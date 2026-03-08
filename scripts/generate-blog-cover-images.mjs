#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, "content/blog/cover-image-prompts.json");
const blogDir = path.join(rootDir, "content/blog");
const publicDir = path.join(rootDir, "public");
const envExamplePath = path.join(rootDir, ".env.local.example");

const DEFAULT_DELAY_MS = 12_500;
const API_URL = "https://api.openai.com/v1/images/generations";

function parseArgs(argv) {
  const args = {
    dryRun: false,
    force: false,
    limit: null,
    slug: null,
    delayMs: DEFAULT_DELAY_MS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--force") args.force = true;
    else if (arg === "--limit") args.limit = Number(argv[index + 1] || 0) || null, index += 1;
    else if (arg === "--slug") args.slug = argv[index + 1] || null, index += 1;
    else if (arg === "--delay-ms") args.delayMs = Number(argv[index + 1] || DEFAULT_DELAY_MS) || DEFAULT_DELAY_MS, index += 1;
  }

  return args;
}

function parseDotEnv(raw) {
  const entries = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    entries[key] = value;
  }
  return entries;
}

async function readEnvFile(filename) {
  try {
    return parseDotEnv(await fs.readFile(path.join(rootDir, filename), "utf8"));
  } catch {
    return {};
  }
}

async function loadApiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;

  const localEnv = await readEnvFile(".env.local");
  if (localEnv.OPENAI_API_KEY) return localEnv.OPENAI_API_KEY;

  const exampleEnv = await readEnvFile(".env.local.example");
  if (exampleEnv.OPENAI_API_KEY && !exampleEnv.OPENAI_API_KEY.includes("your_")) {
    return exampleEnv.OPENAI_API_KEY;
  }

  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function removeWrappingQuotes(value) {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function parseFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: normalized };

  const frontmatter = {};
  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = removeWrappingQuotes(trimmed.slice(separator + 1));
    if (key) frontmatter[key] = value;
  }

  return { frontmatter, body: match[2] };
}

function buildCastingInstruction(index) {
  const leadGender = index % 2 === 0 ? "woman" : "man";
  return `Lead subject: ${leadGender}, Czech white professional, age 28-55, natural-looking, realistic proportions, smart casual clothing, minimal makeup, not a fashion model.`;
}

function buildPrompt(item, post, index) {
  return [
    `Editorial photograph of ${item.concept}, modern Czech office with glass partitions and wood accents, soft natural window light, shallow depth of field, candid moment, 85mm lens, Prague 2026.`,
    `Article title: ${post.frontmatter.title || item.slug}.`,
    `Primary persona: ${post.frontmatter.persona || "business leader"}.`,
    "Audience fit: credible for Czech CEOs and HR leaders in 2026, strategic and trustworthy rather than trendy or playful.",
    "People: exclusively Czech white professionals, men and women alternating as the main subject across the series, ages 28-55, natural skin, realistic faces, understated smart-casual styling, no American power suits.",
    buildCastingInstruction(index),
    "Environment: bright modern Czech office, Prague coworking or startup feel, glass partitions, wood accents, indoor plants, occasional Prague city view through the window, no American flags, no English slogans on walls.",
    "Photography: hyper-realistic documentary-style office photography, lightly warm color temperature, natural daylight from windows, candid not posed, visible depth separation, subtle sensor grain, real skin texture, true-to-life contrast, no beauty retouching.",
    "Realism: the frame should feel like a genuine moment captured inside a real Czech company, with slight asymmetry, lived-in details, believable body language, and natural facial micro-expressions.",
    "Brand fit: compatible with a deep-plum, soft-lavender, warm-white website palette and premium rounded card UI, but never polished into generic corporate advertising.",
    "Composition: wide landscape 3:2 image, one strong focal point readable at thumbnail size, subject slightly off-center, enough negative space for crop variants and article cards.",
    "Do not add any text in the image.",
    "Avoid: American or Asian faces, stock-photo smiles into camera, staged teamwork theater, boardroom applause, handshake cliches, glossy corporate ad aesthetics, overdone HDR, oversaturated colors, neon startup lighting, perfect symmetry, beauty retouching, readable UI, readable dashboards, logos, watermarks, distorted hands, blurry faces, extra fingers, AI artifacts.",
  ].join(" ");
}

