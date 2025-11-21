# 🚗 CarShareX Desktop

> Десктоп приложение для каршеринга на C# + Tauri с встроенной SQLite БД

[![C#](https://img.shields.io/badge/C%23-8.0-239120?style=for-the-badge&logo=csharp&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tauri](https://img.shields.io/badge/Tauri-1.6-FFC131?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![Telegram](https://img.shields.io/badge/Telegram-@swslt1616-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/swslt1616)

---

## 📋 О проекте

**CarShareX Desktop** — это полнофункциональное десктоп приложение для каршеринга с автономной работой. Состоит из двух независимых компонентов:

1. **Backend (C# API)** - REST API на ASP.NET Core с встроенной SQLite БД
2. **Frontend (Tauri Desktop)** - Нативное десктоп приложение на React + Tauri

### 🎯 Ключевые особенности

- **💻 Два отдельных .exe файла** - backend API и desktop frontend
- **🗄️ Встроенная SQLite БД** - работает автономно без внешних зависимостей
- **🔐 Двухуровневая система авторизации** (клиенты + админ-панель с ролями)
- **📊 Продвинутая админ-панель** с детальной статистикой и аналитикой
- **🎨 Адаптивный UI/UX** с анимациями и современным дизайном
- **🚀 Single-file executables** - один .exe для backend, один для frontend
- **🔧 Простой деплой** - скопировать и запустить, без установки

---

## 🛠️ Технологический стек

### Backend (C# API)

| Технология | Версия | Назначение |
|------------|--------|-----------|
| ![C#](https://img.shields.io/badge/-C%23-239120?logo=csharp&logoColor=white) **C#** | 8.0+ | Основной язык backend-разработки |
| ![.NET](https://img.shields.io/badge/-.NET-512BD4?logo=dotnet&logoColor=white) **ASP.NET Core** | 8.0 | Веб-фреймворк для REST API |
| ![EF Core](https://img.shields.io/badge/-EF_Core-512BD4?logo=dotnet&logoColor=white) **Entity Framework Core** | 8.0 | ORM для работы с базой данных |
| ![SQLite](https://img.shields.io/badge/-SQLite-003B57?logo=sqlite&logoColor=white) **SQLite** | 3.x | Встроенная реляционная БД |
| ![Swagger](https://img.shields.io/badge/-Swagger-85EA2D?logo=swagger&logoColor=black) **Swashbuckle** | 6.5.0 | Автоматическая документация API |

### Frontend (Tauri Desktop)

| Технология | Версия | Назначение |
|------------|--------|-----------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) **React** | 18.2.0 | Основная библиотека для UI |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) **TypeScript** | 5.2.2 | Типизация и повышение надежности кода |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) **Vite** | 5.0.0 | Быстрый сборщик и dev-сервер |
| ![Redux Toolkit](https://img.shields.io/badge/-Redux_Toolkit-764ABC?logo=redux&logoColor=white) **Redux Toolkit** | 1.9.7 | Centralized state management |
| ![React Router](https://img.shields.io/badge/-React_Router-CA4245?logo=react-router&logoColor=white) **React Router** | 6.20.0 | Клиентский роутинг |
| ![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) **Tailwind CSS** | 3.3.5 | Utility-first CSS фреймворк |
| ![React Hook Form](https://img.shields.io/badge/-React_Hook_Form-EC5990?logo=reacthookform&logoColor=white) **React Hook Form** | 7.48.2 | Управление формами с валидацией |
| ![Zod](https://img.shields.io/badge/-Zod-3E67B1?logo=zod&logoColor=white) **Zod** | 3.22.4 | Schema валидация на клиенте |
| ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white) **Axios** | 1.6.2 | HTTP клиент для API запросов |
| ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white) **Framer Motion** | 10.16.5 | Продвинутые анимации и transitions |
| ![Headless UI](https://img.shields.io/badge/-Headless_UI-66E3FF?logo=headlessui&logoColor=black) **Headless UI** | 1.7.17 | Доступные UI компоненты |

### Build & Runtime

| Технология | Назначение |
|-----------|-----------|
| ![Tauri](https://img.shields.io/badge/-Tauri-FFC131?logo=tauri&logoColor=black) **Tauri** | Кросс-платформенные desktop приложения |
| ![Rust](https://img.shields.io/badge/-Rust-000000?logo=rust&logoColor=white) **Rust** | Backend для Tauri (компиляция) |
| ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white) **Git/GitHub** | Version control |

---

## 🏗️ Архитектура проекта

### 📂 Структура репозитория

```
CarShareX/
├── 💻 CarShareXAPI/            # Backend C# API
│   ├── Controllers/           # API контроллеры
│   │   ├── AuthController.cs
│   │   ├── VehiclesController.cs
│   │   ├── BookingsController.cs
│   │   ├── Admin*.cs
│   │   └── ...
│   ├── Data/                 # Entity Framework Core
│   │   ├── CarShareContext.cs
│   │   └── DatabaseInitializer.cs
│   ├── Models/               # Модели данных
│   │   ├── User.cs
│   │   ├── Vehicle.cs
│   │   ├── Booking.cs
│   │   └── ...
│   ├── Program.cs           # Точка входа
│   ├── appsettings.json
│   ├── build-backend.bat    # 🆕 Сборка backend .exe
│   └── build-backend.sh     # 🆕 Сборка backend .exe
│
├── 🎨 front/                  # Frontend Tauri Desktop
│   ├── src/                  # React приложение
│   │   ├── app/             # Redux store
│   │   ├── features/        # Feature-based модули
│   │   │   ├── auth/       # Аутентификация
│   │   │   ├── admin/      # Админ-панель
│   │   │   ├── bookings/   # Бронирования
│   │   │   ├── vehicles/   # Автомобили
│   │   │   ├── profile/    # Профиль
│   │   │   └── transactions/
│   │   ├── components/     # Компоненты
│   │   ├── types/          # TypeScript типы
│   │   └── utils/          # Утилиты
│   ├── src-tauri/          # Tauri Rust backend
│   │   ├── src/
│   │   ├── icons/
│   │   ├── Cargo.toml
│   │   └── tauri.conf.json
│   ├── .env                # 🆕 Конфигурация API
│   ├── package.json
│   └── vite.config.ts
│
├── 📚 BUILD_AND_RUN.md      # 🆕 Инструкции по сборке
└── 🗒️ README.md              # Документация проекта
```

### 🔄 Архитектура взаимодействия

```
┌─────────────────────────────────────────────────────────────┐
│            Tauri Desktop Window (CarShareX.exe)              │
│  ┌───────────────────────────────────────────────────┐     │
│  │   React UI (TypeScript + Redux Toolkit)           │     │
│  │   ├── Client App (Public Routes)                  │     │
│  │   ├── Admin Panel (Protected Routes)              │     │
│  │   └── Shared UI Components                        │     │
│  └──────────────────┬─────────────────────────────────┘     │
└────────────────────┼─────────────────────────────────────────┘
                      │ HTTP/REST API (Axios)
                      │ http://localhost:5000
                      │
        ┌─────────────▼────────────────┐
        │  Backend API (CarShareX.exe) │
        │  ┌────────────────────────┐  │
        │  │   ASP.NET Core Web API │  │
        │  │   ├── Controllers      │  │
        │  │   ├── Models           │  │
        │  │   └── EF Core Context  │  │
        │  └─────────┬──────────────┘  │
        └────────────┼───────────────────┘
                     │ Entity Framework Core
                     │
        ┌────────────▼──────────────────┐
        │   SQLite (Local Database)     │
        │   %APPDATA%/CarShareX/        │
        │   carsharex.db                │
        │   ├── users                   │
        │   ├── employees               │
        │   ├── vehicles                │
        │   ├── bookings                │
        │   ├── transactions            │
        │   └── ...                     │
        └───────────────────────────────┘
```

---

## 🚀 Быстрый старт

### Сборка приложений

#### 1️⃣ Backend (C# API)
```bash
cd CarShareXAPI
./build-backend.bat    # Windows
# или
./build-backend.sh     # Linux/macOS
```
**Результат:** `CarShareXAPI/bin/Release/net8.0/win-x64/publish/CarShareX.exe`

#### 2️⃣ Frontend (Tauri Desktop)
```bash
cd front
npm install
npm run tauri:build
```
**Результат:** `front/src-tauri/target/release/CarShareX.exe`

### Запуск приложений

**Development режим:**
```bash
# Терминал 1 - Backend
cd CarShareXAPI
dotnet run

# Терминал 2 - Frontend
cd front
npm run tauri:dev
```

**Production режим:**
1. Запустите `CarShareX.exe` из папки `CarShareXAPI/bin/.../publish/` (Backend API)
2. Запустите `CarShareX.exe` из папки `front/src-tauri/target/release/` (Desktop App)

📖 **Полная документация:** См. [BUILD_AND_RUN.md](BUILD_AND_RUN.md)

---

## ⚙️ Функциональность

### Клиентская часть

- ✅ **Регистрация и аутентификация** пользователей
- ✅ **Управление профилем** (личные данные, водительские права, история)
- ✅ **Каталог автомобилей** с фильтрацией и поиском
- ✅ **Система бронирований** в реальном времени
- ✅ **История поездок** и детализация
- ✅ **Транзакции и платежи** с полной историей
- ✅ **Просмотр тарифов** и парковочных зон
- ✅ **Responsive дизайн** для всех устройств

### Админ-панель

- ✅ **Dashboard со статистикой** (выручка, бронирования, пользователи)
- ✅ **Управление пользователями** (просмотр, редактирование, блокировка)
- ✅ **Управление автомобилями** (CRUD операции, статусы, техобслуживание)
- ✅ **Управление бронированиями** (мониторинг активных поездок)
- ✅ **Управление инцидентами** (ДТП, повреждения, штрафы)
- ✅ **Управление сотрудниками** с системой ролей
- ✅ **Управление тарифами** и ценообразованием
- ✅ **Управление парковками** и геозонами
- ✅ **Управление филиалами** компании
- ✅ **Детальная аналитика** и отчетность

### API Features

- 📡 **RESTful API** с автодокументацией (Swagger/OpenAPI)
- 🔒 **Разграничение доступа** по ролям (User, Admin, SuperAdmin)
- ⚡ **Async endpoints** для высокой производительности
- 🎯 **Валидация данных** на уровне Pydantic схем
- 🛡️ **Error handling** с понятными сообщениями
- 📊 **Database migrations** для обновления схемы БД

---

## 💼 Разработка и вклад

### 👨‍💻 Распределение работы

**50% проекта** выполнено вручную с фокусом на архитектуру и бизнес-логику:

#### Ключевые технические решения (Manual Development)

- 🏗️ **Архитектура всего приложения** (backend + frontend)
  - Проектирование многослойной архитектуры
  - Разделение на модули и feature-based структура
  - Интеграция между frontend и backend

- 🔗 **Интеграция модулей и систем**
  - Настройка Redux store с RTK Query
  - Интеграция React Router с защищенными роутами
  - Связь всех API endpoints с frontend

- 🗄️ **Проектирование базы данных**
  - Схема БД с 10+ таблицами и связями
  - Индексы и оптимизация запросов
  - Миграции и seed данные

- 🔐 **Система авторизации и ролей**
  - Двухуровневая авторизация (клиенты + админы)
  - Role-based access control (User/Admin/SuperAdmin)
  - Защита роутов на frontend и backend

- 📊 **Бизнес-логика**
  - Логика бронирований и расчета стоимости
  - Система транзакций и платежей
  - Управление статусами автомобилей

- 🚀 **DevOps и деплой**
  - Настройка CI/CD pipeline
  - Конфигурация Netlify, Render, Neon
  - Environment variables и secrets management

#### AI-assisted Development (Routine Tasks)

- 🎨 **Верстка компонентов** по готовому дизайну
- 📝 **Генерация однотипного кода** (CRUD операции)
- 🧪 **Написание seed данных** для тестирования
- 📚 **Документация** и комментарии

---

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** 18+ и **npm**
- **Python** 3.11+
- **PostgreSQL** 16+ (или SQLite для локальной разработки)

### Установка и запуск

#### Backend

```bash
cd back

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

# Установить зависимости
pip install -r requirements.txt

# Настроить .env (скопировать .env.example)
cp .env.example .env

# Запустить сервер
uvicorn main:app --reload
```

Backend будет доступен на `http://localhost:8000`

#### Frontend

```bash
cd front

# Установить зависимости
npm install

# Настроить .env (скопировать .env.example)
cp .env.example .env

# Запустить dev-сервер
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

---

## 📖 API Документация

После запуска backend, автоматическая интерактивная документация доступна по адресам:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Основные endpoints

#### Клиентские

- `POST /auth/register` - Регистрация пользователя
- `POST /auth/login` - Вход в систему
- `GET /profile` - Получить профиль
- `GET /vehicles` - Список автомобилей с фильтрами
- `POST /bookings` - Создать бронирование
- `GET /transactions` - История транзакций

#### Админские

- `POST /admin/auth/login` - Вход для админов
- `GET /admin/users` - Управление пользователями
- `GET /admin/vehicles` - Управление автомобилями
- `GET /admin/stats` - Статистика и аналитика
- `POST /admin/employees` - Управление сотрудниками

---

## 🧪 Тестовые данные

### Клиенты

| Email | Password | Статус |
|-------|----------|--------|
| `morozov@mail.ru` | `user123` | Активный пользователь |
| `petrov@mail.ru` | `user123` | Активный пользователь |

### Админы

| Email | Password | Роль |
|-------|----------|------|
| `ivanov@carsharex.ru` | `admin123` | SuperAdmin |
| `sidorova@carsharex.ru` | `admin123` | Admin |

---

## 📦 Production Deployment

Проект готов к деплою на следующих платформах:

- **Frontend**: Netlify (CDN + SPA routing)
- **Backend**: Render (Python/FastAPI)
- **Database**: Neon (Serverless PostgreSQL)

Подробная инструкция: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📄 Лицензия

Этот проект создан в образовательных целях.

---

## 📞 Контакты

**Разработчик**: Иванин Степан
**Telegram**: [@swslt1616](https://t.me/swslt1616)
**Live Demo**: [https://delicate-lokum-0cb456.netlify.app/](https://delicate-lokum-0cb456.netlify.app/)

---

<div align="center">

**Сделано с использованием современных технологий и best practices** 🚀

[![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redux](https://img.shields.io/badge/-Redux-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/-Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>
