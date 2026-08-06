#!/bin/sh
set -e

if [ -z "$ANTHROPIC_API_KEY" ] && [ -f /run/secrets/anthropic_api_key ]; then
  export ANTHROPIC_API_KEY="$(cat /run/secrets/anthropic_api_key)"
fi

exec "$@"
