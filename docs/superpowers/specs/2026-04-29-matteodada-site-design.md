# matteodada.com — Site Design

## Summary

Personal site for Matteo Dada. Static Astro site with a fixed left sidebar and content area. Desktop-only for now (mobile deferred). No JavaScript framework, no TypeScript, no CSS utility library.

---

## Stack

- **Astro** — static output (`output: 'static'`)
- **Plain CSS** — single `global.css`, no framework
- **No TypeScript** — plain JS throughout, including `content/config.js`
- **No React or any JS framework**

---

## Layout

- **Sidebar**: 180px wide, fixed left, padding 16px on all sides
  - "matteo dada" in pixel font (`ThatThatNewPixelFamily-Square`) at top, links to `/`
  - Nav links below with 24px gap after site name: `observations` / `adventures` / `projects` / `creatives` / `curation`
  - Active page link: `font-weight: bold`
- **Content area**: starts to the right of the sidebar, padding-left 32px
  - Max-width 800px, left-aligned
  - `padding-top` calculated so the first content element aligns with the "observations" nav link (= sidebar padding-top 16px + site-name line-height ~22px + margin-bottom 24px ≈ 62px)

---

## Content Architecture

**Hybrid approach:**
- `src/content/observations/` + `src/content/adventures/` → Astro Content Collections with `src/content/config.js` schema
- `data/photos.json`, `data/projects.json`, `data/curation.json`, `data/site.json` → direct JSON imports

`Base.astro` accepts:
- `title` prop (page `<title>`)
- `activePage` prop — one of `"observations" | "adventures" | "projects" | "creatives" | "curation"` — used to bold the correct nav link

---

## Pages

| Route | Data source | Notes |
|---|---|---|
| `/` | collections + all JSON | 5 sections in order |
| `/observations` | observations collection | flat list, date right DD-MM-YYYY |
| `/observations/[slug]` | observations collection | `title — DD/MM/YYYY` header |
| `/adventures` | adventures collection | 3-col grid |
| `/adventures/[slug]` | adventures collection | freeform body, side-by-side consecutive images |
| `/projects` | `projects.json` | active (linked) + archived (not linked) sections |
| `/creatives` | `photos.json` | 4-col grayscale grid |
| `/creatives/[slug]` | `photos.json` | large image + metadata + copyright |
| `/curation` | `curation.json` | flat list, type muted + title bold |

### Home `/`
Sections in order:
1. last observation — title (link) + date
2. last adventure — cover image + name (link) + date
3. active projects — name (external link) + date + description
4. last creatives — 5 most recent from `photos.json`, horizontal strip of square thumbnails (grayscale)
5. where i'm at — `location` from `site.json`

Section labels are 11px, color `#bbb`, lowercase.

---

## CSS Key Rules

```css
/* sidebar */
.sidebar { width: 180px; padding: 16px; }
.site-name { font-family: 'ThatThatNewPixelFamily-Square', serif; }
.content { padding: 62px 32px 32px 32px; max-width: 800px; }

/* body */
body { font-family: Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 1.6; color: #111; background: #fff; }
a { color: #111; text-decoration: underline; }

/* section labels */
.section-label { font-size: 11px; color: #bbb; }

/* creatives grid */
.creatives-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.creatives-grid img { width: 100%; aspect-ratio: 1; object-fit: cover; filter: grayscale(100%); }

/* adventures grid */
.adventures-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

/* prose images */
.prose img { width: 100%; margin: 1.5rem 0; display: block; }
.prose img + img { display: inline-block; width: calc(50% - 4px); }
```

---

## Dummy Content

Images use `https://picsum.photos` (swap for Cloudinary later).

**observations/** (2 entries)
- "Why small towns will not be hit by AI" — 2026-03-08
- "On keeping a journal" — 2025-11-15

**adventures/** (3 entries)
- "Madagascar" — 2026-06 (cover + body images, tests image layout)
- "Japan" — 2025-09 (cover + body images)
- "Pyrenees" — 2025-04 (cover + two consecutive images → side-by-side test)

**photos.json** — 6 entries (5 shown on home strip, all 6 on grid)

**projects.json** — 2 active, 1 archived

**curation.json** — 4 entries across types: music, quote, movie, artist

**site.json** — `{ "location": "Toulouse, France" }`

---

## Decisions Made

- Sidebar width: 180px (chosen over 140px and 220px)
- Mobile responsiveness: deferred, desktop-only for now
- Content top alignment: matches "observations" nav link via calculated padding-top (~62px)
- Content collection slugs for creatives: not needed — `photos.json` entries have explicit `slug` field, used directly in `getStaticPaths`
