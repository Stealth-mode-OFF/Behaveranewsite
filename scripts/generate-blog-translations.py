#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from urllib.error import HTTPError, URLError
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "content" / "blog"
OUTPUT_PATH = Path(os.environ.get("BLOG_TRANSLATIONS_OUTPUT", ROOT / "src" / "lib" / "blog-translations.json"))
TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"
REQUEST_DELAY_SEC = 0.2
MAX_CHARS = 4200
MAX_RETRIES = 5

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n?(.*)$", re.DOTALL)

CODE_FENCE_RE = re.compile(r"```[\s\S]*?```")
INLINE_CODE_RE = re.compile(r"`[^`]+`")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")

CS_TO_EN_GLOSSARY = [
    (re.compile(r"\bquiet quitting\b", re.IGNORECASE), "__TERM_QUIET_QUITTING__"),
    (re.compile(r"\bquiet cracking\b", re.IGNORECASE), "__TERM_QUIET_CRACKING__"),
    (re.compile(r"\bpulse survey\b", re.IGNORECASE), "__TERM_PULSE_SURVEY__"),
    (re.compile(r"\bpulzní průzkum\w*\b", re.IGNORECASE), "__TERM_PULSE_SURVEY__"),
    (re.compile(r"\bengagement\b", re.IGNORECASE), "__TERM_ENGAGEMENT__"),
    (re.compile(r"\bemployee engagement\b", re.IGNORECASE), "__TERM_ENGAGEMENT__"),
    (re.compile(r"\bonboarding\b", re.IGNORECASE), "__TERM_ONBOARDING__"),
    (re.compile(r"\bEcho Pulse\b"), "__TERM_ECHO_PULSE__"),
    (re.compile(r"\bBehavera\b"), "__TERM_BEHAVERA__"),
    (re.compile(r"\bvyhořen\w*\b", re.IGNORECASE), "__TERM_BURNOUT__"),
    (re.compile(r"\bburnout\b", re.IGNORECASE), "__TERM_BURNOUT__"),
    (re.compile(r"\bfluktuac\w*\b", re.IGNORECASE), "__TERM_EMPLOYEE_TURNOVER__"),
    (re.compile(r"\btiché odcházen\w*\b", re.IGNORECASE), "__TERM_QUIET_QUITTING__"),
]

EN_RESTORE = {
    "__TERM_QUIET_QUITTING__": "quiet quitting",
    "__TERM_QUIET_CRACKING__": "quiet cracking",
    "__TERM_PULSE_SURVEY__": "pulse survey",
    "__TERM_ENGAGEMENT__": "engagement",
    "__TERM_ONBOARDING__": "onboarding",
    "__TERM_ECHO_PULSE__": "Echo Pulse",
    "__TERM_BEHAVERA__": "Behavera",
    "__TERM_BURNOUT__": "burnout",
    "__TERM_EMPLOYEE_TURNOVER__": "employee turnover",
}

EN_TO_DE_RESTORE = {
    "__TERM_QUIET_QUITTING__": "Quiet Quitting",
    "__TERM_QUIET_CRACKING__": "Quiet Cracking",
    "__TERM_PULSE_SURVEY__": "Pulse Survey",
    "__TERM_ENGAGEMENT__": "Engagement",
    "__TERM_ONBOARDING__": "Onboarding",
    "__TERM_ECHO_PULSE__": "Echo Pulse",
    "__TERM_BEHAVERA__": "Behavera",
    "__TERM_BURNOUT__": "Burnout",
    "__TERM_EMPLOYEE_TURNOVER__": "Mitarbeiterfluktuation",
}


def parse_frontmatter(raw: str) -> tuple[dict[str, str], str]:
    match = FRONTMATTER_RE.match(raw.replace("\r\n", "\n"))
    if not match:
        return {}, raw

    frontmatter_raw, body = match.groups()
    frontmatter: dict[str, str] = {}
    for line in frontmatter_raw.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        frontmatter[key.strip()] = value.strip().strip("\"'")
    return frontmatter, body.strip()


