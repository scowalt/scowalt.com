# GitHub Repository Configuration

This directory contains OpenTofu configuration for managing the GitHub repository settings declaratively.

## Setup

1. Install OpenTofu: <https://opentofu.org/docs/intro/install/>
2. Run every command through Mission Control's Doppler config. It supplies the
   R2 state credentials and the `GITHUB_TOKEN` the GitHub provider uses:

   ```bash
   alias mc-tofu='doppler run --project mission-control --config dev --only-secrets AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,GITHUB_TOKEN -- tofu'
   ```

3. Initialize OpenTofu: `mc-tofu init`

CI validates without remote state (`tofu init -backend=false`) and needs no
Doppler access.

## Usage

- **Plan changes**: `mc-tofu plan`
- **Apply changes**: `mc-tofu apply`
- **Check current state**: `mc-tofu show`

## What's Managed

- Repository settings (description, topics, merge options)
- Branch protection rules for `main` branch
  - Requires pull request reviews (1 approver)
  - Requires status checks to pass
  - Prevents force pushes and deletions

## Files

- `main.tf` - Provider configuration
- `repository.tf` - Repository settings
- `branch-protection.tf` - Branch protection rules
- `.gitignore` - OpenTofu-specific gitignore
