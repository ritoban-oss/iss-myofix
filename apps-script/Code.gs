// MyoFix Adherence Logger
// Google Apps Script — deployed as a Web App
//
// Deploy settings:
//   Execute as: Me
//   Who has access: Anyone
//
// Tabs auto-created on first run:
//   "Registrations" — one row per new patient account
//   "Sessions"      — one row per completed therapy session, with per-exercise breakdown

function doPost(e) {
  try {
    var raw  = (e.parameter && e.parameter.data) ? e.parameter.data : e.postData.contents;
    var data = JSON.parse(raw);
    var ss   = SpreadsheetApp.getActiveSpreadsheet();

    // ── REGISTRATION ────────────────────────────────────────────────────────
    if (data.event === "registration") {
      var regSheet = ss.getSheetByName("Registrations") || ss.insertSheet("Registrations");

      if (regSheet.getLastRow() === 0) {
        regSheet.appendRow(["Timestamp", "Patient ID", "First Name", "Last Name", "Age", "Email", "Registered At"]);
        regSheet.getRange(1, 1, 1, 7)
          .setFontWeight("bold").setBackground("#0d9488").setFontColor("#ffffff");
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

    // ── SESSION ─────────────────────────────────────────────────────────────
    } else if (data.event === "session") {
      var sessionSheet = ss.getSheetByName("Sessions") || ss.insertSheet("Sessions");

      if (sessionSheet.getLastRow() === 0) {
        sessionSheet.appendRow([
          "Timestamp", "Date", "Patient ID", "First Name", "Last Name",
          "Age", "Email", "Total Days", "Streak", "Milestones Achieved",
          "Exercises Completed",
          "Tongue Press", "Tongue Slide", "Tongue Stretch",
          "Tongue Push-Up", "Lip Seal", "Swallow Practice"
        ]);
        sessionSheet.getRange(1, 1, 1, 17)
          .setFontWeight("bold").setBackground("#0d9488").setFontColor("#ffffff");
        sessionSheet.setFrozenRows(1);
      }

      // Deduplicate: block duplicate patientId + date combinations
      var lastRow = sessionSheet.getLastRow();
      if (lastRow > 1) {
        var existing = sessionSheet.getRange(2, 3, lastRow - 1, 2).getValues();
        for (var i = 0; i < existing.length; i++) {
          if (existing[i][0] === data.patientId && existing[i][1] === data.date) {
            return ContentService
              .createTextOutput(JSON.stringify({ status: "duplicate" }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
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
        data.milestonesAchieved,
        data.exercisesCompleted || "",
        data.ex_1 || "",   // Tongue Press
        data.ex_2 || "",   // Tongue Slide
        data.ex_3 || "",   // Tongue Stretch
        data.ex_4 || "",   // Tongue Push-Up
        data.ex_5 || "",   // Lip Seal
        data.ex_6 || ""    // Swallow Practice
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

// Run from the Apps Script editor to verify sheet setup
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Spreadsheet: " + ss.getName());
  Logger.log("Sheets: " + ss.getSheets().map(function(s) { return s.getName(); }).join(", "));
}
