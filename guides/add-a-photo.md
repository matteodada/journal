# How to add a new photo to the site

## 1. Prepare the photo

Export or locate the photo on your Mac as a **JPEG**. Full resolution is fine — Cloudinary handles resizing.

## 2. Upload to Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) → Media Library
2. Navigate to the **creatives** folder
3. Click **Upload** and select your JPEG
4. Before confirming, set the **Public ID** to match your intended filename (e.g. `kyoto-temple`) — Cloudinary does not update it automatically from the filename
5. Once uploaded, the public ID is the last segment of the URL path

## 3. Build the Cloudinary URL

Use this pattern:

```
https://res.cloudinary.com/dpyebib7h/image/upload/w_1200,f_auto,q_auto/creatives/kyoto-temple.jpg
```

- `dpyebib7h` — your Cloudinary cloud name
- `w_1200,f_auto,q_auto` — resize to 1200px wide, auto format (WebP/AVIF), auto quality
- `creatives/kyoto-temple.jpg` — folder + filename

## 4. Add the entry to photos.json

Open `data/photos.json` and add a new object at the top of the array (most recent first):

```json
{
  "slug": "kyoto-temple",
  "image": "https://res.cloudinary.com/dpyebib7h/image/upload/w_1200,f_auto,q_auto/creatives/kyoto-temple.jpg",
  "location": "Kyoto, Japan, September 2025",
  "date": "2025-09-01",
  "date_label": "September 2025",
  "camera": "Leica Q2"
}
```

**Fields:**
- `slug` — URL-safe identifier, used as the detail page URL (`/creatives/kyoto-temple`)
- `image` — full Cloudinary URL with transform params
- `location` — city, country, month + year
- `date` — ISO date `YYYY-MM-DD`, used for sorting (set to the 1st of the month is fine)
- `date_label` — human-readable date shown on the page
- `camera` — camera model

## 5. Done

The photo appears automatically on:
- `/creatives` — the grid
- `/creatives/kyoto-temple` — the detail page
- `/` — the home strip if it's in the 5 most recent

---

## Variant: adding photos to an adventure article

Adventure images go into the **adventures** folder in Cloudinary and are referenced directly in the markdown file, not in a JSON file.

### Upload

Same as above but navigate to the **adventures** folder (or a subfolder per trip, e.g. `adventures/japan/`).

### URL params by use

| Use | Params | Example |
|-----|--------|---------|
| Cover image (grid + home) | `w_800,f_auto,q_auto` | `adventures/japan/cover.jpg` |
| Body image (article) | `w_800,f_auto,q_auto` | `adventures/japan/temple.jpg` |

### Cover image

Set in the frontmatter of the adventure markdown file (`content/adventures/japan.md`):

```yaml
---
title: "Japan"
date: "2025-09-01"
date_label: "September 2025"
cover: "https://res.cloudinary.com/dpyebib7h/image/upload/w_800,f_auto,q_auto/adventures/japan/cover.jpg"
---
```

### Body images

Add images inline in the markdown. Group them in the same paragraph (no blank line between) to trigger the CSS side-by-side layouts:

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
