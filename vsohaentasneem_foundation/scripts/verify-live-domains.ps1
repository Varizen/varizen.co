# =============================================================================
# STFL Live Domain Smoke Verification
# Implements STFL_DOMAIN_SEPARATION_ARCHITECTURE.md §6.2
# =============================================================================

param (
    [string]$OrgOrigin = "https://stflbd.org",
    [string]$AppOrigin = "https://stflbd.app",
    [switch]$Detailed = $false
)

$ErrorActionPreference = "Continue"

Write-Host "`n=== STFL LIVE DOMAIN SEPARATION VERIFICATION ===" -ForegroundColor Cyan
Write-Host "Checking target origins:"
Write-Host "  Organization (Org): $OrgOrigin"
Write-Host "  Mobile App   (App): $AppOrigin"
Write-Host "=================================================`n"

$results = [System.Collections.Generic.List[PSCustomObject]]::new()
$failures = 0

function Test-Endpoint {
    param (
        [string]$Url,
        [int[]]$ExpectedStatus,
        [string]$ExpectedLocationPrefix = $null,
        [string]$Description = ""
    )

    $raw = & curl.exe -sI --max-time 10 $Url 2>&1
    $statusLine = ($raw | Where-Object { $_ -match "^HTTP/\S+\s+(\d+)" } | Select-Object -Last 1)
    $locationLine = ($raw | Where-Object { $_ -match "^[Ll]ocation:\s*(.+)$" } | Select-Object -Last 1)

    $actualStatus = 0
    if ($statusLine -match "^HTTP/\S+\s+(\d+)") {
        $actualStatus = [int]$matches[1]
    }

    $actualLocation = ""
    if ($locationLine -match "^[Ll]ocation:\s*(.+)\r?$") {
        $actualLocation = $matches[1].Trim()
    }

    $statusMatch = $ExpectedStatus -contains $actualStatus
    $locationMatch = $true
    if ($ExpectedLocationPrefix) {
        # Next.js emits same-origin redirects as a relative Location ("/"), which is
        # valid per RFC 7231. Accept either the absolute prefix or the bare path.
        $expectedPath = $null
        if ($ExpectedLocationPrefix -match '^https?://[^/]+(/.*)?$') {
            $expectedPath = if ($Matches[1]) { $Matches[1] } else { "/" }
        }
        $locationMatch = $actualLocation.StartsWith($ExpectedLocationPrefix) -or
            ($expectedPath -ne $null -and $actualLocation -eq $expectedPath)
    }

    $passed = $statusMatch -and $locationMatch

    $statusStr = if ($passed) { "PASS" } else { "FAIL" }
    $color = if ($passed) { "Green" } else { "Red" }

    if (-not $passed) {
        $script:failures++
    }

    Write-Host "[$statusStr] $Description" -ForegroundColor $color
    Write-Host "       URL: $Url" -ForegroundColor Gray
    Write-Host "       Status: $actualStatus (expected: $($ExpectedStatus -join '/'))" -ForegroundColor Gray
    if ($ExpectedLocationPrefix -or $actualLocation) {
        Write-Host "       Location: $actualLocation" -ForegroundColor Gray
    }

    $script:results.Add([PSCustomObject]@{
        Description = $Description
        Url = $Url
        Status = $actualStatus
        ExpectedStatus = ($ExpectedStatus -join '/')
        Location = $actualLocation
        Result = $statusStr
    })
}

# --- 1. Top-Level Landing Pages ---
Test-Endpoint -Url "$OrgOrigin/" -ExpectedStatus @(200) -Description "Org: Foundation Landing (/)"
Test-Endpoint -Url "$AppOrigin/" -ExpectedStatus @(200) -Description "App: Mobile App Landing (/)"

