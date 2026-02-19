/**
 * Client-side CSV/TSV parser for importing employee contacts.
 * Detects email and name columns automatically from header row.
 * Supports comma, semicolon, and tab delimiters (auto-detect).
 */

export interface ParsedContact {
  name: string;
  email: string;
}

export interface ParseResult {
  contacts: ParsedContact[];
  totalRows: number;
  skippedRows: number;
  errors: string[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Header patterns for email columns (case-insensitive) */
const EMAIL_HEADERS = [
  "email", "e-mail", "mail", "emailaddress", "e-mailaddress",
  "email address", "e-mail address",
  // Czech
  "emailová adresa", "emailova adresa", "e-mailová adresa",
  // German
  "e-mail-adresse", "emailadresse",
];

/** Header patterns for name columns (case-insensitive) */
const NAME_HEADERS = [
  "name", "full name", "fullname", "display name", "displayname",
  "employee", "employee name",
  // Czech
  "jméno", "jmeno", "celé jméno", "cele jmeno",
  // German
  "name", "vollständiger name", "vollstandiger name", "anzeigename",
];

const FIRST_NAME_HEADERS = [
  "first name", "firstname", "given name", "givenname",
  "křestní jméno", "krestni jmeno",
  "vorname",
];

const LAST_NAME_HEADERS = [
  "last name", "lastname", "surname", "family name", "familyname",
  "příjmení", "prijmeni",
  "nachname", "familienname",
];

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[""'']/g, "");
}

function detectDelimiter(firstLine: string): string {
  const tab = (firstLine.match(/\t/g) || []).length;
  const semi = (firstLine.match(/;/g) || []).length;
  const comma = (firstLine.match(/,/g) || []).length;

  if (tab >= semi && tab >= comma && tab > 0) return "\t";
  if (semi >= comma && semi > 0) return ";";
  return ",";
}

function splitCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function matchHeader(header: string, patterns: string[]): boolean {
  const h = normalize(header);
  return patterns.some((p) => h === p || h.includes(p));
}

/**
 * Parse CSV text content and extract contacts with name + email.
 * Auto-detects delimiter, email column, and name columns.
 */
export function parseCSV(text: string): ParseResult {
  const errors: string[] = [];
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { contacts: [], totalRows: 0, skippedRows: 0, errors: ["Empty file"] };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitCSVLine(lines[0], delimiter);

  // Find email column
  let emailIdx = headers.findIndex((h) => matchHeader(h, EMAIL_HEADERS));

  // Fallback: find column where first data row looks like an email
  if (emailIdx === -1 && lines.length > 1) {
    const firstDataRow = splitCSVLine(lines[1], delimiter);
    emailIdx = firstDataRow.findIndex((cell) => EMAIL_REGEX.test(cell.trim()));
  }

  if (emailIdx === -1) {
    // Try: entire file might be just emails, one per line
    const allEmails = lines.filter((l) => EMAIL_REGEX.test(l.trim()));
    if (allEmails.length >= lines.length * 0.5) {
      const contacts: ParsedContact[] = [];
      const seen = new Set<string>();
      for (const l of lines) {
        const email = l.trim().toLowerCase();
        if (EMAIL_REGEX.test(email) && !seen.has(email)) {
          seen.add(email);
          contacts.push({ name: email.split("@")[0].replace(/[._-]/g, " "), email });
        }
      }
      return {
        contacts,
        totalRows: lines.length,
        skippedRows: lines.length - contacts.length,
        errors: [],
      };
    }

    return {
      contacts: [],
      totalRows: lines.length - 1,
      skippedRows: lines.length - 1,
      errors: ["Could not detect email column. Please include a header row with 'Email'."],
    };
  }

  // Find name column(s)
  let nameIdx = headers.findIndex((h) => matchHeader(h, NAME_HEADERS));
  let firstNameIdx = headers.findIndex((h) => matchHeader(h, FIRST_NAME_HEADERS));
  let lastNameIdx = headers.findIndex((h) => matchHeader(h, LAST_NAME_HEADERS));

  const contacts: ParsedContact[] = [];
  const seen = new Set<string>();
  let skippedRows = 0;

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCSVLine(lines[i], delimiter);
    const email = cells[emailIdx]?.trim().toLowerCase();

    if (!email || !EMAIL_REGEX.test(email)) {
      skippedRows++;
      continue;
    }

    if (seen.has(email)) {
      skippedRows++;
      continue;
    }
    seen.add(email);

    let name = "";
    if (nameIdx !== -1) {
      name = cells[nameIdx]?.trim() || "";
    } else if (firstNameIdx !== -1 || lastNameIdx !== -1) {
      const first = firstNameIdx !== -1 ? cells[firstNameIdx]?.trim() || "" : "";
      const last = lastNameIdx !== -1 ? cells[lastNameIdx]?.trim() || "" : "";
      name = `${first} ${last}`.trim();
    }

    // Fallback: derive name from email prefix
    if (!name) {
      name = email.split("@")[0].replace(/[._-]/g, " ");
      // Capitalize first letters
      name = name.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    contacts.push({ name, email });
  }

  return {
    contacts,
    totalRows: lines.length - 1,
    skippedRows,
    errors,
  };
}

/**
 * Read a File object and parse it as CSV/TSV.
 * Also handles .txt files (one email per line).
 */
export function parseContactsFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) {
      resolve({
        contacts: [],
        totalRows: 0,
        skippedRows: 0,
        errors: ["File too large (max 5 MB)"],
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        resolve({ contacts: [], totalRows: 0, skippedRows: 0, errors: ["Could not read file"] });
        return;
      }
      resolve(parseCSV(text));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

/** Accepted file extensions for the file input */
export const CSV_ACCEPT = ".csv,.tsv,.txt";
