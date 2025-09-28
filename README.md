# Twilio – Salesforce Middleware Integration

This project integrates **Twilio** (voice calls) with **Salesforce** (case management) through a backend middleware built with **Node.js + Express**.  

The system automatically creates Salesforce cases when a call is made or received via Twilio, prevents duplicate cases by phone number, and updates the case status based on the call lifecycle. An IVR flow is also included for basic call routing.

---

## 🚀 Features
- Outbound and inbound calling via Twilio  
- Automatic Salesforce case creation  
- Prevents duplicate cases by caller’s phone number  
- Call status tracking (`New → In Progress → Closed`)  
- Basic IVR menu using Twilio `<Gather>`  

---

## 🛠 Tech Stack
- **Node.js + Express** – middleware API  
- **Twilio** – call handling, IVR, and status callbacks  
- **Salesforce (Developer Org)** – case management via REST API (`jsforce`)  

---

## ⚙️ Setup

### 1. Clone the project
```bash
git clone <your-repo-url>
cd <project-folder>

npm install


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

npm start

📡 API Endpoints
POST /call

Trigger an outbound call.

Request body:

{ "to": "+92XXXXXXXXXX" }

POST /voice

Handles inbound calls and plays IVR menu.

POST /gather

Processes IVR input (e.g., press 1 for Sales, 2 for Support).

POST /status

Twilio sends call lifecycle updates here. Updates Salesforce case status.

🧪 Testing

Use Postman to test /call, /voice, and /gather endpoints.

Use ngrok or deploy the server to provide Twilio with a public URL.

Check Salesforce Cases tab to confirm:

New cases are created on calls

Status updates correctly (New, In Progress, Closed)

Phone number appears in Supplied Phone field

📌 Notes

Duplicate cases are prevented using the caller’s phone number.

Salesforce stores the phone number in the Supplied Phone field.

The IVR flow can be extended for more options (e.g., departments, agent routing).
