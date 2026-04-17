#!/usr/bin/env bash
# vaquita health-sentinel
# Validates .claude/settings.json parses and every hook command referenced
# under .hooks exists and is executable. Prints a single status line.
# Always exits 0.
#
# Written to work on bash 3.2 (macOS default). No mapfile, no readarray.

set -u

SETTINGS_JSON=".claude/settings.json"

if [ ! -f "$SETTINGS_JSON" ]; then
  echo "vaquita-health: FAIL (settings.json not found)"
  exit 0
fi

if ! python3 -c "import json,sys; json.load(open('$SETTINGS_JSON'))" >/dev/null 2>&1; then
  echo "vaquita-health: FAIL (settings.json invalid JSON)"
  exit 0
fi

# Extract every script path referenced as a hook command under .hooks.
SCRIPT_LIST="$(python3 -c "
import json
with open('$SETTINGS_JSON') as f:
    data = json.load(f)
hooks = data.get('hooks', {})
for event in hooks.values():
    for matcher_block in event:
        for h in matcher_block.get('hooks', []):
            if h.get('type') == 'command':
                cmd = h.get('command', '').strip()
                if cmd:
                    print(cmd.split()[0])
")"

MISSING=""
NOT_EXEC=""

while IFS= read -r script; do
  [ -z "$script" ] && continue
  if [ ! -e "$script" ]; then
    MISSING="${MISSING:+$MISSING }$script"
  elif [ ! -x "$script" ]; then
    NOT_EXEC="${NOT_EXEC:+$NOT_EXEC }$script"
  fi
done <<EOF
$SCRIPT_LIST
EOF

if [ -z "$MISSING" ] && [ -z "$NOT_EXEC" ]; then
  echo "vaquita-health: OK"
  exit 0
fi

echo "vaquita-health: FAIL (missing: ${MISSING}, not-executable: ${NOT_EXEC})"
exit 0
