/**
 * Google Apps Script — Behavera Onboarding Export
 *
 * SETUP:
 * 1. Otevři Google Sheet → Extensions → Apps Script
 * 2. Vlož tento kód (nahraď Code.gs)
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Zkopíruj URL a vlož do Vercel env GOOGLE_SHEETS_WEBHOOK_URL
 * 5. Hotovo — každý nový onboarding se automaticky zapíše
 */

/* ─── Constants ─── */
var SHEET_NAME = "Onboardings";
var HEADER_BG   = "#1a1a2e";
var HEADER_FG   = "#ffffff";
var TEAM_BG     = "#f0f4ff";
var MEMBER_BG   = "#ffffff";
var DIVIDER_BG  = "#e2e8f0";

/* ─── doPost — webhook receiver ─── */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    writeOnboarding(data);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ─── doGet — manual full refresh from Supabase ─── */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "status";
  if (action === "refresh") {
    refreshAll();
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, action: "refreshed" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, status: "ready" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Write one onboarding submission ─── */
function writeOnboarding(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // If sheet is empty, write master header
  if (sheet.getLastRow() === 0) {
    writeMasterHeader(sheet);
  }

  var startRow = sheet.getLastRow() + 2; // blank row before each company

  // ── Company header row ──
  var plan = data.billingInterval === "yearly" ? "Roční" : "Měsíční";
  var pricePerPerson = data.billingInterval === "yearly" ? 99 : 129;
  var seats = data.employeeCount || 0;
  var monthlyTotal = seats * pricePerPerson;
  var totalMembers = 0;
  if (data.teams) {
    for (var i = 0; i < data.teams.length; i++) {
      totalMembers += (data.teams[i].members || []).length;
    }
  }

  var companyRow = [
    data.companyName || "",
    data.companyId ? "IČO " + data.companyId : "",
    plan,
    seats + " zaměstnanců",
    formatCZK(monthlyTotal) + "/měs",
    data.repName || "",
    data.repEmail || "",
    data.adminName || "",
    data.adminEmail || "",
    data.billingEmail || "",
    data.oauthProvider || "manual",
    data.status || "new",
    data.submissionId || "",
    data.pipedrivePersonId || "",
    data.pipedriveLeadId || "",
    formatDate(data.createdAt || new Date().toISOString())
  ];

  sheet.getRange(startRow, 1, 1, companyRow.length).setValues([companyRow]);
  var companyRange = sheet.getRange(startRow, 1, 1, companyRow.length);
  companyRange.setBackground(HEADER_BG);
  companyRange.setFontColor(HEADER_FG);
  companyRange.setFontWeight("bold");
  companyRange.setFontSize(11);

  // ── Teams sub-header ──
  var teamHeaderRow = startRow + 1;
  var teamHeaders = ["Tým", "Členů", "Lídr", "Člen – jméno", "Člen – email", "", "", "", "", "", "", "", "", "", "", ""];
  sheet.getRange(teamHeaderRow, 1, 1, teamHeaders.length).setValues([teamHeaders]);
  var teamHeaderRange = sheet.getRange(teamHeaderRow, 1, 1, teamHeaders.length);
  teamHeaderRange.setBackground(TEAM_BG);
  teamHeaderRange.setFontWeight("bold");
  teamHeaderRange.setFontSize(10);

  // ── Teams + members ──
  var currentRow = teamHeaderRow + 1;
  var teams = data.teams || [];

  for (var t = 0; t < teams.length; t++) {
    var team = teams[t];
    var members = team.members || [];
    var leader = team.leaderEmail || "bez lídra";

    if (members.length === 0) {
      // Team with no members
      var emptyRow = [team.name, "0", leader, "", "", "", "", "", "", "", "", "", "", "", "", ""];
      sheet.getRange(currentRow, 1, 1, emptyRow.length).setValues([emptyRow]);
      sheet.getRange(currentRow, 1, 1, 3).setBackground(TEAM_BG);
      sheet.getRange(currentRow, 1).setFontWeight("bold");
      currentRow++;
    } else {
      // First member row includes team name
      var firstRow = [
        team.name,
        members.length.toString(),
        leader,
        members[0].name || extractName(members[0].email),
        members[0].email,
        "", "", "", "", "", "", "", "", "", "", ""
      ];
      sheet.getRange(currentRow, 1, 1, firstRow.length).setValues([firstRow]);
      sheet.getRange(currentRow, 1, 1, 3).setBackground(TEAM_BG);
      sheet.getRange(currentRow, 1).setFontWeight("bold");
      currentRow++;

      // Remaining members
      for (var m = 1; m < members.length; m++) {
        var memberRow = [
          "", "", "",
          members[m].name || extractName(members[m].email),
          members[m].email,
          "", "", "", "", "", "", "", "", "", "", ""
        ];
        sheet.getRange(currentRow, 1, 1, memberRow.length).setValues([memberRow]);
        currentRow++;
      }
    }
  }

  // ── Divider ──
  sheet.getRange(currentRow, 1, 1, 16).setBackground(DIVIDER_BG);
  currentRow++;

  // Auto-resize columns
  for (var c = 1; c <= 16; c++) {
    sheet.autoResizeColumn(c);
  }

  SpreadsheetApp.flush();
}

/* ─── Master header (first row of sheet) ─── */
function writeMasterHeader(sheet) {
  var headers = [
    "Firma", "IČO", "Plán", "Zaměstnanci", "Cena/měs",
    "Zástupce", "Email zástupce", "Admin", "Email admin", "Fakturační email",
    "OAuth", "Status", "Submission ID", "Pipedrive Person", "Pipedrive Lead", "Datum"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#0f172a");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  sheet.setFrozenRows(1);

  for (var c = 1; c <= headers.length; c++) {
    sheet.setColumnWidth(c, 140);
  }
}

/* ─── Full refresh from Supabase ─── */
function refreshAll() {
  var props = PropertiesService.getScriptProperties();
  var sbUrl = props.getProperty("SUPABASE_URL");
  var sbKey = props.getProperty("SUPABASE_SERVICE_KEY");

  if (!sbUrl || !sbKey) {
    throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY in Script Properties");
  }

  var headers = {
    "apikey": sbKey,
    "Authorization": "Bearer " + sbKey
  };

  // Fetch all submissions
  var subRes = UrlFetchApp.fetch(sbUrl + "/rest/v1/onboarding_submissions?select=*&order=created_at.desc", { headers: headers });
  var submissions = JSON.parse(subRes.getContentText());

  // Fetch all teams
  var teamsRes = UrlFetchApp.fetch(sbUrl + "/rest/v1/onboarding_teams?select=*&order=sort_order", { headers: headers });
  var allTeams = JSON.parse(teamsRes.getContentText());

  // Fetch all members
  var membersRes = UrlFetchApp.fetch(sbUrl + "/rest/v1/onboarding_team_members?select=*", { headers: headers });
  var allMembers = JSON.parse(membersRes.getContentText());

  // Index teams by submission_id
  var teamsBySubmission = {};
  for (var i = 0; i < allTeams.length; i++) {
    var sid = allTeams[i].submission_id;
    if (!teamsBySubmission[sid]) teamsBySubmission[sid] = [];
    teamsBySubmission[sid].push(allTeams[i]);
  }

  // Index members by team_id
  var membersByTeam = {};
  for (var j = 0; j < allMembers.length; j++) {
    var tid = allMembers[j].team_id;
    if (!membersByTeam[tid]) membersByTeam[tid] = [];
    membersByTeam[tid].push(allMembers[j]);
  }

  // Clear and rebuild sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) {
    sheet.clear();
    sheet.clearFormats();
  } else {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  writeMasterHeader(sheet);

  // Write each submission
  for (var s = 0; s < submissions.length; s++) {
    var sub = submissions[s];
    var teams = teamsBySubmission[sub.id] || [];

    // Sort teams by sort_order
    teams.sort(function(a, b) { return (a.sort_order || 0) - (b.sort_order || 0); });

    // Build teams array in webhook format
    var teamsFormatted = [];
    for (var t = 0; t < teams.length; t++) {
      var tm = teams[t];
      var mems = membersByTeam[tm.id] || [];
      teamsFormatted.push({
        name: tm.name,
        leaderEmail: tm.leader_email || "",
        members: mems.map(function(m) {
          return { name: m.name || "", email: m.email };
        })
      });
    }

    var webhookData = {
      companyName: sub.company_name,
      companyId: sub.company_id,
      billingInterval: sub.billing_interval,
      employeeCount: sub.employee_count,
      repName: sub.rep_name,
      repEmail: sub.rep_email,
      adminName: sub.admin_name,
      adminEmail: sub.admin_email,
      billingEmail: sub.billing_email,
      oauthProvider: sub.oauth_provider,
      status: sub.status,
      submissionId: sub.id,
      pipedrivePersonId: sub.pipedrive_person_id,
      pipedriveLeadId: sub.pipedrive_lead_id,
      createdAt: sub.created_at,
      teams: teamsFormatted
    };

    writeOnboarding(webhookData);
  }
}

/* ─── Helpers ─── */

function formatCZK(amount) {
  return amount.toLocaleString("cs-CZ").replace(/\s/g, "\u00a0") + " Kč";
}

function formatDate(isoStr) {
  if (!isoStr) return "";
  var d = new Date(isoStr);
  var day = ("0" + d.getDate()).slice(-2);
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var year = d.getFullYear();
  var hours = ("0" + d.getHours()).slice(-2);
  var mins = ("0" + d.getMinutes()).slice(-2);
  return day + "." + month + "." + year + " " + hours + ":" + mins;
}

function extractName(email) {
  if (!email) return "";
  var local = email.split("@")[0];
  // Capitalize first letter
  return local.charAt(0).toUpperCase() + local.slice(1);
}

/* ─── Menu button for manual refresh ─── */
function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Behavera", [
    { name: "🔄 Obnovit všechny onboardingy", functionName: "refreshAll" }
  ]);
}
