// MyoFix Adherence Logger
// Google Apps Script — deployed as a Web App
//
// Deploy settings:
//   Execute as: Me
//   Who has access: Anyone
//
// The script auto-creates two tabs on first run:
//   "Registrations" — one row per new patient account
//   "Sessions"      — one row per completed therapy session

function doPost(e) {
  try {
    var raw = (e.parameter && e.parameter.data) ? e.parameter.data : e.postData.contents;
    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.event === "registration") {
      var regSheet = ss.getSheetByName("Registrations") || ss.insertSheet("Registrations");

      // Write headers on first use
      if (regSheet.getLastRow() === 0) {
        regSheet.appendRow([
          "Timestamp", "Patient ID", "First Name", "Last Name", "Age", "Email", "Registered At"
        ]);
        regSheet.getRange(1, 1, 1, 7)
          .setFontWeight("bold")
          .setBackground("#0d9488")
          .setFontColor("#ffffff");
        regSheet.setFrozenRows(1);
      }

      regSheet.appendRow([
        new Date(),
        data.patientId,
        data.firstName,
        data.lastName,
        data.age,
        data.email,
        data.timestamp
      ]);

    } else if (data.event === "session") {
      var sessionSheet = ss.getSheetByName("Sessions") || ss.insertSheet("Sessions");

      // Write headers on first use
      if (sessionSheet.getLastRow() === 0) {
        sessionSheet.appendRow([
          "Timestamp", "Date", "Patient ID", "First Name", "Last Name",
          "Age", "Email", "Total Days", "Streak", "Milestones Achieved"
        ]);
        sessionSheet.getRange(1, 1, 1, 10)
          .setFontWeight("bold")
          .setBackground("#0d9488")
          .setFontColor("#ffffff");
        sessionSheet.setFrozenRows(1);
      }

      sessionSheet.appendRow([
        new Date(),
        data.date,
        data.patientId,
        data.firstName,
        data.lastName,
        data.age,
        data.email,
        data.totalDays,
        data.streak,
        data.milestonesAchieved
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: test the script manually from the Apps Script editor
// Run this function to verify the sheet is set up correctly
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Spreadsheet: " + ss.getName());
  Logger.log("Sheets: " + ss.getSheets().map(function(s) { return s.getName(); }).join(", "));
}
