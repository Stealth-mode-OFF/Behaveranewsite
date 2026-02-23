/**
 * Google Apps Script — Behavera Onboarding Export (v2)
 *
 * SETUP:
 * 1. Otevři Google Sheet → Extensions → Apps Script
 * 2. Vlož tento kód (nahraď Code.gs)
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Zkopíruj URL a vlož do Vercel env GOOGLE_SHEETS_WEBHOOK_URL
 * 5. V Script Properties (ozubené kolečko) nastav:
 *    - SUPABASE_URL = https://gruomxlcwerzevjohqdo.supabase.co
 *    - SUPABASE_SERVICE_KEY = (tvůj service key)
 * 6. Hotovo — každý nový onboarding se automaticky zapíše,
 *    + v menu Behavera → Obnovit vše stáhne komplet data ze Supabase
 */

/* ─── Constants ─── */
var SHEET_NAME     = "Onboardings";
var COMPANY_BG     = "#1a1a2e";
var COMPANY_FG     = "#ffffff";
var INFO_LABEL_BG  = "#f1f5f9";
var TEAM_HEADER_BG = "#3b82f6";
var TEAM_HEADER_FG = "#ffffff";
var MEMBER_ALT_A   = "#ffffff";
var MEMBER_ALT_B   = "#f8fafc";
var DIVIDER_BG     = "#cbd5e1";

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

/* ─── doGet — status / manual refresh trigger ─── */
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

/* ───────────────────────────────────────────────────────────
   Write one company onboarding — beautiful multi-row block
   ─────────────────────────────────────────────────────────── */
function writeOnboarding(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Ensure we have at least 10 columns wide
  if (sheet.getMaxColumns() < 10) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), 10 - sheet.getMaxColumns());
  }

  var row = sheet.getLastRow() + 2; // blank spacer before each company

  /* ── 1. Company name banner (merged across A-J) ── */
  var plan = data.billingInterval === "yearly" ? "Roční" : "Měsíční";
  var pricePerPerson = data.billingInterval === "yearly" ? 99 : 129;
  var seats = data.employeeCount || 0;
  var monthlyTotal = seats * pricePerPerson;
  var totalMembers = countMembers(data.teams || []);

  var title = (data.companyName || "Neznámá firma")
    + "  ·  IČO " + (data.companyId || "–")
    + "  ·  " + seats + " zaměstnanců"
    + "  ·  " + formatCZK(monthlyTotal) + "/měs (" + plan + ")"
    + "  ·  " + formatDate(data.createdAt || new Date().toISOString());

  sheet.getRange(row, 1).setValue(title);
  sheet.getRange(row, 1, 1, 10).merge();
  var banner = sheet.getRange(row, 1, 1, 10);
  banner.setBackground(COMPANY_BG).setFontColor(COMPANY_FG)
    .setFontWeight("bold").setFontSize(12)
    .setVerticalAlignment("middle").setWrap(true);
  sheet.setRowHeight(row, 36);
  row++;

  /* ── 2. Company detail rows (label : value pairs, 2 columns each) ── */
  var infoRows = [
    ["Zástupce:", data.repName || "–", "Email zástupce:", data.repEmail || "–"],
    ["Admin:", data.adminName || "–", "Email admin:", data.adminEmail || "–"],
    ["Fakturační email:", data.billingEmail || "–", "OAuth:", data.oauthProvider || "manuální"],
    ["Počet lidí v týmech:", totalMembers.toString(), "Status:", data.status || "new"],
    ["Pipedrive Person ID:", data.pipedrivePersonId || "–", "Pipedrive Lead ID:", data.pipedriveLeadId || "–"],
    ["Submission ID:", data.submissionId || "–", "", ""]
  ];

  for (var i = 0; i < infoRows.length; i++) {
    var r = infoRows[i];
    sheet.getRange(row, 1).setValue(r[0]);
    sheet.getRange(row, 2, 1, 2).merge().setValue(r[1]);
    sheet.getRange(row, 4).setValue(r[2]);
    sheet.getRange(row, 5, 1, 2).merge().setValue(r[3]);

    // Style labels
    sheet.getRange(row, 1).setFontWeight("bold").setBackground(INFO_LABEL_BG).setFontSize(10);
    sheet.getRange(row, 4).setFontWeight("bold").setBackground(INFO_LABEL_BG).setFontSize(10);
    sheet.getRange(row, 2, 1, 2).setFontSize(10);
    sheet.getRange(row, 5, 1, 2).setFontSize(10);
    row++;
  }

  row++; // spacer

  /* ── 3. Teams section ── */
  var teams = data.teams || [];

  for (var t = 0; t < teams.length; t++) {
    var team = teams[t];
    var members = team.members || [];
    var leader = team.leaderEmail || "nenastaveno";

    // Team header row
    var teamTitle = "Tým: " + team.name + "  (" + members.length + " členů)  ·  Team Leader: " + leader;
    sheet.getRange(row, 1).setValue(teamTitle);
    sheet.getRange(row, 1, 1, 10).merge();
    var teamBanner = sheet.getRange(row, 1, 1, 10);
    teamBanner.setBackground(TEAM_HEADER_BG).setFontColor(TEAM_HEADER_FG)
      .setFontWeight("bold").setFontSize(10);
    row++;

    // Member column headers
    if (members.length > 0) {
      var memberHeaders = ["#", "Jméno", "Příjmení", "Email", "", "", "", "", "", ""];
      sheet.getRange(row, 1, 1, memberHeaders.length).setValues([memberHeaders]);
      sheet.getRange(row, 1, 1, 4).setFontWeight("bold").setFontSize(9)
        .setBackground("#e2e8f0");
      row++;

      // Member rows
      for (var m = 0; m < members.length; m++) {
        var mem = members[m];
        var parsed = parseName(mem.name, mem.email);
        var bg = (m % 2 === 0) ? MEMBER_ALT_A : MEMBER_ALT_B;

        var memberRow = [
          (m + 1).toString(),
          parsed.firstName,
          parsed.lastName,
          mem.email || "",
          "", "", "", "", "", ""
        ];
        sheet.getRange(row, 1, 1, memberRow.length).setValues([memberRow]);
        sheet.getRange(row, 1, 1, 4).setBackground(bg).setFontSize(9);
        row++;
      }
    } else {
      sheet.getRange(row, 1).setValue("  (žádní členové)");
      sheet.getRange(row, 1).setFontStyle("italic").setFontSize(9);
      row++;
    }

    row++; // spacer between teams
  }

  /* ── 4. Divider line ── */
  sheet.getRange(row, 1, 1, 10).merge().setBackground(DIVIDER_BG);
  sheet.setRowHeight(row, 4);

  /* ── Auto-resize key columns ── */
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 160);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 250);
  for (var c = 5; c <= 10; c++) {
    sheet.setColumnWidth(c, 120);
  }

  SpreadsheetApp.flush();
}

