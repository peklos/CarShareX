@echo off
echo ========================================
echo CarShareX - WebView2Loader.dll Fixer
echo ========================================
echo.
echo This script will download the missing WebView2Loader.dll file
echo and place it next to CarShareX.exe
echo.
pause

echo.
echo Downloading WebView2Loader.dll...

REM Try to download WebView2Loader.dll for x64
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/MicrosoftEdge/WebView2Samples/raw/main/SampleApps/WebView2APISample/WebView2Loader.dll' -OutFile 'WebView2Loader.dll' -ErrorAction Stop}" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Failed to download from GitHub, trying alternative source...

    REM Alternative: Download from NuGet package cache location
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $url = 'https://raw.githubusercontent.com/microsoft/Microsoft-ui-xaml/main/tools/WebView2Loader.dll'; try { Invoke-WebRequest -Uri $url -OutFile 'WebView2Loader.dll' } catch { Write-Host 'Failed to download' }}" 2>nul
)

if exist "WebView2Loader.dll" (
    echo.
    echo ========================================
    echo Success! WebView2Loader.dll downloaded
    echo ========================================
    echo.
    echo The file has been placed in the current directory.
    echo You can now run CarShareX-1.0.0-windows.exe
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to download WebView2Loader.dll
    echo ========================================
    echo.
    echo Manual solution:
    echo 1. Make sure Microsoft Edge WebView2 Runtime is installed
    echo    Download from: https://go.microsoft.com/fwlink/p/?LinkId=2124703
    echo.
    echo 2. After installing WebView2 Runtime, the DLL should be available
    echo    system-wide and CarShareX should work.
    echo.
    echo Alternatively, you can:
    echo - Copy WebView2Loader.dll from: C:\Program Files (x86)\Microsoft\EdgeWebView\Application\[version]\
    echo - Place it in the same folder as CarShareX-1.0.0-windows.exe
    echo.
)

pause
