# matteodada.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static personal site with a fixed left sidebar, serving observations, adventures, projects, creatives, and curation from markdown and JSON content.

**Architecture:** Astro 5 static output with a hybrid data model — Content Collections (glob loader) for markdown-based observations and adventures; direct JSON imports for photos, projects, curation, and site data. One `Base.astro` layout wraps all pages. All styles in a single `global.css`.

**Tech Stack:** Astro 5, plain CSS, no TypeScript, no JS framework

---

## File Map

**Create:**
- `package.json` — Astro dependency + dev scripts
- `astro.config.mjs` — site URL + static output
- `.gitignore` — node_modules, dist, .astro, .superpowers
- `src/content/config.js` — collection schemas for observations + adventures
- `src/layouts/Base.astro` — sidebar + slot wrapper
- `src/styles/global.css` — all styles
- `src/pages/index.astro` — home page
- `src/pages/observations/index.astro` — observations list
- `src/pages/observations/[slug].astro` — observation detail
- `src/pages/adventures/index.astro` — adventures grid
- `src/pages/adventures/[slug].astro` — adventure detail
- `src/pages/projects/index.astro` — projects (active + archived)
- `src/pages/creatives/index.astro` — creatives grid
- `src/pages/creatives/[slug].astro` — creative detail
- `src/pages/curation/index.astro` — curation list
- `content/observations/why-small-towns.md`
- `content/observations/on-keeping-a-journal.md`
- `content/adventures/madagascar.md`
- `content/adventures/japan.md`
- `content/adventures/pyrenees.md`
- `data/photos.json`
- `data/projects.json`
- `data/curation.json`
- `data/site.json`

**Already present:**
- `public/fonts/ThatThatNewPixelFamily-Square.woff2`

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "matteodada",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://matteodada.com',
  output: 'static',
});
```

- [ ] **Step 3: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
.superpowers/
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 5: Create required directory structure**

```bash
mkdir -p src/content src/layouts src/pages/observations src/pages/adventures src/pages/projects src/pages/creatives src/pages/curation src/styles content/observations content/adventures data
```

- [ ] **Step 6: Verify Astro CLI works**

```bash
npx astro --version
```

Expected: prints Astro version (5.x.x).

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs .gitignore
git commit -m "feat: init Astro project scaffold"
```

---

## Task 2: Global CSS and Base layout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
@font-face {
  font-family: 'ThatThatNewPixelFamily-Square';
  src: url('/fonts/ThatThatNewPixelFamily-Square.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 14px;
  line-height: 1.6;
  color: #111;
  background: #fff;
}

a {
  color: #111;
  text-decoration: underline;
}

/* ── Layout ── */

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 180px;
  flex-shrink: 0;
  padding: 16px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.site-name {
  font-family: 'ThatThatNewPixelFamily-Square', serif;
  display: block;
  margin-bottom: 24px;
  font-size: 14px;
  text-decoration: none;
  color: #111;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sidebar nav a {
  text-decoration: none;
  color: #111;
  font-size: 14px;
}

.sidebar nav a.active {
  font-weight: bold;
}

/* content top padding = sidebar padding-top (16) + site-name line-height (~22) + margin-bottom (24) = 62px */
.content {
  margin-left: 180px;
  padding: 62px 32px 64px 32px;
  max-width: 800px;
  width: 100%;
}

/* ── Section labels (home page dividers) ── */

.section-label {
  font-size: 11px;
  color: #bbb;
  margin-top: 32px;
  margin-bottom: 6px;
}

.section-label:first-child {
  margin-top: 0;
}

/* ── Row: title left, date right ── */

.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}

.row a {
  text-decoration: underline;
}

.row span {
  white-space: nowrap;
  font-size: 13px;
  flex-shrink: 0;
}

/* ── Prose (observation + adventure body) ── */

.prose p {
  margin-bottom: 1rem;
}

.prose img {
  width: 100%;
  margin: 1.5rem 0;
  display: block;
}

/* Two consecutive images = side by side */
.prose img + img {
  display: inline-block;
  width: calc(50% - 4px);
  vertical-align: top;
  margin-top: 0;
}

.prose img:has(+ img) {
  display: inline-block;
  width: calc(50% - 4px);
  vertical-align: top;
  margin-bottom: 0;
  margin-right: 8px;
}

