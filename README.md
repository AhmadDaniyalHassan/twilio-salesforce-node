Twilio – Salesforce Middleware Integration

This project demonstrates how to integrate Twilio (voice calls) with Salesforce (case management) using a backend middleware built with Node.js + Express.

The system automatically creates Salesforce cases when a call is made or received via Twilio, prevents duplicate cases by phone number, and updates the case status based on the call lifecycle. An IVR flow is also included for basic call routing.

Features

Outbound and inbound calling via Twilio.

Automatic Salesforce case creation.

No duplicate cases for the same caller.

Call status tracking (New → In Progress → Closed).

Simple IVR menu using Twilio <Gather>.

Tech Stack

Node.js + Express – middleware API.

Twilio – call handling, IVR, and status callbacks.

Salesforce (Developer Account) – case management via REST API (jsforce).

Setup
1. Clone the project
git clone <your-repo-url>
cd <project-folder>

2. Install dependencies
npm install

3. Configure environment variables

Create a .env file in the root directory with the following:

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
MY_PHONE_NUMBER=+92XXXXXXXXXX
BASE_URL=https://your-public-url  # e.g., ngrok or deployed server

# Salesforce
SF_LOGIN_URL=https://login.salesforce.com
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password
SF_TOKEN=your_salesforce_security_token

# Server
PORT=5000


⚠️ Use test credentials from Twilio and a Salesforce Developer Org.

4. Run the server
npm start

API Endpoints
POST /call

Trigger an outbound call.
Body:

{ "to": "+92XXXXXXXXXX" }

POST /voice

Handles inbound calls and starts IVR flow.

POST /gather

Handles IVR menu choices. (e.g., press 1 for Sales, 2 for Support)

POST /status

Twilio sends call status updates here. Updates Salesforce case status.

Testing

Use Postman to test /call, /voice, and /gather.

Use ngrok or deploy to a server to let Twilio access your /voice and /status endpoints.

Check Salesforce Cases tab to confirm case creation and updates.

Notes

Salesforce SuppliedPhone field stores the caller’s number.

Duplicate case prevention is based on phone number.

IVR flow can be extended to handle more options or agent routing.

Would you like me to also include a call flow diagram (Twilio → Middleware → Salesforce) in the README, or do you prefer to keep it text-only?
