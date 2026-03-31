#!/bin/bash
# Deploy script for content.kaihamil.com
# GitHub-first workflow: Push to GitHub, Netlify auto-deploys
# Usage: ./deploy.sh ["commit message"]

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default commit message
if [ -z "$1" ]; then
    COMMIT_MSG="Deploy: $(date '+%Y-%m-%d %H:%M')"
else
    COMMIT_MSG="$1"
fi

echo -e "${YELLOW}Step 1: Committing to GitHub...${NC}"

# Check if we're in a git repo
if [ ! -d ".git" ]; then
    echo "Error: Not a git repository. Run 'git init' first."
    exit 1
fi

# Check for changes
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}No changes to commit.${NC}"
    echo -e "${YELLOW}Step 2: Triggering Netlify deploy...${NC}"
else
    # Stage all changes
    git add .
    
    # Commit
    git commit -m "$COMMIT_MSG"
    
    # Push to GitHub
    echo -e "${YELLOW}Pushing to GitHub...${NC}"
    git push origin main
    
    echo -e "${GREEN}✓ Pushed to GitHub${NC}"
    echo -e "${YELLOW}Step 2: Netlify auto-deploying...${NC}"
fi

echo -e "${GREEN}✓ Netlify will auto-deploy from GitHub${NC}"
echo -e "${YELLOW}Monitor at: https://app.netlify.com/sites/gilded-travesseiro-564341/deploys${NC}"
echo -e "${GREEN}Done! Site will update at https://content.kaihamil.com${NC}"
