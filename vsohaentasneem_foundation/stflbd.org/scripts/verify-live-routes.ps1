$routes = @(
    '/',
    '/about',
    '/mission',
    '/team',
    '/reports',
    '/programs',
    '/programs/education',
    '/programs/health',
    '/programs/community-development',
    '/programs/emergency-relief',
    '/programs/digital-inclusion',
    '/impact',
    '/projects',
    '/events',
    '/news',
    '/gallery',
    '/publications',
    '/donate',
    '/volunteer',
    '/partner',
    '/careers',
    '/brandcenter',
    '/brand',
    '/verify',
    '/media/community-leader.jpg',
    '/media/tribal-artisan.jpg',
    '/media/health-worker.jpg',
    '/media/literacy-teacher.jpg',
    '/media/coastal-farmer.jpg',
    '/media/artisan-craft.jpg',
    '/media/dot-matrix-hero.png',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/safeguarding',
    '/cookies',
    '/admin',
    '/admin/property',
    '/admin/iam',
    '/admin/governance',
    '/admin/executive',
    '/admin/finance',
    '/admin/compliance',
    '/admin/knowledge',
    '/demo',
    '/initiatives',
    '/initiatives/grihostios',
    '/initiatives/skillconnect',
    '/initiatives/aev-developments',
    '/initiatives/maxremit',
    '/initiatives/helpex',
    '/initiatives/proiozon',
    '/initiatives/perlu',
    '/initiatives/oiix',
    '/initiatives/hakimsarker',
    '/initiatives/qimai',
    '/roadmap',
    '/roadmap.html',
    '/media/hakimsarker-logo.svg',
    '/media/hakimsarker-symbol.svg',
    '/media/hakimsarker-portrait.svg',
    '/media/qimai-logo.svg',
    '/media/qimai-symbol.svg',
    '/media/grihostios-logo.svg',
    '/media/skillconnect-logo.svg',
    '/media/aev-logo.svg',
    '/media/maxremit-logo.svg',
    '/media/helpex-logo.svg',
    '/media/proiozon-logo.png',
    '/media/perlu-logo.svg',
    '/media/oiix-logo.svg'
)

$passed = 0
$failed = 0

Write-Host "============================================================"
Write-Host " STFL VI PRODUCTION WEB ROUTE HEALTH VERIFICATION"
Write-Host " Target: http://127.0.0.1:4173"
Write-Host "============================================================"

foreach ($r in $routes) {
    $url = "http://127.0.0.1:4173$r"
    try {
        $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
        if ($res.StatusCode -eq 200) {
            Write-Host "[HTTP 200 PASS] $r ($($res.RawContentLength) bytes)" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "[HTTP $($res.StatusCode) WARN] $r" -ForegroundColor Yellow
            $failed++
        }
    } catch {
        Write-Host "[FAIL] $r - $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host "============================================================"
Write-Host "TOTAL CHECKED: $($routes.Count) | PASSED: $passed | FAILED: $failed"
Write-Host "============================================================"

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
