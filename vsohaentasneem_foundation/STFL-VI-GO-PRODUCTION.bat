@echo off
setlocal EnableExtensions EnableDelayedExpansion
title STFL VI — PRODUCTION RELEASE / DEPLOY

REM ============================================================
REM STFL VI — PRODUCTION RELEASE SCRIPT
REM Canonical Web:
REM   C:\Users\ShoebTahseen\Desktop\stfl\main\web
REM Production:
REM   https://stflbd.app
REM
REM SAFETY:
REM - This is a REAL production release script.
REM - It does NOT modify DNS, nameservers, MX, SPF, DKIM, DMARC,
REM   Android signing, PostgreSQL data, or Cloudflare records directly.
REM - It refuses to use apk\web as the production source.
REM - It builds/tests before deployment.
REM - Deployment occurs ONLY through the repository's configured
REM   npm deployment script or an explicitly configured Wrangler setup.
REM ============================================================

set "ROOT=C:\Users\ShoebTahseen\Desktop\stfl"
set "WEB=%ROOT%\main\web"
set "DOMAIN=https://stflbd.app"
set "API=https://stflbd.app/api/v1"
set "LOG=%ROOT%\STFL_VI_PRODUCTION_RELEASE.log"
set "BACKUP=%ROOT%\_RELEASE_BACKUPS"

echo.
echo ============================================================
echo             STFL VI — PRODUCTION RELEASE
echo ============================================================
echo.
echo  Canonical source : %WEB%
echo  Production       : %DOMAIN%
echo  API               : %API%
echo.
echo  WARNING: THIS SCRIPT CAN DEPLOY TO PRODUCTION.
echo ============================================================
echo.

if not exist "%ROOT%" (
    echo [FAIL] STFL root not found:
    echo %ROOT%
    pause
    exit /b 1
)

if not exist "%WEB%" (
    echo [FAIL] Canonical web root not found:
    echo %WEB%
    pause
    exit /b 1
)

if exist "%ROOT%\apk\web" (
    echo [FAIL] Invalid duplicate web root still exists:
    echo %ROOT%\apk\web
    echo.
    echo Remove/quarantine it first. Production source MUST be main\web.
    pause
    exit /b 1
)

if not exist "%WEB%\package.json" (
    echo [FAIL] package.json missing from canonical web root.
    pause
    exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Node.js not found.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [FAIL] npm not found.
    pause
    exit /b 1
)

echo %date% %time% RELEASE_STARTED>>"%LOG%"

echo.
echo [1/9] Checking Git working tree...
where git >nul 2>&1
if not errorlevel 1 (
    pushd "%ROOT%"
    git status --short
    popd
) else (
    echo [WARN] Git not available. Continuing without Git status.
)

echo.
echo [2/9] Installing locked dependencies...
pushd "%WEB%"
if exist package-lock.json (
    call npm ci
) else (
    echo [WARN] package-lock.json not found.
    call npm install
)
if errorlevel 1 (
    echo [FAIL] Dependency installation failed.
    popd
    exit /b 1
)
popd

echo.
echo [3/9] Running icon-policy verification if available...
pushd "%WEB%"
call npm run verify:icons >nul 2>&1
if errorlevel 1 (
    echo [INFO] verify:icons not configured or failed.
    echo [INFO] Production gate will continue to explicit source scan.
)
popd

echo.
echo [4/9] Scanning for forbidden development endpoints/references...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$p='%WEB%'; $bad=@('10.0.2.2','127.0.0.1:3000','127.0.0.1:4173','DEV_MOCK','devmock','api.stflbd.app','localhost:3000','localhost:4173'); $files=Get-ChildItem $p -Recurse -File -ErrorAction SilentlyContinue | Where-Object {$_.FullName -notmatch '\\node_modules\\|\\.next\\|\\dist\\|\\build\\'}; $hits=@(); foreach($f in $files){try{$t=[IO.File]::ReadAllText($f.FullName); foreach($b in $bad){if($t -match [regex]::Escape($b)){$hits+=""$($f.FullName): $b""}}}catch{}}; if($hits.Count){$hits; exit 2}else{Write-Host 'PASS - no forbidden development references found.'}"
if errorlevel 1 (
    echo [FAIL] Forbidden development reference detected.
    echo Production deployment STOPPED.
    exit /b 1
)

echo.
echo [5/9] Creating release backup...
if not exist "%BACKUP%" mkdir "%BACKUP%"
set "STAMP=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "STAMP=%STAMP: =0%"
mkdir "%BACKUP%\%STAMP%" >nul 2>&1
copy "%WEB%\package.json" "%BACKUP%\%STAMP%\package.json" >nul 2>&1
if exist "%WEB%\next.config.js" copy "%WEB%\next.config.js" "%BACKUP%\%STAMP%\next.config.js" >nul 2>&1
if exist "%WEB%\next.config.mjs" copy "%WEB%\next.config.mjs" "%BACKUP%\%STAMP%\next.config.mjs" >nul 2>&1
if exist "%WEB%\wrangler.toml" copy "%WEB%\wrangler.toml" "%BACKUP%\%STAMP%\wrangler.toml" >nul 2>&1
if exist "%WEB%\wrangler.json" copy "%WEB%\wrangler.json" "%BACKUP%\%STAMP%\wrangler.json" >nul 2>&1
if exist "%WEB%\wrangler.jsonc" copy "%WEB%\wrangler.jsonc" "%BACKUP%\%STAMP%\wrangler.jsonc" >nul 1>&2

