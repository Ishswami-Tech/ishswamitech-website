/* eslint-disable */

const FALLBACK_HEADERS = [
  "Submitted At",
  "Name",
  "Email",
  "Phone",
  "Company",
  "Service",
  "Budget",
  "Message",
];

function doPost(event) {
  const payload = JSON.parse(event.postData.contents || "{}");
  const headers = payload.headers || FALLBACK_HEADERS;
  const values = payload.values || [];
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  sheet.appendRow(values);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
