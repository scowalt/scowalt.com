# scowalt.com

This is an Astro site deployed to Cloueflare pages that will act as my personal landing page / business card.

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
