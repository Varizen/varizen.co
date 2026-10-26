# Embeds fonts into the STFL meeting minutes DOCX via Word COM and exports a PDF with embedded fonts.
# Brand: STFL VI Brand Guidelines v3.0.0 / Typography System v2.0.0
$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$docx = Join-Path $dir "STFL_Meeting_Minutes_Template.docx"
$pdf = Join-Path $dir "STFL_Meeting_Minutes_Template.pdf"
$fontDir = Join-Path $dir "fonts"

$fonts = @(
    "Inter-Regular.ttf",
    "Inter-Medium.ttf",
    "Inter-SemiBold.ttf",
    "Inter-Bold.ttf",
    "NotoSansBengali-Regular.ttf",
    "NotoSansBengali-Medium.ttf",
    "NotoSansBengali-SemiBold.ttf",
    "NotoSansBengali-Bold.ttf",
    "HindSiliguri-Regular.ttf",
    "HindSiliguri-Medium.ttf",
    "HindSiliguri-SemiBold.ttf",
    "HindSiliguri-Bold.ttf"
)

# --- 1. Register fonts per-user (no admin required) ---
$dest = Join-Path $env:LOCALAPPDATA "Microsoft\Windows\Fonts"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$regPath = "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts"
foreach ($f in $fonts) {
    $src = Join-Path $fontDir $f
    $dst = Join-Path $dest $f
    try {
        Copy-Item $src $dst -Force -ErrorAction Stop
    } catch {
        # already installed and locked by the font cache - safe to reuse
        if (-not (Test-Path $dst)) { throw }
        Write-Host "  (already installed: $f)"
    }
    $fam = switch -Wildcard ($f) {
        "Inter-Regular.ttf"            { "Inter (TrueType)" }
        "Inter-Medium.ttf"             { "Inter Medium (TrueType)" }
        "Inter-SemiBold.ttf"           { "Inter SemiBold (TrueType)" }
        "Inter-Bold.ttf"               { "Inter Bold (TrueType)" }
        "NotoSansBengali-Regular.ttf"  { "Noto Sans Bengali (TrueType)" }
        "NotoSansBengali-Medium.ttf"   { "Noto Sans Bengali Medium (TrueType)" }
        "NotoSansBengali-SemiBold.ttf" { "Noto Sans Bengali SemiBold (TrueType)" }
        "NotoSansBengali-Bold.ttf"     { "Noto Sans Bengali Bold (TrueType)" }
        "HindSiliguri-Regular.ttf"     { "Hind Siliguri (TrueType)" }
        "HindSiliguri-Medium.ttf"      { "Hind Siliguri Medium (TrueType)" }
        "HindSiliguri-SemiBold.ttf"    { "Hind Siliguri SemiBold (TrueType)" }
        "HindSiliguri-Bold.ttf"        { "Hind Siliguri Bold (TrueType)" }
    }
    New-ItemProperty -Path $regPath -Name $fam -Value $dst -PropertyType String -Force | Out-Null
}
Write-Host "Fonts registered per-user."

# --- 2. Word COM: embed fonts + export PDF ---
# Remove stale Word lock files from previous crashed runs
Get-ChildItem $dir -Filter "~`$*.docx" -Force -ErrorAction SilentlyContinue |
    ForEach-Object { Write-Host "Removing stale lock: $($_.Name)"; Remove-Item $_.FullName -Force }

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open($docx, $false, $false)

    # --- Convert inline header pictures to native floating watermarks ---
    # The DOCX carries the seal as an inline picture in each header; Word COM
    # converts it to a centered, behind-text floating shape (native Word
    # watermark behavior) so it repeats centered on every page.
    foreach ($sec in $doc.Sections) {
        foreach ($hdr in @($sec.Headers)) {
            $count = $hdr.Range.InlineShapes.Count
            for ($i = $count; $i -ge 1; $i--) {
                $ish = $hdr.Range.InlineShapes.Item($i)
                if ($ish.Type -eq 3) {  # wdInlineShapePicture
                    $shp = $ish.ConvertToShape()
                    $shp.RelativeHorizontalPosition = 1  # wdRelativeHorizontalPositionPage
                    $shp.RelativeVerticalPosition = 1    # wdRelativeVerticalPositionPage
                    $shp.Left = -999995                  # wdShapeCenter
                    $shp.Top = -999995                   # wdShapeCenter
                    $shp.WrapFormat.Type = 5             # wdWrapBehind
                    $shp.LockAnchor = $true
                }
            }
        }
    }

    $doc.EmbedTrueTypeFonts = $true
    $doc.SaveSubsetFonts = $true
    $doc.DoNotEmbedSystemFonts = $true
    $doc.Save()
    # 17 = wdExportFormatPDF; OpenAfterExport=$false is critical for headless COM
    $doc.ExportAsFixedFormat($pdf, 17, $false)
    $doc.Close($false)
    Write-Host "PDF exported: $pdf"
}
finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
Write-Host "Done."
