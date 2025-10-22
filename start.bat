@echo off
title "Hotel Management System - Startup"
color 0A

echo ==========================================
echo   Hotel Management System Setup
echo ==========================================
echo.

:: Check Java
echo [CHECK] Verifying Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)
echo [OK] Java found
echo.

:: Check Node.js
echo [CHECK] Verifying Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js
    pause
    exit /b 1
)
echo [OK] Node.js found
echo.

:: Check npm
echo [CHECK] Verifying npm installation...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)
echo [OK] npm found
echo.

:: Check PostgreSQL
echo [CHECK] Verifying PostgreSQL installation...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0E
    echo [WARNING] PostgreSQL CLI not found in PATH
    echo Make sure PostgreSQL is installed and running
    echo.
) else (
    echo [OK] PostgreSQL found
    echo.
)

:: Database Setup
echo ==========================================
echo   Database Setup
echo ==========================================
echo.
echo [INFO] Setting up database...
echo This will create the database and user if they don't exist
echo.

:: Ask for PostgreSQL password dynamically
set /p DB_PASSWORD=Enter PostgreSQL password (for user 'postgres'): 
echo.

:: Test connection
set PGPASSWORD=%DB_PASSWORD%
psql -U postgres -h localhost -c "SELECT version();" >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Could not connect to PostgreSQL. Please check the password and try again.
    pause
    exit /b 1
)
echo [OK] Connected to PostgreSQL successfully
echo.

psql -U postgres -h localhost -c "SELECT 1 FROM pg_database WHERE datname='hotel_db'" | findstr "1 row" >nul 2>&1

if %errorlevel% neq 0 (
    echo [INFO] Creating database 'hotel_db'...
    psql -U postgres -h localhost -c "CREATE DATABASE hotel_db;" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Database created
    ) else (
        echo [WARNING] Could not create database automatically
        echo Please create it manually or check if it already exists
    )
) else (
    echo [OK] Database 'hotel_db' already exists
)
echo.

psql -U postgres -h localhost -c "SELECT 1 FROM pg_roles WHERE rolname='hotel_user'" | findstr "1 row" >nul 2>&1

if %errorlevel% neq 0 (
    echo [INFO] Creating user 'hotel_user'...
    psql -U postgres -h localhost -c "CREATE USER hotel_user WITH PASSWORD '%DB_PASSWORD%';"
    psql -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE hotel_db TO hotel_user;" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] User created and privileges granted
    ) else (
        echo [WARNING] Could not create user automatically
        echo Please create it manually or check if it already exists
    )
) else (
    echo [OK] User 'hotel_user' already exists
    psql -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE hotel_db TO hotel_user;" >nul 2>&1
)
echo.

set PGPASSWORD=

:: Backend Dependencies
echo ==========================================
echo   Backend Setup
echo ==========================================
echo.
echo [INFO] Checking backend dependencies...
cd hotelmanagement\hotelmanagement

if not exist "target" (
    echo [INFO] Installing Maven dependencies...
    call mvnw.cmd clean install -DskipTests
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Failed to install backend dependencies
        cd ..\..
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)
cd ..\..
echo.

:: Frontend Dependencies
echo ==========================================
echo   Frontend Setup
echo ==========================================
echo.
echo [INFO] Checking frontend dependencies...
cd hotelmanagement-frontend

if not exist "node_modules" (
    echo [INFO] Installing npm packages...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)
cd ..
echo.

:: Start Services
echo ==========================================
echo   Starting Hotel Management System
echo ==========================================
echo.
if exist "null" del "null" >nul 2>&1

color 0A
echo [INFO] Starting Backend Server...
cd hotelmanagement\hotelmanagement
start cmd /k "mvnw.cmd spring-boot:run"
cd ..\..
echo.

echo [INFO] Waiting for backend to initialize...
timeout /t 10 >nul

color 0B
echo [INFO] Starting Frontend Server...
cd hotelmanagement-frontend
start cmd /k "npm start"
cd ..
echo.

color 0A
echo ==========================================
echo   Setup Complete! Servers Running
echo ==========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Database: hotel_db
echo User:     hotel_user
echo.
echo Press any key to close this window...
echo (Servers will continue running)
color 07
pause