async function loadManifest() {
  return JSON.parse(await fs.readFile(manifestPath, "utf8"));
}

async function loadPost(file) {
  const fullPath = path.join(blogDir, file);
  const raw = await fs.readFile(fullPath, "utf8");
  return {
    path: fullPath,
    raw,
    ...parseFrontmatter(raw),
  };
}

async function ensureDirectory(filepath) {
  await fs.mkdir(path.dirname(filepath), { recursive: true });
}

async function generateImage(apiKey, prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1.5",
      prompt,
      size: "1536x1024",
      quality: "medium",
      background: "opaque",
      output_format: "webp",
      output_compression: 82,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI image generation failed (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`OpenAI image generation returned no image payload: ${JSON.stringify(json)}`);
  }

  return Buffer.from(b64, "base64");
}

async function updateCoverImageFrontmatter(postPath, coverImagePath) {
  const raw = await fs.readFile(postPath, "utf8");
  if (!raw.startsWith("---\n")) {
    throw new Error(`Missing frontmatter in ${postPath}`);
  }

  const nextLine = `cover_image: "${coverImagePath}"`;
  let updated;
  if (/^cover_image:\s*.+$/m.test(raw)) {
    updated = raw.replace(/^cover_image:\s*.+$/m, nextLine);
  } else {
    updated = raw.replace(/^---\n([\s\S]*?)\n---\n/, `---\n$1\n${nextLine}\n---\n`);
  }

  if (updated !== raw) {
    await fs.writeFile(postPath, updated, "utf8");
  }
}

async function validateManifest(manifest) {
  const seen = new Set();
  for (const item of manifest) {
    if (seen.has(item.slug)) {
      throw new Error(`Duplicate slug in manifest: ${item.slug}`);
    }
    seen.add(item.slug);

    const postPath = path.join(blogDir, item.file);
    await fs.access(postPath);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = await loadManifest();
  await validateManifest(manifest);

  const filtered = manifest
    .filter((item) => !args.slug || item.slug === args.slug)
    .slice(0, args.limit || manifest.length);

  if (filtered.length === 0) {
    throw new Error("No blog posts matched the provided filters.");
  }

  console.log(`Preparing ${filtered.length} blog cover image job(s).`);
  console.log(`Manifest: ${path.relative(rootDir, manifestPath)}`);
  console.log(`Delay between requests: ${args.delayMs} ms`);

  if (args.dryRun) {
    for (const item of filtered) {
      const post = await loadPost(item.file);
      const outputPath = path.join(publicDir, item.output);
      console.log(`\n[DRY RUN] ${item.slug}`);
      console.log(`  Source: ${path.relative(rootDir, post.path)}`);
      console.log(`  Output: ${path.relative(rootDir, outputPath)}`);
      console.log(`  Prompt: ${buildPrompt(item, post, filtered.indexOf(item))}`);
    }
    return;
  }

  const apiKey = await loadApiKey();
  if (!apiKey) {
    throw new Error(
      `OPENAI_API_KEY was not found. Add it to your shell environment or .env.local. See ${path.relative(rootDir, envExamplePath)}.`
    );
  }

  for (let index = 0; index < filtered.length; index += 1) {
    const item = filtered[index];
    const post = await loadPost(item.file);
    const outputPath = path.join(publicDir, item.output);
    const publicPath = `/${item.output.replace(/\\/g, "/")}`;

    if (!args.force) {
      try {
        await fs.access(outputPath);
        await updateCoverImageFrontmatter(post.path, publicPath);
        console.log(`[${index + 1}/${filtered.length}] ${item.slug} already exists, skipping.`);
        continue;
      } catch {
        // Missing file is expected on first run.
      }
    }

    await ensureDirectory(outputPath);
    const prompt = buildPrompt(item, post, index);
    console.log(`[${index + 1}/${filtered.length}] Generating ${item.slug}...`);
    const imageBuffer = await generateImage(apiKey, prompt);
    await fs.writeFile(outputPath, imageBuffer);
    await updateCoverImageFrontmatter(post.path, publicPath);
    console.log(`  Saved ${path.relative(rootDir, outputPath)} and updated frontmatter.`);

    if (index < filtered.length - 1) {
      await sleep(args.delayMs);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
