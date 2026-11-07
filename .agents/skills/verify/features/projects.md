# Projects index

`/projects` lists each project as a card with its screenshot, title, and description. Cards are sorted by the `order` field in each project's frontmatter. Choosing a card opens that project's detail page.

## Sub-features

- `projects-render`: the page loads with the h1 `Projects` and the `← Home` link.
- `projects-order`: the card titles appear in ascending `order` from `src/content/projects/*.mdx`.
- `projects-images`: each card's `Screenshot of <title>` image loads from `public/images/projects/`.
- `projects-open`: choosing a card opens `/projects/<slug>`, and `← Back to Projects` returns to the index.

## How to get to it (user POV)

- Choose `Projects` on the landing page.
- Choose `← Back to Projects` on any project detail page.
- Open `https://scowalt.com/projects` directly.

## Driving it with drive.mjs

Preconditions:

- The site is launched in `preview` mode, and doctor passes.
- Each project MDX file has `title` and `order` in its frontmatter, and its `screenshot` file exists under `public/images/projects/`.

- **Open the index.** Visit `/projects`. The response is 200.
- **Check order.** Read the `h2` of each `main a[href^="/projects/"]` card. The list equals the frontmatter titles sorted by `order`.
- **Check images.** Each image named `Screenshot of <title>` has `naturalWidth > 0`. Screenshot `projects-01-projects.png`.
- **Open a card.** Choose the card of the first project. The URL ends in `/projects/<slug>`, and the h1 equals its title. Screenshot `projects-02-card-to-<slug>.png`.
- **Go back.** Choose `← Back to Projects`. The URL ends in `/projects`, and the card count equals the number of projects.
- **Run it.** `node .agents/skills/verify/scripts/drive.mjs projects`, plus `--viewport mobile projects`. Below the `md` breakpoint the cards stack vertically.

## Gotchas

- Adding a project means adding an MDX file and its image. The driver finds new files on its own, so a missing image fails `card image ... loaded` and appears as a 404 in `failedResponses`.
- Two projects with the same `order` have no defined relative order. The driver's sort then decides the expected order, so the order check can fail without a real bug. Give each project a unique `order`.
- The `title` regex reads the first `title:` line in the file. Keep `title` on one line in the frontmatter.
