#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run the Jekyll Algolia command
bundle exec jekyll algolia .