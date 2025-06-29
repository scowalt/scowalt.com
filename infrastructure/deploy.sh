#!/bin/bash
set -e

# This script wraps terraform with infisical and maps env vars correctly
export TF_VAR_cloudflare_account_id="$CLOUDFLARE_ACCOUNT_ID"

# Run terraform with the provided arguments
terraform "$@"