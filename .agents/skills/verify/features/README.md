# scowalt.com verification map

This directory is the maintained source for verifying what a visitor to scowalt.com can see and do. Read this index before you drive the site, then use the matching feature file as the recipe. Every feature has a journey of the same name in `../scripts/drive.mjs`.

## Baseline preconditions

- Start the site with `.agents/skills/verify/scripts/launch.sh preview` from the repository root.
- `.agents/skills/verify/scripts/doctor.sh` exits `0`. Every check must print `ok`. A tailnet warning does not block local driving, but report it.
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
- Run all journeys at both viewports when the change touches every page: `Layout.astro`, `global.css`, `astro.config.mjs`, `wrangler.toml`, `public/_headers`, or dependencies.
- If a journey cannot run, report the command, the failing check, and its detail. Do not report it as verified through a different journey.

## Gotchas

- **Every route is a file in `dist/`.** `output: 'static'` prerenders each page, and `build.format: 'file'` writes `/projects` as `dist/projects.html` rather than `dist/projects/index.html`. Cloudflare's default `auto-trailing-slash` handling then serves `/projects` with 200 and redirects `/projects/` to `/projects` with 307. With the `directory` format, the slash-less URLs that every link uses would redirect instead. A path with no file gets `dist/404.html` with status 404. `/404` itself returns 200, because it is a real file; nothing links to it.
- **No request runs Worker code.** `wrangler.toml` has no `main` and no `run_worker_first`. A page that needs request data (cookies, headers, or a redirect decided per request) cannot be added without a Worker script, and that change brings back billed Worker invocations.
- **The tailnet URL depends on `server.allowedHosts`.** Vite rejects any Host header that is not allowed, with 403 `Blocked request`. `astro.config.mjs` allows only the hostname in `PORTLESS_TAILSCALE_URL`, which Portless sets when it runs with `--tailscale` or `PORTLESS_TAILSCALE=1`. Other `*.ts.net` hosts still get 403. Do not widen the list to `true` or a `.ts.net` suffix.
- **The CSP blocks inline styles and scripts that Astro did not hash.** `security.csp` in `astro.config.mjs` makes Astro write a `<meta http-equiv="content-security-policy">` tag into the `<head>` of every prerendered page. No `Content-Security-Policy` response header is sent. A meta policy cannot carry `frame-ancestors`, `report-uri`, or `sandbox`, so do not add those directives. Its `script-src` and `style-src` allow `'self'` plus the SHA-256 hashes of the inline `<script>` and `<style>` elements Astro emits. A `style="..."` attribute, an `is:inline` script or style, or a Shiki code block (Shiki uses inline styles; the build warns about it) is blocked, and Chromium logs a console error that fails the journey. `astro dev` sends no CSP, so check CSP behavior only in `preview`. To inspect the policy, run `grep -o '<meta http-equiv="content-security-policy"[^>]*>' dist/index.html`.
- **Astro takes its port from `PORT`, not from Portless flags.** `PORTLESS_TAILSCALE=1 portless` runs `bun run dev`, and Portless adds `--port` and `--host` only when the command is `astro` itself. `astro.config.mjs` reads the `PORT` and `HOST` that Portless always sets. If you remove that, Astro falls back to 4321 behind `bun run`, and the route returns 502.
- **`/projects/<unknown>` is an ordinary missing file.** `getStaticPaths()` in `src/pages/projects/[slug].astro` builds one page for each project, so an unknown slug gets the 404 page with status 404 at its original URL. There is no redirect to `/404`.

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
