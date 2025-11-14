@echo off
chcp 65001 >nul
echo ============================================================
echo    CarShareX Hybrid - Full Build (DEBUG MODE)
echo ============================================================
echo.

echo [INFO] Checking dotnet installation...
dotnet --version
if errorlevel 1 (
    echo.
    echo [ERROR] .NET SDK not found!
    echo Please install .NET 8.0 SDK from:
    echo https://dotnet.microsoft.com/download/dotnet/8.0
    echo.
    pause
    exit /b 1
)
echo [OK] .NET SDK found
echo.

echo [INFO] Checking npm installation...
npm --version
if errorlevel 1 (
    echo.
    echo [ERROR] npm not found!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo [OK] npm found
echo.

echo [1/4] Building React frontend...
cd ..\front
if not exist "package.json" (
    echo [ERROR] Front folder not found!
    pause
    exit /b 1
)

echo [INFO] Installing npm dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [INFO] Building frontend...
call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    pause
    exit /b 1
)

echo [OK] Frontend built successfully
echo.

echo [2/4] Copying frontend to wwwroot...
cd ..\CarShareXAPI
if exist "wwwroot" rmdir /s /q wwwroot
xcopy "..\front\dist" "wwwroot\" /E /I /Q /Y
if errorlevel 1 (
    echo [ERROR] Failed to copy frontend
    pause
    exit /b 1
)
echo [OK] Frontend copied
echo.

echo [3/4] Building C# backend...
echo [INFO] Cleaning previous builds...
dotnet clean -c Release
if errorlevel 1 (
    echo [ERROR] Clean failed
    pause
    exit /b 1
)

echo [INFO] Restoring NuGet packages...
dotnet restore
if errorlevel 1 (
    echo [ERROR] Restore failed
    pause
    exit /b 1
)

echo [INFO] Publishing (this may take 2-5 minutes)...
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true /p:IncludeNativeLibrariesForSelfExtract=true /p:EnableCompressionInSingleFile=true /p:PublishReadyToRun=true /p:PublishTrimmed=false
if errorlevel 1 (
    echo.
    echo [ERROR] Publish failed! Check errors above.
    echo.
    pause
    exit /b 1
)

echo [OK] Backend built successfully
echo.

echo [4/4] Checking result...
set EXE_PATH=bin\Release\net8.0\win-x64\publish\CarShareX.exe
if exist "%EXE_PATH%" (
    echo.
    echo ============================================================
    echo            BUILD COMPLETED SUCCESSFULLY!
    echo ============================================================
    echo.
    echo Output file:
    echo    %CD%\%EXE_PATH%
    echo.
    echo File size:
    dir "%EXE_PATH%" | find "CarShareX.exe"
    echo.
    echo How to run:
    echo    1. Double-click: %EXE_PATH%
    echo    2. Open browser: http://localhost:5000
    echo.
    echo Database will be created in:
    echo    %%APPDATA%%\CarShareX\carsharex.db
    echo.
) else (
    echo [ERROR] File not found: %EXE_PATH%
    echo Something went wrong during build!
    pause
    exit /b 1
)

echo.
echo Press any key to exit...
pause >nul
