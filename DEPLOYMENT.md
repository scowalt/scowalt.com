# Deployment

## GitHub Actions pipeline

`.github/workflows/ci.yml` runs these credential-free checks on pull requests and
pushes to `main`:

- **Code Quality & Tests:** typechecking, linting and formatting.
- **Worker Build:** build the Astro application and run Wrangler deployment
  validation with `--dry-run`, without Cloudflare credentials.
- **OpenTofu Validation:** formatting, backend-disabled initialization,
  validation and TFLint. This job never plans or applies infrastructure.

The separate **Comment-free source** workflow checks the source policy and its
regression tests.

Production deployment runs only after the three CI jobs succeed, and only when
all of these conditions hold:

- The repository is `scowalt/scowalt.com`.
- The event is a push or manual workflow dispatch on `main`, never a pull request.
- The repository variable `CLOUDFLARE_DEPLOYMENTS_ENABLED` is exactly `true`.
- The `production` environment's deployment rules permit the job.

Configure that environment to allow the `main` branch only, not tags. The job
serializes production deployments without cancelling an in-progress deployment
and refuses to deploy a revision that is no longer the current `main` tip.

The job builds without deployment credentials. Only its final Wrangler step
receives the GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
Use a Cloudflare token scoped to the existing account and the permissions needed
to deploy the existing Worker. Never supply production secrets to fork PRs,
`pull_request_target`, or a workflow that executes untrusted PR artifacts.

Wrangler uses the generated `dist/server/wrangler.json` and the existing
`scowalt-com` Worker. `--keep-vars` preserves variables maintained in the
Cloudflare dashboard. Do not change Worker names, routes, domains, storage
bindings, or DNS as part of changing the deployment controller.

## One-time cutover from Workers Builds

Do not enable Actions deployment until the old controller is disabled and its
in-flight builds have finished. Changing GitHub repository visibility is a
separate operation from deploying the site.

1. Keep `CLOUDFLARE_DEPLOYMENTS_ENABLED` unset or `false`. Review the configured
   Cloudflare production/preview commands and retain a record of the current
   production version for rollback.
2. Open the migration PR. Wait for the existing required checks and the new
   **Worker Build** check on the exact PR revision. The Actions deploy job must
   be skipped on this PR.
3. Configure GitHub's `production` environment for the `main` branch only. Verify
   the two Cloudflare deployment secrets are configured without exposing values.
4. At the coordinated cutover, replace only the required
   **Workers Builds: scowalt-com** check with **Worker Build**, keeping the other
   required checks and strict/up-to-date protection. Keep
   `opentofu/branch-protection.tf` consistent. Merge normally while Actions
   deployment remains disabled; do not bypass or weaken protection. Let any
   final legacy production build settle before continuing.
5. Disconnect this Worker's repository integration in Cloudflare's
   **Settings > Builds**. Verify no Git-triggered production or preview builds
   remain active or queued. Do not delete the Worker, domains, DNS, or data.
6. Only after confirming the old controller has stopped, set
   `CLOUDFLARE_DEPLOYMENTS_ENABLED=true`. Run the **CI** workflow manually on
   `main` if the latest merge occurred while deployment was disabled.
7. Confirm the Actions deployment succeeded for the expected commit, verify the
   production site, and confirm Cloudflare did not start a second Git-triggered
   deployment. Publish the source only after the remaining publication checks
   and the visibility configuration are reconciled. The public visibility in
   `opentofu/repository.tf` is the desired final state, not permission to apply
   it before the cutover gates are satisfied.

If any required check or controller state cannot be verified, leave the enable
variable off and stop. A successful Actions run alone does not establish that
all GitHub protection requirements passed.

## Rollback and pausing deployment

Set `CLOUDFLARE_DEPLOYMENTS_ENABLED=false` to prevent subsequent Actions
deployments. This does not stop an already-running deployment; wait for its
result before taking another deployment action.

Use a reviewed revert through the same protected PR path for normal application
rollback, or an explicitly approved rollback to a known Cloudflare Worker
version. Do not re-enable the legacy Git integration while Actions deployment
is enabled or running.

## References

- [Cloudflare deployment from GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Disconnecting Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/#disconnecting-builds)
- [GitHub deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)
