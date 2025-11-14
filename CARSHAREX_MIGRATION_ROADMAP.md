# 🚀 Roadmap: Миграция CarShareX на React + C# + SQLite

> **Цель:** Перенести весь проект с Python/FastAPI на C# ASP.NET Core + SQLite, собрать в единый .exe файл

---

## 📋 Общий план миграции

### Этап 1: Подготовка C# проекта ✅ (ЧАСТИЧНО ГОТОВО)

**Создано:**
- ✅ `CarShareXAPI/CarShareXAPI.csproj` - проект файл
- ✅ `CarShareXAPI/Models/Models.cs` - все 10 моделей данных
- ✅ `CarShareXAPI/Data/CarShareContext.cs` - DbContext с индексами
- ✅ `CarShareXAPI/Data/DatabaseInitializer.cs` - инициализация тестовых данных

**Нужно создать:**
1. `CarShareXAPI/Program.cs` - точка входа приложения
2. `CarShareXAPI/appsettings.json` - конфигурация
3. `CarShareXAPI/.gitignore` - игнорируемые файлы

---

### Этап 2: Миграция всех API контроллеров

**Список роутеров для переноса** (из `back/routers/`):

#### 📁 Клиентские API (7 контроллеров)
1. ✅ `auth.py` → `Controllers/AuthController.cs`
2. ✅ `profile.py` → `Controllers/ProfileController.cs`
3. ✅ `vehicles.py` → `Controllers/VehiclesController.cs`
4. ✅ `bookings.py` → `Controllers/BookingsController.cs`
5. ✅ `transactions.py` → `Controllers/TransactionsController.cs`
6. ✅ `tariffs.py` → `Controllers/TariffsController.cs`
7. ✅ `parking_zones.py` → `Controllers/ParkingZonesController.cs`

#### 📁 Админские API (11 контроллеров)
8. ✅ `employee_auth.py` → `Controllers/EmployeeAuthController.cs`
9. ✅ `admin_users.py` → `Controllers/AdminUsersController.cs`
10. ✅ `admin_vehicles.py` → `Controllers/AdminVehiclesController.cs`
11. ✅ `admin_bookings.py` → `Controllers/AdminBookingsController.cs`
12. ✅ `admin_incidents.py` → `Controllers/AdminIncidentsController.cs`
13. ✅ `admin_employees.py` → `Controllers/AdminEmployeesController.cs`
14. ✅ `admin_tariffs.py` → `Controllers/AdminTariffsController.cs`
15. ✅ `admin_parking.py` → `Controllers/AdminParkingController.cs`
16. ✅ `admin_branches.py` → `Controllers/AdminBranchesController.cs`
17. ✅ `admin_stats.py` → `Controllers/AdminStatsController.cs`
18. ✅ `update_images.py` → `Controllers/UpdateImagesController.cs`

---

### Этап 3: Настройка React фронтенда

**Файлы для модификации:**
1. `front/.env.production` - изменить VITE_API_URL на localhost:5000
2. `front/src/utils/api.ts` (или аналог) - проверить базовый URL API
3. Убедиться что все axios запросы совместимы с C# API

---

### Этап 4: Создание build скриптов

**Создать файлы:**
1. `CarShareXAPI/build.bat` - сборка для Windows (bat)
2. `CarShareXAPI/build.ps1` - сборка для Windows (PowerShell)
3. `CarShareXAPI/build.sh` - сборка для Linux
4. `CarShareXAPI/README.md` - инструкции по сборке

---

## 🔧 Детальные инструкции для каждого этапа

---

## ЭТАП 1: Создать Program.cs

**Файл:** `CarShareXAPI/Program.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using CarShareXAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Настройка базы данных SQLite
var dbPath = Path.Combine(
    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
    "CarShareX",
    "carsharex.db"
);

// Создаем папку если её нет
Directory.CreateDirectory(Path.GetDirectoryName(dbPath)!);

builder.Services.AddDbContext<CarShareContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// CORS для React фронтенда
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() {
        Title = "CarShareX API",
        Version = "1.0.0",
        Description = "API для каршеринг-приложения CarShareX"
    });
});

var app = builder.Build();

// Инициализация БД
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<CarShareContext>();
    context.Database.EnsureCreated();
    DatabaseInitializer.Initialize(context);
}

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CarShareX API v1"));

app.UseCors();

// Статические файлы (React build)
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// Fallback для React Router
app.MapFallbackToFile("index.html");

Console.WriteLine("✅ CarShareX API работает");
Console.WriteLine($"📊 Swagger: http://localhost:5000/swagger");
Console.WriteLine($"🗄️  База данных: {dbPath}");

app.Run("http://0.0.0.0:5000");
```

