#!/usr/bin/env bash
# vaquita bash-security
# PreToolUse hook for the Bash tool. Warns on known-dangerous command patterns
# and always exits 0 (does not block).
#
# Claude Code passes the proposed tool invocation as JSON on stdin.

set -u

INPUT="$(cat)"

# Extract the command field; fall back to the raw JSON if extraction fails.
CMD="$(printf '%s' "$INPUT" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    cmd = data.get('tool_input', {}).get('command', '')
    print(cmd)
except Exception:
    pass
" 2>/dev/null || true)"

if [ -z "$CMD" ]; then
  exit 0
fi

warn() {
  printf 'vaquita-security: WARN (%s) -- command: %s\n' "$1" "$CMD" >&2
}

case "$CMD" in
  *"rm -rf /"*|*"rm -rf ~"*|*"rm -rf \$HOME"*)
    warn "rm -rf on root or home"
    ;;
  *"rm -rf *"*|*"rm -rf ./*"*)
    warn "rm -rf glob"
    ;;
  *"git push --force"*|*"git push -f"*)
    case "$CMD" in
      *" main"*|*" master"*|*":main"*|*":master"*)
        warn "force push to main/master"
        ;;
      *)
        warn "force push"
        ;;
    esac
    ;;
  *"DROP DATABASE"*|*"DROP TABLE"*|*"drop database"*|*"drop table"*)
    warn "destructive SQL"
    ;;
  *"chmod -R 777 /"*|*"chmod -R 777 ~"*)
    warn "world-writable on root or home"
    ;;
  *"mkfs"*)
    warn "filesystem format"
    ;;
  *":(){ :|:& };:"*)
    warn "fork bomb"
    ;;
esac

exit 0
