@echo off
setlocal enabledelayedexpansion

REM Config
set DB_CONTAINER=medina-db-1
set DB_NAME=medina
set DB_USER=root
set DB_PASSWORD=22022006
set SQL_FILE=backend\medina.sql

echo 🚀 Building and starting Docker containers...
docker-compose up -d --build

REM Wait for MySQL to be ready
echo ⏳ Waiting for MySQL to become available...
:wait_for_mysql
docker exec %DB_CONTAINER% mysql -u%DB_USER% -p%DB_PASSWORD% -e "USE %DB_NAME%;" >nul 2>&1
if errorlevel 1 (
    timeout /t 2 >nul
    goto wait_for_mysql
)

echo ✅ MySQL is ready.

REM Import SQL file
echo 📥 Importing %SQL_FILE% into database '%DB_NAME%'...
type %SQL_FILE% | docker exec -i %DB_CONTAINER% sh -c "exec mysql -u%DB_USER% -p%DB_PASSWORD% %DB_NAME%"

echo ✅ SQL import completed.