---

## ЭТАП 2.1: Клиентские контроллеры

### 1. AuthController.cs

**Файл:** `CarShareXAPI/Controllers/AuthController.cs`

**Прочитай:** `back/routers/auth.py`

**Перенеси endpoints:**
- `POST /api/auth/register` - регистрация пользователя
- `POST /api/auth/login` - вход пользователя
- `GET /api/auth/me/{user_id}` - получить данные пользователя

**Формат ответа:** JSON с полями из модели User (без password!)

---

### 2. ProfileController.cs

**Файл:** `CarShareXAPI/Controllers/ProfileController.cs`

**Прочитай:** `back/routers/profile.py`

**Перенеси endpoints:**
- `GET /api/profile/{user_id}` - профиль пользователя
- `PUT /api/profile/{user_id}` - обновить профиль
- `POST /api/profile/{user_id}/top-up` - пополнить баланс

---

### 3. VehiclesController.cs

**Файл:** `CarShareXAPI/Controllers/VehiclesController.cs`

**Прочитай:** `back/routers/vehicles.py`

**Перенеси endpoints:**
- `GET /api/vehicles` - список авто с фильтрами (type, brand, status, parking_zone_id)
- `GET /api/vehicles/{id}` - детали автомобиля
- Include связи: ParkingZone, Tariff

---

### 4. BookingsController.cs

**Файл:** `CarShareXAPI/Controllers/BookingsController.cs`

**Прочитай:** `back/routers/bookings.py`

**Перенеси endpoints:**
- `POST /api/bookings` - создать бронирование
- `GET /api/bookings/my/{user_id}` - мои бронирования
- `GET /api/bookings/{id}` - детали бронирования
- `POST /api/bookings/{id}/start` - начать поездку
- `POST /api/bookings/{id}/complete` - завершить поездку
- `DELETE /api/bookings/{id}` - отменить бронирование

**Важная логика:**
- При старте: проверка баланса, смена статуса авто на "in_use"
- При завершении: расчёт стоимости, списание с баланса, создание транзакции
- Формула: `cost = duration_hours * tariff.price_per_hour` или `duration_minutes * tariff.price_per_minute`

---

### 5. TransactionsController.cs

**Файл:** `CarShareXAPI/Controllers/TransactionsController.cs`

**Прочитай:** `back/routers/transactions.py`

**Перенеси endpoints:**
- `GET /api/transactions/my/{user_id}` - история транзакций
- `GET /api/transactions/{id}` - детали транзакции

---

### 6. TariffsController.cs

**Файл:** `CarShareXAPI/Controllers/TariffsController.cs`

**Прочитай:** `back/routers/tariffs.py`

**Перенеси endpoints:**
- `GET /api/tariffs` - список тарифов

---

### 7. ParkingZonesController.cs

**Файл:** `CarShareXAPI/Controllers/ParkingZonesController.cs`

**Прочитай:** `back/routers/parking_zones.py`

**Перенеси endpoints:**
- `GET /api/parking-zones` - список парковок
- `GET /api/parking-zones/{id}` - детали парковки

---

## ЭТАП 2.2: Админские контроллеры

### 8. EmployeeAuthController.cs

**Файл:** `CarShareXAPI/Controllers/EmployeeAuthController.cs`

**Прочитай:** `back/routers/employee_auth.py`

**Перенеси endpoints:**
- `POST /api/admin/auth/login` - вход сотрудника
- `GET /api/admin/auth/me/{employee_id}` - данные сотрудника
- Include: Role, Branch

---

### 9. AdminUsersController.cs

**Файл:** `CarShareXAPI/Controllers/AdminUsersController.cs`

