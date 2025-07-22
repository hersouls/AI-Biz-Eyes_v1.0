#!/bin/bash

# Script to update repository URL references
# From: AI-Biz-Eyes_v1.0
# To: B2G_v1.0

echo "Updating repository URL references..."

# Update all files that contain the old repository name
find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" \) -exec sed -i 's/AI-Biz-Eyes_v1\.0/B2G_v1.0/g' {} \;

echo "Repository URL references updated!"
echo "Please review the changes and commit them."