/* ─── Full refresh from Supabase ─── */
function refreshAll() {
  var props = PropertiesService.getScriptProperties();
  var sbUrl = props.getProperty("SUPABASE_URL");
  var sbKey = props.getProperty("SUPABASE_SERVICE_KEY");

  if (!sbUrl || !sbKey) {
    SpreadsheetApp.getUi().alert(
      "Chybí nastavení!\n\nJdi do Extensions → Apps Script → ⚙️ Project Settings → Script Properties\n" +
      "a nastav SUPABASE_URL + SUPABASE_SERVICE_KEY"
    );
    return;
  }

  var headers = {
    "apikey": sbKey,
    "Authorization": "Bearer " + sbKey
  };

  // Fetch all data
  var subRes = UrlFetchApp.fetch(
    sbUrl + "/rest/v1/onboarding_submissions?select=*&order=created_at.desc",
    { headers: headers }
  );
  var submissions = JSON.parse(subRes.getContentText());

  var teamsRes = UrlFetchApp.fetch(
    sbUrl + "/rest/v1/onboarding_teams?select=*&order=sort_order",
    { headers: headers }
  );
  var allTeams = JSON.parse(teamsRes.getContentText());

  var membersRes = UrlFetchApp.fetch(
    sbUrl + "/rest/v1/onboarding_team_members?select=*",
    { headers: headers }
  );
  var allMembers = JSON.parse(membersRes.getContentText());

  // Index teams by submission_id
  var teamsBySub = {};
  for (var i = 0; i < allTeams.length; i++) {
    var sid = allTeams[i].submission_id;
    if (!teamsBySub[sid]) teamsBySub[sid] = [];
    teamsBySub[sid].push(allTeams[i]);
  }

  // Index members by team_id
  var membersByTeam = {};
  for (var j = 0; j < allMembers.length; j++) {
    var tid = allMembers[j].team_id;
    if (!membersByTeam[tid]) membersByTeam[tid] = [];
    membersByTeam[tid].push(allMembers[j]);
  }

  // Clear sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) {
    sheet.clear();
    sheet.clearFormats();
    // unmerge all
    var merges = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
    merges.breakApart();
  } else {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Write each submission
  for (var s = 0; s < submissions.length; s++) {
    var sub = submissions[s];
    var subTeams = teamsBySub[sub.id] || [];

    // Sort teams
    subTeams.sort(function(a, b) { return (a.sort_order || 0) - (b.sort_order || 0); });

    // Build webhook-format payload
    var teamsFormatted = [];
    for (var t = 0; t < subTeams.length; t++) {
      var tm = subTeams[t];
      var mems = membersByTeam[tm.id] || [];
      teamsFormatted.push({
        name: tm.name,
        leaderEmail: tm.leader_email || "",
        members: mems.map(function(mm) {
          return { name: mm.name || "", email: mm.email };
        })
      });
    }

    writeOnboarding({
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
    });
  }

  SpreadsheetApp.getUi().alert(
    "Hotovo! Načteno " + submissions.length + " onboardingů."
  );
}

/* ─── Parse name into firstName + lastName ─── */
function parseName(fullName, email) {
  // If we have a real name, split it
  if (fullName && fullName.trim().length > 0) {
    var parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" ")
      };
    }
    return { firstName: parts[0], lastName: "" };
  }

  // Derive from email: "kraslova@malcom.app" → "Kraslová" (best effort)
  if (!email) return { firstName: "", lastName: "" };
  var local = email.split("@")[0];

  // Handle "josef.hofman" format
  var emailParts = local.split(/[._-]/);
  if (emailParts.length >= 2) {
    return {
      firstName: capitalize(emailParts[0]),
      lastName: capitalize(emailParts.slice(1).join(" "))
    };
  }

  return { firstName: "", lastName: capitalize(local) };
}

function capitalize(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function countMembers(teams) {
  var total = 0;
  for (var i = 0; i < teams.length; i++) {
    total += (teams[i].members || []).length;
  }
  return total;
}

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

/* ─── Custom menu ─── */
function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Behavera", [
    { name: "🔄 Obnovit všechny onboardingy", functionName: "refreshAll" }
  ]);
}