/* ── Entry header (observation + adventure detail) ── */

.entry-header {
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 1.5rem;
}

/* ── Adventures grid ── */

.adventures-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.adventure-card img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
  margin-bottom: 6px;
}

.adventure-card a {
  display: block;
  margin-bottom: 2px;
}

.adventure-date {
  font-size: 12px;
  color: #555;
}

/* ── Creatives grid ── */

.creatives-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.creatives-grid a {
  display: block;
  text-decoration: none;
}

.creatives-grid img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  filter: grayscale(100%);
  display: block;
}

/* ── Creatives strip (home page) ── */

.creatives-strip {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.creatives-strip a {
  display: block;
  text-decoration: none;
  flex: 1;
}

.creatives-strip img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  filter: grayscale(100%);
  display: block;
}

/* ── Creative detail ── */

.creative-full {
  width: 100%;
  display: block;
  margin-bottom: 1rem;
}

.creative-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 0.5rem;
}

.creative-copyright {
  font-size: 12px;
  color: #888;
}

/* ── Projects ── */

.projects-section {
  margin-bottom: 2rem;
}

.projects-section-title {
  font-size: 11px;
  color: #bbb;
  margin-bottom: 12px;
}

.project-item {
  margin-bottom: 1.2rem;
}

.project-description {
  font-size: 13px;
  color: #444;
  margin-top: 2px;
}

.project-archived-reason {
  font-size: 12px;
  color: #999;
  font-style: italic;
  margin-top: 2px;
}

/* ── Curation ── */

.curation-item {
  margin-bottom: 1rem;
}

.curation-title-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.curation-type {
  font-size: 11px;
  color: #bbb;
}

.curation-title {
  font-weight: bold;
  font-size: 14px;
}

.curation-meta {
  font-size: 12px;
  color: #555;
  margin-top: 1px;
}
```

- [ ] **Step 2: Create `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
const { title, activePage = '' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>{title} — matteo dada</title>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <a href="/" class="site-name">matteo dada</a>
      <nav>
        <a href="/observations" class={activePage === 'observations' ? 'active' : ''}>observations</a>
        <a href="/adventures" class={activePage === 'adventures' ? 'active' : ''}>adventures</a>
        <a href="/projects" class={activePage === 'projects' ? 'active' : ''}>projects</a>
        <a href="/creatives" class={activePage === 'creatives' ? 'active' : ''}>creatives</a>
        <a href="/curation" class={activePage === 'curation' ? 'active' : ''}>curation</a>
      </nav>
    </aside>
    <main class="content">
      <slot />
    </main>
  </div>
</body>
</html>
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: build succeeds (no pages yet, just the layout). If you see "No pages found" that is fine at this stage — just confirm no errors in the layout/CSS files.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro
git commit -m "feat: add global CSS and Base layout"
```

---

## Task 3: Content collections config

**Files:**
- Create: `src/content/config.js`

Note: The config file must live at `src/content/config.js` (Astro requirement). The actual markdown files live at the project-root `content/` directory — referenced via the glob loader's `base` option.

- [ ] **Step 1: Create `src/content/config.js`**

```js
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const observations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/observations' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
  }),
});

const adventures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/adventures' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    cover: z.string(),
  }),
});

