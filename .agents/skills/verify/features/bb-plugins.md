# bb Plugins

`/bb` lists the bb plugins Scott built or patched, in two groups: `Built by me` and `Forks I run`. Each card opens the plugin's GitHub repository in a new tab, and a fork shows a `Fork of <upstream>` credit link. The page is hidden: nothing on the site links to it, and it sends `<meta name="robots" content="noindex">`. A `← Home` link returns to the landing page.

## Sub-features

- `bb-render`: the page returns 200 with the title `bb Plugins - Scott Walters` and a `noindex` robots meta tag.
- `bb-order`: the h3 plugin names appear grouped (`built`, then `fork`) and sorted by the `order` field in `src/content/bb-plugins.json`.
- `bb-links`: each card's `href` is the plugin's `repo`, with `target="_blank"` and `rel="noopener noreferrer"`.
- `bb-art`: each card shows `public/images/bb-plugins/<id>.svg` as a decorative image (`alt=""`).
- `bb-fork-credit`: each plugin with `forkOf` shows a link named `forkOf.name` that points to `forkOf.url`.
- `bb-hidden`: the landing page has no link to `/bb`.
- `bb-home`: `← Home` returns to `/`.

## How to get to it (user POV)

- Open `https://scowalt.com/bb` directly. No page on the site links to it.

## Driving it with drive.mjs

Preconditions:

- The site is launched in `preview` mode, and doctor passes.

- **Open the page.** Visit `/bb`. The response is 200, the title matches, and the robots meta is `noindex`.
- **Check the list.** The h3 texts equal the `name` fields from `src/content/bb-plugins.json`, grouped `built` then `fork`, each sorted by `order`.
- **Check links.** Each `a.plugin` card has the plugin's `repo` as its `href` and opens in a new tab. Each card's image loads. Each fork credit links to `forkOf.url`.
- **Check it stays hidden.** Visit `/`. No `a[href="/bb"]` exists.
- **Go home.** Revisit `/bb`, screenshot `bb-plugins-01-bb-plugins.png`, choose `← Home`. The h1 is `Scott Walters`.
- **Run it.** `node .agents/skills/verify/scripts/drive.mjs bb-plugins`.

## Gotchas

- The list lives in `src/content/bb-plugins.json`, loaded by the `bbPlugins` collection in `src/content.config.ts`. A JSON entry that fails the schema (for example, a `repo` that is not a URL) fails the build, not the journey.
- A new plugin needs an SVG named after its `id` in `public/images/bb-plugins/`; without one, its card shows a broken image and the journey fails on the 404.
- `getCollection` returns entries sorted by `id`, not in file order. The page sorts by `order`; a missing or duplicate `order` changes what visitors see.
- When the page goes public, add a link from the landing page, drop `noindex` in `src/pages/bb.astro`, and remove the `bb-hidden` check.