**Прочитай:** `back/routers/admin_users.py`

**Перенеси endpoints:**
- `GET /api/admin/users` - все пользователи
- `GET /api/admin/users/{id}` - детали пользователя
- `PUT /api/admin/users/{id}` - обновить пользователя
- `DELETE /api/admin/users/{id}` - удалить пользователя
- `GET /api/admin/users/{id}/bookings` - бронирования пользователя

---

### 10. AdminVehiclesController.cs

**Файл:** `CarShareXAPI/Controllers/AdminVehiclesController.cs`

**Прочитай:** `back/routers/admin_vehicles.py`

**Перенеси endpoints:**
- `GET /api/admin/vehicles` - все авто
- `POST /api/admin/vehicles` - создать авто
- `PUT /api/admin/vehicles/{id}` - обновить авто
- `DELETE /api/admin/vehicles/{id}` - удалить авто
- `PATCH /api/admin/vehicles/{id}/status` - изменить статус

---

### 11. AdminBookingsController.cs

**Файл:** `CarShareXAPI/Controllers/AdminBookingsController.cs`

**Прочитай:** `back/routers/admin_bookings.py`

**Перенеси endpoints:**
- `GET /api/admin/bookings` - все бронирования
- `GET /api/admin/bookings/{id}` - детали
- `DELETE /api/admin/bookings/{id}` - удалить

---

### 12. AdminIncidentsController.cs

**Файл:** `CarShareXAPI/Controllers/AdminIncidentsController.cs`

**Прочитай:** `back/routers/admin_incidents.py`

**Перенеси endpoints:**
- `GET /api/admin/incidents` - все инциденты
- `POST /api/admin/incidents` - создать инцидент
- `PUT /api/admin/incidents/{id}` - обновить инцидент
- `DELETE /api/admin/incidents/{id}` - удалить инцидент

---

### 13. AdminEmployeesController.cs

**Файл:** `CarShareXAPI/Controllers/AdminEmployeesController.cs`

**Прочитай:** `back/routers/admin_employees.py`

**Перенеси endpoints:**
- `GET /api/admin/employees` - все сотрудники
- `POST /api/admin/employees` - создать сотрудника
- `PUT /api/admin/employees/{id}` - обновить
- `DELETE /api/admin/employees/{id}` - удалить

---

### 14. AdminTariffsController.cs

**Файл:** `CarShareXAPI/Controllers/AdminTariffsController.cs`

**Прочитай:** `back/routers/admin_tariffs.py`

**Перенеси endpoints:**
- `GET /api/admin/tariffs` - все тарифы
- `POST /api/admin/tariffs` - создать тариф
- `PUT /api/admin/tariffs/{id}` - обновить
- `DELETE /api/admin/tariffs/{id}` - удалить

---

### 15. AdminParkingController.cs

**Файл:** `CarShareXAPI/Controllers/AdminParkingController.cs`

**Прочитай:** `back/routers/admin_parking.py`

**Перенеси endpoints:**
- `GET /api/admin/parking-zones` - все парковки
- `POST /api/admin/parking-zones` - создать
- `PUT /api/admin/parking-zones/{id}` - обновить
- `DELETE /api/admin/parking-zones/{id}` - удалить

---

### 16. AdminBranchesController.cs

**Файл:** `CarShareXAPI/Controllers/AdminBranchesController.cs`

**Прочитай:** `back/routers/admin_branches.py`

**Перенеси endpoints:**
- `GET /api/admin/branches` - все филиалы
- `POST /api/admin/branches` - создать
- `PUT /api/admin/branches/{id}` - обновить
- `DELETE /api/admin/branches/{id}` - удалить

---

### 17. AdminStatsController.cs

**Файл:** `CarShareXAPI/Controllers/AdminStatsController.cs`

**Прочитай:** `back/routers/admin_stats.py`

**Перенеси endpoints:**
- `GET /api/admin/stats/overview` - общая статистика
- `GET /api/admin/stats/revenue` - доходы
- `GET /api/admin/stats/vehicles` - статистика по авто
- `GET /api/admin/stats/users` - статистика по пользователям
- `GET /api/admin/stats/popular-vehicles` - популярные авто
- `GET /api/admin/stats/active-bookings` - активные бронирования

