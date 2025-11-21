@echo off
chcp 65001 >nul
echo ============================================================
echo    CarShareX Backend - API Only Build
echo ============================================================
echo.

echo [1/3] Cleaning previous build...
dotnet clean -c Release --nologo --verbosity quiet
if errorlevel 1 (
    echo [ERROR] Clean failed
    exit /b 1
)
echo [OK] Cleaned
echo.

echo [2/3] Restoring dependencies...
dotnet restore --nologo --verbosity quiet
if errorlevel 1 (
    echo [ERROR] Restore failed
    exit /b 1
)
echo [OK] Dependencies restored
echo.

echo [3/3] Publishing backend (this may take a few minutes)...
dotnet publish -c Release -r win-x64 --self-contained true ^
    /p:PublishSingleFile=true ^
    /p:IncludeNativeLibrariesForSelfExtract=true ^
    /p:EnableCompressionInSingleFile=true ^
    /p:PublishReadyToRun=true ^
    /p:PublishTrimmed=false ^
    --nologo --verbosity quiet

if errorlevel 1 (
    echo [ERROR] Publish failed
    exit /b 1
)

echo [OK] Backend built successfully
echo.

set EXE_PATH=bin\Release\net8.0\win-x64\publish\CarShareX.exe
if exist "%EXE_PATH%" (
    echo.
    echo ============================================================
    echo            BUILD COMPLETED SUCCESSFULLY!
    echo ============================================================
    echo.
    echo Backend executable:
    echo    %CD%\%EXE_PATH%
    echo.
    echo How to use:
    echo    1. Run CarShareX.exe - это запустит backend API на http://localhost:5000
    echo    2. Отдельно соберите и запустите Tauri frontend:
    echo       cd ..\front
    echo       npm run tauri:build
    echo    3. Запустите собранный Tauri .exe из front\src-tauri\target\release\
    echo.
    echo Database will be created in:
    echo    %%APPDATA%%\CarShareX\carsharex.db
    echo.
    echo Swagger UI available at:
    echo    http://localhost:5000/swagger
    echo.
) else (
    echo [ERROR] File not found: %EXE_PATH%
    exit /b 1
)
