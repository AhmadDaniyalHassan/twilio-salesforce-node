import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";   // ✅ use main twilio package
import bodyParser from "body-parser";
import fetch from "node-fetch"; // Salesforce API calls

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Correct VoiceResponse
const VoiceResponse = twilio.twiml.VoiceResponse;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio IVR webhook
app.post("/ivr", (req, res) => {
    const twiml = new VoiceResponse();

    const gather = twiml.gather({
        numDigits: 1,
        action: "/gather",
        method: "POST",
    });

    gather.say("Welcome to our service. Press 1 to create a support case.");

    twiml.redirect("/ivr");

    res.type("text/xml");
    res.send(twiml.toString());
});

// Handle user input from IVR
app.post("/gather", async (req, res) => {
    const digits = req.body.Digits;
    const caller = req.body.From;

    const twiml = new VoiceResponse();

    if (digits === "1") {
        // Call Salesforce middleware to create a case
        try {
            const response = await fetch(`${process.env.SALESFORCE_API_URL}/cases`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
                },
                body: JSON.stringify({
                    phone: caller,
                    description: "Case created from Twilio IVR",
                }),

            });


            const data = await response.json();

            if (response.ok) {
                twiml.say("Your support case has been created. Thank you.");
            } else {
                twiml.say("Sorry, we could not create your case.");
                console.error(data);
                
            }
        } catch (err) {
            console.error("Salesforce error:", err);
            twiml.say("Error connecting to Salesforce.");
        }
    } else {
        twiml.say("Invalid choice. Goodbye.");
    }

    res.type("text/xml");
    res.send(twiml.toString());
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