export const collections = { observations, adventures };
```

- [ ] **Step 2: Commit**

```bash
git add src/content/config.js
git commit -m "feat: add content collections config"
```

---

## Task 4: Data files

**Files:**
- Create: `data/photos.json`
- Create: `data/projects.json`
- Create: `data/curation.json`
- Create: `data/site.json`

- [ ] **Step 1: Create `data/photos.json`**

```json
[
  {
    "slug": "madagascar-street",
    "image": "https://picsum.photos/seed/madagascar/800/800",
    "location": "Madagascar, August 2003",
    "date": "2003-08",
    "camera": "Nikon DSLR"
  },
  {
    "slug": "japan-temple",
    "image": "https://picsum.photos/seed/japantemple/800/800",
    "location": "Kyoto, Japan, September 2025",
    "date": "2025-09",
    "camera": "Leica Q2"
  },
  {
    "slug": "pyrenees-peak",
    "image": "https://picsum.photos/seed/pyreneespeak/800/800",
    "location": "Pyrenees, France, April 2025",
    "date": "2025-04",
    "camera": "iPhone 15 Pro"
  },
  {
    "slug": "toulouse-canal",
    "image": "https://picsum.photos/seed/toulousecanal/800/800",
    "location": "Toulouse, France, January 2025",
    "date": "2025-01",
    "camera": "Leica Q2"
  },
  {
    "slug": "paris-street",
    "image": "https://picsum.photos/seed/parisstreet/800/800",
    "location": "Paris, France, December 2024",
    "date": "2024-12",
    "camera": "Nikon DSLR"
  },
  {
    "slug": "london-fog",
    "image": "https://picsum.photos/seed/londonfog/800/800",
    "location": "London, UK, November 2024",
    "date": "2024-11",
    "camera": "iPhone 14 Pro"
  }
]
```

- [ ] **Step 2: Create `data/projects.json`**

```json
[
  {
    "name": "Peak Partner",
    "date": "January 2025",
    "url": "https://apps.apple.com/app/peak-partner/id123456789",
    "description": "An app to help pro athletes understand the impact of their daily lives on performance.",
    "status": "active"
  },
  {
    "name": "Explorer Journal",
    "date": "April 2026",
    "url": "https://matteodada.com",
    "description": "A personal site to document travels, observations, and creative work.",
    "status": "active"
  },
  {
    "name": "Watudu",
    "date": "January 2025",
    "url": null,
    "description": "An app to help people find activities by category.",
    "archived_reason": "The content was bad.",
    "status": "archived"
  }
]
```

- [ ] **Step 3: Create `data/curation.json`**

```json
[
  {
    "type": "music",
    "title": "Mumbo Sugar from Arc De Soleil",
    "date": "2025-05",
    "note": "Hard to put into words but it just hits different."
  },
  {
    "type": "movie",
    "title": "Past Lives",
    "date": "2024-11",
    "note": "One of the most quietly devastating films I've seen in years."
  },
  {
    "type": "quote",
    "title": "The map is not the territory",
    "date": "2024-08",
    "note": "Alfred Korzybski"
  },
  {
    "type": "artist",
    "title": "Saul Leiter",
    "date": "2024-06",
    "note": "Discovered his photography and haven't looked at windows the same way since."
  }
]
```

- [ ] **Step 4: Create `data/site.json`**

```json
{
  "location": "Toulouse, France"
}
```

- [ ] **Step 5: Commit**

```bash
git add data/
git commit -m "feat: add JSON data files with dummy content"
```

---

## Task 5: Dummy markdown content

**Files:**
- Create: `content/observations/why-small-towns.md`
- Create: `content/observations/on-keeping-a-journal.md`
- Create: `content/adventures/madagascar.md`
- Create: `content/adventures/japan.md`
- Create: `content/adventures/pyrenees.md`

- [ ] **Step 1: Create `content/observations/why-small-towns.md`**

```markdown
---
title: "Why small towns will not be hit by AI"
date: "2026-03-08"
---

The conversation around AI displacement always centres on cities — the knowledge workers, the coders, the analysts. It misses something obvious: the economic fabric of small towns is built on things that require physical presence and personal trust.

Your plumber knows your house. Your baker remembers you take no sugar. The mechanic who services your car has thirty years of experience with the specific way that particular model rusts in your particular climate. None of this is easily automated.

There is also a social layer. In small places, reputation travels fast. People choose who they do business with based on who that person is, not just what they can do. A robot can fix a pipe but it cannot be a neighbour.

The real question for small towns is not whether AI will take jobs — it probably will not take many — but whether the young people who grew up there will stay. That is a harder problem, and an older one.
```

- [ ] **Step 2: Create `content/observations/on-keeping-a-journal.md`**

```markdown
---
title: "On keeping a journal"
date: "2025-11-15"
---

I have kept a journal since I was seventeen. Not every day — the consistency has varied wildly — but the practice has never fully stopped. It has changed shape many times.

What I have come to believe is that the point of a journal is not the record. You will not read most of it back. The point is the act of converting experience into language, which forces a kind of mild reckoning. You cannot write "today was fine" if you actually felt something. The page resists vagueness.

There is also a temporal benefit. Writing down what happened this morning makes this morning a distinct thing, separable from yesterday and tomorrow. Without that separation, days blur. Months blur. Years start to feel simultaneous.

