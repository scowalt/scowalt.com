resource "github_repository" "scowalt_com" {
  name         = "scowalt.com"
  description  = "My personal website"
  homepage_url = "https://scowalt.com"

  visibility = "private"

  has_issues      = true
  has_projects    = false
  has_wiki        = false
  has_downloads   = false
  has_discussions = false

  delete_branch_on_merge      = true
  allow_merge_commit          = false
  allow_squash_merge          = true
  allow_rebase_merge          = false
  squash_merge_commit_title   = "COMMIT_OR_PR_TITLE"
  squash_merge_commit_message = "COMMIT_MESSAGES"

  topics = ["personal", "website", "astro", "cloudflare-pages"]
}