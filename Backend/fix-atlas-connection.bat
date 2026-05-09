@echo off
title Fix MongoDB Atlas Connection
color 0E

echo ═══════════════════════════════════════════════════════════════
echo                MongoDB Atlas Connection Fix
echo ═══════════════════════════════════════════════════════════════
echo.

echo Testing network connectivity to MongoDB Atlas...
echo.

ping cluster0.6ffhs.mongodb.net -n 2 >nul
if %errorlevel% neq 0 (
    echo ❌ Network: Cannot reach MongoDB Atlas cluster
    echo    Possible causes:
    echo    • Firewall blocking outbound connections
    echo    • No internet connection
    echo    • DNS resolution issues
    echo.
    echo 🔧 Try these solutions:
    echo    1. Check internet connection
    echo    2. Disable VPN/Proxy
    echo    3. Check firewall settings
    echo    4. Try different network
) else (
    echo ✅ Network: MongoDB Atlas server reachable
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo.

echo Trying alternative connection strings...
echo.

echo Option 1: Atlas with SSL (Recommended)
echo MONGO_URI=mongodb+srv://naveenfd101:T3XECENndRMIpJa4@cluster0.6ffhs.mongodb.net/auth-service?ssl=true&retryWrites=true&w=majority
echo.

echo Option 2: Atlas with shorter timeout
echo MONGO_URI=mongodb+srv://naveenfd101:T3XECENndRMIpJa4@cluster0.6ffhs.mongodb.net/auth-service?connectTimeoutMS=10000&socketTimeoutMS=10000
echo.

echo Option 3: Fallback to Local MongoDB
echo MONGO_URI=mongodb://localhost:27017/auth-service
echo.

echo ═══════════════════════════════════════════════════════════════
echo.

echo Choose connection option:
echo 1 - Atlas with SSL (Try first)
echo 2 - Atlas with short timeout
echo 3 - Local MongoDB (Fallback)
echo 4 - Keep current settings
echo.

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo Updating .env.local with Atlas SSL...
    cd Auth-service
    (
        echo # Auth Service Environment Variables - MongoDB Atlas
        echo PORT=5000
        echo MONGO_URI=mongodb+srv://naveenfd101:T3XECENndRMIpJa4@cluster0.6ffhs.mongodb.net/auth-service?ssl=true^&retryWrites=true^&w=majority^&connectTimeoutMS=30000^&socketTimeoutMS=30000
        echo.
        echo # JWT Configuration
        echo JWT_PRIVATE_KEY_PATH=./src/keys/private.key
        echo JWT_PUBLIC_KEY_PATH=./src/keys/public.key
        echo JWT_ACCESS_EXPIRES_IN=15m
        echo JWT_REFRESH_EXPIRES_IN=7d
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > .env.local
    echo ✅ Updated to Atlas with SSL
)

if "%choice%"=="2" (
    echo Updating .env.local with Atlas short timeout...
    cd Auth-service
    (
        echo # Auth Service Environment Variables - MongoDB Atlas
        echo PORT=5000
        echo MONGO_URI=mongodb+srv://naveenfd101:T3XECENndRMIpJa4@cluster0.6ffhs.mongodb.net/auth-service?connectTimeoutMS=10000^&socketTimeoutMS=10000
        echo.
        echo # JWT Configuration
        echo JWT_PRIVATE_KEY_PATH=./src/keys/private.key
        echo JWT_PUBLIC_KEY_PATH=./src/keys/public.key
        echo JWT_ACCESS_EXPIRES_IN=15m
        echo JWT_REFRESH_EXPIRES_IN=7d
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > .env.local
    echo ✅ Updated to Atlas with short timeout
)

if "%choice%"=="3" (
    echo Updating .env.local with Local MongoDB...
    cd Auth-service
    (
        echo # Auth Service Environment Variables - Local MongoDB
        echo PORT=5000
        echo MONGO_URI=mongodb://localhost:27017/auth-service
        echo.
        echo # JWT Configuration
        echo JWT_PRIVATE_KEY_PATH=./src/keys/private.key
        echo JWT_PUBLIC_KEY_PATH=./src/keys/public.key
        echo JWT_ACCESS_EXPIRES_IN=15m
        echo JWT_REFRESH_EXPIRES_IN=7d
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > .env.local
    echo ✅ Updated to Local MongoDB
)

if "%choice%"=="4" (
    echo Keeping current settings...
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo.

echo Restart Auth Service to apply new settings...
echo.

cd Auth-service
echo Starting Auth Service with new MongoDB connection...
node src/index.js

pause
