#!/usr/bin/env bash
# Build + deploy the current working tree as a Vercel preview, then re-alias
# the stable `ui-builder-stage.vercel.app` URL to point at this fresh deploy.
#
# Use this for testing changes before merging to main. The bookmarklet at
# `https://ui-builder-stage.vercel.app/embed.js` always points at the most
# recent stage deploy made this way.

set -euo pipefail

echo "→ Building…"
npm run build

echo "→ Deploying preview…"
# Capture vercel output to a temp file so we can both display it and parse
# the deployment URL out of it. (We can't use `tee /dev/tty` because that
# fails when stdout isn't a terminal — e.g., when invoked from a non-TTY shell.)
TMP=$(mktemp -t deploy-stage.XXXXXX)
trap 'rm -f "$TMP"' EXIT
npx vercel deploy --yes 2>&1 | tee "$TMP"
DEPLOY_URL=$(grep -oE 'https://[a-zA-Z0-9.-]+\.vercel\.app' "$TMP" | tail -1)

if [ -z "$DEPLOY_URL" ]; then
  echo "✗ Could not parse deployment URL from Vercel output." >&2
  exit 1
fi

echo "→ Aliasing $DEPLOY_URL → ui-builder-stage.vercel.app"
npx vercel alias set "$DEPLOY_URL" ui-builder-stage

echo "✓ Stage live at https://ui-builder-stage.vercel.app/embed.js"
