from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base, SessionLocal
from db.init_data import initialize_database

# Роутеры клиентов
from routers import auth
from routers import profile
from routers import vehicles
from routers import bookings
from routers import transactions

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

app = FastAPI(
    title="CarShareX API",
    description="API для каршеринг-приложения CarShareX (учебный проект)",
    version="1.0.0"
)

# Создание таблиц
Base.metadata.create_all(bind=engine)

# Инициализация начальных данных
db = SessionLocal()
try:
    initialize_database(db)
finally:
    db.close()

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

@app.get("/", tags=["Main"])
def root():
    return {
        "message": "CarShareX API работает",
        "version": "1.0.0",
        "docs": "/docs",
        "client_endpoints": "/auth, /profile, /vehicles, /bookings, /transactions",
        "admin_endpoints": "/admin/auth, /admin/users, /admin/vehicles, /admin/bookings, /admin/incidents, /admin/employees, /admin/tariffs, /admin/parking, /admin/branches"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
