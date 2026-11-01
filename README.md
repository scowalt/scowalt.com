# scowalt.com

This is an Astro site deployed to Cloueflare pages that will act as my personal landing page / business card.

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

This site deploys to **Cloudflare Workers** using the direct GitHub integration.

### Setup

1. **Connect to Cloudflare Workers**:
   - Go to [Cloudflare Workers dashboard](https://dash.cloudflare.com/workers)
   - Create a new Worker project
   - Connect your GitHub repository using the GitHub integration

2. **Build Configuration**:
   - **Build Command**: `bun run build`
   - **Build Output Directory**: `dist`

3. **Custom Domain** (optional):
   - Add your domain to Cloudflare (if not already)
   - Configure routes in `wrangler.toml` or the Workers dashboard

### Local Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```
