# scowalt.com

This is an Astro site deployed to Cloueflare pages that will act as my personal landing page / business card.

## Tech Stack

- Astro
- Tailwind
- Cloudflare Pages
- GitHub Actions
- Renovate

## Deployment Setup

### Infisical Setup (Secrets Management)

This project uses [Infisical](https://infisical.com/) for centralized secrets management. Choose **Option A** (simpler) or **Option B** (more advanced):

#### 1. Create Infisical Project

1. Sign up/login to [Infisical](https://app.infisical.com/)
2. Create a new project named `scowalt-com`
3. Create two environments: `prod` and `dev`

#### 2. Generate Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token" → "Custom token"
3. Configure with these permissions:
   - **Account** - `Cloudflare Pages:Edit`
   - **User** - `Memberships:Read`
   - **User** - `User Details:Read`
   - **Zone** - `Zone:Read` (for your domain)
   - **Zone** - `DNS:Read` (for your domain)
4. Set Account/Zone Resources appropriately
5. Create the token

#### 3. Add Secrets to Infisical

Add these secrets to both `prod` and `dev` environments in Infisical:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token from above
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (from dashboard sidebar)

#### 4. Integrate Infisical with GitHub

1. In your Infisical project, go to **Integrations** tab
2. Find **GitHub** and click **"Add Integration"**
3. Select **"GitHub App"** authentication method
4. Click **"Connect to GitHub"** and authorize the app
5. Configure sync settings:
   - **Source Environment**: `prod` (for production) or `dev` (for preview)
   - **Target**: Repository secrets
   - **Repository**: Select `scowalt.com` repository
6. Repeat for both environments if needed
7. Secrets will be automatically synced to GitHub repository secrets

## Deployment

The site automatically deploys via GitHub Actions:

- **Production**: Pushes to `main` branch deploy to production
- **Preview**: Pull requests deploy preview sites with unique URLs
