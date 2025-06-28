# scowalt.com

This is an Astro site deployed to Cloueflare pages that will act as my personal landing page / business card.

## Tech Stack

- Astro
- Tailwind
- Cloudflare Pages
- GitHub Actions
- Renovate

## Deployment Setup

### Generating Cloudflare API Token

To deploy this site to Cloudflare Pages, you'll need to generate an API token with the following permissions:

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Configure the token with these permissions:
   - **Account** - `Cloudflare Pages:Edit`
   - **User** - `Memberships:Read`
   - **User** - `User Details:Read`
   - **Zone** - `Zone:Read` (for your domain)
   - **Zone** - `DNS:Read` (for your domain)
5. Set Account Resources to "Include - All accounts" or your specific account
6. Set Zone Resources to "Include - Specific zone" and select your domain
7. Click "Continue to summary" and then "Create Token"

Add these secrets to your GitHub repository:

- `CLOUDFLARE_API_TOKEN`: The API token you generated above
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (found in the right sidebar of your Cloudflare dashboard)

## Deployment

The site automatically deploys via GitHub Actions:

- **Production**: Pushes to `main` branch deploy to production
- **Preview**: Pull requests deploy preview sites with unique URLs
