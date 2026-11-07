# Not found

A request for a path with no page returns status 404 and renders a custom page. The page shows a large `404`, a short apology, and a `Back to the homepage` button.

## Sub-features

- `404-status`: an unknown path returns HTTP 404, not 200 or 500.
- `404-render`: the h1 reads `404`, and the page uses the site layout.
- `404-home`: `Back to the homepage` returns to `/`.

## How to get to it (user POV)

- Follow a broken or mistyped link, such as `https://scowalt.com/definitely-not-a-page`.
- Open an unknown project slug, which redirects here (see [project detail](./project-detail.md)).

## Driving it with drive.mjs

Preconditions:

- The site is launched in `preview` mode, and doctor passes. `preview` serves the 404 through the same Worker as production. `dev` does not.

- **Open a missing path.** Visit `/definitely-not-a-page`. The status is 404, and the h1 reads `404`. Screenshot `not-found-01-not-found.png`.
- **Go home.** Choose `Back to the homepage`. The URL path is `/`, and the h1 is `Scott Walters`.
- **Run it.** `node .agents/skills/verify/scripts/drive.mjs not-found`.

## Gotchas

- Chromium logs `Failed to load resource: 404` for the missing document. The driver ignores console errors and responses only for the 404 URLs that it requested on purpose. Any other 404 on this page still fails the journey.
- `src/pages/404.astro` sets the status to 404. The Worker setting `not_found_handling = "404-page"` in `wrangler.toml` also affects this behavior. Run this journey after a change to either file.
