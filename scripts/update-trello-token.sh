#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="$(dirname "$0")/../apps/backend/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

API_KEY=$(grep -E '^TRELLO_API_KEY=' "$ENV_FILE" | cut -d= -f2)

if [[ -z "$API_KEY" ]]; then
  echo "Error: TRELLO_API_KEY not found in $ENV_FILE"
  exit 1
fi

echo ""
echo "Open this URL in your browser to generate a new Trello token:"
echo ""
echo "  https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=${API_KEY}"
echo ""
echo "After authorizing, paste the token here and press Enter:"
read -r NEW_TOKEN

if [[ -z "$NEW_TOKEN" ]]; then
  echo "No token entered, aborting."
  exit 1
fi

# Update apps/backend/.env
sed -i '' "s/^TRELLO_API_TOKEN=.*/TRELLO_API_TOKEN=${NEW_TOKEN}/" "$ENV_FILE"
echo "Updated $ENV_FILE"

# Update root .env if it exists and has the key
ROOT_ENV="$(dirname "$0")/../.env"
if [[ -f "$ROOT_ENV" ]] && grep -q '^TRELLO_API_TOKEN=' "$ROOT_ENV"; then
  sed -i '' "s/^TRELLO_API_TOKEN=.*/TRELLO_API_TOKEN=${NEW_TOKEN}/" "$ROOT_ENV"
  echo "Updated $ROOT_ENV"
fi

echo ""
echo "Done. Remember to update TRELLO_API_TOKEN in your Vercel environment variables too."
