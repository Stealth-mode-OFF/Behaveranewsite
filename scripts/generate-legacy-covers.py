#!/usr/bin/env python3
"""
Generate emotigram-style blog cover images for 16 legacy EN blog posts
using OpenAI's gpt-image-1 (DALL-E) API.

Style: semi-flat editorial illustrations matching the existing 30 CZ covers.
"""

import os
import base64
import json
import time
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("Installing openai package...")
    os.system("pip3 install openai")
    from openai import OpenAI

API_KEY = os.environ.get("OPENAI_API_KEY", "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")
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "blog-covers"

STYLE_SUFFIX = (
    "Clean semi-flat editorial illustration style. Deep purple (#1e0a3c) and soft grey palette "
    "with warm orange-gold accents. Minimalist geometric shapes, subtle paper texture. "
    "Professional B2B SaaS aesthetic. Landscape 3:2 ratio. No text in the image. "
    "Avoid: cartoon style, realistic photography, cluttered composition, people with realistic faces."
)

# 16 legacy posts: slug -> prompt concept
POSTS = [
    {
        "slug": "5-leaders-share-7-tips-to-kickstart-your-leadership",
        "concept": "New leader stepping up — growth and team guidance",
        "prompt": (
            "A single figure standing on a rising staircase made of geometric blocks, "
            "reaching upward toward a glowing star. Below, 5 smaller silhouettes look up supportively. "
            "The staircase transitions from dark purple at the bottom to warm orange-gold at the top, "
            "symbolizing leadership growth. Abstract geometric background with soft gradients."
        ),
    },
    {
        "slug": "office-time-productive-time-or-is-it",
        "concept": "Office time vs productive time — clock and output mismatch",
        "prompt": (
            "A large wall clock with its hands spinning, next to a productivity meter/gauge that shows "
            "a low reading. Between them, a desk with a laptop where a silhouette figure sits. "
            "The clock is rendered in deep purple, the low gauge in warm orange. "
            "Scattered geometric shapes represent wasted time floating away like bubbles."
        ),
    },
    {
        "slug": "the-creeping-killer-of-your-business",
        "concept": "Silent disengagement creeping through an organization",
        "prompt": (
            "A healthy thriving office building on the left, gradually transitioning to a crumbling, "
            "fading version on the right. Subtle cracks appear in the walls, with small dark tendrils "
            "creeping upward from the foundation. The healthy side glows warm orange-gold, "
            "the deteriorating side is dark purple and grey. A subtle heartbeat/pulse line runs across."
        ),
    },
    {
        "slug": "hiring-only-top-performing-sales-reps",
        "concept": "Identifying top sales talent — separating signal from noise",
        "prompt": (
            "A row of 7 abstract human silhouettes standing in line. One silhouette in the center "
            "glows bright warm orange-gold with radiating energy lines, while others are in muted grey. "
            "Above, a magnifying glass or radar beam sweeps across them. "
            "A subtle bar chart in the background shows varying performance levels."
        ),
    },
    {
        "slug": "valxons-discovery-journey-of-the-truth-behind-money-complaints",
        "concept": "Looking beneath surface complaints to find root causes",
        "prompt": (
            "An iceberg illustration where the tip above water shows golden coins and money symbols, "
            "but below the waterline reveals much larger hidden shapes: a broken heart, disconnected "
            "puzzle pieces, and a dimming lightbulb representing real issues like recognition, "
            "connection and purpose. Water line divides deep purple above from soft grey below."
        ),
    },
    {
        "slug": "old-school-recruiting-is-the-new-blackberry",
        "concept": "Outdated recruitment methods vs modern approach",
        "prompt": (
            "Split composition: left side shows an old-fashioned filing cabinet, paper resumes, "
            "and a rotary phone, all rendered in fading grey with cobwebs. Right side shows a sleek "
            "modern dashboard with data visualizations and connected nodes glowing in warm orange-gold. "
            "A diagonal line divides old from new. Deep purple background."
        ),
    },
    {
        "slug": "how-to-do-1-1-meetings-effectively",
        "concept": "Effective one-on-one meetings — meaningful dialogue",
        "prompt": (
            "Two abstract figures sitting across a small round table, connected by glowing warm orange "
            "conversation lines that form a bridge between them. Speech bubbles contain abstract "
            "geometric shapes (not text). The table and chairs are deep purple, the connection lines "
            "radiate warmth. A subtle clock in the background shows dedicated time."
        ),
    },
    {
        "slug": "busting-6-myths-about-well-being-in-companies",
        "concept": "Myths being shattered — breaking misconceptions",
        "prompt": (
            "Six floating bubbles or glass spheres, each containing a different myth symbol "
            "(a simple icon), being shattered by small geometric arrows or rays of light. "
            "The broken pieces transform into warm orange-gold sparks. "
            "Deep purple background with scattered geometric fragments. "
            "The overall feeling is liberation and clarity."
        ),
    },
    {
        "slug": "well-being-of-leaders-at-risk",
        "concept": "Leader carrying heavy burden — well-being at stake",
        "prompt": (
            "A single tall figure (leader silhouette) standing strong but with visible cracks "
            "forming across their body, like a statue under pressure. They hold up a large platform "
            "with smaller figures (team) standing on it comfortably. The leader is deep purple "
            "with orange-gold cracks showing strain. The team above is in comfortable soft grey."
        ),
    },
    {
        "slug": "hr-conferences-2023-international-online-events",
        "concept": "Global HR conference — connected professionals worldwide",
        "prompt": (
            "A stylized globe with connection lines linking multiple location dots across continents. "
            "Small laptop/screen icons at each dot suggest virtual attendance. "
            "The globe is rendered in deep purple, connection lines in warm orange-gold, "
            "screens glow softly. Calendar pages flutter around the globe. Geometric grid background."
        ),
    },
    {
        "slug": "behavera-well-being-index",
        "concept": "Well-being measurement dashboard — index visualization",
        "prompt": (
            "A large circular well-being index gauge or radial chart at center, divided into 12 segments "
            "like a clock face. Each segment has a different fill level showing various well-being factors. "
            "Colors transition from deep purple (low) through soft grey to warm orange-gold (high). "
            "Small human silhouettes surround the chart. Clean data visualization aesthetic."
        ),
    },
    {
        "slug": "how-to-deal-with-well-being-effectively",
        "concept": "Strategic approach to workplace well-being",
        "prompt": (
            "A toolbox or toolkit opening up, with various well-being tools emerging: a heart, "
            "a balance scale, a growing plant, a shield, and a lightbulb — all floating upward "
            "in an organized constellation. The toolbox is deep purple, tools glow warm orange-gold. "
            "Soft connecting lines link the tools into a strategic framework."
        ),
    },
    {
        "slug": "7-tips-for-improving-employee-engagement-in-hybrid-work",
        "concept": "Hybrid work engagement — bridging office and remote",
        "prompt": (
            "A split scene: left side shows a small office building, right side shows a home with "
            "a desk by a window. A glowing warm orange bridge connects them, with 7 small star-like "
            "points along the bridge representing 7 tips. Small human silhouettes walk across. "
            "Deep purple buildings, orange-gold bridge, soft grey sky background."
        ),
    },
    {
        "slug": "inspiring-ted-talks-for-hr-professionals",
        "concept": "Inspiring TED talks — knowledge and inspiration",
        "prompt": (
            "A classic TED-style red circular stage carpet viewed from above, rendered in warm orange-gold. "
            "A single spotlight illuminates a small figure standing at center. "
            "Radiating outward from the stage are abstract idea symbols: lightbulbs, gears, hearts, "
            "stars — flowing toward silhouette audience figures. Deep purple background."
        ),
    },
    {
        "slug": "5-trends-that-will-transform-the-way-we-work",
        "concept": "Future work trends — transformation arrows",
        "prompt": (
            "Five large upward-pointing arrows arranged in a row, each with a different abstract icon "
            "at the tip: a brain (AI), a house (remote), a heart (well-being), a network node (connection), "
            "and a leaf (sustainability). Arrows transition from deep purple at base to warm orange-gold "
            "at tips. Futuristic geometric grid background with subtle motion lines."
        ),
    },
    {
        "slug": "the-future-of-work-is-in-the-people-first-approach",
        "concept": "People-first future — humans at the center of business",
        "prompt": (
            "A large warm orange-gold heart shape at center, with a modern office/city skyline growing "
            "from within and around it. Small human silhouettes are integrated throughout — some inside "
            "the heart, some walking along the skyline. The heart pulses with subtle energy rings. "
            "Deep purple background transitioning to soft grey at edges."
        ),
    },
]


