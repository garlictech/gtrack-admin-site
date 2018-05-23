#! /usr/bin/env bash
. .env
tar -zcvf secrets.tgz docker/tokens.env
travis encrypt-file secrets.tgz -r $SCOPE/$PROJECT
