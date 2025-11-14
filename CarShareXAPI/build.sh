#!/bin/bash
set -e

echo "============================================================"
echo "   CarShareX Hybrid - Full Build (Linux)"
echo "============================================================"
echo

echo "[1/4] Building React frontend..."
cd ../front
if [ ! -f "package.json" ]; then
    echo "[ERROR] Front folder not found!"
    exit 1
fi

npm install --silent
npm run build
echo "[OK] Frontend built successfully"
echo

echo "[2/4] Copying frontend to wwwroot..."
cd ../CarShareXAPI
rm -rf wwwroot
cp -r ../front/dist wwwroot
echo "[OK] Frontend copied"
echo

echo "[3/4] Building C# backend..."
dotnet clean -c Release --nologo --verbosity quiet
dotnet restore --nologo --verbosity quiet

echo "Publishing (this may take a few minutes)..."
dotnet publish -c Release -r linux-x64 --self-contained true \
    /p:PublishSingleFile=true \
    /p:IncludeNativeLibrariesForSelfExtract=true \
    /p:EnableCompressionInSingleFile=true \
    /p:PublishReadyToRun=true \
    /p:PublishTrimmed=false \
    --nologo --verbosity quiet

echo "[OK] Backend built successfully"
echo

echo "[4/4] Checking result..."
EXE_PATH="bin/Release/net8.0/linux-x64/publish/CarShareX"
if [ -f "$EXE_PATH" ]; then
    chmod +x "$EXE_PATH"
    echo
    echo "============================================================"
    echo "           BUILD COMPLETED SUCCESSFULLY!"
    echo "============================================================"
    echo
    echo "Output file:"
    echo "   $(pwd)/$EXE_PATH"
    echo
    echo "How to run:"
    echo "   1. Copy CarShareX to any folder"
    echo "   2. Run: ./CarShareX"
    echo "   3. Open browser: http://localhost:5000"
    echo
    echo "Database will be created in:"
    echo "   ~/.local/share/CarShareX/carsharex.db"
    echo
else
    echo "[ERROR] File not found: $EXE_PATH"
    exit 1
fi