def apply_cs_glossary(text: str) -> str:
    result = text
    for pattern, replacement in CS_TO_EN_GLOSSARY:
        result = pattern.sub(replacement, result)
    return result


def restore_terms(text: str, replacements: dict[str, str]) -> str:
    result = text
    for placeholder, target in replacements.items():
        result = result.replace(placeholder, target)
    return result


def translate_chunk(text: str, source_lang: str, target_lang: str) -> str:
    if not text.strip():
        return text

    query = urllib.parse.urlencode(
        {
            "client": "gtx",
            "sl": source_lang,
            "tl": target_lang,
            "dt": "t",
            "q": text,
        }
    )
    req = urllib.request.Request(
        f"{TRANSLATE_URL}?{query}",
        headers={"User-Agent": "Mozilla/5.0"},
    )
    last_error: Exception | None = None
    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
            time.sleep(REQUEST_DELAY_SEC)
            return "".join(part[0] for part in payload[0] if part and part[0])
        except (HTTPError, URLError, TimeoutError) as error:
            last_error = error
            if attempt == MAX_RETRIES - 1:
                break
            time.sleep(1.5 * (attempt + 1))

    raise RuntimeError(
        f"Translation failed after {MAX_RETRIES} attempts for {source_lang}->{target_lang}"
    ) from last_error


def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    if len(text) <= MAX_CHARS:
        return translate_chunk(text, source_lang, target_lang)

    pieces: list[str] = []
    current = ""
    for part in re.split(r"(\n\n+)", text):
        candidate = f"{current}{part}"
        if current and len(candidate) > MAX_CHARS:
            pieces.append(current)
            current = part
        else:
            current = candidate
    if current:
        pieces.append(current)
    return "".join(translate_chunk(piece, source_lang, target_lang) for piece in pieces)


def translate_inline(text: str, source_lang: str, target_lang: str) -> str:
    placeholders: list[tuple[str, str]] = []

    def protect(pattern: re.Pattern[str], value_builder) -> None:
        nonlocal text

        def repl(match: re.Match[str]) -> str:
            token = f"__INLINE_{len(placeholders)}__"
            placeholders.append((token, value_builder(match)))
            return token

        text = pattern.sub(repl, text)

    protect(IMAGE_RE, lambda m: f"![{translate_inline(m.group(1), source_lang, target_lang)}]({m.group(2)})")
    protect(LINK_RE, lambda m: f"[{translate_inline(m.group(1), source_lang, target_lang)}]({m.group(2)})")
    protect(INLINE_CODE_RE, lambda m: m.group(0))

    translated = translate_text(text, source_lang, target_lang)
    for token, original in placeholders:
        translated = translated.replace(token, original)
    return translated


def translate_table_row(line: str, source_lang: str, target_lang: str) -> str:
    if re.fullmatch(r"\|\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?", line.strip()):
        return line

    has_leading = line.startswith("|")
    has_trailing = line.endswith("|")
    cells = line.strip("|").split("|")
    translated_cells = [translate_inline(cell.strip(), source_lang, target_lang) for cell in cells]
    rebuilt = " | ".join(translated_cells)
    if has_leading:
        rebuilt = f"| {rebuilt}"
    if has_trailing:
        rebuilt = f"{rebuilt} |"
    return rebuilt


def translate_markdown(markdown: str, source_lang: str, target_lang: str) -> str:
    code_blocks: list[str] = []

    def code_repl(match: re.Match[str]) -> str:
        token = f"__CODEBLOCK_{len(code_blocks)}__"
        code_blocks.append(match.group(0))
        return token

    protected = CODE_FENCE_RE.sub(code_repl, markdown)
    translated_blocks: list[str] = []

    for block in re.split(r"(\n\s*\n)", protected):
        if not block:
            continue
        if re.fullmatch(r"\n\s*\n", block):
            translated_blocks.append(block)
            continue

        stripped = block.strip()
        if not stripped:
            translated_blocks.append(block)
            continue

        if stripped.startswith("__CODEBLOCK_"):
            translated_blocks.append(block)
            continue

        block_lines = block.splitlines()
        if block_lines and all(line.strip().startswith("|") for line in block_lines if line.strip()):
            translated_blocks.append(
                "\n".join(translate_table_row(line, source_lang, target_lang) if line.strip() else line for line in block_lines)
            )
            continue

        translated_blocks.append(translate_inline(block, source_lang, target_lang))

    translated = "".join(translated_blocks)
    for index, block in enumerate(code_blocks):
        translated = translated.replace(f"__CODEBLOCK_{index}__", block)
    return translated