This site is a kind of public journal. More curated, obviously. But the impulse is the same: to hold time still long enough to look at it.
```

- [ ] **Step 3: Create `content/adventures/madagascar.md`**

```markdown
---
title: "Madagascar"
date: "2026-06"
cover: "https://picsum.photos/seed/madagascarcover/800/600"
---

There is nowhere else quite like it. The island split from the African continent so long ago that it developed its own solutions to every biological problem. Walking through the Tsingy — those cathedral formations of razor limestone — you feel the particular loneliness of a place that evolved in isolation.

![Street in Antananarivo](https://picsum.photos/seed/mada1/800/600)

The capital, Antananarivo, sits on a series of hills and has the chaotic energy of a city that grew without a plan. Everywhere you look something interesting is happening.

![Market scene](https://picsum.photos/seed/mada2/800/600)
![Children near the harbour](https://picsum.photos/seed/mada3/800/600)

The two images above are from the same afternoon in Toamasina. The light was extraordinary — that particular equatorial gold that arrives without warning in the late afternoon.

The food was its own education. Rice at every meal, in quantities that would seem excessive anywhere else.
```

- [ ] **Step 4: Create `content/adventures/japan.md`**

```markdown
---
title: "Japan"
date: "2025-09"
cover: "https://picsum.photos/seed/japancover/800/600"
---

Kyoto in September is just past peak tourist season, which means it is merely very busy rather than completely overwhelming. The temples are still there, indifferent to the crowds.

![Fushimi Inari at dawn](https://picsum.photos/seed/japan1/800/600)

Going early in the morning to Fushimi Inari — before six — means walking the thousand torii gates almost alone. The path climbs through forest and the gates become gradually more spaced, the forest deeper.

Tokyo is a different experience entirely. A city that never stops operating, in the most literal sense.

![Shibuya crossing at night](https://picsum.photos/seed/japan2/800/600)

I am not sure I would want to live there, but I understand why people do.
```

- [ ] **Step 5: Create `content/adventures/pyrenees.md`**

```markdown
---
title: "Pyrenees"
date: "2025-04"
cover: "https://picsum.photos/seed/pyreneescover/800/600"
---

April in the Pyrenees means the snowline is still low. The trails below it are muddy and often empty. You can hike for hours without seeing anyone.

![Mountain trail in early spring](https://picsum.photos/seed/pyr1/800/600)

We walked the GR10 for four days, carrying too much food. The weather changed constantly — clear mornings, clouds by noon, clear again by late afternoon.

![Summit view east](https://picsum.photos/seed/pyr2/800/600)
![Summit view west](https://picsum.photos/seed/pyr3/800/600)

The two summit photographs above were taken from the same spot, turning. The difference in light is entirely down to which direction the cloud was moving.
```

- [ ] **Step 6: Verify collections load**

```bash
npm run build 2>&1 | head -30
```

Expected: build proceeds past collection loading (may fail later since pages don't exist yet — that is fine; look for any schema validation errors about your markdown frontmatter).

- [ ] **Step 7: Commit**

```bash
git add content/
git commit -m "feat: add dummy markdown content for observations and adventures"
```

---

## Task 6: Home page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { getCollection } from 'astro:content';
import projects from '../../data/projects.json';
import photos from '../../data/photos.json';
import site from '../../data/site.json';

const observations = await getCollection('observations');
observations.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
const lastObservation = observations[0];

const adventures = await getCollection('adventures');
adventures.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
const lastAdventure = adventures[0];

const activeProjects = projects.filter(p => p.status === 'active');

const sortedPhotos = [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));
const lastCreatives = sortedPhotos.slice(0, 5);

function formatObsDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

function formatAdvDate(dateStr) {
  const [year, month] = dateStr.split('-');
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}
---
<Base title="home">
  <div class="section-label">last observation</div>
  <div class="row">
    <a href={`/observations/${lastObservation.id}`}>{lastObservation.data.title}</a>
    <span>{formatObsDate(lastObservation.data.date)}</span>
  </div>

  <div class="section-label">last adventure</div>
  <img src={lastAdventure.data.cover} alt={lastAdventure.data.title} style="width:100%;display:block;margin-bottom:6px;" />
  <div class="row">
    <a href={`/adventures/${lastAdventure.id}`}>{lastAdventure.data.title}</a>
    <span>{formatAdvDate(lastAdventure.data.date)}</span>
  </div>

  <div class="section-label">active projects</div>
  {activeProjects.map(project => (
    <div class="project-item">
      <div class="row">
        <a href={project.url} target="_blank" rel="noopener noreferrer">{project.name}</a>
        <span>{project.date}</span>
      </div>
      <p class="project-description">{project.description}</p>
    </div>
  ))}

  <div class="section-label">last creatives</div>
  <div class="creatives-strip">
    {lastCreatives.map(photo => (
      <a href={`/creatives/${photo.slug}`}>
        <img src={photo.image} alt={photo.location} />
      </a>
    ))}
  </div>

  <div class="section-label">where i'm at</div>
  <p>{site.location}</p>
</Base>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds, `dist/index.html` is generated. No errors about missing data.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page"
```

---

## Task 7: Observations pages

**Files:**
- Create: `src/pages/observations/index.astro`
- Create: `src/pages/observations/[slug].astro`

- [ ] **Step 1: Create `src/pages/observations/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';

const observations = await getCollection('observations');
observations.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}
---
<Base title="observations" activePage="observations">
  {observations.map(entry => (
    <div class="row" style="margin-bottom: 4px;">
      <a href={`/observations/${entry.id}`}>{entry.data.title}</a>
      <span>{formatDate(entry.data.date)}</span>
    </div>
  ))}
</Base>
```

- [ ] **Step 2: Create `src/pages/observations/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const observations = await getCollection('observations');
  return observations.map(entry => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);

function formatDateSlash(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}
---
<Base title={entry.data.title} activePage="observations">
  <h1 class="entry-header">{entry.data.title} — {formatDateSlash(entry.data.date)}</h1>
  <div class="prose">
    <Content />
  </div>
</Base>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: `dist/observations/index.html` and `dist/observations/why-small-towns/index.html` (and the other slug) are generated.

- [ ] **Step 4: Commit**

```bash
git add src/pages/observations/
git commit -m "feat: add observations list and detail pages"
```

---

## Task 8: Adventures pages

**Files:**
- Create: `src/pages/adventures/index.astro`
- Create: `src/pages/adventures/[slug].astro`

- [ ] **Step 1: Create `src/pages/adventures/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';

const adventures = await getCollection('adventures');
adventures.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

function formatDate(dateStr) {
  const [year, month] = dateStr.split('-');
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}
---
<Base title="adventures" activePage="adventures">
  <div class="adventures-grid">
    {adventures.map(entry => (
      <div class="adventure-card">
        <img src={entry.data.cover} alt={entry.data.title} />
        <a href={`/adventures/${entry.id}`}>{entry.data.title}</a>
        <span class="adventure-date">{formatDate(entry.data.date)}</span>
      </div>
    ))}
  </div>
</Base>
```

- [ ] **Step 2: Create `src/pages/adventures/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const adventures = await getCollection('adventures');
  return adventures.map(entry => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);

function formatDate(dateStr) {
  const [year, month] = dateStr.split('-');
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}
---
<Base title={entry.data.title} activePage="adventures">
  <h1 class="entry-header">{entry.data.title} — {formatDate(entry.data.date)}</h1>
  <div class="prose">
    <Content />
  </div>
</Base>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: `dist/adventures/index.html` and per-slug pages generated (madagascar, japan, pyrenees).

- [ ] **Step 4: Commit**

```bash
git add src/pages/adventures/
git commit -m "feat: add adventures list and detail pages"
```

---

## Task 9: Projects page

**Files:**
- Create: `src/pages/projects/index.astro`

- [ ] **Step 1: Create `src/pages/projects/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import projects from '../../../data/projects.json';

const active = projects.filter(p => p.status === 'active');
const archived = projects.filter(p => p.status === 'archived');
---
<Base title="projects" activePage="projects">
  <div class="projects-section">
    <div class="projects-section-title">active</div>
    {active.map(project => (
      <div class="project-item">
        <div class="row">
          <a href={project.url} target="_blank" rel="noopener noreferrer">{project.name}</a>
          <span>{project.date}</span>
        </div>
        <p class="project-description">{project.description}</p>
      </div>
    ))}
  </div>

  <div class="projects-section">
    <div class="projects-section-title">archived</div>
    {archived.map(project => (
      <div class="project-item">
        <div class="row">
          <span>{project.name}</span>
          <span>{project.date}</span>
        </div>
        <p class="project-description">{project.description}</p>
        {project.archived_reason && (
          <p class="project-archived-reason">{project.archived_reason}</p>
        )}
      </div>
    ))}
  </div>
</Base>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: `dist/projects/index.html` generated, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/index.astro
git commit -m "feat: add projects page"
```

---

## Task 10: Creatives pages

**Files:**
- Create: `src/pages/creatives/index.astro`
- Create: `src/pages/creatives/[slug].astro`

- [ ] **Step 1: Create `src/pages/creatives/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import photos from '../../../data/photos.json';

const sorted = [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));
---
<Base title="creatives" activePage="creatives">
  <div class="creatives-grid">
    {sorted.map(photo => (
      <a href={`/creatives/${photo.slug}`}>
        <img src={photo.image} alt={photo.location} />
      </a>
    ))}
  </div>
</Base>
```

- [ ] **Step 2: Create `src/pages/creatives/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import photos from '../../../data/photos.json';

export async function getStaticPaths() {
  return photos.map(photo => ({
    params: { slug: photo.slug },
    props: { photo },
  }));
}

const { photo } = Astro.props;
---
<Base title={photo.location} activePage="creatives">
  <img src={photo.image} alt={photo.location} class="creative-full" />
  <div class="creative-meta">
    <span>{photo.location}</span>
    <span>taken with {photo.camera}</span>
  </div>
  <p class="creative-copyright">© Matteo Dada. All Rights Reserved.</p>
</Base>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: `dist/creatives/index.html` and per-slug pages for all 6 photos generated.

- [ ] **Step 4: Commit**

```bash
git add src/pages/creatives/
git commit -m "feat: add creatives grid and detail pages"
```

---

## Task 11: Curation page

**Files:**
- Create: `src/pages/curation/index.astro`

- [ ] **Step 1: Create `src/pages/curation/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import curation from '../../../data/curation.json';

const sorted = [...curation].sort((a, b) => new Date(b.date) - new Date(a.date));

function formatDate(dateStr) {
  const [year, month] = dateStr.split('-');
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}
---
<Base title="curation" activePage="curation">
  {sorted.map(item => (
    <div class="curation-item">
      <div class="curation-title-row">
        <span class="curation-type">{item.type}</span>
        <span class="curation-title">{item.title}</span>
      </div>
      <div class="curation-meta">{formatDate(item.date)} — {item.note}</div>
    </div>
  ))}
</Base>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: `dist/curation/index.html` generated, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/curation/index.astro
git commit -m "feat: add curation page"
```

---

## Task 12: Full build verification

- [ ] **Step 1: Clean build from scratch**

```bash
rm -rf dist/ && npm run build
```

Expected: exits with code 0. All routes generated:
- `dist/index.html`
- `dist/observations/index.html`
- `dist/observations/why-small-towns/index.html`
- `dist/observations/on-keeping-a-journal/index.html`
- `dist/adventures/index.html`
- `dist/adventures/madagascar/index.html`
- `dist/adventures/japan/index.html`
- `dist/adventures/pyrenees/index.html`
- `dist/projects/index.html`
- `dist/creatives/index.html`
- `dist/creatives/madagascar-street/index.html` (and 5 others)
- `dist/curation/index.html`

- [ ] **Step 2: Verify font is in dist**

```bash
ls dist/fonts/
```

Expected: `ThatThatNewPixelFamily-Square.woff2` present (Astro copies `public/` to `dist/`).

- [ ] **Step 3: Preview locally**

```bash
npm run preview
```

Open `http://localhost:4321` and check:
- Home: all 5 sections render, thumbnail strip shows 5 images
- Observations list: 2 entries, dates right-aligned
- Observation detail: `title — DD/MM/YYYY` header, prose body
- Adventures list: 3-column grid with cover images
- Adventure detail (pyrenees): two consecutive images appear side by side
- Projects: active (linked) + archived (unlinked with archived reason) sections
- Creatives: 4-column grayscale grid
- Creative detail: large image, location + camera + copyright
- Curation: type muted, title bold, date + note below
- Active page in nav is bold on each page
- "matteo dada" uses pixel font

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete site build with all pages and dummy content"
```
