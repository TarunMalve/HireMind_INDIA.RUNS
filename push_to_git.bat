@echo off
echo ===================================================
echo  HireMind AI - Git Push Helper
echo ===================================================
echo.
echo Adding files to git...
git add .
echo.
echo Committing changes...
git commit -m "feat: Integrate V2 Talent Intelligence landing page and dashboards into Next.js frontend"
echo.
echo Pushing to GitHub (origin main)...
git push origin main
echo.
echo ===================================================
echo Done!
pause