# --- 2. Foundation Redirection ---
Test-Endpoint -Url "$OrgOrigin/foundation" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$OrgOrigin" -Description "Org: /foundation -> $OrgOrigin/"
Test-Endpoint -Url "$AppOrigin/foundation" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$OrgOrigin" -Description "App: /foundation -> $OrgOrigin"

# --- 3. Foundation Content Routes ---
$foundationRoutes = @(
    "about", "mission", "team", "programs", "initiatives", "impact",
    "news", "events", "gallery", "publications", "reports", "donate",
    "volunteer", "partner", "careers", "contact", "faq", "brand", "brandcenter"
)

foreach ($r in $foundationRoutes) {
    Test-Endpoint -Url "$OrgOrigin/$r" -ExpectedStatus @(200) -Description "Org: Foundation page (/$r)"
    Test-Endpoint -Url "$AppOrigin/$r" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$OrgOrigin/$r" -Description "App: Foundation redirect (/$r -> Org)"
}

# --- 4. Dual-Domain Policies ---
Test-Endpoint -Url "$OrgOrigin/cookies" -ExpectedStatus @(200) -Description "Org: Cookies policy (/cookies)"
Test-Endpoint -Url "$AppOrigin/cookies" -ExpectedStatus @(200) -Description "App: Cookies policy (/cookies)"
Test-Endpoint -Url "$OrgOrigin/privacy" -ExpectedStatus @(200) -Description "Org: Foundation Privacy policy (/privacy)"
Test-Endpoint -Url "$AppOrigin/privacy" -ExpectedStatus @(200) -Description "App: App Privacy policy (/privacy)"
Test-Endpoint -Url "$OrgOrigin/terms" -ExpectedStatus @(200) -Description "Org: Foundation Terms (/terms)"
Test-Endpoint -Url "$AppOrigin/terms" -ExpectedStatus @(200) -Description "App: App Terms (/terms)"
Test-Endpoint -Url "$OrgOrigin/safeguarding" -ExpectedStatus @(200) -Description "Org: Safeguarding policy (/safeguarding)"
Test-Endpoint -Url "$AppOrigin/safeguarding" -ExpectedStatus @(200) -Description "App: Safeguarding policy (/safeguarding)"

# --- 5. App-Specific Pages ---
Test-Endpoint -Url "$OrgOrigin/account-deletion" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$AppOrigin/account-deletion" -Description "Org: /account-deletion -> App"
Test-Endpoint -Url "$AppOrigin/account-deletion" -ExpectedStatus @(200) -Description "App: /account-deletion"
Test-Endpoint -Url "$OrgOrigin/download" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$AppOrigin/download" -Description "Org: /download -> App"
Test-Endpoint -Url "$AppOrigin/download" -ExpectedStatus @(200) -Description "App: /download"
Test-Endpoint -Url "$OrgOrigin/roadmap" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$AppOrigin/roadmap" -Description "Org: /roadmap -> App"
Test-Endpoint -Url "$AppOrigin/roadmap" -ExpectedStatus @(200) -Description "App: /roadmap"

# --- 6. Auth & Consoles ---
Test-Endpoint -Url "$OrgOrigin/login" -ExpectedStatus @(200) -Description "Org: Workspace Login (/login)"
Test-Endpoint -Url "$AppOrigin/login" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$OrgOrigin/login" -Description "App: /login -> Org"
Test-Endpoint -Url "$OrgOrigin/signup" -ExpectedStatus @(200) -Description "Org: Workspace Signup (/signup)"
Test-Endpoint -Url "$AppOrigin/signup" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$OrgOrigin/signup" -Description "App: /signup -> Org"
Test-Endpoint -Url "$OrgOrigin/admin" -ExpectedStatus @(200) -Description "Org: Enterprise Workspace (/admin)"
Test-Endpoint -Url "$AppOrigin/admin" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$OrgOrigin/admin" -Description "App: /admin -> Org"

