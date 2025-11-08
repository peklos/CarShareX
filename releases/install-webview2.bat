@echo off
echo ========================================
echo CarShareX - WebView2 Installer
echo ========================================
echo.
echo This script will download and install Microsoft Edge WebView2 Runtime
echo Required for CarShareX to run on Windows
echo.
pause

echo.
echo Downloading WebView2 Runtime...
powershell -Command "& {Invoke-WebRequest -Uri 'https://go.microsoft.com/fwlink/p/?LinkId=2124703' -OutFile '%TEMP%\MicrosoftEdgeWebview2Setup.exe'}"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to download WebView2 Runtime
    echo Please check your internet connection and try again
    echo.
    echo Alternative: Download manually from:
    echo https://go.microsoft.com/fwlink/p/?LinkId=2124703
    echo.
    pause
    exit /b 1
)

echo.
echo Installing WebView2 Runtime...
echo Please wait, this may take a few minutes...
start /wait "" "%TEMP%\MicrosoftEdgeWebview2Setup.exe" /silent /install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Installation may have failed or was cancelled
    echo Please run the installer manually: %TEMP%\MicrosoftEdgeWebview2Setup.exe
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo You can now run CarShareX-1.0.0-windows.exe
echo.
pause
