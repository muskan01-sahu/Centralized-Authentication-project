@echo off
title Resource Service Debug
color 0E

echo ═══════════════════════════════════════════════════════════════
echo                Resource Service Debug Mode
echo ═══════════════════════════════════════════════════════════════
echo.

echo Current Directory: %CD%
echo.

echo Checking Node.js...
node --version
echo.

echo Checking Files...
dir src\index.js
echo.

echo Checking package.json...
type package.json
echo.

echo Checking Environment...
if exist .env (
    echo .env found:
    type .env
) else (
    echo .env not found
)
echo.

echo Starting Resource Service...
echo.
echo If you see errors below, the service failed to start:
echo.

node src/index.js

echo.
echo If service started successfully, you should see:
echo "🚀 Resource Service running"
echo.
pause
