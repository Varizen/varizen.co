# run-payload-tests.ps1
# STFL Android — force re-run of the payload / contract test suites.
# The Gradle project lives in the  apk  SUBFOLDER (apk is a folder, not a .apk file).

$ErrorActionPreference = 'Stop'

$ProjectPath = 'C:\Users\ShoebTahseen\Desktop\stfl\apk'

if (-not (Test-Path (Join-Path $ProjectPath 'gradlew.bat'))) {
    Write-Host "gradlew.bat not found in $ProjectPath" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath
Write-Host "Project: $(Get-Location)" -ForegroundColor Cyan

# Payload-related suites, across the three modules that own them.
$testArgs = @(
    '--tests', '*SessionWireFormatTest*',
    '--tests', '*MockServerContractTest*',
    '--tests', '*ContentRepositoryImplTest*',
    '--tests', '*CacheStoreTest*',
    '--tests', '*AuthRepositoryImplTest*'
)

Write-Host "`nForce re-running payload tests (no cache)..." -ForegroundColor Yellow

# Android library modules need the variant-specific unit-test task: their
# aggregate "test" task is a lifecycle task that rejects --tests. The pure JVM
# module (:devmockserver) uses the plain "test" task.
$tasks = @(
    ':network:testDebugUnitTest',
    ':data:testDebugUnitTest',
    ':devmockserver:test'
)

& .\gradlew.bat @tasks @testArgs --rerun-tasks --no-build-cache --console=plain
$code = $LASTEXITCODE

if ($code -eq 0) {
    Write-Host "`nAll payload tests PASSED" -ForegroundColor Green
} else {
    Write-Host "`nPayload tests FAILED (exit $code)" -ForegroundColor Red
}

# Print the parsed results, so the count is visible rather than assumed.
Write-Host "`nPer-suite results:" -ForegroundColor Cyan
Get-ChildItem -Recurse -Filter 'test-results' -Directory | ForEach-Object {
    Get-ChildItem "$($_.FullName)\*\*.xml" -ErrorAction SilentlyContinue
} | ForEach-Object {
    $x = [xml](Get-Content $_.FullName)
    [PSCustomObject]@{
        Suite = $x.testsuite.name -replace '.*\.', ''
        Tests = [int]$x.testsuite.tests
        Fail  = [int]$x.testsuite.failures + [int]$x.testsuite.errors
    }
} | Format-Table -AutoSize

exit $code
