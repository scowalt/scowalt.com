resource "github_branch_protection" "main" {
  repository_id = github_repository.scowalt_com.node_id
  pattern       = "main"

  required_status_checks {
    strict = true
    contexts = [
      "Workers Builds: scowalt-com",
      "Code Quality & Tests",
      "OpenTofu Validation"
    ]
  }


  enforce_admins = false

  allows_deletions                = false
  allows_force_pushes             = false
  require_signed_commits          = false
  require_conversation_resolution = false
  required_linear_history         = false
  lock_branch                     = false
}