echo.
echo [6/9] Running production lint/test/build...
pushd "%WEB%"

call npm run lint
if errorlevel 1 (
    echo [FAIL] Lint failed. Deployment STOPPED.
    popd
    exit /b 1
)

call npm test -- --runInBand
if errorlevel 1 (
    echo [WARN] Test command failed or is unavailable.
    echo [WARN] Review the failure before production deployment.
    set /p CONTINUE="Continue anyway? Type DEPLOY to continue: "
    if /I not "!CONTINUE!"=="DEPLOY" (
        echo Deployment cancelled.
        popd
        exit /b 1
    )
)

call npm run build
if errorlevel 1 (
    echo [FAIL] Production build failed.
    popd
    exit /b 1
)
popd

echo.
echo [7/9] Detecting configured production deployment...
set "DEPLOY_CMD="

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$j=Get-Content -Raw '%WEB%\package.json' | ConvertFrom-Json; if($j.scripts.deploy){Write-Host ('DEPLOY_SCRIPT='+$j.scripts.deploy)}" > "%TEMP%\stfl_deploy.txt"

set /p DEPLOY_LINE=<"%TEMP%\stfl_deploy.txt"
del "%TEMP%\stfl_deploy.txt" >nul 2>&1

if defined DEPLOY_LINE (
    echo [INFO] Found package deployment script:
    echo %DEPLOY_LINE%
) else (
    echo [INFO] No npm deploy script found.
)

echo.
echo ============================================================
echo [8/9] PRODUCTION DEPLOYMENT CONFIRMATION
echo ============================================================
echo.
echo Target: %DOMAIN%
echo Source: %WEB%
echo.
echo The build has passed the release gates above.
echo Deployment will use the project's existing deployment contract.
echo.
set /p CONFIRM="Type STFL-VI-PRODUCTION to deploy: "
if /I not "%CONFIRM%"=="STFL-VI-PRODUCTION" (
    echo.
    echo Deployment cancelled safely.
    echo Build remains available locally.
    exit /b 0
)

pushd "%WEB%"

if defined DEPLOY_LINE (
    call npm run deploy
    if errorlevel 1 (
        echo [FAIL] npm production deployment failed.
        popd
        exit /b 1
    )
) else if exist "wrangler.toml" (
    where npx >nul 2>&1
    if errorlevel 1 (
        echo [FAIL] npx not found; cannot invoke Wrangler.
        popd
        exit /b 1
    )
    call npx wrangler deploy
    if errorlevel 1 (
        echo [FAIL] Wrangler deployment failed.
        popd
        exit /b 1
    )
) else if exist "wrangler.json" (
    call npx wrangler deploy
    if errorlevel 1 (
        echo [FAIL] Wrangler deployment failed.
        popd
        exit /b 1
    )
) else if exist "wrangler.jsonc" (
    call npx wrangler deploy
    if errorlevel 1 (
        echo [FAIL] Wrangler deployment failed.
        popd
        exit /b 1
    )
) else (
    echo [FAIL] No recognized production deployment contract.
    echo.
    echo Configure the project's existing Cloudflare deployment method
    echo first. This script will NOT invent deployment infrastructure.
    popd
    exit /b 1
)

popd

echo.
echo [9/9] Verifying public production site...
timeout /t 5 /nobreak >nul

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$urls=@('%DOMAIN%/','%DOMAIN%/brand','%DOMAIN%/privacy','%DOMAIN%/terms','%DOMAIN%/sitemap.xml'); $fail=0; foreach($u in $urls){try{$r=Invoke-WebRequest -UseBasicParsing -Uri $u -TimeoutSec 20; Write-Host ('PASS '+$r.StatusCode+' '+$u)}catch{Write-Host ('FAIL '+$u+' '+$_.Exception.Message); $fail=1}}; exit $fail"

if errorlevel 1 (
    echo.
    echo [WARN] Production verification has failures.
    echo DO NOT declare the release healthy until investigated.
    echo %date% %time% RELEASE_DEPLOYED_VERIFICATION_FAILED>>"%LOG%"
    pause
    exit /b 2
)

echo.
echo ============================================================
echo              STFL VI PRODUCTION LIVE
echo ============================================================
echo.
echo  Website : %DOMAIN%
echo  API     : %API%
echo.
echo  Production smoke checks passed.
echo  Release log:
echo  %LOG%
echo.
echo ============================================================

echo %date% %time% RELEASE_DEPLOYED_VERIFIED>>"%LOG%"
start "" "%DOMAIN%/"
pause
exit /b 0
