@echo off
title Student Task & Deadline Tracker
echo ===================================================
echo   Launching Student Task & Deadline Tracker...
echo ===================================================
cd /d "%~dp0"
start "" http://127.0.0.1:3000
npm run preview