def generate_image(client: OpenAI, prompt: str, slug: str) -> bytes | None:
    """Generate image via OpenAI gpt-image-1 and return PNG bytes."""
    full_prompt = f"{prompt}\n\n{STYLE_SUFFIX}"
    try:
        result = client.images.generate(
            model="gpt-image-1",
            prompt=full_prompt,
            size="1536x1024",  # landscape ~3:2
            quality="medium",
            n=1,
        )
        # gpt-image-1 returns base64
        image_b64 = result.data[0].b64_json
        if image_b64:
            return base64.b64decode(image_b64)
        # fallback: URL
        url = result.data[0].url
        if url:
            import urllib.request
            with urllib.request.urlopen(url) as resp:
                return resp.read()
    except Exception as e:
        print(f"  ERROR generating {slug}: {e}")
        return None


def png_to_webp(png_bytes: bytes, output_path: Path, quality: int = 82):
    """Convert PNG bytes to WebP file."""
    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(png_bytes))
        img.save(str(output_path), "WEBP", quality=quality)
        return True
    except ImportError:
        # Fallback: save as PNG, convert with sips (macOS)
        tmp = output_path.with_suffix(".png")
        tmp.write_bytes(png_bytes)
        os.system(f'sips -s format webp "{tmp}" --out "{output_path}" 2>/dev/null')
        if output_path.exists():
            tmp.unlink()
            return True
        # If sips fails, just rename
        tmp.rename(output_path.with_suffix(".png"))
        print(f"  WARNING: saved as PNG (no WebP converter)")
        return False


