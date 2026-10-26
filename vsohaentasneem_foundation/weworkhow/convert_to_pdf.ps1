# Convert Chairman's Digital Desk .docx templates to .dotx and PDF with embedded fonts
$ErrorActionPreference = "Stop"

$baseDir = "C:\Users\ShoebTahseen\Desktop\stfl\weworkhow"
$fontsDir = "C:\Users\ShoebTahseen\Desktop\stfl\brandcenter\typography\fonts"

# Register fonts for embedding
Write-Host "Registering fonts for embedding..."
$fontFiles = @(
    "Inter-Regular.ttf", "Inter-Medium.ttf", "Inter-SemiBold.ttf",
    "NotoSansBengali-Regular.ttf", "NotoSansBengali-Medium.ttf", "NotoSansBengali-SemiBold.ttf",
    "HindSiliguri-Regular.ttf", "HindSiliguri-SemiBold.ttf"
)

$regPath = "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts"
foreach ($ff in $fontFiles) {
    $fp = Join-Path $fontsDir $ff
    if (Test-Path $fp) {
        $fontName = [System.IO.Path]::GetFileNameWithoutExtension($ff)
        $isBold = $ff -match "Bold"
        $isItalic = $ff -match "Italic"
        $regName = if ($isBold -and $isItalic) { "$fontName (TrueType)" }
                   elseif ($isBold) { "$fontName Bold (TrueType)" }
                   elseif ($isItalic) { "$fontName Italic (TrueType)" }
                   else { "$fontName (TrueType)" }
        Set-ItemProperty -Path $regPath -Name $regName -Value $fp -ErrorAction SilentlyContinue
        Write-Host "  Registered: $regName"
    }
}

# Convert templates
$templates = @(
    @{ Folder = "STFL-Chairman-Desk-Bangla"; Name = "STFL-Chairman-Desk-Bangla" },
    @{ Folder = "STFL-Chairman-Desk-English"; Name = "STFL-Chairman-Desk-English" }
)

Write-Host "`nConverting templates to .dotx and PDF..."
$word = $null

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    foreach ($t in $templates) {
        $folder = Join-Path $baseDir $t.Folder
        $docxPath = Join-Path $folder "$($t.Name).docx"
        $dotxPath = Join-Path $folder "$($t.Name).dotx"
        $pdfPath = Join-Path $folder "$($t.Name).pdf"

        if (-not (Test-Path $docxPath)) {
            Write-Host "SKIP: $docxPath not found"
            continue
        }

        Write-Host "Processing: $($t.Name)"

        $doc = $word.Documents.Open($docxPath, $false, $false)
        $doc.EmbedTrueTypeFonts = $true
        $doc.SaveSubsetFonts = $true

        # Save as Word Template (.dotx) - format 13
        $doc.SaveAs($dotxPath, 13)
        Write-Host "  DOTX created: $dotxPath"

        # Export as PDF (format 17 = PDF)
        $doc.ExportAsFixedFormat($pdfPath, 17)
        Write-Host "  PDF created: $pdfPath"

        $doc.Close($false)
    }

    Write-Host "`nAll conversions complete!"
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace
}
finally {
    if ($word) {
        $word.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    }
}
