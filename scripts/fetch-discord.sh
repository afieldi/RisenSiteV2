#!/usr/bin/env bash
# Print a Discord channel's recent messages as JSON, including full embeds
# (the mcp-discord tool only returns an embed count).
#
# Usage: scripts/fetch-discord.sh <channel-id> [limit]
#   limit: 1-100, default 50. Oldest message first.
#
# Reads the bot token from RISEN_BOT_TOKEN or DISCORD_TOKEN in .env (or the environment).
# Channels: risen-info 945547601514745936, announcements 291315891214352384,
#           mythical-announcements 753755627062427709
set -euo pipefail

channel=${1:?usage: scripts/fetch-discord.sh <channel-id> [limit]}
limit=${2:-50}

root=$(cd "$(dirname "$0")/.." && pwd)
if [[ -f "$root/.env" ]]; then
  set -a; source "$root/.env"; set +a
fi
token=${RISEN_BOT_TOKEN:-${DISCORD_TOKEN:-}}
[[ -n "$token" ]] || { echo "No RISEN_BOT_TOKEN or DISCORD_TOKEN in .env or environment" >&2; exit 1; }

body=$(curl -sS -w '\n%{http_code}' -H "Authorization: Bot $token" \
  "https://discord.com/api/v10/channels/$channel/messages?limit=$limit")
status=${body##*$'\n'}
body=${body%$'\n'*}
if [[ "$status" != 200 ]]; then
  echo "Discord API returned $status: $body" >&2
  exit 1
fi

jq 'reverse | map({
  id, timestamp,
  author: .author.username,
  content,
  embeds: [.embeds[] | {title, description, url, fields: [.fields[]? | {name, value}]}
           | with_entries(select(.value != null and .value != []))]
} | if .embeds == [] then del(.embeds) else . end)' <<<"$body"
