@echo off
cd /D "%~dp0"
cd ..\..
git status
sh _\bin\wiki.sh %*
