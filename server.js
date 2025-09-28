import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';
import jsforce from 'jsforce';

const app = express();
app.use(express.urlencoded({ extended: true })); // ✅ for Twilio form data
app.use(express.json()); // ✅ for JSON data

// Twilio setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const VoiceResponse = twilio.twiml.VoiceResponse;

// Salesforce setup
const conn = new jsforce.Connection({ loginUrl: process.env.SF_LOGIN_URL });

// Auto-login on server start
async function salesforceLogin() {
    try {
        await conn.login(
            process.env.SF_USERNAME,
            process.env.SF_PASSWORD + process.env.SF_TOKEN
        );
        console.log('✅ Salesforce login successful');
    } catch (err) {
        console.error('❌ Salesforce login failed:', err);
    }
}
await salesforceLogin();

// Utility: Create Salesforce Case (avoid duplicates)
async function createCaseIfNotExists(phone, direction, status, subjectExtra = '') {
    try {
        const existingCases = await conn
            .sobject('Case')
            .find({ SuppliedPhone: phone })
            .limit(1)
            .execute();

        if (existingCases.length === 0) {
            const newCase = await conn.sobject('Case').create({
                Subject: `New ${direction} call from ${phone} ${subjectExtra}`,
                Status: status || 'New',
                Origin: 'Phone',
                SuppliedPhone: phone,
                Description: `Auto-logged ${direction} call via Twilio middleware ${subjectExtra}`
            });
            console.log(`📂 Created Salesforce Case for ${phone}:`, newCase.id);
            return newCase;
        } else {
            console.log(`ℹ️ Case already exists for ${phone}`);
            return existingCases[0];
        }
    } catch (err) {
        console.error('❌ Salesforce error while creating case:', err);
    }
}

/**
 * Inbound Call IVR (Twilio → /voice)
 */
app.post('/voice', async (req, res) => {
    const twiml = new VoiceResponse();
    const caller = req.body.From;

    // Play IVR menu
    const gather = twiml.gather({
        numDigits: 1,
        action: '/gather', // when digit is pressed, Twilio POSTs here
        method: 'POST'
    });

    gather.say(
        { voice: 'alice', language: 'en-US' },
        'Welcome to the automated system. ' +
        'Press 1 for Sales. ' +
        'Press 2 for Support. ' +
        'Or press any other key to hear this menu again.'
    );

    // If no input, repeat menu
    twiml.redirect('/voice');

    // Log inbound call case (general)
    await createCaseIfNotExists(caller, 'inbound', 'New');

    res.type('text/xml');
    res.send(twiml.toString());
});

/**
 * IVR Gather Handler
 */
app.post('/gather', async (req, res) => {
    const twiml = new VoiceResponse();
    const digit = req.body.Digits;
    const caller = req.body.From;

    if (digit === '1') {
        // Create Salesforce case tagged as Sales
        await createCaseIfNotExists(caller, 'inbound', 'New', '(Sales)');
        twiml.say('You selected Sales. A case has been created. Please wait while we connect you to Sales.');
        // Example: forward to sales team number
        twiml.dial(process.env.SALES_PHONE || process.env.MY_PHONE_NUMBER);
    } else if (digit === '2') {
        // Create Salesforce case tagged as Support
        await createCaseIfNotExists(caller, 'inbound', 'New', '(Support)');
        twiml.say('You selected Support. A case has been created. Please wait while we connect you to Support.');
        // Example: forward to support team number
        twiml.dial(process.env.SUPPORT_PHONE || process.env.MY_PHONE_NUMBER);
    } else {
        twiml.say('Invalid choice. Returning to the main menu.');
        twiml.redirect('/voice');
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

/**
 * Outbound Call (POST /call)
 * Body: { "to": "+92XXXXXXXXXX" }
 */
app.post('/call', async (req, res) => {
    const to = req.body.to || process.env.MY_PHONE_NUMBER;

    try {
        // Create Salesforce case before dialing
        await createCaseIfNotExists(to, 'outbound', 'In Progress');

        const call = await client.calls.create({
            url: `${process.env.BASE_URL}/voice`, // Twilio will hit this endpoint when answered
            to,
            from: process.env.TWILIO_PHONE_NUMBER,
            statusCallback: `${process.env.BASE_URL}/status`,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
            statusCallbackMethod: 'POST'
        });

        return res.json({ success: true, sid: call.sid });
    } catch (err) {
        console.error('❌ Twilio call error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * Status Callback (Twilio → /status)
 */
app.post('/status', async (req, res) => {
    const { CallStatus, From, To, CallSid } = req.body;
    console.log(`📞 Status update for ${CallSid}: ${CallStatus}`);

    try {
        // Update case status in Salesforce
        const phone = From || To;

        if (CallStatus === 'completed') {
            const existingCases = await conn
                .sobject('Case')
                .find({ SuppliedPhone: phone })
                .limit(1)
                .execute();

            if (existingCases.length > 0) {
                await conn.sobject('Case').update({
                    Id: existingCases[0].Id,
                    Status: 'Closed'
                });
                console.log(`✅ Closed Salesforce Case for ${phone}`);
            }
        }
    } catch (err) {
        console.error('❌ Error updating Salesforce case:', err);
    }

    res.sendStatus(200);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Middleware with IVR running on port ${port}`));