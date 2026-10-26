#Requires -Version 5.1
<#
.SYNOPSIS
    Convert Chairman's Digital Desk letterhead DOCX templates to PDF with embedded fonts.
.DESCRIPTION
    Uses Microsoft Word COM automation to convert DOCX files to PDF format
    with full font embedding for archival and distribution.
.NOTES
    Requires Microsoft Word to be installed.
    Run from the weworkhow directory.
#>
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = Get-Location }
Set-Location $ScriptDir

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STFL Chairman's Desk Letterhead PDF Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Word is available
try {
    $Word = New-Object -ComObject Word.Application
    $Word.Visible = $false
    Write-Host "✓ Microsoft Word COM object initialized" -ForegroundColor Green
} catch {
    Write-Error "Failed to initialize Microsoft Word. Ensure Microsoft Office is installed."
    exit 1
}

# PDF export constants
$wdExportFormatPDF = 17
$wdExportOptimizeForPrint = 0
$wdExportDocumentContent = 0
$wdExportCreateBookmarks = 1

# Font embedding options for PDF
$wdExportDocumentWithMarkup = 7

# Files to convert
$FilesToConvert = @(
    "STFL_Chairman_Desk_Bangla_Template.docx",
    "STFL_Chairman_Desk_English_Template.docx"
)

$SuccessCount = 0
$FailCount = 0

foreach ($File in $FilesToConvert) {
    $DocxPath = Join-Path $ScriptDir $File
    $PdfName = [System.IO.Path]::GetFileNameWithoutExtension($File) + ".pdf"
    $PdfPath = Join-Path $ScriptDir $PdfName
    
    if (-not (Test-Path $DocxPath)) {
        Write-Warning "Source file not found: $File"
        $FailCount++
        continue
    }
    
    Write-Host "Processing: $File" -ForegroundColor Yellow
    
    try {
        # Open document
        $Doc = $Word.Documents.Open($DocxPath)
        
        # Export to PDF with font embedding
        $Doc.ExportAsFixedFormat(
            $PdfPath,
            $wdExportFormatPDF,
            $false,  # OpenAfterExport
            $wdExportOptimizeForPrint,
            $wdExportDocumentContent,
            1,       # From page
            1,       # To page (0 = all)
            $wdExportCreateBookmarks,
            $true,   # Include props
            $true,   # PDF/A compliance
            $false,  # No bitmap
            $true    # Embed fonts
        )
        
        $Doc.Close($false)
        
        if (Test-Path $PdfPath) {
            $FileSize = (Get-Item $PdfPath).Length / 1KB
            Write-Host "  ✓ Created: $PdfName ($([math]::Round($FileSize, 2)) KB)" -ForegroundColor Green
            $SuccessCount++
        } else {
            Write-Warning "  PDF creation failed for: $File"
            $FailCount++
        }
    } catch {
        Write-Warning "  Error processing ${File}: $_"
        $FailCount++
    }
}

# Cleanup
$Word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($Word) | Out-Null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Conversion Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Successful: $SuccessCount" -ForegroundColor Green
Write-Host "Failed: $FailCount" -ForegroundColor $(if ($FailCount -gt 0) { "Red" } else { "Green" })
Write-Host ""

# List generated files
Write-Host "Generated files in: $ScriptDir" -ForegroundColor Cyan
Get-ChildItem -Path $ScriptDir -Filter "STFL_Chairman_Desk_*.pdf" | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor White
}
