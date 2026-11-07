#!/usr/bin/env bash
set -euo pipefail

mode="${1:-preview}"
case "$mode" in
  dev | preview) ;;
  *)
    echo "usage: launch.sh [dev|preview]" >&2
    exit 2
    ;;
esac

root="$(git rev-parse --show-toplevel)"
state_dir="$root/tmp/verify"
state="$state_dir/server.env"
log="$state_dir/server.log"
session="verify-scowalt-$(printf '%s' "$root" | sha1sum | cut -c1-8)"

if tmux has-session -t "$session" 2>/dev/null; then
  echo "tmux session $session is already serving this checkout. Run doctor.sh to inspect it or cleanup.sh to stop it." >&2
  exit 1
fi

mkdir -p "$state_dir"
cd "$root"

if [ ! -x node_modules/.bin/astro ] || [ ! -x node_modules/.bin/playwright ]; then
  bun install --frozen-lockfile
fi
bunx playwright install --only-shell chromium >"$state_dir/playwright-install.log" 2>&1

if [ "$mode" = preview ]; then
  echo "building production Worker into dist/ (log: $state_dir/build.log)"
  if ! bun run build >"$state_dir/build.log" 2>&1; then
    tail -40 "$state_dir/build.log" >&2
    exit 1
  fi
fi

: >"$log"
tmux new-session -d -s "$session" -c "$root" \
  bash -c 'portless run --tailscale astro "$1" 2>&1 | tee "$2"' launch "$mode" "$log"

url=""
deadline=$((SECONDS + 120))
while [ "$SECONDS" -lt "$deadline" ]; do
  if ! tmux has-session -t "$session" 2>/dev/null; then
    echo "server exited before it became ready:" >&2
    cat "$log" >&2
    exit 1
  fi
  url="$(grep -m1 -oE '^ *-> https://[^ ]+' "$log" | sed 's/^ *-> //' || true)"
  if [ -n "$url" ] && curl -fsS --max-time 30 "$url/" 2>/dev/null | grep -q '<title>Scott Walters</title>'; then
    break
  fi
  url=""
  sleep 1
done

if [ -z "$url" ]; then
  echo "server did not serve the home page within 120s; log:" >&2
  cat "$log" >&2
  tmux kill-session -t "$session"
  exit 1
fi

tailscale_url="$(grep -m1 -oE 'Tailscale -> https://[^ ]+' "$log" | sed 's/^Tailscale -> //' || true)"

cat >"$state" <<EOF
MODE=$mode
SESSION=$session
URL=$url
TAILSCALE_URL=$tailscale_url
LOG=$log
STARTED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF

echo "ready: $mode"
echo "local: $url"
echo "tailnet: ${tailscale_url:-none}"
echo "tmux: $session"
