# scowalt.com

This is an Astro site hosted on Cloudflare Workers that acts as my personal landing page / business card.

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
- Tailwind
- Cloudflare Workers
- Renovate

## Deployment

The site runs on **Cloudflare Workers**. GitHub Actions handles pull-request
validation and includes a gated production deployment job for `main`.

See [deployment and cutover instructions](DEPLOYMENT.md). The direct Cloudflare
Git integration must be disconnected before enabling Actions deployment; never
run both deployment controllers at once. Hosting, the Worker name, and DNS are
independent of that controller change.

### Local Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```
