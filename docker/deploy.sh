#!/usr/bin/env bash
set -e

TARGET=staging

if [[ $TRAVIS_BRANCH == "master" ]]; then
  TARGET=master
fi

docker run -i -t --rm \
  -v $(pwd):/app/project \
  -e FIREBASE_TOKEN="$FIREBASE_TOKEN" \
  garlictech2/workflows-common:${npm_package_config_dockerWorkflowVersion} scripts/firebase-deploy.sh $TARGET
