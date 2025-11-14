$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   CarShareX Hybrid - Full Build (PowerShell)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host

Write-Host "[1/4] Building React frontend..." -ForegroundColor Yellow
Set-Location -Path "..\front"
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] Front folder not found!" -ForegroundColor Red
    exit 1
}

npm install --silent
npm run build
Write-Host "[OK] Frontend built successfully" -ForegroundColor Green
Write-Host

Write-Host "[2/4] Copying frontend to wwwroot..." -ForegroundColor Yellow
Set-Location -Path "..\CarShareXAPI"
if (Test-Path "wwwroot") {
    Remove-Item -Recurse -Force "wwwroot"
}
Copy-Item -Recurse -Path "..\front\dist" -Destination "wwwroot"
Write-Host "[OK] Frontend copied" -ForegroundColor Green
Write-Host

Write-Host "[3/4] Building C# backend..." -ForegroundColor Yellow
dotnet clean -c Release --nologo --verbosity quiet
dotnet restore --nologo --verbosity quiet

Write-Host "Publishing (this may take a few minutes)..." -ForegroundColor Yellow
dotnet publish -c Release -r win-x64 --self-contained true `
    /p:PublishSingleFile=true `
    /p:IncludeNativeLibrariesForSelfExtract=true `
    /p:EnableCompressionInSingleFile=true `
    /p:PublishReadyToRun=true `
    /p:PublishTrimmed=false `
    --nologo --verbosity quiet

Write-Host "[OK] Backend built successfully" -ForegroundColor Green
Write-Host

Write-Host "[4/4] Checking result..." -ForegroundColor Yellow
$exePath = "bin\Release\net8.0\win-x64\publish\CarShareX.exe"
if (Test-Path $exePath) {
    Write-Host
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "           BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host
    Write-Host "Output file:" -ForegroundColor Cyan
    Write-Host "   $(Get-Location)\$exePath" -ForegroundColor White
    Write-Host
    Write-Host "How to run:" -ForegroundColor Cyan
    Write-Host "   1. Copy CarShareX.exe to any folder" -ForegroundColor White
    Write-Host "   2. Run it by double-click" -ForegroundColor White
    Write-Host "   3. Open browser: http://localhost:5000" -ForegroundColor White
    Write-Host
    Write-Host "Database will be created in:" -ForegroundColor Cyan
    Write-Host "   $env:APPDATA\CarShareX\carsharex.db" -ForegroundColor White
    Write-Host
} else {
    Write-Host "[ERROR] File not found: $exePath" -ForegroundColor Red
    exit 1
}
