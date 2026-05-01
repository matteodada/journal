# How to update site data (curation, projects, location)

---

## Add a curation entry

Open `data/curation.json` and add a new object at the **top** of the array (most recent first):

```json
{
  "type": "music",
  "title": "Mumbo Sugar from Arc De Soleil",
  "date": "2025-05-01",
  "date_label": "May 2025",
  "note": "Hard to put into words but it just hits different."
}
```

**Fields:**
- `type` — free-form label shown in muted text: `music`, `movie`, `series`, `book`, `quote`, `artist`, `youtube channel`, etc.
- `title` — the name of the thing
- `date` — ISO date `YYYY-MM-DD`, used for sorting (1st of the month is fine)
- `date_label` — human-readable date shown on the page
- `note` — one or two sentences about why it's worth noting; for quotes, use this for the attribution

The entry appears automatically on `/curation`, sorted by date descending.

---

## Add or archive a project

Open `data/projects.json`.

### Active project

Add a new object anywhere in the array (display order follows date, not array order):

```json
{
  "name": "Peak Partner",
  "date": "2025-01-01",
  "date_label": "January 2025",
  "url": "https://apps.apple.com/...",
  "description": "An app to help pro athletes understand the impact of their daily lives on performance.",
  "status": "active"
}
```

**Fields:**
- `name` — project name, shown as an external link
- `url` — the public URL; required for active projects
- `description` — one sentence
- `date` / `date_label` — launch or start date
- `status` — `"active"`

### Archived project

Same structure, but set `status` to `"archived"`, set `url` to `null`, and add an `archived_reason`:

```json
{
  "name": "Watudu",
  "date": "2025-01-01",
  "date_label": "January 2025",
  "url": null,
  "description": "An app to help people find activities by category.",
  "archived_reason": "The content was bad.",
  "status": "archived"
}
```

To archive an existing active project: change `status` to `"archived"`, set `url` to `null`, and add the `archived_reason` field.

Projects appear on `/projects` split into two sections — active (linked) and archived (plain text). They also appear on the home page if active.

---

## Update location

Open `data/locations.json`. When you move somewhere new, **add a new entry** to the array — don't edit the existing one. The array is sorted by `start_date` at build time, so order in the file doesn't matter.

### Moving to a new place

Set `end_date` on the current entry, then add a new object with the new location:

```json
[
  {
    "location": "Paris",
    "start_date": "2026-03-01",
    "end_date": null
  },
  {
    "location": "Toulouse",
    "start_date": "2025-01-01",
    "end_date": "2026-02-28"
  }
]
```

**Fields:**
- `location` — city or place name, shown as-is on the home page
- `start_date` — ISO date `YYYY-MM-DD` when you arrived
- `end_date` — ISO date `YYYY-MM-DD` when you left, or `null` if you're still there

The entry with the most recent `start_date` is shown on the home page under "where i'm at".
