# How to add a new adventure article to the site

## 1. Upload images to Cloudinary

All adventure images go into the **adventures** folder in Cloudinary (or a subfolder per trip, e.g. `adventures/japan/`).

1. Go to [cloudinary.com](https://cloudinary.com) → Media Library
2. Navigate to the **adventures** folder (create a subfolder for the trip if needed)
3. Click **Upload** and select your JPEGs
4. Before confirming each, set the **Public ID** explicitly (e.g. `adventures/japan/cover`) — Cloudinary does not use the filename automatically

### URL params by use

| Use | Params |
|-----|--------|
| Cover image (grid + home) | `w_800,f_auto,q_auto` |
| Body image (article) | `w_800,f_auto,q_auto` |

Example URL:
```
https://res.cloudinary.com/dpyebib7h/image/upload/w_800,f_auto,q_auto/adventures/japan/cover.jpg
```

## 2. Create the markdown file

Create a new `.md` file in `content/adventures/`. The filename becomes the URL slug.

Example: `content/adventures/japan.md`

## 3. Write the frontmatter

```yaml
---
title: "Japan"
date: "2025-09-01"
date_label: "September 2025"
cover: "https://res.cloudinary.com/dpyebib7h/image/upload/w_800,f_auto,q_auto/adventures/japan/cover.jpg"
---
```

**Fields:**
- `title` — displayed as the page heading and on the grid card
- `date` — ISO date `YYYY-MM-DD`, used for sorting (set to the 1st of the month is fine)
- `date_label` — human-readable date shown below the grid card and on the detail page
- `cover` — Cloudinary URL for the cover image, shown in the grid and on the home page

## 4. Write the body

Add prose and images below the frontmatter. Images go inline in the markdown. Group multiple images in the same paragraph (no blank line between them) to trigger the CSS side-by-side layouts:

```markdown
<!-- 1 image — centered, max-height 30vh -->
![](https://res.cloudinary.com/dpyebib7h/image/upload/w_800,f_auto,q_auto/adventures/japan/temple.jpg)

<!-- 2 images side by side -->
![](https://res.cloudinary.com/dpyebib7h/image/upload/w_800,f_auto,q_auto/adventures/japan/market.jpg)
![](https://res.cloudinary.com/dpyebib7h/image/upload/w_800,f_auto,q_auto/adventures/japan/street.jpg)

<!-- 3 images side by side -->
![](https://res.cloudinary.com/dpyebib7h/image/upload/w_800,f_auto,q_auto/adventures/japan/a.jpg)
![](https://res.cloudinary.com/dpyebib7h/image/upload/w_800,f_auto,q_auto/adventures/japan/b.jpg)
![](https://res.cloudinary.com/dpyebib7h/image/upload/w_800,f_auto,q_auto/adventures/japan/c.jpg)
```

Alt text is intentionally left empty — these are decorative photos.

## 5. Done

The adventure appears automatically on:
- `/adventures` — the 3-column grid, sorted by date descending
- `/adventures/japan` — the detail page
- `/` — the home page "last adventure" section if it's the most recent
