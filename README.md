# olvt.org

The website for the Orbital Launch Vehicle Team at Virginia Tech. It's a static site built with [Astro](https://astro.build) and hosted free on Cloudflare.

Most updates don't need any code: edit a YAML or Markdown file, commit, and the site rebuilds.

**Before launch, work through [REVIEW.md](REVIEW.md).**

## Updating content

| To change… | Edit |
|---|---|
| Officers and subteam leads | `src/data/team.yaml` (photos go in `public/team/`) |
| Subteam descriptions (Team and Join pages) | `src/data/subteams.yaml` |
| Sponsors and perks | `src/data/sponsors.yaml` (logos go in `public/sponsors/`) |
| Application dates and form link | `src/data/site.yaml` → `applications` |
| "Now building" on the home page | `src/data/site.yaml` → `currentProgram` |
| Email, social links, form links | `src/data/site.yaml` |
| A rocket's page, specs or chart point | `src/content/vehicles/<name>.md` |
| Add a rocket | Copy any file in `src/content/vehicles/`, rename it, edit it. It appears on the chart, the flight record and its own page automatically. |
| Add a news post | Add a Markdown file to `src/content/news/`. Set `draft: false` to publish. |

Application status on the Join page switches between upcoming, open and closed on its own, based on the dates in `site.yaml`.

## Working on the site

Requires Node.js 22 or newer.

```sh
npm install
npm run dev            # local site at http://localhost:4321
npm run build          # public build in dist/
npm run build:review   # build with review notes and photo placeholders shown
```

`npm run build:artifact` makes a self-contained copy of the review build in `preview/` (relative links, embedded font) for sharing as a single bundle. It isn't needed for deployment.

## Deploying

The site is plain static files, so it runs on Cloudflare's free tier.

1. Put this repository in a team GitHub organization (not a personal account).
2. In the Cloudflare dashboard, create a Worker from this repository. Build command: `npm run build`. The included `wrangler.jsonc` serves `dist/` as static assets.
3. Add the domain: move olvt.org's DNS to Cloudflare (free), then attach the domain to the Worker.
4. Test the old URLs. `public/_redirects` sends every old WordPress address (like `/membership/`) to its new page. Check a few after the switch.
5. Keep the WordPress host running for a couple of weeks, then cancel it.

Every pull request gets its own preview URL, so changes can be reviewed before they go live.

## Project layout

```
src/
  data/            site-wide YAML: site, team, subteams, sponsors
  content/         Markdown: vehicles/, news/
  components/      AltitudeChart, FlightRecord, Person, Photo, Review
  layouts/Base.astro   header, nav, footer
  pages/           one file per page
  styles/global.css    design tokens (colors, type) and shared styles
public/            fonts, favicon, _redirects, and any photos
```

## Design

- Colors: Hokie Stone greys, Chicago Maroon for links and buttons, burnt orange reserved for what's next (Hokie 0.75). Light and dark themes follow the visitor's system setting.
- Type: Archivo, self-hosted (SIL Open Font License, `public/fonts/OFL.txt`). The extended width is used for headings and vehicle names, like lettering on an airframe.
- The home page chart plots every rocket's highest altitude on a log scale against the Kármán line. It reads directly from the vehicle files.
