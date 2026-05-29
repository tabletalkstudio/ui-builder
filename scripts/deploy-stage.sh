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
# Capture the deployment URL from Vercel's stdout (last URL printed).
DEPLOY_URL=$(npx vercel deploy --yes 2>&1 | tee /dev/tty | grep -oE 'https://[a-zA-Z0-9.-]+\.vercel\.app' | tail -1)

if [ -z "$DEPLOY_URL" ]; then
  echo "✗ Could not parse deployment URL from Vercel output." >&2
  exit 1
fi

echo "→ Aliasing $DEPLOY_URL → ui-builder-stage.vercel.app"
npx vercel alias set "$DEPLOY_URL" ui-builder-stage

echo "✓ Stage live at https://ui-builder-stage.vercel.app/embed.js"
