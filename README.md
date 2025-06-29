# scowalt.com

This is an Astro site deployed to Cloueflare pages that will act as my personal landing page / business card.

## Tech Stack

- Astro
- Tailwind
- Cloudflare Pages
- GitHub Actions
- Renovate

## Deployment Setup

You have two options for setting up Cloudflare Pages deployment:

### Option A: Terraform (Recommended)

This approach uses Infrastructure as Code to create the Cloudflare Pages projects:

1. **Install Terraform**: [Download Terraform](https://www.terraform.io/downloads.html)

2. **Login to Infisical CLI**:

   ```bash
   # Install Infisical CLI if needed
   npm install -g @infisical/cli
   
   # Login to your account
   infisical login
   ```

3. **Deploy infrastructure**:

   ```bash
   cd infrastructure/
   
   # Initialize Terraform
   terraform init
   
   # Run Terraform with Infisical secrets injected
   infisical run --env=prod -- ./deploy.sh plan
   infisical run --env=prod -- ./deploy.sh apply
   ```

4. **Connect GitHub manually**:
   - Go to [Cloudflare Pages dashboard](https://dash.cloudflare.com/pages)
   - Find your `scowalt-com` project and click "Connect to Git"
   - Connect your GitHub repository
   
5. **Add secrets to GitHub**:
   - Go to your repo Settings → Secrets and variables → Actions
   - Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

### Option B: Manual Setup with Infisical (Secrets Management)

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
