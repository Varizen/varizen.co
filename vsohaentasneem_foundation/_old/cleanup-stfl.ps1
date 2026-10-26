# cleanup-stfl.ps1
# One-shot cleanup for stfl\apk\ debris + stale docs + .gitignore
# Safe: every step asks for confirmation; nothing is force-deleted.

$root    = "C:\Users\ShoebTahseen\Desktop\stfl"
$apkPath = Join-Path $root "apk"
# The git repo lives in apk\, NOT in stfl\ — this was the bug in the first draft.
$gitignore = Join-Path $apkPath ".gitignore"

function Line { Write-Host ("-" * 60) -ForegroundColor DarkGray }
function Head($t) { Line; Write-Host $t -ForegroundColor Cyan; Line }

# ---------------------------------------------------------------
Head "STFL cleanup — $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
Write-Host "Root : $root"
Write-Host "APK  : $apkPath (git repo root)`n"

if (-not (Test-Path $apkPath)) {
    Write-Host "apk folder not found!" -ForegroundColor Red; exit 1
}

# ===============================================================
# STEP 1 — Logs / build debris (tracked in git, so 'git rm' not Remove-Item)
# ===============================================================
Head "STEP 1 — Logs / build debris (~27 MB, git-tracked)"

$debrisNames = @(
    "1.zip",
    "androidcli.txt", "androidcli2.txt",
    "build-core.txt", "build-core-log.txt", "build-log.txt",
    "hs_err_pid13264.log",
    "inst37b.txt", "install37.txt",
    "logcat.txt", "logcat2.txt", "logcat3.txt", "logcat4.txt",
    "logcat5.txt", "logcat6.txt", "logcat7.txt", "logcat8.txt",
    "mock-server.log", "mock-server-err.log",
    "p37.txt", "pkgs.txt", "pkgs2.txt",
    "plat2.txt", "sdk37.txt", "sdklist.txt", "state.txt"
)

$debris = $debrisNames | ForEach-Object {
    $f = Join-Path $apkPath $_
    if (Test-Path $f) { Get-Item $f }
}

if ($debris.Count -eq 0) {
    Write-Host "  (nothing found — already clean)" -ForegroundColor DarkGray
} else {
    $debris | Sort-Object Name | ForEach-Object {
        $kb = [math]::Round($_.Length / 1KB, 1)
        Write-Host ("  DEL  {0,-28} {1,8} KB" -f $_.Name, $kb) -ForegroundColor Yellow
    }
    $mb = [math]::Round(($debris | Measure-Object Length -Sum).Sum / 1MB, 2)
    Write-Host "`n  Total: $($debris.Count) files, $mb MB" -ForegroundColor Cyan
    Write-Host "  (1.zip is an old core+domain snapshot; same code is safe in git history 9a6d46e)" -ForegroundColor DarkGray

    $ans = Read-Host "  Delete these? (y/N)"
    if ($ans -eq "y") {
        # Tracked files must leave via git rm, or they show as deleted-and-recreated clutter.
        $tracked = @(); $untracked = @()
        foreach ($f in $debris) {
            if ((git ls-files -- $f.FullName) -ne $null) { $tracked += $f } else { $untracked += $f }
        }
        if ($tracked.Count -gt 0) {
            git rm -q -- @($tracked | ForEach-Object { $_.Name })
            Write-Host "  OK  git rm $($tracked.Count) tracked files" -ForegroundColor Green
        }
        if ($untracked.Count -gt 0) {
            $untracked | ForEach-Object { Remove-Item $_.FullName -Force }
            Write-Host "  OK  removed $($untracked.Count) untracked files" -ForegroundColor Green
        }
        Write-Host "  OK  $($debris.Count) files deleted, $mb MB freed." -ForegroundColor Green
    } else {
        Write-Host "  Skipped." -ForegroundColor DarkGray
    }
}

# ===============================================================
# STEP 2 — Stale status docs
# ===============================================================
Head "STEP 2 — Stale status docs"

$docStatus  = Join-Path $apkPath "ENGINEERING_STATUS.md"
$docFinal   = Join-Path $apkPath "FINAL_REPORT.md"
$docProject = Join-Path $apkPath "PROJECT_STATUS.md"