def main():
    client = OpenAI(api_key=API_KEY)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    results = []
    for i, post in enumerate(POSTS):
        slug = post["slug"]
        output_file = OUTPUT_DIR / f"{slug}.webp"

        if output_file.exists():
            print(f"[{i+1}/{len(POSTS)}] SKIP {slug} (already exists)")
            results.append({"slug": slug, "status": "skipped"})
            continue

        print(f"[{i+1}/{len(POSTS)}] Generating {slug}...")
        png_bytes = generate_image(client, post["prompt"], slug)
        if not png_bytes:
            results.append({"slug": slug, "status": "failed"})
            continue

        png_to_webp(png_bytes, output_file)
        size_kb = output_file.stat().st_size / 1024
        print(f"  -> {output_file.name} ({size_kb:.0f} KB)")
        results.append({"slug": slug, "status": "ok", "size_kb": round(size_kb)})

        # Rate limit: ~5 images per minute for gpt-image-1
        if i < len(POSTS) - 1:
            time.sleep(12)

    print("\n=== RESULTS ===")
    ok = sum(1 for r in results if r["status"] == "ok")
    skip = sum(1 for r in results if r["status"] == "skipped")
    fail = sum(1 for r in results if r["status"] == "failed")
    print(f"Generated: {ok}, Skipped: {skip}, Failed: {fail}")

    # Save prompts for reference
    prompts_file = Path(__file__).parent.parent / "content" / "blog" / "cover-image-prompts-legacy.json"
    with open(prompts_file, "w") as f:
        json.dump(POSTS, f, indent=2)
    print(f"Prompts saved to {prompts_file}")


if __name__ == "__main__":
    main()
