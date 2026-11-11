# scowalt.com

This is a static Astro site, served as Cloudflare Workers static assets, that acts as my personal landing page / business card.

## License

The original website code and infrastructure configuration are licensed under
[GNU GPL version 3 only](LICENSE) (`GPL-3.0-only`). Copyright (C) 2026 Scott Walters.

This software license does not cover personal writing, biographical information,
photographs, portfolio screenshots, or branding, including:

- Personal prose in `src/pages/` and `src/content/projects/`, regardless of file
  format.
- Photographs and screenshots in `public/images/`, including historical versions.
- Third-party artwork, logos, and trademarks depicted in those images.

No additional reuse license is granted for those excluded materials. Third-party
code and assets remain subject to their own licenses and notices; the GPL grant
applies only to original code. See [third-party notices](THIRD_PARTY_NOTICES.md).
No trademark or endorsement rights are granted.

## Tech Stack

- Astro
- Plain CSS with cascade layers
- Cloudflare Workers static assets
- Renovate

## Styling

The site uses plain CSS without a framework. `src/styles/global.css` declares
the cascade order once, as `@layer theme, base, components;`:

- `theme` holds the design tokens as CSS custom properties: colors, font
  stacks, font sizes, spacing, and radii.
- `base` holds the reset and the element defaults.
- `components` holds the shared named classes, such as `.page-column`,
  `.back-link`, and `.prose` for Markdown content.

Styles that only one component uses live in that component's scoped `<style>`
block, inside `@layer components`. Do not use `!important`.

Custom properties do not work in media queries, so the breakpoints are
literal values: `48rem` (768px) for tablet layouts and `64rem` (1024px) for
desktop layouts.

## Deployment

Astro prerenders every page to HTML at build time (`output: 'static'`). The
`scowalt-com` Worker has no script: it serves `dist/` as static assets, so no
request runs Worker code or counts against the Workers request quota. Unknown
paths get `dist/404.html` with status 404 through `not_found_handling`. The
Content Security Policy ships as a `<meta http-equiv>` tag in each page, with
hashes for every inline script and style that Astro emits. `public/_headers`
marks the fingerprinted files under `/_astro/` as immutable.

GitHub Actions validates pull requests;
Cloudflare's Git integration builds and deploys production from protected `main`.
Cloudflare is the sole deployment controller.

See [deployment and preview configuration](DEPLOYMENT.md). GitHub Actions never
deploys the site or receives Cloudflare deployment credentials.

### Local Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```
