@echo off
title Stop Hotel Management System
color 0A

:: ==========================================
::  Stop Hotel Management System (Windows)
:: ==========================================

set BACKEND_PORT=8080
set FRONTEND_PORT=3000

echo ==========================================
echo   Stopping Hotel Management System
echo ==========================================
echo.

:: ---------- Stop Backend ----------
echo [INFO] Stopping Backend (port %BACKEND_PORT%)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%BACKEND_PORT%') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo [OK] Backend stopped
echo.

:: ---------- Stop Frontend ----------
echo [INFO] Stopping Frontend (port %FRONTEND_PORT%)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%FRONTEND_PORT%') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo [OK] Frontend stopped
echo.

:: ---------- Extra Cleanup ----------
echo [INFO] Cleaning up any remaining processes...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
echo [OK] Cleanup done
echo.

timeout /t 2 >nul

echo ==========================================
echo   All services stopped successfully!
echo ==========================================
echo.
pause
