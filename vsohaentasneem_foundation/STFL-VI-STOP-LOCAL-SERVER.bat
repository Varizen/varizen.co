@echo off
setlocal EnableExtensions
title STFL VI — Production STOP / SAFE SHUTDOWN

REM ============================================================
REM This stops ONLY a local STFL VI process/server.
REM It does NOT delete or disable the production Cloudflare site.
REM Cloudflare production is not a local process.
REM ============================================================

echo.
echo ============================================================
echo       STFL VI — LOCAL PRODUCTION SERVER STOP
echo ============================================================
echo.
echo NOTE: If STFL VI is deployed on Cloudflare, there is no
echo local process to "stop". This script only stops a local
echo Next.js/Node server started from main\web.
echo.

set "PORT=3000"

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$c=Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue; if(-not $c){Write-Host 'No local server listening on port 3000.'; exit 0}; $pids=$c | Select-Object -ExpandProperty OwningProcess -Unique; foreach($p in $pids){Write-Host ('Stopping PID '+$p); Stop-Process -Id $p -Force -ErrorAction SilentlyContinue}"

echo.
echo Local STFL VI server shutdown complete.
echo Cloudflare/production deployment was NOT modified.
echo.
pause
exit /b 0
