from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from db.database import engine, Base, SessionLocal
from db.init_data import initialize_database
from sqlalchemy import text, inspect
from datetime import datetime
import os

# Роутеры клиентов
from routers import auth
from routers import profile
from routers import vehicles
from routers import bookings
from routers import transactions
from routers import tariffs
from routers import parking_zones

# Роутеры админов
from routers import employee_auth
from routers import admin_users
from routers import admin_vehicles
from routers import admin_bookings
from routers import admin_incidents
from routers import admin_employees
from routers import admin_tariffs
from routers import admin_parking
from routers import admin_branches
from routers import admin_stats
from routers import update_images

app = FastAPI(
    title="CarShareX API",
    description="API для каршеринг-приложения CarShareX (учебный проект)",
    version="1.0.0"
)

# Создание таблиц
Base.metadata.create_all(bind=engine)

# Миграция: добавление столбцов description и created_at в transactions если их нет
def migrate_transactions_table():
    """Добавляет столбцы description и created_at в таблицу transactions если их нет"""
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns('transactions')]

    with engine.connect() as conn:
        # Добавляем description если его нет
        if 'description' not in columns:
            try:
                conn.execute(text("ALTER TABLE transactions ADD COLUMN description VARCHAR(500)"))
                conn.commit()
                print("✅ Добавлен столбец description в таблицу transactions")
            except Exception as e:
                print(f"⚠️  Не удалось добавить столбец description: {e}")

        # Добавляем created_at если его нет
        if 'created_at' not in columns:
            try:
                conn.execute(text("ALTER TABLE transactions ADD COLUMN created_at TIMESTAMP"))
                conn.commit()
                print("✅ Добавлен столбец created_at в таблицу transactions")
            except Exception as e:
                print(f"⚠️  Не удалось добавить столбец created_at: {e}")

# Миграция: добавление столбца duration_hours в bookings если его нет
def migrate_bookings_table():
    """Добавляет столбец duration_hours в таблицу bookings если его нет"""
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns('bookings')]

    with engine.connect() as conn:
        # Добавляем duration_hours если его нет
        if 'duration_hours' not in columns:
            try:
                # Используем DOUBLE PRECISION для PostgreSQL совместимости
                conn.execute(text("ALTER TABLE bookings ADD COLUMN duration_hours DOUBLE PRECISION"))
                conn.commit()
                print("✅ Добавлен столбец duration_hours в таблицу bookings")
            except Exception as e:
                print(f"⚠️  Не удалось добавить столбец duration_hours: {e}")
                # Попытка с FLOAT для SQLite
                try:
                    conn.execute(text("ALTER TABLE bookings ADD COLUMN duration_hours FLOAT"))
                    conn.commit()
                    print("✅ Добавлен столбец duration_hours в таблицу bookings (FLOAT)")
                except Exception as e2:
                    print(f"⚠️  Повторная попытка не удалась: {e2}")

# Запуск миграций
try:
    migrate_transactions_table()
    migrate_bookings_table()
except Exception as e:
    print(f"⚠️  Ошибка миграции: {e}")

# Инициализация начальных данных
db = SessionLocal()
try:
    initialize_database(db)
finally:
    db.close()

# Обработчик ошибок валидации для отладки
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("❌ ОШИБКА ВАЛИДАЦИИ:")
    print(f"📍 URL: {request.url}")
    print(f"📍 Метод: {request.method}")
    print(f"📍 Тело запроса: {await request.body()}")
    print(f"📍 Ошибки: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": exc.errors(), "body": str(await request.body())},
    )

# CORS (разрешаем все для учебного проекта)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# === КЛИЕНТСКИЕ РОУТЕРЫ ===
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(vehicles.router)
app.include_router(bookings.router)
app.include_router(transactions.router)
app.include_router(tariffs.router)
app.include_router(parking_zones.router)

# === АДМИНСКИЕ РОУТЕРЫ ===
app.include_router(employee_auth.router)
app.include_router(admin_users.router)
app.include_router(admin_vehicles.router)
app.include_router(admin_bookings.router)
app.include_router(admin_incidents.router)
app.include_router(admin_employees.router)
app.include_router(admin_tariffs.router)
app.include_router(admin_parking.router)
app.include_router(admin_branches.router)
app.include_router(admin_stats.router)
app.include_router(update_images.router)

# === СТАТИЧЕСКИЕ ФАЙЛЫ ===
# Создаем папку static если её нет
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
    print("✅ Статические файлы подключены")

@app.get("/", tags=["Main"])
def root():
    return {
        "message": "CarShareX API работает",
        "version": "2.0.0",
        "docs": "/docs",
        "client_endpoints": "/auth, /profile, /vehicles (with filters), /bookings, /transactions, /tariffs, /parking-zones",
        "admin_endpoints": "/admin/auth, /admin/users, /admin/vehicles, /admin/bookings, /admin/incidents, /admin/employees, /admin/tariffs, /admin/parking, /admin/branches, /admin/stats"
    }

@app.get("/health", tags=["Health"])
@app.head("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