**Важно:** Используй EF Core запросы для агрегации (Count, Sum, Average, GroupBy)

---

### 18. UpdateImagesController.cs

**Файл:** `CarShareXAPI/Controllers/UpdateImagesController.cs`

**Прочитай:** `back/routers/update_images.py`

**Перенеси endpoints:**
- `POST /api/admin/update-vehicle-images` - обновить картинки авто

---

## ЭТАП 3: Создать appsettings.json

**Файл:** `CarShareXAPI/appsettings.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## ЭТАП 4: Создать .gitignore

**Файл:** `CarShareXAPI/.gitignore`

```
bin/
obj/
*.db
*.db-shm
*.db-wal
wwwroot/
.vs/
.vscode/
*.user
*.suo
```

---

## ЭТАП 5: Настроить React фронтенд

### Обновить .env.production

**Файл:** `front/.env.production`

```
VITE_API_URL=
```

**Объяснение:** Пустое значение = использовать текущий хост (т.к. фронт и API в одном exe)

---

### Проверить axios baseURL

**Файл:** `front/src/utils/api.ts` (или аналогичный)

Убедись что axios использует:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});
```

---

## ЭТАП 6: Создать build скрипты

### build.bat (Windows)

**Файл:** `CarShareXAPI/build.bat`

```bat
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
```

---

### build.sh (Linux)

**Файл:** `CarShareXAPI/build.sh`

```bash
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
```

---

### build.ps1 (PowerShell)

**Файл:** `CarShareXAPI/build.ps1`

```powershell
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
```

---

## ЭТАП 7: Создать README для C# проекта

**Файл:** `CarShareXAPI/README.md`

```markdown
# 🚀 CarShareX Hybrid - Гибридное приложение

Современная каршеринг-система с **React** фронтендом и **C# ASP.NET Core** бэкендом, упакованная в один исполняемый файл!

## ✨ Особенности

- **Frontend**: React + TypeScript + Redux + Tailwind CSS
- **Backend**: C# ASP.NET Core Web API
- **Database**: SQLite (создается автоматически)
- **Упаковка**: Все в один .exe файл (~80-120 MB)
- **Запуск**: Просто двойной клик, никаких дополнительных установок!

## 📋 Требования для сборки

### Windows
- .NET 8.0 SDK: https://dotnet.microsoft.com/download/dotnet/8.0
- Node.js 18+: https://nodejs.org/
- PowerShell или CMD

### Linux
- .NET 8.0 SDK
- Node.js 18+
- Bash

## 🛠️ Сборка приложения

### Windows (Рекомендуется)

**Вариант 1: BAT файл (самый надежный)**
```cmd
cd CarShareXAPI
build.bat
```

**Вариант 2: PowerShell**
```powershell
cd CarShareXAPI
.\build.ps1
```

### Linux

```bash
cd CarShareXAPI
chmod +x build.sh
./build.sh
```

Скрипт автоматически:
1. ✅ Соберет React фронтенд
2. ✅ Скопирует его в wwwroot
3. ✅ Соберет C# бэкенд со встроенным фронтендом
4. ✅ Создаст один .exe/.bin файл

## 📦 Готовый файл

После сборки найдете здесь:

**Windows:**
```
CarShareXAPI/bin/Release/net8.0/win-x64/publish/CarShareX.exe
```

**Linux:**
```
CarShareXAPI/bin/Release/net8.0/linux-x64/publish/CarShareX
```

## 🚀 Запуск приложения

### Вариант 1: Двойной клик (Windows)
Просто запустите `CarShareX.exe` двойным кликом!

### Вариант 2: Командная строка
```bash
./CarShareX.exe  # Windows
./CarShareX      # Linux
```

Приложение запустится на **http://localhost:5000**

## 🌐 Использование

После запуска:

1. **Веб-интерфейс**: http://localhost:5000
2. **API Документация (Swagger)**: http://localhost:5000/swagger

### Тестовые данные

**Пользователь:**
- Email: `morozov@mail.ru`
- Пароль: `user123`

**Сотрудник (Админ):**
- Email: `ivanov@carsharex.ru`
- Пароль: `admin123`

**Менеджер:**
- Email: `petrova@carsharex.ru`
- Пароль: `manager123`

## 💾 База данных

База данных SQLite создается автоматически при первом запуске в:

```
Windows: C:\Users\{имя}\AppData\Roaming\CarShareX\carsharex.db
Linux: ~/.local/share/CarShareX/carsharex.db
```

**Преимущества:**
- ✅ Данные сохраняются между запусками
- ✅ Можно делать резервные копии
- ✅ Можно удалить БД для сброса к исходному состоянию

## 📂 Структура проекта

```
CarShareXAPI/
├── Controllers/         # API контроллеры (18 файлов)
├── Data/               # Контекст БД и инициализация
│   ├── CarShareContext.cs
│   └── DatabaseInitializer.cs
├── Models/             # Модели данных
│   └── Models.cs
├── wwwroot/            # React фронтенд (генерируется при сборке)
├── Program.cs          # Точка входа
├── appsettings.json    # Конфигурация
├── build.bat           # Скрипт сборки (Windows)
├── build.ps1           # Скрипт сборки (PowerShell)
├── build.sh            # Скрипт сборки (Linux)
└── README.md           # Этот файл
```

## 🎯 Преимущества данного подхода

### ✅ Для пользователей
- Один .exe файл - легко распространять
- Не нужно устанавливать .NET Runtime, Node.js
- Работает "из коробки"
- Современный веб-интерфейс

### ✅ Для разработчиков
- React + Redux - современный фронтенд
- C# - мощный и типизированный бэкенд
- SQLite - простая и надежная БД
- REST API - легко расширять
- Swagger - автодокументирование API

## 📝 Лицензия

© 2024 CarShareX Team

## 🐛 Поддержка

При возникновении проблем:
1. Проверьте логи приложения
2. Проверьте, что порт 5000 свободен
3. Создайте issue в репозитории

---

**Версия:** 2.0.0 (C# + SQLite)
**Последнее обновление:** Ноябрь 2024
```

