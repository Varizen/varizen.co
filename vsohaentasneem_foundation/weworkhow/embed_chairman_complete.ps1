$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$fontDir = Join-Path $dir "fonts"
$canonicalHindDir = Join-Path $dir "..\brandcenter\assets\digital\fonts"
$fontCache = Join-Path $env:LOCALAPPDATA "Microsoft\Windows\Fonts"
$fontRegistry = "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts"

# Define all required fonts
$fonts = @(
    @{ File = "Inter-Regular.ttf"; Name = "Inter (TrueType)"; Source = $fontDir },
    @{ File = "Inter-Medium.ttf"; Name = "Inter Medium (TrueType)"; Source = $fontDir },
    @{ File = "Inter-SemiBold.ttf"; Name = "Inter SemiBold (TrueType)"; Source = $fontDir },
    @{ File = "NotoSansBengali-Regular.ttf"; Name = "Noto Sans Bengali (TrueType)"; Source = $fontDir },
    @{ File = "NotoSansBengali-Medium.ttf"; Name = "Noto Sans Bengali Medium (TrueType)"; Source = $fontDir },
    @{ File = "NotoSansBengali-SemiBold.ttf"; Name = "Noto Sans Bengali SemiBold (TrueType)"; Source = $fontDir }
)

# Add Hind Siliguri fonts if available
$hindRegular = Join-Path $canonicalHindDir "HindSiliguri-Regular.ttf"
$hindSemiBold = Join-Path $canonicalHindDir "HindSiliguri-SemiBold.ttf"
if (Test-Path $hindRegular) {
    $fonts += @{ File = "HindSiliguri-Regular.ttf"; Name = "Hind Siliguri (TrueType)"; Source = $canonicalHindDir }
}
if (Test-Path $hindSemiBold) {
    $fonts += @{ File = "HindSiliguri-SemiBold.ttf"; Name = "Hind Siliguri SemiBold (TrueType)"; Source = $canonicalHindDir }
}

Write-Host "Registering fonts for embedding..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path $fontCache | Out-Null
foreach ($font in $fonts) {
    $source = Join-Path $font.Source $font.File
    if (-not (Test-Path $source)) { 
        Write-Warning "Required font not found: $source"
        continue
    }
    $destination = Join-Path $fontCache $font.File
    $sourceHash = (Get-FileHash $source).Hash
    if ((Test-Path $destination) -and (Get-FileHash $destination).Hash -ne $sourceHash) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($font.File)
        $extension = [System.IO.Path]::GetExtension($font.File)
        $destination = Join-Path $fontCache "$baseName-STFL$extension"
    }
    if (-not (Test-Path $destination)) {
        Copy-Item $source $destination
    }
    elseif ((Get-FileHash $destination).Hash -ne $sourceHash) {
        throw "A conflicting font file already exists and cannot be replaced: $destination"
    }
    New-ItemProperty -Path $fontRegistry -Name $font.Name -Value $destination -PropertyType String -Force | Out-Null
    Write-Host "  Registered: $($font.Name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Converting Chairman's Digital Desk templates to PDF..." -ForegroundColor Cyan

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    foreach ($name in @("STFL_Chairman_Desk_Bangla_Template", "STFL_Chairman_Desk_English_Template")) {
        $docx = Join-Path $dir "$name.docx"
        $pdf = Join-Path $dir "$name.pdf"
        if (-not (Test-Path $docx)) { 
            Write-Warning "Template not found: $docx"
            continue
        }
        Write-Host "Processing: $name.docx" -ForegroundColor Yellow
        $document = $word.Documents.Open($docx, $false, $false)
        try {
            $document.EmbedTrueTypeFonts = $true
            $document.SaveSubsetFonts = $true
            $document.Save()
            $document.ExportAsFixedFormat($pdf, 17)
            Write-Host "  Exported: $name.pdf" -ForegroundColor Green
        }
        catch {
            Write-Warning "  Error exporting $name.pdf : $_"
        }
        finally {
            $document.Close($false)
            [System.Runtime.InteropServices.Marshal]::ReleaseComObject($document) | Out-Null
        }
    }
}
finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chairman's Digital Desk PDF Export Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Get-ChildItem -Path $dir -Filter "STFL_Chairman_Desk_*.pdf" | ForEach-Object {
    Write-Host "  Generated: $($_.Name) ($([math]::Round($_.Length/1KB, 2)) KB)" -ForegroundColor White
}