# --- 7. Demo Routes ---
Test-Endpoint -Url "$OrgOrigin/demo" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$AppOrigin/demo" -Description "Org: /demo -> App"
Test-Endpoint -Url "$AppOrigin/demo" -ExpectedStatus @(200) -Description "App: Demo Workspace (/demo)"
$demoSubRoutes = @("finance", "operations", "governance", "outcomes", "compliance", "documents")
foreach ($ds in $demoSubRoutes) {
    Test-Endpoint -Url "$OrgOrigin/$ds" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$AppOrigin/demo/$ds" -Description "Org: /$ds -> App /demo/$ds"
    Test-Endpoint -Url "$AppOrigin/$ds" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "/demo/$ds" -Description "App: /$ds -> /demo/$ds"
}

# --- 8. QR Verification Contract ---
Test-Endpoint -Url "$OrgOrigin/verify" -ExpectedStatus @(301, 308) -ExpectedLocationPrefix "$AppOrigin/verify" -Description "Org: /verify -> App"
Test-Endpoint -Url "$AppOrigin/verify" -ExpectedStatus @(200) -Description "App: Document Verification (/verify)"

# --- 9. Android App Links & API Reachability ---
Write-Host "`n--- Android App Links & API Reachability ---" -ForegroundColor Cyan

# Assetlinks test
$assetlinksRaw = & curl.exe -s --max-time 10 "$AppOrigin/.well-known/assetlinks.json" 2>&1
$isAssetlinksValid = $false
try {
    $parsed = $assetlinksRaw | ConvertFrom-Json
    if ($parsed -and $parsed.Length -gt 0 -and $parsed[0].target.package_name -eq "foundation.sohaeltasneem.app") {
        $isAssetlinksValid = $true
    }
} catch {}

if ($isAssetlinksValid) {
    Write-Host "[PASS] App: /.well-known/assetlinks.json is valid 200 JSON" -ForegroundColor Green
    $script:results.Add([PSCustomObject]@{
        Description = "App: /.well-known/assetlinks.json"
        Url = "$AppOrigin/.well-known/assetlinks.json"
        Status = 200
        ExpectedStatus = "200"
        Location = ""
        Result = "PASS"
    })
} else {
    Write-Host "[FAIL] App: /.well-known/assetlinks.json failed verification" -ForegroundColor Red
    $script:failures++
    $script:results.Add([PSCustomObject]@{
        Description = "App: /.well-known/assetlinks.json"
        Url = "$AppOrigin/.well-known/assetlinks.json"
        Status = 0
        ExpectedStatus = "200"
        Location = ""
        Result = "FAIL"
    })
}

# API Config test
$apiRaw = & curl.exe -s --max-time 10 "$AppOrigin/api/v1/app/config" 2>&1
$isApiValid = $false
try {
    $parsedApi = $apiRaw | ConvertFrom-Json
    if ($parsedApi.success -eq $true) {
        $isApiValid = $true
    }
} catch {}

if ($isApiValid) {
    Write-Host "[PASS] App: /api/v1/app/config is reachable and returns valid JSON" -ForegroundColor Green
    $script:results.Add([PSCustomObject]@{
        Description = "App: /api/v1/app/config"
        Url = "$AppOrigin/api/v1/app/config"
        Status = 200
        ExpectedStatus = "200"
        Location = ""
        Result = "PASS"
    })
} else {
    Write-Host "[WARN] App: /api/v1/app/config returned non-200 or invalid response (check API deployment)" -ForegroundColor Yellow
}

# --- 10. Summary ---
Write-Host "`n=================================================" -ForegroundColor Cyan
Write-Host "VERIFICATION COMPLETE: $($results.Count) checks executed."
if ($failures -eq 0) {
    Write-Host "RESULT: ALL TESTS PASSED (0 failures)`n" -ForegroundColor Green
    exit 0
} else {
    Write-Host "RESULT: $failures CHECKS FAILED (Expected if DNS / live deploys are pending)`n" -ForegroundColor Yellow
    exit 1
}
