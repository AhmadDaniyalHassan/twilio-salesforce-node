# README
# Salesforce-Twilio IVR Integration
This project demonstrates a simple IVR system using Twilio and Salesforce. It allows inbound and outbound calls, gathers user input, and creates Salesforce Cases based on call interactions.
## Features
- Inbound Call IVR: Handles incoming calls and prompts users with a menu. (return a xml response in psotman)
- Outbound Call: Initiates calls to specified phone numbers.
- Salesforce Case Creation: Creates cases in Salesforce while avoiding duplicates else if there is a duplication it will not upload the same number twice.
## Setup
1. Clone the Repository:
   ```bash
   git clone
    cd salesforce-twilio-ivr
    ```
2. Install Dependency
npm install
npm run dev

3. Environment Variables: Create a `.env` file in the root directory and populate it with your Salesforce and Twilio credentials as shown in the `.env` example above.
PORT = xxxx
# salesforce
SALESFORCE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SALESFORCE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SF_USERNAME=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SF_PASSWORD=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SF_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SF_LOGIN_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#twilio
TWILIO_ACCOUNT_SID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MY_PHONE_NUMBER=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BASE_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx