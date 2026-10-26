$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$fontDir = Join-Path $dir "fonts"
$canonicalHindDir = Join-Path $dir "..\brandcenter\assets\digital\fonts"
$fontCache = Join-Path $env:LOCALAPPDATA "Microsoft\Windows\Fonts"
$fontRegistry = "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts"

$fonts = @(
    @{ File = "Inter-Regular.ttf"; Name = "Inter (TrueType)"; Source = $fontDir },
    @{ File = "Inter-Medium.ttf"; Name = "Inter Medium (TrueType)"; Source = $fontDir },
    @{ File = "Inter-SemiBold.ttf"; Name = "Inter SemiBold (TrueType)"; Source = $fontDir },
    @{ File = "NotoSansBengali-Regular.ttf"; Name = "Noto Sans Bengali (TrueType)"; Source = $fontDir },
    @{ File = "NotoSansBengali-Medium.ttf"; Name = "Noto Sans Bengali Medium (TrueType)"; Source = $fontDir },
    @{ File = "NotoSansBengali-SemiBold.ttf"; Name = "Noto Sans Bengali SemiBold (TrueType)"; Source = $fontDir },
    @{ File = "HindSiliguri-Regular.ttf"; Name = "Hind Siliguri (TrueType)"; Source = $canonicalHindDir },
    @{ File = "HindSiliguri-SemiBold.ttf"; Name = "Hind Siliguri SemiBold (TrueType)"; Source = $canonicalHindDir }
)

New-Item -ItemType Directory -Force -Path $fontCache | Out-Null
foreach ($font in $fonts) {
    $source = Join-Path $font.Source $font.File
    if (-not (Test-Path $source)) { throw "Required font not found: $source" }
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
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    foreach ($name in @("STFL_Letterhead_Bangla_Template", "STFL_Letterhead_English_Template")) {
        $docx = Join-Path $dir "$name.docx"
        $pdf = Join-Path $dir "$name.pdf"
        if (-not (Test-Path $docx)) { throw "Template not found: $docx" }
        $document = $word.Documents.Open($docx, $false, $false)
        try {
            $document.EmbedTrueTypeFonts = $true
            $document.SaveSubsetFonts = $true
            $document.Save()
            $document.ExportAsFixedFormat($pdf, 17)
        }
        finally {
            $document.Close($false)
            [System.Runtime.InteropServices.Marshal]::ReleaseComObject($document) | Out-Null
        }
        Write-Host "Embedded fonts and exported $pdf"
    }
}
finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
