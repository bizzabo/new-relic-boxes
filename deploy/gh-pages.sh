#!/bin/bash
npm install -g gulp; npm install
( cd ../_docs
 git init
 git config user.name "Travis-CI"
 git add .
 git commit -m "Deployed to Github Pages"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)