Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"
$docx = "C:\Users\ShoebTahseen\Desktop\stfl\weworkhow\STFL_Meeting_Minutes_Template.docx"
$word = New-Object -ComObject Word.Application
$word.Visible = $true
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open($docx, $false, $false)
    Write-Host "OPENED OK"
    Start-Sleep -Seconds 2
    $doc.Close($false)
} catch {
    Write-Host ("FAILED: " + $_.Exception.Message)
}
Start-Sleep -Seconds 1
# Screenshot the screen to see any dialog
$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bmp = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
$bmp.Save("C:\Users\ShoebTahseen\Desktop\stfl\weworkhow\word_diag.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Host "Screenshot saved"
$word.Quit()
