terraform {
  required_version = "1.14.3"
  required_providers {
    github = {
      source  = "integrations/github"
      version = "6.8.0"
    }
  }
}

provider "github" {
  owner = "scowalt"
}
