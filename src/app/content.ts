import raw from "../../behavera_cz_full_text.txt?raw";

export type ContentItem = {
  id: string;
  url: string;
  path: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  wordCount: number;
};

const titleOverrides: Record<string, string> = {
  "/about": "O Behaveře",
  "/ai-readiness": "AI readiness",
  "/privacy-policy": "Zásady ochrany osobních údajů",
  "/terms": "Obchodní a produktové podmínky",
  "/products-pricing": "Produkty a ceny",
  "/engagement": "Engagement (Behavera)",
  "/hiring": "Hiring & onboarding",
  "/core-competencies": "Core competencies",
  "/culture-fit": "Culture fit",
  "/leadership-competencies": "Leadership competencies",
  "/well-being-team-leader": "Well-being pro team leadery",
  "/demo": "Domluvte si demo"
};

const categoryOverrides: Record<string, string> = {
  "/about": "O nás",
  "/ai-readiness": "AI readiness",
  "/privacy-policy": "Soukromí",
  "/terms": "Podmínky",
  "/products-pricing": "Produkty",
  "/engagement": "Řešení",
  "/hiring": "Řešení",
  "/core-competencies": "Řešení",
  "/culture-fit": "Řešení",
  "/leadership-competencies": "Řešení",
  "/well-being-team-leader": "Řešení",
  "/demo": "Demo"
};

const toTitleCase = (value: string) => {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const titleFromPath = (path: string) => {
  if (titleOverrides[path]) return titleOverrides[path];
  const slug = path.split("/").filter(Boolean).pop() || "Behavera";
  const normalized = slug.replace(/-/g, " ").replace(/\s+/g, " ").trim();
  return toTitleCase(normalized);
};

const categoryFromPath = (path: string) => {
  if (categoryOverrides[path]) return categoryOverrides[path];
  if (path.startsWith("/blog/")) return "Blog";
  if (path.startsWith("/case-study") || path.startsWith("/case-studies-2-0")) return "Případové studie";
  if (path.startsWith("/tags/")) return "Tagy";
  return "Ostatní";
};

const normalizeLines = (lines: string[]) => {
  const cleaned = lines.map((line) => line.replace(/\s+$/g, ""));
  const output: string[] = [];
  let lastBlank = false;

  cleaned.forEach((line) => {
    const isBlank = line.trim().length === 0;
    if (isBlank && lastBlank) return;
    output.push(line);
    lastBlank = isBlank;
  });

  return output;
};

const extractSections = () => {
  const lines = raw.split(/\r?\n/);
  const sections: { url: string; content: string }[] = [];
  let currentUrl = "";
  let buffer: string[] = [];

  const flush = () => {
    if (!currentUrl) return;
    const normalized = normalizeLines(buffer).join("\n").trim();
    if (normalized.length > 0) {
      sections.push({ url: currentUrl, content: normalized });
    }
    buffer = [];
  };

  lines.forEach((line) => {
    if (line.startsWith("=====")) {
      flush();
      currentUrl = line.replace(/=+/g, "").trim();
    } else {
      buffer.push(line);
    }
  });

  flush();
  return sections;
};

const buildItems = () => {
  const sections = extractSections();
  const byUrl = new Map<string, ContentItem>();
  const excludedPaths = new Set(["/rich-text-style"]);

  sections.forEach((section, index) => {
    try {
      const urlObj = new URL(section.url);
      const path = urlObj.pathname.replace(/\/$/, "");
      if (excludedPaths.has(path)) return;
      const content = section.content.trim();
      const normalizedExcerpt = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find((line) => line.length > 0) || "";

      const excerpt = normalizedExcerpt.length > 180
        ? `${normalizedExcerpt.slice(0, 177)}...`
        : normalizedExcerpt;

      const wordCount = content.split(/\s+/).filter(Boolean).length;

      const item: ContentItem = {
        id: `${path.replace(/\//g, "-")}-${index}`,
        url: section.url,
        path,
        category: categoryFromPath(path),
        title: titleFromPath(path),
        excerpt,
        content,
        wordCount
      };

      const existing = byUrl.get(section.url);
      if (!existing || existing.content.length < item.content.length) {
        byUrl.set(section.url, item);
      }
    } catch {
      // Ignore malformed URLs
    }
  });

  return Array.from(byUrl.values());
};

export const behaveraContent = buildItems();

export const behaveraByPath = new Map(
  behaveraContent.map((item) => [item.path, item])
);

export const getBehaveraItem = (pathOrUrl: string) => {
  try {
    const path = pathOrUrl.startsWith("http")
      ? new URL(pathOrUrl).pathname.replace(/\/$/, "")
      : pathOrUrl.startsWith("/")
        ? pathOrUrl.replace(/\/$/, "")
        : `/${pathOrUrl.replace(/\/$/, "")}`;
    return behaveraByPath.get(path);
  } catch {
    return undefined;
  }
};
