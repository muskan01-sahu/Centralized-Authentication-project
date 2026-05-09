@echo off
title Service Status Check
color 0B

echo ═══════════════════════════════════════════════════════════════
echo                Service Status Check
echo ═══════════════════════════════════════════════════════════════
echo.

echo Checking Auth Service (Port 5000)...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Auth Service: RUNNING
) else (
    echo ❌ Auth Service: NOT RUNNING
)

echo.
echo Checking Resource Service (Port 5001)...
curl -s http://localhost:5001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Resource Service: RUNNING
) else (
    echo ❌ Resource Service: NOT RUNNING
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo.

pause
