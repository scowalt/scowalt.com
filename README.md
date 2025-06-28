# scowalt.com

This is an Astro site deployed to Cloueflare pages that will act as my personal landing page / business card.

## Tech Stack

- Astro
- Tailwind
- Cloudflare Pages
- CicleCI
- Renovate

## Deployment Setup

### Generating Cloudflare API Token

To deploy this site to Cloudflare Pages, you'll need to generate an API token with the following permissions:

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Configure the token with these permissions:
   - **Account** - `Cloudflare Pages:Edit`
   - **Zone** - `Zone:Read` (for your domain)
   - **Zone** - `DNS:Read` (for your domain)
5. Set Account Resources to "Include - All accounts" or your specific account
6. Set Zone Resources to "Include - Specific zone" and select your domain
7. Click "Continue to summary" and then "Create Token"

The token should be added to your CircleCI environment variables as `CLOUDFLARE_API_TOKEN`.
