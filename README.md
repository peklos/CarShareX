# 🚗 CarShareX(render вбанен временно)

> Современная платформа каршеринга с продвинутой архитектурой и enterprise-ready решениями

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://delicate-lokum-0cb456.netlify.app/)
[![API Docs](https://img.shields.io/badge/API_Docs-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://delicate-lokum-0cb456.netlify.app/docs)
[![Telegram](https://img.shields.io/badge/Telegram-@swslt1616-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/swslt1616)

---

## 📋 О проекте

**CarShareX** — это полнофункциональная платформа каршеринга, разработанная с использованием современного технологического стека и архитектурных паттернов enterprise-уровня.

### 🎯 Ключевые особенности

- **🏗️ Многослойная архитектура** с четким разделением ответственности
- **🔐 Двухуровневая система авторизации** (клиенты + админ-панель с ролями)
- **⚡ Real-time обновления** состояния бронирований и транзакций
- **📊 Продвинутая админ-панель** с детальной статистикой и аналитикой
- **🎨 Адаптивный UI/UX** с анимациями и современным дизайном
- **🚀 Production-ready деплой** на облачных платформах (Netlify, Render, Neon)
- **📱 SPA архитектура** с клиентским роутингом

---

## 🛠️ Технологический стек

### Backend (API)

| Технология | Версия | Назначение |
|------------|--------|-----------|
| ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white) **Python** | 3.11+ | Основной язык backend-разработки |
| ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?logo=fastapi&logoColor=white) **FastAPI** | 0.115.0 | Высокопроизводительный async веб-фреймворк |
| ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-D71F00?logo=sqlalchemy&logoColor=white) **SQLAlchemy** | 2.0.35 | ORM для работы с базой данных |
| ![Pydantic](https://img.shields.io/badge/-Pydantic-E92063?logo=pydantic&logoColor=white) **Pydantic** | 2.9.2 | Валидация данных и сериализация |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white) **PostgreSQL** | 16 | Основная реляционная БД (production) |
| ![Uvicorn](https://img.shields.io/badge/-Uvicorn-499848?logo=gunicorn&logoColor=white) **Uvicorn** | 0.31.0 | ASGI сервер для async приложений |

### Frontend (Client & Admin)

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

### DevOps & Deployment

| Сервис | Назначение |
|--------|-----------|
| ![Netlify](https://img.shields.io/badge/-Netlify-00C7B7?logo=netlify&logoColor=white) **Netlify** | Хостинг frontend-приложения с CDN |
| ![Render](https://img.shields.io/badge/-Render-46E3B7?logo=render&logoColor=white) **Render** | Хостинг FastAPI backend |
| ![Neon](https://img.shields.io/badge/-Neon-000000?logo=neon&logoColor=white) **Neon** | Serverless PostgreSQL database |
| ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white) **Git/GitHub** | Version control и CI/CD |

---

## 🏗️ Архитектура проекта

### 📂 Структура репозитория

```
CarShareX/
├── 🎨 front/                    # Frontend приложение
│   ├── src/
│   │   ├── app/                # Redux store конфигурация
│   │   ├── features/           # Feature-based модули
│   │   │   ├── auth/          # Аутентификация
│   │   │   ├── admin/         # Админ-панель
│   │   │   ├── bookings/      # Бронирования
│   │   │   ├── vehicles/      # Автомобили
│   │   │   ├── profile/       # Профиль пользователя
│   │   │   └── transactions/  # Транзакции
│   │   ├── components/        # Переиспользуемые компоненты
│   │   │   ├── layout/       # Layout компоненты
│   │   │   └── ui/           # UI компоненты
│   │   ├── pages/            # Страницы приложения
│   │   ├── types/            # TypeScript типы и интерфейсы
│   │   └── utils/            # Утилиты и хелперы
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── 🔧 back/                     # Backend API
│   ├── db/
│   │   ├── database.py        # Конфигурация БД
│   │   ├── models.py          # SQLAlchemy модели
│   │   └── init_data.py       # Seed данные
│   ├── routers/               # API endpoints
│   │   ├── auth.py           # Клиентская авторизация
│   │   ├── employee_auth.py  # Админ авторизация
│   │   ├── profile.py        # Профиль пользователя
│   │   ├── vehicles.py       # Управление автомобилями
│   │   ├── bookings.py       # Бронирования
│   │   ├── transactions.py   # Транзакции
│   │   ├── tariffs.py        # Тарифы
│   │   ├── parking_zones.py  # Парковочные зоны
│   │   ├── admin_*.py        # Админ endpoints
│   │   └── ...
│   ├── schemas/              # Pydantic схемы
│   │   ├── user.py
│   │   ├── vehicle.py
│   │   ├── booking.py
│   │   └── ...
│   ├── main.py              # Entry point FastAPI
│   ├── requirements.txt
│   └── runtime.txt
│
├── 📚 DEPLOYMENT.md            # Инструкции по деплою
└── 🗒️ README.md                # Документация проекта
```

### 🔄 Архитектура взаимодействия

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   React SPA (TypeScript + Redux Toolkit)            │   │
│  │   ├── Client App (Public Routes)                    │   │
│  │   ├── Admin Panel (Protected Routes)                │   │
│  │   └── Shared UI Components                          │   │
│  └──────────────────┬──────────────────────────────────┘   │
└────────────────────┼────────────────────────────────────────┘
                      │ HTTP/REST (Axios)
                      │
        ┌─────────────▼───────────────┐
        │   Netlify CDN (Frontend)    │
        └─────────────┬───────────────┘
                      │
                      │ API Calls
                      │
        ┌─────────────▼───────────────┐
        │   Render (FastAPI Backend)  │
        │  ┌───────────────────────┐  │
        │  │   main.py (FastAPI)   │  │
        │  │   ├── Routers Layer   │  │
        │  │   ├── Schemas Layer   │  │
        │  │   └── DB Layer        │  │
        │  └───────────┬───────────┘  │
        └──────────────┼──────────────┘
                       │ SQLAlchemy ORM
                       │
        ┌──────────────▼──────────────┐
        │ Neon (PostgreSQL Database)  │
        │  ├── users                  │
        │  ├── employees              │
        │  ├── vehicles               │
        │  ├── bookings               │
        │  ├── transactions           │
        │  └── ...                    │
        └─────────────────────────────┘
```

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
