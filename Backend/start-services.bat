@echo off
echo Starting Auth Service...
cd Auth-service
start "Auth Service" cmd /k "node src/index.js"

echo Waiting 3 seconds for Auth Service to start...
timeout /t 3 /nobreak >nul

echo Starting Resource Service...
cd ../Resource-service
start "Resource Service" cmd /k "node src/index.js"

echo.
echo Both services starting...
echo - Auth Service: http://localhost:5000
echo - Resource Service: http://localhost:5001
echo.
echo Press any key to seed database...
pause >nul

echo.
echo Seeding database...
cd ../Auth-service
node src/utils/seed.js

echo.
echo Setup complete! Services are running and database is seeded.
pause
