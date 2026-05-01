# matteodada.com — Build Spec

## Stack
- Astro 5 (static output)
- Plain CSS (no Tailwind, no CSS framework)
- No TypeScript
- No React or any JS framework

## Project Structure

```
journal/
├── public/
│   └── fonts/
│       └── ThatThatNewPixelFamily-Square.woff2
├── src/
│   ├── content/
│   │   └── config.js               # Astro 5 content layer schemas
│   ├── pages/
│   │   ├── index.astro
│   │   ├── thoughts/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── adventures/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── projects/
│   │   │   └── index.astro
│   │   ├── creatives/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── highlights/
│   │       └── index.astro
│   ├── layouts/
│   │   └── Base.astro
│   └── styles/
│       └── global.css
├── content/                        # markdown files at project root (not inside src/)
│   ├── thoughts/
│   └── adventures/
├── data/
│   ├── photos.json
│   ├── projects.json
│   ├── highlights.json
│   └── locations.json
└── astro.config.mjs
```

---

## Data Architecture

**Hybrid approach — two storage systems:**

- `content/thoughts/` + `content/adventures/` → Astro Content Collections (Astro 5 glob loader). The `content/` directory is at the **project root**, not inside `src/`. The schema lives at `src/content/config.js`.
- `data/photos.json`, `data/projects.json`, `data/highlights.json`, `data/locations.json` → plain JSON, imported directly with `import foo from '../../data/foo.json'`

**Slugs:** For content collections, `entry.id` (filename without extension) is used as the URL slug — not a separate `slug` frontmatter field.

**Date pattern across all data:** Every entry uses two date fields:
- `date` — ISO date string (e.g. `"2025-09-01"`), used for sorting
- `date_label` — human-readable display string (e.g. `"September 2025"`), used in templates

---

## Typography

### Custom font (site name only)
```css
@font-face {
  font-family: 'ThatThatNewPixelFamily-Square';
  src: url('/fonts/ThatThatNewPixelFamily-Square.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

.site-name {
  font-family: 'ThatThatNewPixelFamily-Square', serif;
  font-size: 20px;
}
```

### Body
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #111;
  background: #fff;
}

