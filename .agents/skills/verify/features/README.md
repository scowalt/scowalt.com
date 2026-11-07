# scowalt.com verification map

This directory is the maintained source for verifying what a visitor to scowalt.com can see and do. Read this index before you drive the site, then use the matching feature file as the recipe. Every feature has a journey of the same name in `../scripts/drive.mjs`.

## Baseline preconditions

- Start the site with `.agents/skills/verify/scripts/launch.sh preview` from the repository root.
- `.agents/skills/verify/scripts/doctor.sh` exits `0`. Every check must print `ok`, except the tailnet warning.
- The driver reads the base URL from `tmp/verify/server.env`. Pass `--url` only for an instance that you started yourself.
- No seed data is needed. The site has no database, sessions, or forms. Its content is `src/pages/`, `src/content/projects/*.mdx`, and `public/images/`.
- Never drive an instance that this skill did not launch. Doctor checks that the Portless route belongs to our tmux session.

## Driving conventions

- Every journey starts from a fresh browser context, so it has no history or cache from earlier journeys.
- Locate elements by role and accessible name, using `getByRole('link', { name })` and `getByRole('heading', { level: 1 })`. Use a CSS selector only where the markup has no role, such as `a.header-anchor` or `a[data-footnote-ref]`.
- Navigate the way a visitor does: click the link and wait for the URL. `ClientRouter` performs same-origin navigation on the client, so a click does not always cause a full page load.
- Never click an external link (LinkedIn, GitHub, YouTube, Twitter, `mailto:`, project sites). Check its `href`, `target`, and `rel` instead.
- Take expected values from the source files that each feature names. Do not hard-code copy that an editor may change.

## Proof and skip reporting

- Each step of a journey that changes the visible state saves a full-page screenshot to `tmp/verify/runs/<run>/`. Open the screenshots of every page you changed.
- `report.json` in the run directory is the record. Cite its path and the journeys you ran.
- A journey fails on any console error, page error, or unexpected 4xx/5xx response, even if all of its own checks pass.
- Run all journeys at both viewports when the change touches every page: `Layout.astro`, `global.css`, `astro.config.mjs`, `wrangler.toml`, `src/middleware.ts`, or dependencies.
- If a journey cannot run, report the command, the failing check, and its detail. Do not report it as verified through a different journey.

## Gotchas

- **`dev` mode is broken for proof.** `wrangler.toml` sets `run_worker_first = true`. Under `astro dev`, the Cloudflare Vite plugin sends every request to the Worker first, and the Worker returns 404 for `/@vite/client`, `/src/**/*.css`, and `/images/*`. Pages render without CSS, scripts, or images. Doctor and every journey fail in `dev` for this reason. Use `preview`.
- **The tailnet URL returns 403.** Vite's `allowedHosts` rejects the `*.ts.net` Host header in both `dev` and `preview`. The local `*.localhost` URL works.
- **Production sends no Content-Security-Policy.** `astro.config.mjs` sets `security.contentSecurityPolicy`, which Astro 7 ignores, because the supported key is `security.csp`. Neither `preview` nor `https://scowalt.com` sends a CSP header or meta tag. If a change adds a CSP, CSP violations show up as console errors, which fail the journey.
- **`PORTLESS_TAILSCALE=1 portless` does not route correctly.** It runs `bun run dev`, which runs `bun x astro dev`. Portless does not detect Astro behind `bun x`, so it does not add `--port`. Astro then listens on 4321 and the route returns 502. `launch.sh` runs `astro` directly, so Portless adds `--port` and `--host`.
- **`/projects/<unknown>` redirects.** The response is a 302 to `/404`, which then returns 404. Expect the final URL `/404`, not a 404 status at the original URL.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph that describes the behavior a visitor sees. It then has exactly four H2 sections, in this order:

1. `Sub-features` lists a short ID and a one-line description for each behavior.
2. `How to get to it (user POV)` lists every way a visitor reaches the feature.
3. `Driving it with drive.mjs` starts with `Preconditions:`, then has labeled bullets. Each bullet pairs a visitor action with the journey step that performs it and the observable result.
4. `Gotchas` lists traps that can waste a verification run or make its result invalid.

## Features

- [Landing page](./home.md): the portrait, name, and link lines on `/`, and navigation to the internal pages.
- [Projects index](./projects.md): the project cards in frontmatter order, card images, and the card-to-detail round trip.
- [Project detail](./project-detail.md): every `/projects/<slug>` page with its screenshot, title link, tech stack, MDX body, and unknown-slug handling.
- [Working with Me](./working-with-me.md): the MDX essay with heading section links, footnotes, and the way back home.
- [Not found](./not-found.md): the custom 404 page and its link back home.
