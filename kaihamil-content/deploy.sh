#!/bin/bash
# Deploy script for content.kaihamil.com
# Usage: ./deploy.sh

SITE_ID="82820be5-c23f-4990-94ce-087f9efc09a9"
DIR="."

echo "Deploying to content.kaihamil.com..."
./node_modules/.bin/netlify deploy --prod --dir="$DIR" --site="$SITE_ID"

echo "Done! Check https://content.kaihamil.com"
