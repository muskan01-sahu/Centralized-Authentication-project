@echo off
title Quick Fix - Resource Service
color 0C

echo ═══════════════════════════════════════════════════════════════
echo                Quick Fix - Resource Service
echo ═══════════════════════════════════════════════════════════════
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo Checking Resource Service files...
cd Resource-service
if not exist "src\index.js" (
    echo ❌ Resource Service files not found
    pause
    exit /b 1
)
echo ✅ Resource Service files found

echo.
echo Checking package.json...
if not exist "package.json" (
    echo ❌ package.json not found
    pause
    exit /b 1
)
echo ✅ package.json found

echo.
echo Starting Resource Service manually...
echo.
echo If this fails, check for missing dependencies:
echo - Run: npm install
echo - Check: node_modules folder exists
echo.
echo Starting Resource Service on port 5001...
echo.

node src/index.js

pause