def enforce_h1(markdown: str, title: str) -> str:
    lines = markdown.splitlines()
    for index, line in enumerate(lines):
        if line.startswith("# "):
            lines[index] = f"# {title}"
            return "\n".join(lines)
    return f"# {title}\n\n{markdown.strip()}"


def normalize_en(text: str) -> str:
    result = restore_terms(text, EN_RESTORE)
    result = result.replace("turnover costs", "cost of employee turnover")
    result = result.replace("silent employee turnover", "hidden employee turnover")
    result = result.replace("silent turnover", "hidden turnover")
    result = result.replace("quiet leave", "quiet quitting")
    result = result.replace("managerial", "managerial")
    return result


def normalize_de(text: str) -> str:
    result = restore_terms(text, EN_TO_DE_RESTORE)
    replacements = {
        "Umsatzkosten": "Kosten",
        "stiller Umsatz": "stille Fluktuation",
        "stiller Umsatzrückgang": "stille Fluktuation",
        "Mitarbeiterumsatz": "Mitarbeiterfluktuation",
        "Umsatz": "Fluktuation",
        "Pulse-Umfrage": "Pulse Survey",
        "Impulsbefragung": "Pulse Survey",
        "ruhiges Aufhören": "Quiet Quitting",
    }
    for wrong, correct in replacements.items():
        result = result.replace(wrong, correct)
    return result


def translate_article(path: Path) -> tuple[str, dict[str, object]]:
    raw = path.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter(raw)
    slug = frontmatter["slug"]

    title_cs = frontmatter["title"]
    excerpt_cs = frontmatter.get("meta_description") or ""
    body_for_en = apply_cs_glossary(body)
    title_for_en = apply_cs_glossary(title_cs)
    excerpt_for_en = apply_cs_glossary(excerpt_cs)

    print(f"Translating {path.name} -> en", flush=True)
    title_en = normalize_en(translate_text(title_for_en, "cs", "en")).strip()
    excerpt_en = normalize_en(translate_text(excerpt_for_en, "cs", "en")).strip()
    content_en = normalize_en(translate_markdown(body_for_en, "cs", "en")).strip()
    content_en = enforce_h1(content_en, title_en)

    print(f"Translating {path.name} -> de", flush=True)
    title_de = normalize_de(translate_text(title_en, "en", "de")).strip()
    excerpt_de = normalize_de(translate_text(excerpt_en, "en", "de")).strip()
    content_de = normalize_de(translate_markdown(content_en, "en", "de")).strip()
    content_de = enforce_h1(content_de, title_de)

    return slug, {
        "en": {
            "title": title_en,
            "excerpt": excerpt_en,
            "content_markdown": content_en,
        },
        "de": {
            "title": title_de,
            "excerpt": excerpt_de,
            "content_markdown": content_de,
        },
    }


def main() -> None:
    translations: dict[str, object] = {}
    if OUTPUT_PATH.exists():
        translations = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    requested = set(sys.argv[1:])
    paths = sorted(BLOG_DIR.glob("*.mdx"))
    for path in paths:
        if path.name == "STYLEGUIDE.md":
            continue
        if requested and path.name not in requested and path.stem not in requested:
            continue
        frontmatter, _ = parse_frontmatter(path.read_text(encoding="utf-8"))
        slug = frontmatter.get("slug")
        if slug and slug in translations:
            print(f"Skipping {path.name}, already translated", flush=True)
            continue
        slug, payload = translate_article(path)
        translations[slug] = payload
        OUTPUT_PATH.write_text(
            json.dumps(translations, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    print(f"Wrote {OUTPUT_PATH}", flush=True)


if __name__ == "__main__":
    main()
