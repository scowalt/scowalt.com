resource "github_branch_protection" "main" {
  repository_id = github_repository.scowalt_com.node_id
  pattern       = "main"

  required_status_checks {
    strict = true
    contexts = [
      "Workers Builds: scowalt-com",
      "Code Quality & Tests",
      "Terraform Validation",
      "Security Scanning"
    ]
  }

  required_pull_request_reviews {
    required_approving_review_count = 1
    dismiss_stale_reviews           = false
    require_code_owner_reviews      = false
    require_last_push_approval      = false
  }

  enforce_admins = false

  allows_deletions                = false
  allows_force_pushes             = false
  require_signed_commits          = false
  require_conversation_resolution = false
  required_linear_history         = false
  lock_branch                     = false
}