@echo off
title Portfolio Worldwide Sync
color 0b
echo ============================================================
echo   SYNCING HARSHITH'S PORTFOLIO LIVE TO ALL COMPUTERS
echo ============================================================
echo.
cd /d "%~dp0"

echo [1/4] Building production website bundle...
call npm run build
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Saving all changes to Git...
git add -A
git commit -m "feat: sync portfolio updates live to worldwide website"

echo.
echo [3/4] Pushing source code to GitHub (main branch)...
git push origin main

echo.
echo [4/4] Deploying live website to GitHub Pages...
call npx --yes gh-pages -d dist

echo.
color 0a
echo ============================================================
echo   SUCCESS! YOUR PORTFOLIO IS NOW LIVE ACROSS ALL COMPUTERS!
echo   Visit: https://kenchuv1974-ai.github.io/portfolio-website/
echo ============================================================
echo.
timeout /t 5
