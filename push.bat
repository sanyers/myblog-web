@echo off
git pull
git add .
git commit -m %1
git push
git push github