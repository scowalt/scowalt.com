terraform {
  required_version = "1.11.2"

  required_providers {
    github = {
      source  = "integrations/github"
      version = "6.11.1"
    }
  }

  backend "s3" {
    bucket = "opentofu-state"
    key    = "scowalt-com/terraform.tfstate"
    region = "auto"

    # Cloudflare R2 endpoint
    # Credentials injected via Doppler: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
    endpoints = {
      s3 = "https://a2dd27ff56de48a73e384881d22e60e2.r2.cloudflarestorage.com"
    }

    # R2 doesn't support these AWS-specific features
    skip_credentials_validation = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    use_path_style              = true
    skip_s3_checksum            = true
  }
}

provider "github" {
  owner = "scowalt"
}
