#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run the Jekyll Algolia command
bundle exec ruby \
  -r"${SCRIPT_DIR}/scripts/algolia_ssl_compat.rb" \
  "$(bundle show jekyll)/exe/jekyll" algolia .
