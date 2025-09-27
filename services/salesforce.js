// salesforce.js
import jsforce from 'jsforce';

let conn = null;

export async function initConnection() {
  if (conn && conn.accessToken) return conn;

  const { SF_USERNAME, SF_PASSWORD, SF_SECURITY_TOKEN, SF_LOGIN_URL } = process.env;

  conn = new jsforce.Connection({ loginUrl: SF_LOGIN_URL || 'https://login.salesforce.com' });
  await conn.login(SF_USERNAME, SF_PASSWORD + (SF_SECURITY_TOKEN || ''));
  return conn;
}

export function normalizePhone(phone) {
  if (!phone) return null;
  return phone.replace(/\D/g, '');
}


export async function findCaseByPhone(phone) {
  const connLocal = await initConnection();
  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  const soql = `
    SELECT Id, CaseNumber, Status, Subject, ContactPhone__c, Phone
    FROM Case
    WHERE (ContactPhone__c LIKE '%${normalized}%' OR Phone LIKE '%${normalized}%')
    ORDER BY CreatedDate DESC
    LIMIT 1
  `;
  const result = await connLocal.query(soql);
  return result.records?.[0] || null;
}

export async function createCase({ subject, description, phone }) {
  const connLocal = await initConnection();
  const caseObj = {
    Subject: subject || 'Case from Twilio IVR',
    Description: description || 'Created via Twilio IVR',
    Status: 'New',
    Origin: 'Phone',
    ContactPhone__c: phone || null,
    Phone: phone || null
  };

  const res = await connLocal.sobject('Case').create(caseObj);
  if (res.success) {
    return await connLocal.sobject('Case').retrieve(res.id);
  }
  throw new Error('Salesforce case create failed: ' + JSON.stringify(res));
}