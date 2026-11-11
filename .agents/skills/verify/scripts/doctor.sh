#!/usr/bin/env bash
set -uo pipefail

root="$(git rev-parse --show-toplevel)"
state="$root/tmp/verify/server.env"
failures=0

ok() { echo "ok   $*"; }
bad() {
  echo "FAIL $*"
  failures=$((failures + 1))
}
warn() { echo "warn $*"; }

if [ ! -f "$state" ]; then
  bad "no instance launched from this checkout ($state missing); run launch.sh"
  exit 1
fi
# shellcheck source=/dev/null
. "$state"
ok "state $state: mode=$MODE url=$URL"

if tmux has-session -t "$SESSION" 2>/dev/null; then
  ok "tmux session $SESSION is alive"
else
  bad "tmux session $SESSION is gone; run cleanup.sh then launch.sh"
fi

route_pid="$(portless list 2>/dev/null | grep -F "$URL " | grep -oE 'pid [0-9]+' | cut -d' ' -f2 || true)"
if [ -z "$route_pid" ]; then
  bad "portless has no route for $URL"
else
  pane_pid="$(tmux list-panes -t "$SESSION" -F '#{pane_pid}' 2>/dev/null | head -1)"
  pid="$route_pid"
  while [ -n "$pid" ] && [ "$pid" -gt 1 ] && [ "$pid" != "$pane_pid" ]; do
    pid="$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ')"
  done
  if [ -n "$pane_pid" ] && [ "$pid" = "$pane_pid" ]; then
    ok "portless route $URL belongs to our tmux session (pid $route_pid)"
  else
    bad "portless route $URL is owned by pid $route_pid, which this skill did not start; do not drive or kill it"
  fi
fi

home="$(curl -sS --max-time 30 -w '\n%{http_code}' "$URL/" 2>&1)"
if [ "$(tail -1 <<<"$home")" = 200 ] && grep -q '<title>Scott Walters</title>' <<<"$home"; then
  ok "GET / -> 200 with <title>Scott Walters</title>"
else
  bad "GET / did not return the home page: $(tail -1 <<<"$home")"
fi

served_mode=preview
grep -q '/@vite/client' <<<"$home" && served_mode=dev
if [ "$served_mode" = "$MODE" ]; then
  ok "server is in $MODE mode"
else
  bad "server answers like $served_mode mode but was launched as $MODE"
fi

if [ "$MODE" = dev ]; then
  asset_codes="$(for p in /@vite/client /images/me.webp; do curl -s -o /dev/null --max-time 30 -w '%{http_code} ' "$URL$p"; done)"
  if [ "$asset_codes" = '200 200 ' ]; then
    ok "dev server serves Vite modules and public/ assets"
  else
    bad "dev server answers /@vite/client and /images/me.webp with $asset_codes; pages render without CSS, scripts, or images"
  fi
fi

if [ "$MODE" = preview ]; then
  newest_source="$(find "$root/src" "$root/public" "$root/astro.config.mjs" "$root/package.json" "$root/wrangler.toml" -type f -newer "$root/dist/index.html" 2>/dev/null | head -1)"
  if [ -n "$newest_source" ]; then
    bad "dist/ is older than $newest_source; preview serves a stale build, relaunch"
  else
    ok "dist/ build is newer than every source file"
  fi
fi

if [ -n "${TAILSCALE_URL:-}" ]; then
  ts_code="$(curl -s -o /dev/null --max-time 10 -w '%{http_code}' "$TAILSCALE_URL/")"
  if [ "$ts_code" = 200 ]; then
    ok "tailnet $TAILSCALE_URL -> 200"
  else
    warn "tailnet $TAILSCALE_URL -> $ts_code; a 403 means server.allowedHosts in astro.config.mjs does not allow the PORTLESS_TAILSCALE_URL hostname (local URL is still usable)"
  fi
fi

exit $((failures > 0))
