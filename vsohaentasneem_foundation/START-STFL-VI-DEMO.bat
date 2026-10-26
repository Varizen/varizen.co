@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

title STFL VI - DEMO LAUNCHER
set "PORT=4173"
set "HOST=127.0.0.1"
set "URL=http://%HOST%:%PORT%/"
set "LOG=%~dp0stfl-demo-launch.log"
set "SERVER_LOG=%~dp0stfl-demo-server.log"
set "PIDFILE=%~dp0stfl-demo.pid"

echo ============================================================ > "%LOG%"
echo STFL VI - DEMO / NON-PRODUCTION >> "%LOG%"
echo Started: %date% %time% >> "%LOG%"
echo Root: %~dp0 >> "%LOG%"
echo ============================================================ >> "%LOG%"

echo.
echo ============================================================
echo          STFL VI - DEMO / NON-PRODUCTION
echo       Unified Institutional Operating Platform
echo ============================================================
echo.
echo Project root : %~dp0
echo Target Port  : %PORT%
echo Target URL   : %URL%
echo.

rem ------------------------------------------------------------
rem 1. Check if port is already listening. If so, verify health.
rem    If healthy: reuse. If zombie/unresponsive: clean it up.
rem ------------------------------------------------------------
set "EXISTING_PID="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
    set "EXISTING_PID=%%P"
)

if not defined EXISTING_PID goto :FIND_WEBROOT

echo Checking existing process on port %PORT% [PID: %EXISTING_PID%]...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 '%URL%'; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 goto :OPEN_EXISTING

echo [WARN] Stale or unresponsive process detected on port %PORT% [PID: %EXISTING_PID%].
echo Reclaiming port %PORT% for fresh launch...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort %PORT% -ErrorAction SilentlyContinue | ForEach-Object { try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {} }" >nul 2>&1
ping 127.0.0.1 -n 3 >nul

:FIND_WEBROOT
rem ------------------------------------------------------------
rem 2. Prefer the real web app if this repository has one.
rem    Search current folder, parent, and known STFL subdirectories.
rem ------------------------------------------------------------
set "WEBROOT="
if exist "%~dp0main\web\package.json" set "WEBROOT=%~dp0main\web"
if not defined WEBROOT if exist "%~dp0web\package.json" set "WEBROOT=%~dp0web"
if not defined WEBROOT if exist "%~dp0..\main\web\package.json" set "WEBROOT=%~dp0..\main\web"
if not defined WEBROOT if exist "%~dp0package.json" set "WEBROOT=%~dp0"

if defined WEBROOT goto :START_NODE

echo [ERROR] Could not find web root package.json.
echo Looked in: %~dp0main\web, %~dp0web, %~dp0
pause
exit /b 1

:START_NODE
echo Found Web Root: %WEBROOT%
cd /d "%WEBROOT%"

rem Check if node_modules exists, install if not
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting STFL VI production preview server on %URL%...
start /b cmd /c "npm run start -- -p %PORT% -H %HOST% > "%SERVER_LOG%" 2>&1"

rem Wait for server to become healthy
set "TRIES=0"
:HEALTH_CHECK
set /a TRIES+=1
ping 127.0.0.1 -n 2 >nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 '%URL%'; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 goto :OPEN_BROWSER

if %TRIES% geq 15 (
    echo [WARN] Server did not report HTTP 200 within 30 seconds.
    echo Check log: %SERVER_LOG%
    goto :OPEN_BROWSER
)
goto :HEALTH_CHECK

:OPEN_EXISTING
echo [OK] Existing STFL VI server active and healthy on %URL%.

:OPEN_BROWSER
echo Opening browser: %URL%
start "" "%URL%"
echo ============================================================
echo STFL VI Demo Active at: %URL%
echo To stop, run STOP-STFL-VI-DEMO.bat
echo ============================================================