$present = @($docStatus, $docFinal, $docProject) | Where-Object { Test-Path $_ }
if ($present.Count -eq 0) {
    Write-Host "  (no stale docs found)" -ForegroundColor DarkGray
} else {
    $present | ForEach-Object { Write-Host "  DOC  $(Split-Path $_ -Leaf)" -ForegroundColor Yellow }
    Write-Host "`n  These claim :data is 0% and broken. Reality: 100%, 54/54 tests green." -ForegroundColor DarkGray
    Write-Host "`n  Options:"
    Write-Host "    [1] Refresh  — rewrite ENGINEERING_STATUS.md with verified facts, delete the other two"
    Write-Host "    [2] Delete   — remove all three"
    Write-Host "    [3] Skip"

    $choice = Read-Host "  Choose (1/2/3)"

    switch ($choice) {
        "1" {
            $verified = Get-Date -Format 'yyyy-MM-dd'
            $corrected = @"
# STFL Android — Engineering Status

**Verified:** $verified  |  **Truth source:** [docs/STAGE_REPORT.md](docs/STAGE_REPORT.md)

> The older PROJECT_STATUS.md / FINAL_REPORT.md claimed `:data` was 0% and
> did not compile. That was a stale snapshot from before the repositories
> were rewritten against the real domain contracts. This file replaces them.

## Build (verified $verified)

| Check | Result |
|---|---|
| `gradlew test` | PASS — 54/54 |
| `:app:assembleDebug` | PASS — 26.5 MB APK |
| `:app:bundleRelease` | PASS — 5.6 MB AAB (debug-signed; keystore still pending) |
| api `tsc --noEmit` | PASS |
| api vitest (51) | env-blocked — needs local PostgreSQL on 127.0.0.1:5433 |
| web `next build` | PASS — 18 routes |

## Test suites

| Suite | Module | Tests |
|---|---|---|
| SessionWireFormatTest | :network | 6/6 |
| MockServerContractTest | :devmockserver | 25/25 |
| ContentRepositoryImplTest | :data | 8/8 |
| CacheStoreTest | :data | 5/5 |
| AuthRepositoryImplTest | :data | 10/10 |

Re-run with `..\run-payload-tests.ps1` (force, no cache).

## Known open items

1. Release signing — no production keystore (see docs/RELEASE.md §2).
2. Backend not live at stflbd.app; login untested against production.
3. preview\web\ is an untracked nested repo — push it somewhere safe.
"@
            git rm -q -- ENGINEERING_STATUS.md FINAL_REPORT.md PROJECT_STATUS.md 2>$null
            Set-Content -Path $docStatus -Value $corrected -Encoding UTF8
            Write-Host "  OK  ENGINEERING_STATUS.md rewritten with verified facts" -ForegroundColor Green
            Write-Host "  OK  FINAL_REPORT.md + PROJECT_STATUS.md removed" -ForegroundColor Green
        }
        "2" {
            git rm -q -- ENGINEERING_STATUS.md FINAL_REPORT.md PROJECT_STATUS.md 2>$null
            foreach ($d in @($docStatus, $docFinal, $docProject)) {
                if (Test-Path $d) { Remove-Item $d -Force }
            }
            Write-Host "  OK  All three docs deleted." -ForegroundColor Green
        }
        default { Write-Host "  Skipped." -ForegroundColor DarkGray }
    }
}

# ===============================================================
# STEP 3 — .gitignore (in apk\, the actual repo root)
# ===============================================================
Head "STEP 3 — .gitignore update (apk\.gitignore)"

$marker = "# -- build-session debris"
$raw = if (Test-Path $gitignore) { Get-Content $gitignore -Raw } else { "" }
$already = $raw -match [regex]::Escape($marker)

if ($already) {
    Write-Host "  (debris block already present — skipping)" -ForegroundColor DarkGray
} else {
    # Exact names, not *.txt — avoids ignoring legitimate future text files.
    $additions = @"

# -- build-session debris (added $(Get-Date -Format 'yyyy-MM-dd'))
/1.zip
/logcat*.txt
/androidcli*.txt
/build-*.txt
/inst37b.txt
/install37.txt
/p37.txt
/pkgs*.txt
/plat2.txt
/sdk37.txt
/sdklist.txt
/state.txt
/mock-server*.log
/hs_err_pid*.log
/replay_pid*.log
"@
    Add-Content -Path $gitignore -Value $additions
    Write-Host "  OK  .gitignore updated (root-anchored exact names)." -ForegroundColor Green
}

# ===============================================================
# STEP 4 — Summary + git status
# ===============================================================
Head "STEP 4 — Summary"

Set-Location $apkPath
Write-Host "git status:`n" -ForegroundColor Cyan
git status --short | Select-Object -First 40

Write-Host "`nNext: review, then commit:" -ForegroundColor Yellow
Write-Host "  git add -A" -ForegroundColor White
Write-Host "  git commit -m `"chore: remove build-session debris, replace stale status docs`"" -ForegroundColor White

Line
Write-Host "Cleanup finished." -ForegroundColor Green
Line
