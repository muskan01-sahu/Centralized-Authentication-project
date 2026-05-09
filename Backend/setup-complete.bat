@echo off
title Centralized Authentication Setup
color 0A

echo ═══════════════════════════════════════════════════════════════
echo           Centralized Authentication & RBAC Setup
echo ═══════════════════════════════════════════════════════════════
echo.

echo [1/5] Starting Auth Service...
cd Auth-service
start "Auth Service" cmd /k "echo Auth Service Starting... && node src/index.js"
echo ✅ Auth Service started on http://localhost:5000

echo.
echo [2/5] Waiting for Auth Service to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [3/5] Starting Resource Service...
cd ../Resource-service
start "Resource Service" cmd /k "echo Resource Service Starting... && node src/index.js"
echo ✅ Resource Service started on http://localhost:5001

echo.
echo [4/5] Waiting for Resource Service to initialize...
timeout /t 3 /nobreak >nul

echo.
echo [5/5] Seeding database with roles and permissions...
cd ../Auth-service
node src/utils/seed-simple.js

echo.
echo ═══════════════════════════════════════════════════════════════
echo                    🎉 SETUP COMPLETE!
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📡 Services Running:
echo    • Auth Service:     http://localhost:5000
echo    • Resource Service: http://localhost:5001
echo.
echo 🔑 Test Credentials:
echo    • admin@example.com    / Admin@123    (Full access)
echo    • manager@example.com  / Manager@123  (Orders + Reports)
echo    • user@example.com     / User@1234    (Read only)
echo.
echo 🌐 Frontend:
echo    • Start with: cd ../Frontend && npm run dev
echo    • Navigate to: http://localhost:5173
echo.
echo 🧪 Test the complete flow:
echo    1. Register new user with role
echo    2. Login with credentials
echo    3. Access /orders to see RBAC in action
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

pause
