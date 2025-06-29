terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

# Configure the Cloudflare Provider using environment variables set by Infisical CLI
provider "cloudflare" {
  # These will be set by: infisical run -- terraform apply
  # CLOUDFLARE_API_TOKEN environment variable
  # CLOUDFLARE_ACCOUNT_ID environment variable
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "domain" {
  description = "Your domain name"
  type        = string
  default     = "scowalt.com"
}

# Create the Cloudflare Pages project
resource "cloudflare_pages_project" "scowalt_com" {
  account_id        = var.cloudflare_account_id
  name              = "scowalt-com"
  production_branch = "main"

  build_config {
    build_command       = "bun run build"
    destination_dir     = "dist"
    root_dir            = ""
    web_analytics_tag   = null
    web_analytics_token = null
  }

  # No Git integration - will be set up manually in Cloudflare dashboard

  deployment_configs {
    preview {
      environment_variables = {
        NODE_ENV = "development"
      }
    }

    production {
      environment_variables = {
        NODE_ENV = "production"
      }
    }
  }
}

# Create the preview environment project
resource "cloudflare_pages_project" "scowalt_com_preview" {
  account_id        = var.cloudflare_account_id
  name              = "scowalt-com-preview"
  production_branch = "main"

  build_config {
    build_command       = "bun run build"
    destination_dir     = "dist"
    root_dir            = ""
    web_analytics_tag   = null
    web_analytics_token = null
  }

  # No Git integration - will be set up manually in Cloudflare dashboard

  deployment_configs {
    preview {
      environment_variables = {
        NODE_ENV = "development"
      }
    }

    production {
      environment_variables = {
        NODE_ENV = "development"
      }
    }
  }
}

# Output the project URLs
output "production_url" {
  value = "https://${cloudflare_pages_project.scowalt_com.subdomain}.pages.dev"
}

output "preview_url" {
  value = "https://${cloudflare_pages_project.scowalt_com_preview.subdomain}.pages.dev"
}