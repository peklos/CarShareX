@echo off
setlocal enabledelayedexpansion

echo ========================================
echo CarShareX - WebView2Loader.dll Fix
echo ========================================
echo.
echo Searching for WebView2Loader.dll on your system...
echo.

REM Search in common locations
set "FOUND=0"
set "SOURCE_PATH="

REM Check Program Files (x86)
if exist "C:\Program Files (x86)\Microsoft\EdgeWebView\Application\" (
    echo Searching in Program Files (x86)...
    for /d %%D in ("C:\Program Files (x86)\Microsoft\EdgeWebView\Application\*") do (
        if exist "%%D\WebView2Loader.dll" (
            set "SOURCE_PATH=%%D\WebView2Loader.dll"
            set "FOUND=1"
            goto :found
        )
    )
)

REM Check Program Files
if exist "C:\Program Files\Microsoft\EdgeWebView\Application\" (
    echo Searching in Program Files...
    for /d %%D in ("C:\Program Files\Microsoft\EdgeWebView\Application\*") do (
        if exist "%%D\WebView2Loader.dll" (
            set "SOURCE_PATH=%%D\WebView2Loader.dll"
            set "FOUND=1"
            goto :found
        )
    )
)

REM Check Windows directory
if exist "C:\Windows\System32\WebView2Loader.dll" (
    set "SOURCE_PATH=C:\Windows\System32\WebView2Loader.dll"
    set "FOUND=1"
    goto :found
)

if exist "C:\Windows\SysWOW64\WebView2Loader.dll" (
    set "SOURCE_PATH=C:\Windows\SysWOW64\WebView2Loader.dll"
    set "FOUND=1"
    goto :found
)

:found
if "%FOUND%"=="1" (
    echo.
    echo ========================================
    echo Found WebView2Loader.dll!
    echo ========================================
    echo Location: !SOURCE_PATH!
    echo.
    echo Copying to current directory...

    copy "!SOURCE_PATH!" "%~dp0WebView2Loader.dll" >nul 2>&1

    if exist "%~dp0WebView2Loader.dll" (
        echo.
        echo ========================================
        echo SUCCESS!
        echo ========================================
        echo.
        echo WebView2Loader.dll has been copied to:
        echo %~dp0
        echo.
        echo You can now run CarShareX-1.0.0-windows.exe
        echo.
    ) else (
        echo.
        echo ERROR: Failed to copy the file.
        echo Please try running this script as Administrator.
        echo.
    )
) else (
    echo.
    echo ========================================
    echo ERROR: WebView2Loader.dll not found!
    echo ========================================
    echo.
    echo This means WebView2 Runtime is not installed on your system.
    echo.
    echo SOLUTION:
    echo 1. Install Microsoft Edge WebView2 Runtime
    echo    Download from: https://go.microsoft.com/fwlink/p/?LinkId=2124703
    echo.
    echo 2. After installation, run this script again
    echo.
    echo Alternatively, run: install-webview2.bat
    echo.
)

pause
