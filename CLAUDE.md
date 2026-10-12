# Notes for AI assistants working on this repo

This is the Orbital Launch Vehicle Team's website: Astro, static output, deployed to Cloudflare. Maintainers are students who change every year, so keep things simple enough for a non-developer to update.

## Rules

- **Content lives in data files, not page code.** Team, subteams, sponsors and site settings are in `src/data/*.yaml`; vehicles and news are Markdown in `src/content/`. If you find yourself hardcoding a name, date or number in a page, move it to a data file instead.
- **Never invent facts.** No made-up dates, flight counts, sponsors, quotes or achievements. If something is needed and unknown, add a `<Review id="…">` note (or a `review:` entry in Markdown front matter) and a matching line in `REVIEW.md`.
- **Export control.** Don't add propulsion internals (grain geometry, nozzle materials or dimensions, motor design data), guidance/control details, or links to design reviews or test reports without confirmation that the team's export-control review approved them.
- **No new dependencies** unless they do substantial work. No client-side frameworks; small inline scripts only.
- **Style through tokens** in `src/styles/global.css`. Every color must have light and dark values. Use `font-stretch` together with `font-variation-settings: "wdth" …` for width changes.
- **Copy:** plain, active, specific. No marketing filler.

## Before finishing a change

```sh
npm run build          # must succeed with no errors
npm run build:review   # check review notes still render where expected
```

Check new pages at phone width (about 390px): no horizontal scrolling, nothing clipped.
