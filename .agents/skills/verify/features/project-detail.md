# Project detail

Each project has a page at `/projects/<slug>`, where the slug is the MDX file name. The page shows the screenshot, the title, the tech stack joined with `·`, an optional `Source Code →` link, and the MDX write-up. When the project has a `url`, the title links to the live project in a new tab. A slug with no project redirects to the 404 page.

## Sub-features

- `detail-render`: each slug returns 200, and its h1 equals the frontmatter `title`.
- `detail-screenshot`: `Screenshot of <title>` loads.
- `detail-title-link`: when `url` is set, the title link points to `url` with `target="_blank"`.
- `detail-repo-link`: when `repo` is set, `Source Code →` points to `repo`.
- `detail-body`: the MDX body renders at least one `h2` inside `.prose`.
- `detail-unknown`: `/projects/<unknown>` ends on `/404` with status 404.

## How to get to it (user POV)

- Choose a card on `/projects`.
- Open `https://scowalt.com/projects/<slug>` directly, for example from a shared link.

## Driving it with drive.mjs

Preconditions:

- The site is launched in `preview` mode, and doctor passes.

- **Visit every project.** For each MDX file, sorted by `order`, visit `/projects/<slug>`. The response is 200, the h1 equals the title, the screenshot loads, the title and repo links match the frontmatter, and `.prose h2` exists. Screenshot `project-detail-NN-project-<slug>.png` for each.
- **Visit an unknown slug.** Visit `/projects/does-not-exist`. The final URL path is `/404`, and the final status is 404. The driver expects this 404 and does not report it as a failure.
- **Run it.** `node .agents/skills/verify/scripts/drive.mjs project-detail`.

## Gotchas

- `url` and `repo` are read with a one-line regex. A value that wraps to a second line is not compared.
- The title link's accessible name is the title, which a heading also contains. The driver uses `exact: true` so that it does not also match a card or the image alt text.
- No project sets `repo` today, so `detail-repo-link` is not exercised until one does.
- The unknown-slug redirect happens in `src/pages/projects/[slug].astro`, not through Worker asset handling. A change to that file needs this journey.