---

## 📝 Чек-лист выполнения

### Базовая структура
- [ ] Program.cs
- [ ] appsettings.json
- [ ] .gitignore

### Клиентские контроллеры (7 шт)
- [ ] AuthController.cs
- [ ] ProfileController.cs
- [ ] VehiclesController.cs
- [ ] BookingsController.cs
- [ ] TransactionsController.cs
- [ ] TariffsController.cs
- [ ] ParkingZonesController.cs

### Админские контроллеры (11 шт)
- [ ] EmployeeAuthController.cs
- [ ] AdminUsersController.cs
- [ ] AdminVehiclesController.cs
- [ ] AdminBookingsController.cs
- [ ] AdminIncidentsController.cs
- [ ] AdminEmployeesController.cs
- [ ] AdminTariffsController.cs
- [ ] AdminParkingController.cs
- [ ] AdminBranchesController.cs
- [ ] AdminStatsController.cs
- [ ] UpdateImagesController.cs

### Build скрипты
- [ ] build.bat
- [ ] build.ps1
- [ ] build.sh
- [ ] README.md

### Фронтенд
- [ ] .env.production обновлен
- [ ] axios baseURL проверен

### Тестирование
- [ ] Проект компилируется без ошибок
- [ ] База данных создается
- [ ] Все API endpoints работают
- [ ] React фронтенд подключается к C# API
- [ ] Build скрипты создают .exe файл
- [ ] .exe файл запускается на чистой Windows

---

## 🎯 Важные замечания

1. **Без JWT/хеширования паролей** - как в LibraSmart проекте (учебный проект)
2. **Имена полей в snake_case в JSON** - используй `[JsonPropertyName("field_name")]` атрибуты
3. **CORS разрешен для всех** - для упрощения разработки
4. **Swagger включен** - для тестирования API
5. **EF Core с SQLite** - автоматические миграции не нужны (используй EnsureCreated)

---

## 🔗 Полезные ссылки

- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [SQLite with EF Core](https://learn.microsoft.com/en-us/ef/core/providers/sqlite/)

---

**Готов к работе! Следуй чек-листу и создавай контроллеры один за другим.**