a {
  color: #111;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.secondary {
  color: #999;
}
```

---

## Global Layout (Base.astro)

Every page uses a fixed left sidebar and a content area to the right.

**Props:** `title` (string), `activePage` (string, default `''`), `wide` (boolean, default `false`)

**Sidebar:**
- `matteo dada` in custom font (20px) at top → links to `/`
- Nav links below: `thoughts` / `adventures` / `projects` / `creatives` / `highlights`
- 16px padding on all sides
- Active page link is `font-weight: bold`
- Sidebar: `width: 180px; position: fixed`

**Content area:**
- `margin-left: 180px; padding: 72px 32px 64px 32px; max-width: 600px`
- The 72px top padding aligns the first content element with the nav links (sidebar padding-top 16 + site-name line-height ~32 + margin-bottom 24 = 72)
- `wide={true}` adds `.content--wide` which overrides `max-width` to `none` — used for adventures grid and creatives grid

---

## Pages

### Home `/`
Sections in this order, top to bottom:

1. **last thought** — most recent from `thoughts` collection, show title (link) + `date_label` on the right
2. **last adventure** — most recent from `adventures` collection, show cover image (`.home-adventure-cover`: 50% width via `.home-adventure-block`, 3/2 aspect ratio) + name (link) + `date_label`
3. **last project** — the entry in `projects.json` with `"featured": true`, or the most recent if none is featured. Shows name (external link or plain text if no url) + `date_label` + description
4. **last creatives** — 4 most recent from `photos.json`, horizontal strip (`.creatives-strip`): fixed 120px height, auto width per image; each image links to detail page
5. **last highlight** — most recent entry from `highlights.json`, shows type + title row then `date_label, note`
6. **where i'm at** — `.location` of the entry with the latest `start_date` in `locations.json`, plain text

Section labels use `.section-label` (12px, #999, muted). "where i'm at" uses `.section-label--tight` (4px bottom margin instead of 8px).

---

### Thoughts `/thoughts`
**List:**
- Flat list, sorted by date descending
- Each row: title (underlined link, left) + `date_label` (right, 12px, `flex-shrink: 0`)
- Rows have `margin-bottom: 8px` (inline style)

**Detail `/thoughts/[slug]`:**
- Header: `<h1 class="entry-header">` — `title` + `<span class="secondary">date_label</span>`
- Visually flat header: 14px, font-weight normal
- Body: `.prose` wrapping `<Content />`
- No images in thoughts

**Content collection schema:**
```js
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/thoughts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    date_label: z.string(),
  }),
});
```

**Frontmatter:**
```yaml
---
title: "Why small towns will not be hit by AI"
date: "2026-03-08"
date_label: "8 March 2026"
---
```

---

### Adventures `/adventures`
**List:**
- 3-column grid, uses `wide={true}` on Base
- Each card: cover image (3/2 aspect ratio, `object-fit: cover`) + name (underlined link) + `date_label` below in muted 12px
- Sorted by date descending

**Detail `/adventures/[slug]`:**
- Header: `<h1 class="entry-header">` — title + secondary date_label
- Freeform body: `.prose` wrapping `<Content />`
- Images inside markdown `<p>` tags get CSS-driven layouts via `:has()` (see Prose Images below)

**Content collection schema:**
```js
const adventures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/adventures' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    date_label: z.string(),
    cover: z.string(),
  }),
});
```

**Frontmatter:**
```yaml
---
title: "Japan"
date: "2025-09-01"
date_label: "September 2025"
cover: "https://res.cloudinary.com/[account]/image/upload/w_800,f_auto/cover.jpg"
---
```

---

### Projects `/projects`
No detail pages.

Two sections:
- **active** — `name` is an external link, `date_label` right-aligned, one-line description below
- **archived** — name is plain text (never linked), `date_label` right-aligned, description + optional `archived_reason` below

**projects.json structure:**
```json
[
  {
    "name": "Peak Partner",
    "date": "2025-01-01",
    "date_label": "January 2025",
    "url": "https://apps.apple.com/...",
    "description": "An app to help pro athletes understand the impact of their daily lives on performance.",
    "status": "active",
    "featured": true
  },
  {
    "name": "Watudu",
    "date": "2025-01-01",
    "date_label": "January 2025",
    "url": null,
    "description": "An app to help people find activities by category.",
    "archived_reason": "The content was bad.",
    "status": "archived"
  }
]
```

`featured` (optional boolean) — marks which project appears in the home page "last project" section. Only one entry should have `"featured": true`. If none is marked, the most recent project is shown.

---

### Creatives `/creatives`
**Grid:**
- 4-column grid, uses `wide={true}` on Base
- `object-fit: contain`, `aspect-ratio: 1`
- No grayscale filter
- Sorted by date descending
- Each photo links to detail page

**Detail `/creatives/[slug]`:**
- Centered layout (`.creative-block > .creative-inner`)
- Image constrained to `max-height: 75vh`, `width: auto`
- Below image: `.creative-meta` flex row
  - Left column: `location` (12px) + copyright `© Matteo Dada. All Rights Reserved.` (10px, #999) stacked vertically
  - Right: `taken with [camera]` (12px)
- Static paths are built from `photos.json` (not a content collection); `photo.slug` is the URL param

**photos.json structure:**
```json
[
  {
    "slug": "japan-temple",
    "image": "https://res.cloudinary.com/[account]/image/upload/w_800,f_auto/japan-temple.jpg",
    "location": "Kyoto, Japan, September 2025",
    "date": "2025-09-01",
    "date_label": "September 2025",
    "camera": "Leica Q2"
  }
]
```

---

### Highlights `/highlights`
No detail pages.

Flat list, sorted by date descending. Each entry:
- Line 1: `type` (12px, #999, left) + `title` (14px, font-weight normal, same line)
- Line 2: `date_label, note` concatenated

Type is any free string (`music`, `movie`, `series`, `youtube channel`, `quote`, `artist`, etc.) — no predefined list.

**highlights.json structure:**
```json
[
  {
    "type": "music",
    "title": "Mace Island",
    "date": "2024-12-28",
    "date_label": "28 décembre 2024",
    "note": "il va percer"
  },
  {
    "type": "quote",
    "title": "\"Improvise, Adapt, Overcome\" - Bear Grylls",
    "date": "2000-08-03",
    "date_label": "2000",
    "note": "born to risk it all"
  }
]
```

---

### locations.json
Array of location objects. Sorted by `start_date` descending at build time — the entry with the latest `start_date` is displayed on the home page. `end_date: null` means current.
```json
[
  {
    "location": "Toulouse",
    "start_date": "2025-01-01",
    "end_date": null
  }
]
```

---

## CSS Rules

### Prose images — adventure body (`:has()` selectors)

Images are grouped inside `<p>` tags in markdown. Layout is CSS-only via `:has()`:

```css
/* p containing exactly 1 image */
.prose p:has(img):not(:has(img + img)) {
  margin: 2rem 0;
}
.prose p:has(img):not(:has(img + img)) img {
  max-height: 30vh;
  width: auto;
  max-width: 100%;
}

/* p containing exactly 2 images — side by side */
.prose p:has(img + img):not(:has(img + img + img)) {
  display: flex;
  gap: 5%;
}
.prose p:has(img + img):not(:has(img + img + img)) img {
  width: 40%;
  max-height: 30vh;
  object-fit: contain;
}
.prose p:has(img + img):not(:has(img + img + img)) img:last-child {
  margin-right: 15%; /* 40+5+40+15 = 100% */
}

/* p containing exactly 3 images */
.prose p:has(img + img + img) {
  display: flex;
  gap: 5%;
}
.prose p:has(img + img + img) img {
  width: 30%;
  max-height: 30vh;
  object-fit: contain;
}
```

### Creatives grid
```css
.creatives-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 60px;
}

.creatives-grid img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
}
```

### Creatives strip (home page — last 4)
```css
.creatives-strip {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.creatives-strip img {
  height: 120px;
  width: auto;
}
```

### Adventures list grid
```css
.adventures-grid {
  display: grid;
  grid-template-columns: repeat(3, 20%);
  gap: 60px 32px;
}

.adventure-card img {
  width: 100%;
  aspect-ratio: 3/2;
  object-fit: cover;
}
```

### Cloudinary URL pattern
Always use optimized Cloudinary URLs:
- Body images: `w_800,f_auto,q_auto`
- Thumbnails: `w_400,f_auto,q_auto`
- Creative detail: `w_1200,f_auto,q_auto`

---

## astro.config.mjs
```js
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://matteodada.com',
  output: 'static',
});
```

## Notes

- No responsive / mobile CSS. Desktop-only for now.
- No dark mode, no CSS variables.
- No components beyond `Base.astro`. All markup is inlined into page files.
- The only inline style in the codebase is `margin-bottom: 8px` on thought list rows.
