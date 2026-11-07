# Working with Me

`/working-with-me` is an MDX essay rendered with `MDXLayout`. Each heading has a section link icon whose `href` is `#<heading id>`, and footnote references jump to the footnotes at the bottom. A `← Home` link returns to the landing page.

## Sub-features

- `wwm-render`: the page returns 200 with the title `Working with Me - Scott Walters`.
- `wwm-heading-links`: every heading inside `.prose` has an `a.header-anchor`, and choosing one updates the URL hash.
- `wwm-footnotes`: `a[data-footnote-ref]` links exist, and their targets exist on the page.
- `wwm-home`: `← Home` returns to `/`.

## How to get to it (user POV)

- Choose `Working With Me` on the landing page.
- Open `https://scowalt.com/working-with-me`, or a section link such as `#what-i-do-well`, directly.

## Driving it with drive.mjs

Preconditions:

- The site is launched in `preview` mode, and doctor passes.

- **Open the page.** Visit `/working-with-me`. The response is 200, and the title matches.
- **Check section links.** The count of `.prose a.header-anchor` equals the count of `.prose` headings. Choose the second anchor. The URL hash equals that anchor's `href`.
- **Check footnotes.** At least one `a[data-footnote-ref]` exists, and the element its `href` points to exists. Screenshot `working-with-me-01-working-with-me.png`.
- **Go home.** Choose `← Home`. The URL path is `/`, and the h1 is `Scott Walters`.
- **Run it.** `node .agents/skills/verify/scripts/drive.mjs working-with-me`.

## Gotchas

- Section links come from `headingAutolinksPlugin` in `astro.config.mjs`. A change to the markdown processor or its plugins affects this page and the bodies of every project.
- The page's MDX comment `{/* ... */}` is source-only. If its text appears in the screenshot, the MDX comment was rendered as text.
- `cspell` and `remark` lint `.mdx` files in the pre-commit hook. They catch prose problems, but they do not check how the page renders.
