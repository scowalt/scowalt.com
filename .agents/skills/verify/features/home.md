# Landing page

The landing page at `/` is a business card. It shows Scott's portrait, his name, a one-line title, and a column of sentences. Each sentence contains one link: LinkedIn, Working With Me, Projects, GitHub, YouTube, Twitter, and Email. Two of the links go to pages on this site, and the rest go to other sites.

## Sub-features

- `home-render`: the portrait image, the `Scott Walters` h1, and the tagline render with the title `Scott Walters`.
- `home-links`: each entry in the `links` array of `src/pages/index.astro` renders once as a link with the same `href`.
- `home-external`: links that start with `http` open in a new tab with `rel="noopener noreferrer"`.
- `home-icons`: each link that has an `iconName` renders exactly one inline SVG icon.
- `home-internal-nav`: `Working With Me` opens `/working-with-me` and `Projects` opens `/projects`.

## How to get to it (user POV)

- Open `https://scowalt.com/`.
- Choose `← Home` on `/projects` or `/working-with-me`.
- Choose `Back to the homepage` on the 404 page.

## Driving it with drive.mjs

Preconditions:

- The site is launched in `preview` mode, and doctor passes.

- **Open the page.** Visit `/`. Journey step `goto('/')`. The response is 200, the title is `Scott Walters`, and the h1 reads `Scott Walters`. The image named `Scott Walters` has `naturalWidth > 0`.
- **Read the link lines.** Find each link by its `buttonText` as the exact accessible name. Each name matches exactly one link, whose `href` equals the source. External links have `target="_blank"` and `rel` that contains `noopener`. Links with an icon contain one `svg`. Screenshot `home-01-home.png`.
- **Follow Working With Me.** Choose `Working With Me`. The URL ends in `/working-with-me`, and the h1 contains `Working with Me`.
- **Come back and follow Projects.** Use the browser's Back button, then choose `Projects`. The URL ends in `/projects`, and the h1 is `Projects`. Screenshot `home-02-home-to-projects.png`.
- **Run it.** `node .agents/skills/verify/scripts/drive.mjs home`, and `--viewport mobile home` for the narrow layout.

## Gotchas

- The driver parses `links` from `src/pages/index.astro` with a regex over `{ first: ... }` objects. If you restructure that array, for example by moving it to another file, update `readHomeLinks` in the same change. Otherwise the check `home links parsed` fails.
- Accessible names include the icon only when the SVG has a title. Today they do not, so the name equals `buttonText`.
- `mailto:` does not start with `http`. Email is an internal-style link without `target`, and that is correct.
