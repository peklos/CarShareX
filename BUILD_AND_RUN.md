# 🚀 Сборка и запуск CarShareX Desktop

CarShareX состоит из двух отдельных приложений:
1. **Backend (C# API)** - REST API на ASP.NET Core с SQLite БД
2. **Frontend (Tauri Desktop App)** - Десктоп приложение на React + Tauri

## 📋 Требования

### Для Backend (C#):
- .NET 8.0 SDK или выше
- Windows (для сборки .exe)

### Для Frontend (Tauri):
- Node.js 18+ и npm
- Rust (для Tauri)
- Windows (для сборки .exe)

## 🏗️ Сборка приложений

### 1️⃣ Сборка Backend

```bash
cd CarShareXAPI

# Windows:
build-backend.bat

# Linux/macOS:
./build-backend.sh
```

**Результат:** `CarShareXAPI/bin/Release/net8.0/win-x64/publish/CarShareX.exe`

### 2️⃣ Сборка Frontend

```bash
cd front

# Установка зависимостей (первый раз)
npm install

# Сборка Tauri приложения
npm run tauri:build
```

**Результат:** `front/src-tauri/target/release/CarShareX.exe` (Tauri desktop app)

## ▶️ Запуск приложений

### Вариант 1: Development режим

**Шаг 1 - Запустите Backend:**
```bash
cd CarShareXAPI
dotnet run
```
Backend запустится на `http://localhost:5000`

**Шаг 2 - Запустите Frontend:**
```bash
cd front
npm run tauri:dev
```
Откроется Tauri окно с приложением

### Вариант 2: Production режим (после сборки)

**Шаг 1 - Запустите Backend:**
```bash
# Запустите CarShareX.exe из CarShareXAPI/bin/Release/net8.0/win-x64/publish/
CarShareX.exe
```

**Шаг 2 - Запустите Frontend:**
```bash
# Запустите CarShareX.exe из front/src-tauri/target/release/
CarShareX.exe
```

## 📁 Структура проекта

```
CarShareX/
├── CarShareXAPI/              # Backend C# API
│   ├── Controllers/           # API контроллеры
│   ├── Data/                  # EF Core, БД контекст
│   ├── Models/                # Модели данных
│   ├── Program.cs             # Точка входа
│   ├── build-backend.bat      # 🆕 Сборка только backend
│   └── build-backend.sh       # 🆕 Сборка только backend
│
├── front/                     # Frontend Tauri + React
│   ├── src/                   # React код
│   ├── src-tauri/             # Tauri Rust код
│   ├── .env                   # 🆕 Конфиг (API URL)
│   └── package.json           # npm скрипты
│
└── BUILD_AND_RUN.md          # 🆕 Эта инструкция
```

## 🗄️ База данных

База данных SQLite автоматически создается при первом запуске backend:

**Расположение:** `%APPDATA%\CarShareX\carsharex.db` (Windows)

**Инициализация:**
- База создается автоматически
- Заполняется тестовыми данными при первом запуске

## 🔧 Конфигурация

### Backend (CarShareXAPI/appsettings.json)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### Frontend (front/.env)
```bash
VITE_API_URL=http://localhost:5000
```

## 🌐 API Endpoints

После запуска backend:
- **API:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger

## 🎯 Основные изменения

✅ **Backend теперь только API**
- Убран хостинг статических файлов
- Настроен CORS для Tauri
- Отдельная сборка через `build-backend.bat`

✅ **Frontend теперь отдельное Tauri приложение**
- Независимый .exe файл
- Общается с backend через HTTP API
- Конфигурация через .env

## 🐛 Troubleshooting

### Backend не запускается
- Проверьте, что установлен .NET 8.0 SDK
- Проверьте, что порт 5000 свободен
- Посмотрите логи в консоли

### Frontend не подключается к backend
- Убедитесь, что backend запущен на порту 5000
- Проверьте файл `front/.env` - должен быть `VITE_API_URL=http://localhost:5000`
- Проверьте CORS настройки в `CarShareXAPI/Program.cs`

### Ошибки CORS
- Убедитесь, что CORS настроен правильно в `Program.cs`
- Проверьте, что frontend обращается к правильному URL

## 📝 Для разработчиков

### Изменение API URL
Измените `VITE_API_URL` в `front/.env`

### Изменение порта backend
Измените в `CarShareXAPI/Program.cs`:
```csharp
app.Run("http://0.0.0.0:5000"); // изменить порт здесь
```

### Hot reload
- Backend: `dotnet watch run` в папке CarShareXAPI
- Frontend: `npm run tauri:dev` в папке front
