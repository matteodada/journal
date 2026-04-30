# How to add a new thought article to the site

## 1. Create the markdown file

Create a new `.md` file in `content/thoughts/`. The filename becomes the URL slug — keep it lowercase with hyphens, no spaces.

Example: `content/thoughts/why-maps-lie.md`

## 2. Write the frontmatter

Every thought requires exactly three frontmatter fields:

```yaml
---
title: "Why maps lie"
date: "2026-05-01"
date_label: "1 May 2026"
---
```

**Fields:**
- `title` — displayed as the page heading and in the list
- `date` — ISO date `YYYY-MM-DD`, used for sorting (most recent appears first)
- `date_label` — human-readable date shown on the page, next to the title

## 3. Write the body

Add your text below the frontmatter. Plain markdown — paragraphs, headings, lists, inline links. No images.

```markdown
---
title: "Why maps lie"
date: "2026-05-01"
date_label: "1 May 2026"
---

Your text starts here. Each paragraph is separated by a blank line.

A second paragraph.
```

## 4. Done

The thought appears automatically on:
- `/thoughts` — the list, sorted by date descending
- `/thoughts/why-maps-lie` — the detail page
- `/` — the home page "last thought" section if it's the most recent
