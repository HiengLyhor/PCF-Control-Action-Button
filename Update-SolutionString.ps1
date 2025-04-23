param(
    [string]$filePath = ".\src\Other\Solution.xml",
    [string]$versionPrefix = "1.0.0"  # Change this if you need a different prefix
)

# Verify file exists
if (-not (Test-Path $filePath)) {
    Write-Host "Error: File not found at $filePath" -ForegroundColor Red
    exit 1
}

# Read file content
$content = Get-Content -Path $filePath -Raw

# Find version matching the pattern
if ($content -match "<Version>$($versionPrefix)\.(\d+)</Version>") {
    $currentBuildNumber = [int]$Matches[1]
    $newBuildNumber = $currentBuildNumber + 1
    $currentVersion = "<Version>$versionPrefix.$currentBuildNumber</Version>"
    $newVersion = "<Version>$versionPrefix.$newBuildNumber</Version>"

    # Perform replacement
    $newContent = $content -replace [regex]::Escape($currentVersion), $newVersion
    
    # Create backup
    $backupPath = "$filePath.bak"
    Copy-Item $filePath $backupPath
    
    # Write changes
    Set-Content -Path $filePath -Value $newContent -NoNewline
    Write-Host "Successfully updated version from $versionPrefix.$currentBuildNumber to $versionPrefix.$newBuildNumber" -ForegroundColor Green
    Write-Host "Original file backed up to $backupPath" -ForegroundColor Cyan
} else {
    Write-Host "No version matching pattern '$versionPrefix.*' found in the file." -ForegroundColor Yellow
    Write-Host "Current version tag found:"
    $content | Select-String -Pattern "<Version>.*</Version>" | ForEach-Object {
        Write-Host ("- " + $_.Matches.Value) -ForegroundColor Yellow
    }
}