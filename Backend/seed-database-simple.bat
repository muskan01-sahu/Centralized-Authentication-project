@echo off
echo Seeding database with roles and permissions...
cd Auth-service
node src/utils/seed-simple.js
pause
