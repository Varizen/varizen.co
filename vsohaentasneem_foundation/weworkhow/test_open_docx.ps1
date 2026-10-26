param([string]$Pattern = "bisect_*.docx")
$ErrorActionPreference = "Continue"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Get-ChildItem (Join-Path $dir $Pattern) | ForEach-Object {
    try {
        $doc = $word.Documents.Open($_.FullName, $false, $true)
        Write-Host "OK   : $($_.Name)"
        $doc.Close($false)
    } catch {
        Write-Host "FAIL : $($_.Name) - $($_.Exception.Message.Split("`n")[0])"
    }
}
$word.Quit()
