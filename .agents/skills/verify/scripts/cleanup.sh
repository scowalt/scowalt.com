#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
state_dir="$root/tmp/verify"
state="$state_dir/server.env"
session="verify-scowalt-$(printf '%s' "$root" | sha1sum | cut -c1-8)"
url=""

if [ -f "$state" ]; then
  # shellcheck source=/dev/null
  . "$state"
  session="$SESSION"
  url="$URL"
fi

if tmux has-session -t "$session" 2>/dev/null; then
  tmux kill-session -t "$session"
  echo "stopped tmux session $session"
else
  echo "no tmux session $session to stop"
fi

if [ -n "$url" ]; then
  for _ in $(seq 1 20); do
    portless list 2>/dev/null | grep -qF "$url " || break
    sleep 0.5
  done
  if portless list 2>/dev/null | grep -qF "$url "; then
    echo "portless still lists $url; inspect with 'portless list' before relaunching" >&2
    exit 1
  fi
  echo "portless route $url removed"
fi

rm -f "$state"
echo "evidence kept in $state_dir/runs/"
