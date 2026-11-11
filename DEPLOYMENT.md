# Deployment

## GitHub Actions validates; Cloudflare deploys

```text
Pull request → GitHub Actions checks → protected merge to main
                                            ↓
                                Cloudflare build → scowalt-com Worker
```

`scowalt-com` is an assets-only Worker. `wrangler.toml` has no `main` and no
`run_worker_first`, so Cloudflare answers every request from the static files in
`dist/` and never invokes Worker code. Static asset requests are free and do not
count against the Workers request quota. Do not add a Worker script or
`run_worker_first` unless a page needs request-time code.

The Worker routes `scowalt.com/*` and `www.scowalt.com/*` are managed in the
Cloudflare dashboard, not in `wrangler.toml` or OpenTofu. `wrangler deploy` leaves
them in place because the configuration declares no routes.

Cloudflare's direct Git integration is the sole deployment controller. Keep its
production branch set to `main`. Do not enable a second deployment workflow in
GitHub Actions.

The protected branch requires these credential-free Actions checks:

- **Code Quality & Tests:** typechecking, linting and formatting.
- **Worker Build:** build the static site and run Wrangler deployment
  validation with `--dry-run`, without Cloudflare credentials.
- **OpenTofu Validation:** formatting, backend-disabled initialization,
  validation and TFLint. This job never plans or applies infrastructure.

The separate **Comment-free source** workflow checks the source policy and its
regression tests. Required checks stay strict/up-to-date, as declared in
`opentofu/branch-protection.tf`. A Cloudflare preview is not a required merge
check, so fork contributors can validate their code without deployment access.

GitHub Actions workflows use hosted runners and read-only token permissions.
They do not reference repository secrets, deploy the Worker, or execute
privileged `pull_request_target` or `workflow_run` jobs.

## Worker Previews

Use the newer **Worker Previews** model rather than legacy version previews that
use production settings. In Cloudflare's **Settings > Builds**, the preview
command must invoke `wrangler preview`. Keep the project-local Wrangler version
at least 4.135.0; this repository pins it in `package.json` and `bun.lock`.

Preview settings belong in the Wrangler `previews` block. An empty block is
sufficient for this site's static assets; it needs no production credentials,
database bindings, or storage bindings. Any future preview resource binding must
point to a preview-safe resource, not production data. Configure preview secrets
separately in **Previews Base**; never commit their values.

Review Cloudflare build-time variables, secrets and repository/branch access
separately from runtime preview settings. A public fork must not receive
production credentials or access to a privileged build environment. GitHub's
fork-token restrictions do not establish Cloudflare's policy. Only allow
untrusted preview builds when their build-time and runtime access are verified
safe; otherwise disable automatic preview builds and use Actions validation.

The `preview_urls` setting alone does not establish isolated Worker Previews.
Disabling future preview builds also does not necessarily remove old version
preview URLs. Manage any historical preview exposure separately without deleting
production resources.

## Production and rollback

Cloudflare handles the production build/deploy after a protected merge. Check
its deployment result and verify the site separately from Actions CI results.
Keep the existing `scowalt-com` Worker, domain, DNS, variables and data intact.

Use a reviewed revert through the same protected PR path for normal application
rollback, or an explicitly approved rollback to a known Cloudflare Worker
version. Do not add a competing Actions deployment controller for rollback.

A previously prepared Actions deployment job was removed before activation.
Keep the repository variable `CLOUDFLARE_DEPLOYMENTS_ENABLED=false` as a defensive
guard against rerunning historical workflows that contained that job. Existing
Cloudflare secrets in GitHub are not used by current workflows; this change does
not rotate or delete them.

## References

- [Cloudflare Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- [Production branches and Worker Previews](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [Preview configuration](https://developers.cloudflare.com/workers/previews/configuration/)
