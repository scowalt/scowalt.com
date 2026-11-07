---
name: verify
description: Launch scowalt.com (the Astro site that runs on Cloudflare Workers) locally through Portless, drive its pages in headless Chromium the way a visitor does, and capture screenshots plus a pass/fail report. Use to prove a change to pages, layouts, components, styles, MDX content, project entries, images, middleware, or Worker config before you call it done.
---

# Verify scowalt.com

The site is a personal landing page that runs as a Cloudflare Worker. Visitors only read pages and follow links. There are no forms, accounts, or stored data. The surface is the web UI, and every proof comes from a real browser that loads the real routes.

All commands run from the repository root. The helpers live in `.agents/skills/verify/scripts/`. `.claude/skills/verify` is a symlink to this directory.

| Step    | Command                                                     |
| ------- | ----------------------------------------------------------- |
| Launch  | `.agents/skills/verify/scripts/launch.sh [preview\|dev]`     |
| Doctor  | `.agents/skills/verify/scripts/doctor.sh`                   |
| Drive   | `node .agents/skills/verify/scripts/drive.mjs [journey...]` |
| Cleanup | `.agents/skills/verify/scripts/cleanup.sh`                  |

## Launch

```bash
.agents/skills/verify/scripts/launch.sh preview
```

`preview` is the default and the mode to use for proof. It runs `bun run build` and then `portless run --tailscale astro preview`. That command serves `dist/` in workerd with the production `wrangler.json`, which includes `run_worker_first` and the `404-page` fallback. `dev` runs `portless run --tailscale astro dev` and serves source changes with HMR, so use it to iterate. `dev` differs from production: Vite serves `public/` and the CSS and scripts, and pages send no CSP. Use `preview` for any claim about production behavior. `dev` works only while `run_worker_first` lists page routes and not `/*` (see [the Gotchas in the feature map](features/README.md#gotchas)).

The script does these steps:

1. Install dependencies if `node_modules` is missing.
2. Run `bunx playwright install --only-shell chromium`. This step does nothing when the browser is cached.
3. Start Portless in the tmux session `verify-scowalt-<hash of checkout path>`.
4. Wait until `GET /` returns `<title>Scott Walters</title>`. This takes about 30 s for `preview`, which includes the build.
5. Print the local URL and the tailnet URL, and write them to `tmp/verify/server.env`.

Portless assigns the port and a hostname for each worktree, for example `https://<branch>.scowalt-com.localhost`. Never pass a port, and never use `--force`. The server log is `tmp/verify/server.log`, and the build log is `tmp/verify/build.log`.

Ready means `GET /` returned the page HTML. Doctor also confirms that the assets load.

Isolation: one instance per checkout. A second `launch.sh` in the same checkout refuses to start. Different worktrees get different hostnames and tmux sessions, so they can run side by side. If Portless already routes this checkout's hostname to a process that you did not start (for example, the user's own `portless` dev server), launch fails. Report that to the user. Do not take over the route.

To pick up source changes in `preview` mode, run cleanup and then launch again. Preview serves a fixed build.

## Doctor

```bash
.agents/skills/verify/scripts/doctor.sh
```

This check is read-only. Run it before driving, and again whenever something looks wrong. It fails (exit 1) when any of these is true:

- `tmp/verify/server.env` is missing, or its tmux session is gone.
- Portless has no route for the URL, or the route's pid is not a descendant of our tmux session. In that case, someone else owns the route, so do not drive it or kill it.
- `GET /` is not the home page.
- The served mode does not match the launched mode. The check looks for `/@vite/client` in the HTML.
- `dev` mode does not serve `/@vite/client` and `/images/me.webp`.
- In `preview` mode, any file under `src/` or `public/`, `astro.config.mjs`, or `package.json` is newer than `dist/server/entry.mjs`. The build is stale, so launch again.

A tailnet URL that does not return 200 is only a warning, because the local URL still works. A 403 means `server.allowedHosts` in `astro.config.mjs` no longer allows the hostname in `PORTLESS_TAILSCALE_URL` (see [the Gotchas](features/README.md#gotchas)).

## Drive

```bash
node .agents/skills/verify/scripts/drive.mjs --list
node .agents/skills/verify/scripts/drive.mjs                                # every journey, 1280x900
node .agents/skills/verify/scripts/drive.mjs projects project-detail        # selected journeys
node .agents/skills/verify/scripts/drive.mjs --viewport mobile home         # 390x844
node .agents/skills/verify/scripts/drive.mjs --url https://<other-base> home
```

The driver uses Playwright (`playwright`, a devDependency) with headless Chromium. Each journey gets a fresh browser context. The driver opens pages and clicks links by ARIA role and accessible name, the way a visitor would. It never clicks external links. For those links it checks `href`, `target="_blank"`, and `rel="noopener"`, so the run stays on the local site.

The expected data comes from the source, not from constants in the driver:

- Home links come from the `links` array in `src/pages/index.astro`.
- Projects come from the frontmatter of `src/content/projects/*.mdx` (`title`, `order`, `url`, `repo`).

A content edit therefore changes what the driver expects. If the driver can't parse that source, the run fails.

Every journey also fails on any browser console error, uncaught page error, or 4xx/5xx response. The only exceptions are the deliberate 404 navigations in `not-found` and `project-detail`.

Journeys, one for each [feature map](features/README.md) entry: `home`, `projects`, `project-detail`, `working-with-me`, and `not-found`. Before you report a change as verified, drive every journey whose feature file lists a path that the change touches. A change to `Layout.astro`, `global.css`, `astro.config.mjs`, `wrangler.toml`, or `src/middleware.ts` affects every page, so run all journeys at both viewports.

Exit code `0` means every check passed. The output prints `PASS` or `FAIL` for each journey and lists each failed check with its detail.

## Evidence

Each run writes to `tmp/verify/runs/<UTC timestamp>-<viewport>/`. `tmp/` is gitignored, and cleanup never deletes this directory. A run contains:

- `<journey>-NN-<step>.png`: full-page screenshots of the state after each user action. A journey that throws also saves `<journey>-NN-error.png`.
- `report.json`: the base URL, the viewport, and for each journey every check (`label`, `ok`, `detail`), screenshot paths, console errors, page errors, and failed responses.

Proof standards:

- Drive the real route through the served Worker, and use `preview` for any claim about production behavior. Do not substitute `curl` or a test-only page.
- The driver's checks do not judge layout, so open the screenshots of the pages you changed and inspect them. A visual change counts as verified only after you have looked at it at both viewports.
- Cite the run directory and the journeys you drove. If a journey fails for a reason you did not cause, report it and its check output. Do not edit the driver to make it pass.
- `wrangler deploy --dry-run` and the production build prove packaging, not behavior. The deployed site is `https://scowalt.com`. Fetch it read-only if you need to compare, and never deploy from here.

## Cleanup

```bash
.agents/skills/verify/scripts/cleanup.sh
```

Cleanup kills only our tmux session, by name, which stops Portless, Astro, and workerd. It then waits until Portless drops the route and deletes `tmp/verify/server.env`. It keeps `tmp/verify/runs/`, `server.log`, and `build.log`. `dist/` is ordinary build output and is left in place. Never kill by process name (`pkill astro`, `pkill workerd`), because other projects on this machine run the same binaries. Run cleanup after every session, including failed launches and failed iterations.

## Feature map

[features/README.md](features/README.md) is the maintained index of user-facing features, with one recipe file for each feature. When a change adds a page, a route, or a type of link, add or update its feature file and journey in the same change.
