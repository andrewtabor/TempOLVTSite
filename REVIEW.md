# Human review list

Everything a person needs to check before this site replaces olvt.org, ranked by how much it matters. Codes match the yellow notes shown in the review preview (`npm run build:review`). The public build hides those notes.

## Before launch

These block going live. Each one is either a risk to the team or something visitors will notice right away.

| # | What | Why it matters | Where to fix it |
|---|---|---|---|
| R1 | **Export-control sign-off on vehicle content**, Hokie 0.75 first | The old Hokie 0.75 page publishes propulsion internals (grain geometry, nozzle material, named avionics hardware) and links the Critical Design Review on Google Drive. Test Turkey links a flight report too. This prototype leaves all of that out. Get Virginia Tech's export-control office to confirm what each vehicle page can say. **The old pages are still live**, so consider pulling the CDR and report links now rather than waiting for the new site. | `src/content/vehicles/*.md` |
| R2 | **Sponsor list, tiers and logos** | The old Sponsors page's logos couldn't be recovered, so the new site lists no sponsors. Sponsors expect to see themselves. Get written OK to show each logo. The tier names (Platinum, Gold…) are placeholders. | `src/data/sponsors.yaml`, logos in `public/sponsors/` |
| R3 | **"All members are clearable" claim** | The old Sponsors page promised this. The team can't guarantee it for every member, and it's a statement sponsors may rely on. The prototype drops it. Leadership should approve what replaces it, if anything. | `src/data/sponsors.yaml` (perks) |
| R4 | **Where Hokie 0.75 stands now** | It's the headline program on the home page. The old page was last edited in January 2023 and still says "coming soon." Add the current phase and, if the team is comfortable, a target window. | `src/data/site.yaml` (`currentProgram.update`), `src/content/vehicles/hokie-0-75.md` |
| R5 | **Next application cycle** | The Join page opens and closes itself from the dates in `site.yaml`. Right now it shows fall 2026 as closed. Add the next cycle's dates and form link. | `src/data/site.yaml` (`applications`) |
| R6 | **Ownership and cutover** | Put the GitHub repo in a team GitHub organization, and the Cloudflare account and domain registrar login under a shared team email, with at least two admins each. Before shutting down WordPress, export the media library (full-resolution photos) and any form submissions. Keep the old host running until the new site and redirects are verified. | See "Deploying" in README.md |

## Accuracy

The prototype only uses facts from the old site, but several were stale or inconsistent there.

| # | What | Where |
|---|---|---|
| R7 | Founding story (ten students, spring 2016) and member count ("more than a hundred") on the home page | `src/pages/index.astro` |
| R8 | The Certifier's flight count: "69" hasn't changed since 2021 | `src/content/vehicles/the-certifier.md` |
| R9 | Test Turkey: the old page says 2 flights but describes one, and mixes the flown L1720 numbers with a planned N10000 relaunch. Did the relaunch happen? | `src/content/vehicles/test-turkey.md` |
| R10 | Skipper 2's launch site and flight dates (the old page had neither) | `src/content/vehicles/skipper-2.md` |
| R11 | All copy was tightened from the old site. Have each subteam lead read their subteam's description, and someone who flew each rocket read its page. | `src/data/subteams.yaml`, `src/content/vehicles/` |
| R12 | Join page FAQ: three answers built from old-site facts only. Add what recruits actually ask: time commitment, meeting times, whether experience is required, dues. | `src/pages/join.astro` |
| R13 | Team roster: confirm names, roles and spelling. Collect headshots with each person's consent. | `src/data/team.yaml`, photos in `public/team/` |
| R14 | Two news posts are drafts written from old-site facts. Confirm the dates and details, add photos, then set `draft: false`. Drafts never appear on the public site. | `src/content/news/` |

## Assets and polish

| # | What | Where |
|---|---|---|
| R15 | Photos: team at a launch (home), every vehicle, the AEDL assembly bay. The review preview shows a labeled placeholder for each shot needed; the public site simply omits missing photos. | `photo:` in each vehicle file, `public/` |
| R16 | Vector (SVG) version of the OLVT logo to replace the text wordmark and favicon | `src/layouts/Base.astro`, `public/favicon.svg` |
| R17 | Current list of where members have interned and worked. The old page used one flattened image from 2022. Logos need permission; plain text doesn't. | `src/pages/join.astro` |
| R18 | Team-owned Microsoft Forms for contact and sponsor interest (the old forms ran on WordPress and won't carry over). Buttons appear once the links are set. | `src/data/site.yaml` (`forms`) |
| R19 | Sponsorship packet PDF, if the team has one | `src/data/site.yaml` (`sponsorPacketUrl`) |
| R20 | Check Virginia Tech's brand and trademark rules for student organizations (use of the university name and colors) | Whole site |
| R21 | Link the team's L1 build guide from The Certifier page, and the L2 guide when it's ready | `src/content/vehicles/the-certifier.md` |
| R22 | The old site had a "Newsletter: coming soon" page. Decide whether News replaces it or the team wants an email signup. | `src/pages/news/` |

## What changed from the old site

- **Left out on purpose:** Hokie 0.75 propulsion details, the CDR and Test Turkey report links, the clearance claim, the empty "Test" page and the "coming soon" newsletter page.
- **New:** the altitude chart and flight record, a "Now building" block, News, a Join FAQ, a Contact page, automatic open/closed application status, and redirects from every old URL.
- **Removed with WordPress:** the public user sitemap that listed account usernames.
