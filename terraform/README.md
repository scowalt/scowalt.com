# GitHub Repository Configuration

This directory contains OpenTofu configuration for managing the GitHub repository settings declaratively.

## Setup

1. Install OpenTofu: <https://opentofu.org/docs/intro/install/>
2. Set up GitHub authentication (requires GITHUB_TOKEN environment variable or GitHub CLI)
3. Initialize OpenTofu: `tofu init`

## Usage

- **Plan changes**: `tofu plan`
- **Apply changes**: `tofu apply`
- **Check current state**: `tofu show`

## Authentication

This configuration uses the GitHub provider, which can authenticate via:

- GitHub CLI (`gh auth login`)
- GITHUB_TOKEN environment variable
- GitHub App installation

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
