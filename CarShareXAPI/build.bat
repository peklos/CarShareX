@echo off
chcp 65001 >nul
echo ============================================================
echo    CarShareX Hybrid - Full Build
echo ============================================================
echo.

echo [1/4] Building React frontend...
cd ..\front
if not exist "package.json" (
    echo [ERROR] Front folder not found!
    exit /b 1
)

call npm install --silent
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    exit /b 1
)

echo [OK] Frontend built successfully
echo.

echo [2/4] Copying frontend to wwwroot...
cd ..\CarShareXAPI
if exist "wwwroot" rmdir /s /q wwwroot
xcopy "..\front\dist" "wwwroot\" /E /I /Q /Y >nul
echo [OK] Frontend copied
echo.

echo [3/4] Building C# backend...
dotnet clean -c Release --nologo --verbosity quiet
if errorlevel 1 (
    echo [ERROR] Clean failed
    exit /b 1
)

dotnet restore --nologo --verbosity quiet
if errorlevel 1 (
    echo [ERROR] Restore failed
    exit /b 1
)

echo Publishing (this may take a few minutes)...
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true /p:IncludeNativeLibrariesForSelfExtract=true /p:EnableCompressionInSingleFile=true /p:PublishReadyToRun=true /p:PublishTrimmed=false --nologo --verbosity quiet
if errorlevel 1 (
    echo [ERROR] Publish failed
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
    echo How to run:
    echo    1. Copy CarShareX.exe to any folder
    echo    2. Run it by double-click
    echo    3. Open browser: http://localhost:5000
    echo.
    echo Database will be created in:
    echo    %%APPDATA%%\CarShareX\carsharex.db
    echo.
) else (
    echo [ERROR] File not found: %EXE_PATH%
    exit /b 1
)
