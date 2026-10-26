@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title STFL VI - STOP DEMO
set "PORT=4173"

echo.
echo ============================================================
echo          STFL VI - STOPPING LOCAL DEMO
echo       Unified Institutional Operating Platform
echo ============================================================
echo Target Port: %PORT%
echo.

rem ------------------------------------------------------------
rem 1. Terminate process recorded in PID file(s) if found
rem ------------------------------------------------------------
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "foreach ($f in @('%~dp0stfl-demo.pid', '%~dp0main\stfl-demo.pid')) { if (Test-Path $f) { $raw = (Get-Content $f -Raw).Trim(); if ($raw -match '^\d+$') { $p = [int]$raw; try { $pr = Get-Process -Id $p -ErrorAction SilentlyContinue; if ($pr) { Write-Host ('Stopping recorded PID ' + $p + ' (' + $pr.ProcessName + ')...'); Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } } catch {} } Remove-Item $f -Force -ErrorAction SilentlyContinue } }" >nul 2>&1

rem ------------------------------------------------------------
rem 2. Terminate any active process listening on port 4173
rem ------------------------------------------------------------
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$conns = Get-NetTCPConnection -LocalPort %PORT% -ErrorAction SilentlyContinue; if ($conns) { foreach ($c in $conns) { $p = $c.OwningProcess; try { $pr = Get-Process -Id $p -ErrorAction SilentlyContinue; if ($pr) { Write-Host ('Terminating port %PORT% listener PID ' + $p + ' (' + $pr.ProcessName + ')...') }; Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } catch {} } }"

rem ------------------------------------------------------------
rem 3. Fallback taskkill on listening PID if any remains
rem ------------------------------------------------------------
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
    taskkill /PID %%P /T /F >nul 2>&1
)

rem ------------------------------------------------------------
rem 4. Final verification
rem ------------------------------------------------------------
set "STILL_BUSY="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
    set "STILL_BUSY=%%P"
)

echo.
if defined STILL_BUSY (
    echo [WARN] Port %PORT% still appears to be occupied by PID %STILL_BUSY%.
) else (
    echo [SUCCESS] Port %PORT% is clear. All STFL VI demo processes stopped.
)

echo ============================================================
echo.
pause
