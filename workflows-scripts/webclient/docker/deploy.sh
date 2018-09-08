#!/usr/bin/env bash
set -e

docker run -i -t --rm \
  -v $(pwd):/app/project \
  -e FIREBASE_TOKEN="$FIREBASE_TOKEN" \
  garlictech2/workflows-common:${npm_package_config_dockerWorkflowVersion} scripts/firebase-deploy.sh
