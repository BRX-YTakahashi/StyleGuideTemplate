#!/usr/bin/env sh

# abort on errors
set -e

npm install

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git config user.email "y.takahashi@brandex.ne.jp"
git config user.name "BRX-YTakahashi"
git push -f git@github.com:BRX-YTakahashi/StyleGuideTemplate.git main:gh-pages

cd -
