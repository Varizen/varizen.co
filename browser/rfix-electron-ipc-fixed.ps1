# AiBrowser Electron IPC safety patch
# Run from K:\varizen.co\browser
$ErrorActionPreference = "Stop"

$Root = "K:\varizen.co\browser"
$Main = Join-Path $Root "src\main.js"

Write-Host ""
Write-Host "AiBrowser IPC Safety Patcher" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

if (-not (Test-Path -LiteralPath $Main)) {
    Write-Host "ERROR: main.js not found: $Main" -ForegroundColor Red
    exit 1
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$Backup = "$Main.backup-$stamp"

Copy-Item -LiteralPath $Main -Destination $Backup -Force
Write-Host "Backup: $Backup" -ForegroundColor Green

$content = Get-Content -LiteralPath $Main -Raw

# Add a safe IPC helper once.
$helper = @'
/* Eye Browser IPC safety helper */
function safeSend(webContents, channel, ...args) {
    if (!webContents) return false;

    try {
        if (typeof webContents.isDestroyed === "function" &&
            webContents.isDestroyed()) {
            return false;
        }

        webContents.send(channel, ...args);
        return true;
    } catch (err) {
        if (err && String(err.message || "").includes("Object has been destroyed")) {
            return false;
        }

        console.warn("[Eye Browser] IPC send failed:", err && err.message ? err.message : err);
        return false;
    }
}
'@

if ($content -notmatch '(?m)^\s*function\s+safeSend\s*\(') {
    $content = $helper + "`r`n`r`n" + $content
    Write-Host "Added safeSend()." -ForegroundColor Green
} else {
    Write-Host "safeSend() already exists." -ForegroundColor Yellow
}

# Protect common direct WebContents sends.
$before = $content

$content = [regex]::Replace(
    $content,
    '(?<![\w.])webContents\.send\(',
    'safeSend(webContents, '
)

$content = [regex]::Replace(
    $content,
    '(?<![\w.])contents\.send\(',
    'safeSend(contents, '
)

Write-Host "Protected direct webContents/contents.send() calls." -ForegroundColor Green

# Protect common BrowserWindow sends.
$content = [regex]::Replace(
    $content,
    '(?<![\w.])([A-Za-z_$][A-Za-z0-9_$]*)\.webContents\.send\(',
    'safeSend($1.webContents, '
)

# Write the patched file.
Set-Content -LiteralPath $Main -Value $content -Encoding UTF8

# Validate JavaScript syntax if Node is installed.
$node = Get-Command node -ErrorAction SilentlyContinue

if ($null -ne $node) {
    Write-Host "Checking JavaScript syntax..." -ForegroundColor Cyan

    & node --check $Main

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Syntax check failed. Restoring backup." -ForegroundColor Red
        Copy-Item -LiteralPath $Backup -Destination $Main -Force
        exit 1
    }

    Write-Host "JavaScript syntax: OK" -ForegroundColor Green
} else {
    Write-Host "Node.js was not found. Syntax check skipped." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "PATCH COMPLETE" -ForegroundColor Green
Write-Host "Backup: $Backup" -ForegroundColor Cyan
Write-Host ""
Write-Host "Restart/rebuild AiBrowser now." -ForegroundColor Yellow
Write-Host ""
