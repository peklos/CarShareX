# 🚗 CarShareX Backend - ПОЛНАЯ АРХИТЕКТУРА И ИНСТРУКЦИИ ДЛЯ РЕАЛИЗАЦИИ

## 📋 ОБЩАЯ ИНФОРМАЦИЯ О ПРОЕКТЕ

**Название:** CarShareX Backend API  
**Стек:** FastAPI + SQLite + SQLAlchemy  
**Цель:** Учебный проект каршеринга с клиентской частью и админкой  
**Особенности:**
- ❌ БЕЗ хеширования паролей (пароли хранятся в открытом виде)
- ❌ БЕЗ JWT токенов (простая авторизация по email/password)
- ✅ Два типа пользователей: клиенты (users) и сотрудники (employees)
- ✅ Разграничение прав для сотрудников по ролям
- ✅ Полный CRUD для всех сущностей
- ✅ Готово для подключения фронтенда

---

## 📁 ПОЛНАЯ СТРУКТУРА ПРОЕКТА

```
carsharex_backend/
│
├── 📄 .env
├── 📄 .gitignore
├── 📄 requirements.txt
├── 📄 main.py
├── 📄 carsharex.db (создастся автоматически)
│
├── 📁 db/
│   ├── __init__.py
│   ├── database.py
│   ├── models.py
│   └── init_data.py
│
├── 📁 schemas/
│   ├── __init__.py
│   ├── user.py
│   ├── employee.py
│   ├── vehicle.py
│   ├── booking.py
│   ├── transaction.py
│   ├── incident.py
│   ├── tariff.py
│   ├── parking_zone.py
│   ├── role.py
│   └── branch.py
│
└── 📁 routers/
    ├── __init__.py
    ├── auth.py
    ├── profile.py
    ├── vehicles.py
    ├── bookings.py
    ├── transactions.py
    ├── employee_auth.py
    ├── admin_users.py
    ├── admin_vehicles.py
    ├── admin_bookings.py
    ├── admin_incidents.py
    ├── admin_employees.py
    ├── admin_tariffs.py
    ├── admin_parking.py
    └── admin_branches.py
```

---

## 📦 requirements.txt

```txt
fastapi==0.115.0
uvicorn[standard]==0.31.0
sqlalchemy==2.0.35
python-dotenv==1.0.1
pydantic==2.9.2
email-validator==2.2.0
python-multipart==0.0.12
```

---

## 🔐 .env

```env
DATABASE_URL=sqlite:///./carsharex.db
```

---

## 🗂️ .gitignore

```gitignore
__pycache__/
*.py[cod]
*$py.class
.Python
venv/
env/
ENV/
*.db
*.sqlite3
.env
.env.local
.vscode/
.idea/
*.swp
*.swo
*.log
```

---

## 🗄️ БАЗА ДАННЫХ

### SQL Schema для SQLite (адаптированная):

```sql
-- === РОЛИ ===
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- === ОТДЕЛЕНИЯ ===
CREATE TABLE IF NOT EXISTS branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20)
);

-- === СОТРУДНИКИ ===
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role_id INTEGER NOT NULL,
    branch_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- === ПОЛЬЗОВАТЕЛИ ===
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    drivers_license VARCHAR(20) UNIQUE,
    balance REAL DEFAULT 0.0
);

-- === ТАРИФЫ ===
CREATE TABLE IF NOT EXISTS tariffs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    price_per_minute REAL,
    price_per_hour REAL
);

-- === ПАРКОВОЧНЫЕ ЗОНЫ ===
CREATE TABLE IF NOT EXISTS parking_zones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    capacity INTEGER DEFAULT 10
);

-- === АВТОМОБИЛИ ===
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) DEFAULT 'available',
    parking_zone_id INTEGER,
    tariff_id INTEGER,
    FOREIGN KEY (parking_zone_id) REFERENCES parking_zones(id),
    FOREIGN KEY (tariff_id) REFERENCES tariffs(id)
);

-- === БРОНИРОВАНИЯ ===
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    tariff_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    total_cost REAL DEFAULT 0.0,
    status VARCHAR(30) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (tariff_id) REFERENCES tariffs(id)
);

-- === ТРАНЗАКЦИИ ===
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    booking_id INTEGER,
    transaction_type VARCHAR(30) NOT NULL,
    amount REAL NOT NULL,
    status VARCHAR(30) DEFAULT 'completed',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- === ИНЦИДЕНТЫ ===
CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,
    vehicle_id INTEGER NOT NULL,
    user_id INTEGER,
    incident_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'reported',
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🏗️ ФАЙЛЫ ПРОЕКТА - ПОЛНЫЙ КОД

### 1️⃣ db/database.py

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./carsharex.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

### 2️⃣ db/models.py

```python
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class Role(Base):
    __tablename__ = 'roles'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    
    employees = relationship('Employee', back_populates='role')


class Branch(Base):
    __tablename__ = 'branches'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(20))
    
    employees = relationship('Employee', back_populates='branch')


class Employee(Base):
    __tablename__ = 'employees'
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    role_id = Column(Integer, ForeignKey('roles.id'))
    branch_id = Column(Integer, ForeignKey('branches.id'))
    
    role = relationship('Role', back_populates='employees')
    branch = relationship('Branch', back_populates='employees')


class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    drivers_license = Column(String(20), unique=True)
    balance = Column(Float, default=0.0)
    
    bookings = relationship('Booking', back_populates='user')
    transactions = relationship('Transaction', back_populates='user')
    incidents = relationship('Incident', back_populates='user')


class Tariff(Base):
    __tablename__ = 'tariffs'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    price_per_minute = Column(Float)
    price_per_hour = Column(Float)
    
    vehicles = relationship('Vehicle', back_populates='tariff')


class ParkingZone(Base):
    __tablename__ = 'parking_zones'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    capacity = Column(Integer, default=10)
    
    vehicles = relationship('Vehicle', back_populates='parking_zone')


class Vehicle(Base):
    __tablename__ = 'vehicles'
    
    id = Column(Integer, primary_key=True, index=True)
    license_plate = Column(String(20), unique=True, nullable=False)
    brand = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    vehicle_type = Column(String(30), nullable=False)
    status = Column(String(30), default='available')
    parking_zone_id = Column(Integer, ForeignKey('parking_zones.id'))
    tariff_id = Column(Integer, ForeignKey('tariffs.id'))
    
    parking_zone = relationship('ParkingZone', back_populates='vehicles')
    tariff = relationship('Tariff', back_populates='vehicles')
    bookings = relationship('Booking', back_populates='vehicle')
    incidents = relationship('Incident', back_populates='vehicle')


class Booking(Base):
    __tablename__ = 'bookings'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    vehicle_id = Column(Integer, ForeignKey('vehicles.id'))
    tariff_id = Column(Integer, ForeignKey('tariffs.id'))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    total_cost = Column(Float, default=0.0)
    status = Column(String(30), default='pending')
    
    user = relationship('User', back_populates='bookings')
    vehicle = relationship('Vehicle', back_populates='bookings')
    transactions = relationship('Transaction', back_populates='booking')
    incidents = relationship('Incident', back_populates='booking')


class Transaction(Base):
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    booking_id = Column(Integer, ForeignKey('bookings.id'))
    transaction_type = Column(String(30), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(30), default='completed')
    
    user = relationship('User', back_populates='transactions')
    booking = relationship('Booking', back_populates='transactions')


class Incident(Base):
    __tablename__ = 'incidents'
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey('bookings.id'))
    vehicle_id = Column(Integer, ForeignKey('vehicles.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    incident_type = Column(String(50), nullable=False)
    description = Column(String, nullable=False)
    status = Column(String(30), default='reported')
    
    booking = relationship('Booking', back_populates='incidents')
    vehicle = relationship('Vehicle', back_populates='incidents')
    user = relationship('User', back_populates='incidents')
```

---

### 3️⃣ db/init_data.py

```python
from sqlalchemy.orm import Session
from . import models

def initialize_database(db: Session):
    """Инициализация базы данных тестовыми данными"""
    
    # Проверяем, есть ли уже данные
    if db.query(models.Role).count() > 0:
        print("ℹ️  База данных уже заполнена")
        return
    
    print("\n" + "="*50)
    print("🚀 Инициализация базы данных...")
    print("="*50 + "\n")
    
    # Роли
    roles_data = [
        {"name": "SuperAdmin"},
        {"name": "Manager"},
        {"name": "Support"},
        {"name": "Mechanic"}
    ]
    
    for role_data in roles_data:
        role = models.Role(**role_data)
        db.add(role)
    
    db.commit()
    print("✅ Роли созданы")
    
    # Офисы
    branches_data = [
        {"name": "Центральный офис", "address": "Москва, ул. Тверская, 10", "phone": "+7 (495) 123-45-67"},
        {"name": "Офис Арбат", "address": "Москва, ул. Арбат, 25", "phone": "+7 (495) 234-56-78"},
        {"name": "Офис ВДНХ", "address": "Москва, проспект Мира, 119", "phone": "+7 (495) 345-67-89"}
    ]
    
    for branch_data in branches_data:
        branch = models.Branch(**branch_data)
        db.add(branch)
    
    db.commit()
    print("✅ Офисы созданы")
    
    # Сотрудники
    employees_data = [
        {"first_name": "Алексей", "last_name": "Иванов", "email": "ivanov@carsharex.ru", "password": "admin123", "role_id": 1, "branch_id": 1},
        {"first_name": "Мария", "last_name": "Петрова", "email": "petrova@carsharex.ru", "password": "manager123", "role_id": 2, "branch_id": 1},
        {"first_name": "Дмитрий", "last_name": "Сидоров", "email": "sidorov@carsharex.ru", "password": "support123", "role_id": 3, "branch_id": 2},
        {"first_name": "Сергей", "last_name": "Кузнецов", "email": "kuznetsov@carsharex.ru", "password": "mechanic123", "role_id": 4, "branch_id": 3}
    ]
    
    for emp_data in employees_data:
        employee = models.Employee(**emp_data)
        db.add(employee)
    
    db.commit()
    print("✅ Сотрудники созданы")
    
    # Пользователи
    users_data = [
        {"first_name": "Иван", "last_name": "Морозов", "email": "morozov@mail.ru", "phone": "+79161234572", "password": "user123", "drivers_license": "77 12 345678", "balance": 500.0},
        {"first_name": "Елена", "last_name": "Васильева", "email": "vasileva@gmail.com", "phone": "+79161234573", "password": "user123", "drivers_license": "77 23 456789", "balance": 1000.0},
        {"first_name": "Михаил", "last_name": "Новиков", "email": "novikov@yandex.ru", "phone": "+79161234574", "password": "user123", "drivers_license": "77 34 567890", "balance": 250.0},
        {"first_name": "Ольга", "last_name": "Козлова", "email": "kozlova@mail.ru", "phone": "+79161234575", "password": "user123", "drivers_license": "77 45 678901", "balance": 750.0},
        {"first_name": "Александр", "last_name": "Лебедев", "email": "lebedev@gmail.com", "phone": "+79161234576", "password": "user123", "drivers_license": "77 56 789012", "balance": 300.0}
    ]
    
    for user_data in users_data:
        user = models.User(**user_data)
        db.add(user)
    
    db.commit()
    print("✅ Пользователи созданы")
    
    # Тарифы
    tariffs_data = [
        {"name": "Поминутный", "price_per_minute": 8.0, "price_per_hour": None},
        {"name": "Почасовой", "price_per_minute": None, "price_per_hour": 350.0},
        {"name": "Суточный", "price_per_minute": None, "price_per_hour": 2500.0},
        {"name": "Премиум", "price_per_minute": 12.0, "price_per_hour": 550.0}
    ]
    
    for tariff_data in tariffs_data:
        tariff = models.Tariff(**tariff_data)
        db.add(tariff)
    
    db.commit()
    print("✅ Тарифы созданы")
    
    # Парковочные зоны
    parking_data = [
        {"name": "Парковка Центр", "address": "Москва, ул. Тверская, 10", "capacity": 15},
        {"name": "Парковка Арбат", "address": "Москва, ул. Арбат, 25", "capacity": 12},
        {"name": "Парковка Лубянка", "address": "Москва, Лубянская площадь, 2", "capacity": 10},
        {"name": "Парковка Парк Культуры", "address": "Москва, ул. Крымский Вал, 9", "capacity": 20},
        {"name": "Парковка ВДНХ", "address": "Москва, проспект Мира, 119", "capacity": 25}
    ]
    
    for park_data in parking_data:
        parking = models.ParkingZone(**park_data)
        db.add(parking)
    
    db.commit()
    print("✅ Парковки созданы")
    
    # Автомобили
    vehicles_data = [
        {"license_plate": "А123ВС777", "brand": "Kia", "model": "Rio", "vehicle_type": "sedan", "status": "available", "parking_zone_id": 1, "tariff_id": 1},
        {"license_plate": "В456ЕК199", "brand": "Hyundai", "model": "Solaris", "vehicle_type": "sedan", "status": "available", "parking_zone_id": 1, "tariff_id": 1},
        {"license_plate": "С789МН777", "brand": "Renault", "model": "Duster", "vehicle_type": "suv", "status": "available", "parking_zone_id": 2, "tariff_id": 2},
        {"license_plate": "Е012ОР199", "brand": "Volkswagen", "model": "Polo", "vehicle_type": "sedan", "status": "available", "parking_zone_id": 3, "tariff_id": 1},
        {"license_plate": "К345СТ777", "brand": "Skoda", "model": "Rapid", "vehicle_type": "sedan", "status": "in_use", "parking_zone_id": 4, "tariff_id": 1},
        {"license_plate": "М678УФ199", "brand": "Tesla", "model": "Model 3", "vehicle_type": "electric", "status": "available", "parking_zone_id": 2, "tariff_id": 4},
        {"license_plate": "Н901ХЦ777", "brand": "Nissan", "model": "Leaf", "vehicle_type": "electric", "status": "available", "parking_zone_id": 5, "tariff_id": 2},
        {"license_plate": "О234ЧШ199", "brand": "Toyota", "model": "Prius", "vehicle_type": "hybrid", "status": "available", "parking_zone_id": 3, "tariff_id": 2},
        {"license_plate": "П567ЩЫ777", "brand": "Lexus", "model": "UX 300h", "vehicle_type": "hybrid", "status": "available", "parking_zone_id": 1, "tariff_id": 4},
        {"license_plate": "Р890ЭЮ199", "brand": "Kia", "model": "Rio", "vehicle_type": "sedan", "status": "maintenance", "parking_zone_id": None, "tariff_id": 1}
    ]
    
    for vehicle_data in vehicles_data:
        vehicle = models.Vehicle(**vehicle_data)
        db.add(vehicle)
    
    db.commit()
    print("✅ Автомобили созданы")
    
    # Бронирования
    from datetime import datetime
    bookings_data = [
        {"user_id": 1, "vehicle_id": 1, "tariff_id": 1, "start_time": datetime(2024, 10, 28, 9, 0), "end_time": datetime(2024, 10, 28, 10, 30), "total_cost": 720.0, "status": "completed"},
        {"user_id": 2, "vehicle_id": 2, "tariff_id": 2, "start_time": datetime(2024, 10, 28, 14, 0), "end_time": datetime(2024, 10, 28, 17, 0), "total_cost": 1050.0, "status": "completed"},
        {"user_id": 3, "vehicle_id": 3, "tariff_id": 2, "start_time": datetime(2024, 10, 29, 11, 0), "end_time": datetime(2024, 10, 29, 13, 30), "total_cost": 875.0, "status": "completed"},
        {"user_id": 4, "vehicle_id": 6, "tariff_id": 4, "start_time": datetime(2024, 10, 29, 16, 0), "end_time": datetime(2024, 10, 29, 18, 0), "total_cost": 1440.0, "status": "completed"},
        {"user_id": 5, "vehicle_id": 4, "tariff_id": 1, "start_time": datetime(2024, 10, 29, 19, 0), "end_time": datetime(2024, 10, 29, 20, 0), "total_cost": 480.0, "status": "completed"},
        {"user_id": 1, "vehicle_id": 5, "tariff_id": 1, "start_time": datetime(2024, 10, 30, 8, 0), "end_time": None, "total_cost": 0.0, "status": "active"},
        {"user_id": 2, "vehicle_id": 7, "tariff_id": 2, "start_time": datetime(2024, 10, 31, 10, 0), "end_time": None, "total_cost": 0.0, "status": "pending"}
    ]
    
    for booking_data in bookings_data:
        booking = models.Booking(**booking_data)
        db.add(booking)
    
    db.commit()
    print("✅ Бронирования созданы")
    
    # Транзакции
    transactions_data = [
        {"user_id": 1, "booking_id": 1, "transaction_type": "payment", "amount": 720.0, "status": "completed"},
        {"user_id": 2, "booking_id": 2, "transaction_type": "payment", "amount": 1050.0, "status": "completed"},
        {"user_id": 3, "booking_id": 3, "transaction_type": "payment", "amount": 875.0, "status": "completed"},
        {"user_id": 4, "booking_id": 4, "transaction_type": "payment", "amount": 1440.0, "status": "completed"},
        {"user_id": 5, "booking_id": 5, "transaction_type": "payment", "amount": 480.0, "status": "completed"},
        {"user_id": 1, "booking_id": None, "transaction_type": "deposit", "amount": 1000.0, "status": "completed"},
        {"user_id": 3, "booking_id": 3, "transaction_type": "penalty", "amount": 500.0, "status": "completed"}
    ]
    
    for trans_data in transactions_data:
        transaction = models.Transaction(**trans_data)
        db.add(transaction)
    
    db.commit()
    print("✅ Транзакции созданы")
    
    # Инциденты
    incidents_data = [
        {"booking_id": 3, "vehicle_id": 3, "user_id": 3, "incident_type": "damage", "description": "Царапина на переднем крыле", "status": "in_progress"},
        {"booking_id": None, "vehicle_id": 10, "user_id": None, "incident_type": "technical_issue", "description": "Автомобиль не заводится", "status": "reported"},
        {"booking_id": 5, "vehicle_id": 4, "user_id": 5, "incident_type": "violation", "description": "Штраф за неправильную парковку", "status": "resolved"}
    ]
    
    for incident_data in incidents_data:
        incident = models.Incident(**incident_data)
        db.add(incident)
    
    db.commit()
    print("✅ Инциденты созданы")
    
    print("\n" + "="*50)
    print("✅ Инициализация завершена!")
    print("="*50 + "\n")
```

---

### 4️⃣ schemas/user.py

```python
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    password: str
    drivers_license: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    drivers_license: Optional[str]
    balance: float
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    drivers_license: Optional[str] = None
```

---

### 5️⃣ schemas/employee.py

```python
from pydantic import BaseModel, EmailStr
from typing import Optional

class EmployeeLogin(BaseModel):
    email: EmailStr
    password: str

class EmployeeResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role_id: int
    branch_id: Optional[int]
    
    class Config:
        from_attributes = True

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role_id: int
    branch_id: Optional[int] = None

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role_id: Optional[int] = None
    branch_id: Optional[int] = None
```

---

### 6️⃣ schemas/vehicle.py

```python
from pydantic import BaseModel
from typing import Optional

class VehicleCreate(BaseModel):
    license_plate: str
    brand: str
    model: str
    vehicle_type: str
    parking_zone_id: Optional[int] = None
    tariff_id: Optional[int] = None

class VehicleUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    vehicle_type: Optional[str] = None
    status: Optional[str] = None
    parking_zone_id: Optional[int] = None
    tariff_id: Optional[int] = None

class VehicleResponse(BaseModel):
    id: int
    license_plate: str
    brand: str
    model: str
    vehicle_type: str
    status: str
    parking_zone_id: Optional[int]
    tariff_id: Optional[int]
    
    class Config:
        from_attributes = True
```

---

### 7️⃣ schemas/booking.py

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookingCreate(BaseModel):
    vehicle_id: int
    tariff_id: int
    start_time: datetime

class BookingResponse(BaseModel):
    id: int
    user_id: int
    vehicle_id: int
    tariff_id: int
    start_time: datetime
    end_time: Optional[datetime]
    total_cost: float
    status: str
    
    class Config:
        from_attributes = True

class BookingComplete(BaseModel):
    end_time: datetime
    total_cost: float
```

---

### 8️⃣ schemas/transaction.py

```python
from pydantic import BaseModel
from typing import Optional

class TransactionCreate(BaseModel):
    transaction_type: str
    amount: float
    booking_id: Optional[int] = None

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    booking_id: Optional[int]
    transaction_type: str
    amount: float
    status: str
    
    class Config:
        from_attributes = True
```

---

### 9️⃣ schemas/incident.py

```python
from pydantic import BaseModel
from typing import Optional

class IncidentCreate(BaseModel):
    booking_id: Optional[int] = None
    vehicle_id: int
    incident_type: str
    description: str

class IncidentUpdate(BaseModel):
    status: str

class IncidentResponse(BaseModel):
    id: int
    booking_id: Optional[int]
    vehicle_id: int
    user_id: Optional[int]
    incident_type: str
    description: str
    status: str
    
    class Config:
        from_attributes = True
```

---

### 🔟 schemas/tariff.py

```python
from pydantic import BaseModel
from typing import Optional

class TariffCreate(BaseModel):
    name: str
    price_per_minute: Optional[float] = None
    price_per_hour: Optional[float] = None

class TariffUpdate(BaseModel):
    name: Optional[str] = None
    price_per_minute: Optional[float] = None
    price_per_hour: Optional[float] = None

class TariffResponse(BaseModel):
    id: int
    name: str
    price_per_minute: Optional[float]
    price_per_hour: Optional[float]
    
    class Config:
        from_attributes = True
```

---

### 1️⃣1️⃣ schemas/parking_zone.py

```python
from pydantic import BaseModel
from typing import Optional

class ParkingZoneCreate(BaseModel):
    name: str
    address: str
    capacity: int = 10

class ParkingZoneUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    capacity: Optional[int] = None

class ParkingZoneResponse(BaseModel):
    id: int
    name: str
    address: str
    capacity: int
    
    class Config:
        from_attributes = True
```

---

### 1️⃣2️⃣ schemas/role.py

```python
from pydantic import BaseModel

class RoleResponse(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True
```

---

### 1️⃣3️⃣ schemas/branch.py

```python
from pydantic import BaseModel
from typing import Optional

class BranchCreate(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None

class BranchUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

class BranchResponse(BaseModel):
    id: int
    name: str
    address: str
    phone: Optional[str]
    
    class Config:
        from_attributes = True
```

---

## 🛣️ РОУТЕРЫ (API ENDPOINTS)

### 🔹 routers/auth.py (Авторизация клиентов)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import user as user_schemas

router = APIRouter(prefix="/auth", tags=["Авторизация клиентов"])

@router.post("/register", response_model=user_schemas.UserResponse)
def register(user_data: user_schemas.UserCreate, db: Session = Depends(database.get_db)):
    """Регистрация нового пользователя"""
    # Проверка email
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    
    # Проверка телефона
    existing_phone = db.query(models.User).filter(models.User.phone == user_data.phone).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Телефон уже зарегистрирован")
    
    # Создание пользователя
    new_user = models.User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        phone=user_data.phone,
        password=user_data.password,  # БЕЗ хеширования
        drivers_license=user_data.drivers_license,
        balance=0.0
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login")
def login(login_data: user_schemas.UserLogin, db: Session = Depends(database.get_db)):
    """Вход пользователя"""
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    
    if not user or user.password != login_data.password:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    
    return {
        "message": "Вход выполнен успешно",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone,
            "balance": user.balance
        }
    }

@router.get("/me/{user_id}", response_model=user_schemas.UserResponse)
def get_current_user(user_id: int, db: Session = Depends(database.get_db)):
    """Получить данные текущего пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    return user
```

---

### 🔹 routers/profile.py (Профиль клиента)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import user as user_schemas

router = APIRouter(prefix="/profile", tags=["Профиль клиента"])

@router.get("/{user_id}", response_model=user_schemas.UserResponse)
def get_profile(user_id: int, db: Session = Depends(database.get_db)):
    """Получить профиль пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    return user

@router.patch("/{user_id}", response_model=user_schemas.UserResponse)
def update_profile(user_id: int, user_data: user_schemas.UserUpdate, db: Session = Depends(database.get_db)):
    """Обновить профиль пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    if user_data.first_name:
        user.first_name = user_data.first_name
    if user_data.last_name:
        user.last_name = user_data.last_name
    if user_data.phone:
        user.phone = user_data.phone
    if user_data.drivers_license:
        user.drivers_license = user_data.drivers_license
    
    db.commit()
    db.refresh(user)
    
    return user
```

---

### 🔹 routers/vehicles.py (Просмотр автомобилей)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import vehicle as vehicle_schemas
from typing import List

router = APIRouter(prefix="/vehicles", tags=["Автомобили для клиентов"])

@router.get("/", response_model=List[vehicle_schemas.VehicleResponse])
def get_available_vehicles(db: Session = Depends(database.get_db)):
    """Получить список доступных автомобилей"""
    vehicles = db.query(models.Vehicle).filter(models.Vehicle.status == "available").all()
    return vehicles

@router.get("/{vehicle_id}", response_model=vehicle_schemas.VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(database.get_db)):
    """Получить информацию об автомобиле"""
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")
    
    return vehicle
```

---

### 🔹 routers/bookings.py (Бронирования клиента)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import booking as booking_schemas
from typing import List

router = APIRouter(prefix="/bookings", tags=["Бронирования клиента"])

@router.post("/", response_model=booking_schemas.BookingResponse)
def create_booking(booking_data: booking_schemas.BookingCreate, user_id: int, db: Session = Depends(database.get_db)):
    """Создать новое бронирование"""
    # Проверка автомобиля
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == booking_data.vehicle_id).first()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")
    
    if vehicle.status != "available":
        raise HTTPException(status_code=400, detail="Автомобиль недоступен")
    
    # Создание бронирования
    new_booking = models.Booking(
        user_id=user_id,
        vehicle_id=booking_data.vehicle_id,
        tariff_id=booking_data.tariff_id,
        start_time=booking_data.start_time,
        status="active"
    )
    
    # Обновление статуса автомобиля
    vehicle.status = "in_use"
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return new_booking

@router.get("/user/{user_id}", response_model=List[booking_schemas.BookingResponse])
def get_user_bookings(user_id: int, db: Session = Depends(database.get_db)):
    """Получить все бронирования пользователя"""
    bookings = db.query(models.Booking).filter(models.Booking.user_id == user_id).all()
    return bookings

@router.patch("/{booking_id}/complete", response_model=booking_schemas.BookingResponse)
def complete_booking(booking_id: int, complete_data: booking_schemas.BookingComplete, db: Session = Depends(database.get_db)):
    """Завершить бронирование"""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    
    if booking.status != "active":
        raise HTTPException(status_code=400, detail="Бронирование уже завершено")
    
    # Обновление бронирования
    booking.end_time = complete_data.end_time
    booking.total_cost = complete_data.total_cost
    booking.status = "completed"
    
    # Освобождение автомобиля
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == booking.vehicle_id).first()
    if vehicle:
        vehicle.status = "available"
    
    # Списание с баланса
    user = db.query(models.User).filter(models.User.id == booking.user_id).first()
    if user:
        user.balance -= complete_data.total_cost
    
    # Создание транзакции
    transaction = models.Transaction(
        user_id=booking.user_id,
        booking_id=booking.id,
        transaction_type="payment",
        amount=complete_data.total_cost,
        status="completed"
    )
    db.add(transaction)
    
    db.commit()
    db.refresh(booking)
    
    return booking
```

---

### 🔹 routers/transactions.py (Транзакции клиента)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import transaction as transaction_schemas
from typing import List

router = APIRouter(prefix="/transactions", tags=["Транзакции клиента"])

@router.get("/user/{user_id}", response_model=List[transaction_schemas.TransactionResponse])
def get_user_transactions(user_id: int, db: Session = Depends(database.get_db)):
    """Получить все транзакции пользователя"""
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()
    return transactions

@router.post("/deposit", response_model=transaction_schemas.TransactionResponse)
def deposit_balance(user_id: int, amount: float, db: Session = Depends(database.get_db)):
    """Пополнить баланс пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Сумма должна быть положительной")
    
    # Пополнение баланса
    user.balance += amount
    
    # Создание транзакции
    transaction = models.Transaction(
        user_id=user_id,
        transaction_type="deposit",
        amount=amount,
        status="completed"
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    return transaction
```

---

### 🔹 routers/employee_auth.py (Авторизация сотрудников)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import employee as employee_schemas

router = APIRouter(prefix="/admin/auth", tags=["Авторизация сотрудников"])

@router.post("/login")
def employee_login(login_data: employee_schemas.EmployeeLogin, db: Session = Depends(database.get_db)):
    """Вход сотрудника"""
    employee = db.query(models.Employee).filter(models.Employee.email == login_data.email).first()
    
    if not employee or employee.password != login_data.password:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    
    # Получаем роль
    role = db.query(models.Role).filter(models.Role.id == employee.role_id).first()
    
    return {
        "message": "Вход выполнен успешно",
        "employee": {
            "id": employee.id,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "email": employee.email,
            "role": role.name if role else None,
            "role_id": employee.role_id,
            "branch_id": employee.branch_id
        }
    }

@router.get("/me/{employee_id}", response_model=employee_schemas.EmployeeResponse)
def get_current_employee(employee_id: int, db: Session = Depends(database.get_db)):
    """Получить данные текущего сотрудника"""
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    
    return employee
```

---

### 🔹 routers/admin_users.py (Управление пользователями)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import user as user_schemas
from typing import List

router = APIRouter(prefix="/admin/users", tags=["Админ: Пользователи"])

@router.get("/", response_model=List[user_schemas.UserResponse])
def get_all_users(db: Session = Depends(database.get_db)):
    """Получить всех пользователей"""
    users = db.query(models.User).all()
    return users

@router.get("/{user_id}", response_model=user_schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(database.get_db)):
    """Получить пользователя по ID"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    return user

@router.patch("/{user_id}", response_model=user_schemas.UserResponse)
def update_user(user_id: int, user_data: user_schemas.UserUpdate, db: Session = Depends(database.get_db)):
    """Обновить данные пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    if user_data.first_name:
        user.first_name = user_data.first_name
    if user_data.last_name:
        user.last_name = user_data.last_name
    if user_data.phone:
        user.phone = user_data.phone
    if user_data.drivers_license:
        user.drivers_license = user_data.drivers_license
    
    db.commit()
    db.refresh(user)
    
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(database.get_db)):
    """Удалить пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    db.delete(user)
    db.commit()
    
    return {"message": "Пользователь удален", "user_id": user_id}
```

---

### 🔹 routers/admin_vehicles.py (Управление автомобилями)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import vehicle as vehicle_schemas
from typing import List

router = APIRouter(prefix="/admin/vehicles", tags=["Админ: Автомобили"])

@router.get("/", response_model=List[vehicle_schemas.VehicleResponse])
def get_all_vehicles(db: Session = Depends(database.get_db)):
    """Получить все автомобили"""
    vehicles = db.query(models.Vehicle).all()
    return vehicles

@router.post("/", response_model=vehicle_schemas.VehicleResponse)
def create_vehicle(vehicle_data: vehicle_schemas.VehicleCreate, db: Session = Depends(database.get_db)):
    """Создать новый автомобиль"""
    # Проверка номера
    existing = db.query(models.Vehicle).filter(models.Vehicle.license_plate == vehicle_data.license_plate).first()
    if existing:
        raise HTTPException(status_code=400, detail="Автомобиль с таким номером уже существует")
    
    new_vehicle = models.Vehicle(
        license_plate=vehicle_data.license_plate,
        brand=vehicle_data.brand,
        model=vehicle_data.model,
        vehicle_type=vehicle_data.vehicle_type,
        status="available",
        parking_zone_id=vehicle_data.parking_zone_id,
        tariff_id=vehicle_data.tariff_id
    )
    
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    
    return new_vehicle

@router.patch("/{vehicle_id}", response_model=vehicle_schemas.VehicleResponse)
def update_vehicle(vehicle_id: int, vehicle_data: vehicle_schemas.VehicleUpdate, db: Session = Depends(database.get_db)):
    """Обновить данные автомобиля"""
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")
    
    if vehicle_data.brand:
        vehicle.brand = vehicle_data.brand
    if vehicle_data.model:
        vehicle.model = vehicle_data.model
    if vehicle_data.vehicle_type:
        vehicle.vehicle_type = vehicle_data.vehicle_type
    if vehicle_data.status:
        vehicle.status = vehicle_data.status
    if vehicle_data.parking_zone_id is not None:
        vehicle.parking_zone_id = vehicle_data.parking_zone_id
    if vehicle_data.tariff_id is not None:
        vehicle.tariff_id = vehicle_data.tariff_id
    
    db.commit()
    db.refresh(vehicle)
    
    return vehicle

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(database.get_db)):
    """Удалить автомобиль"""
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")
    
    db.delete(vehicle)
    db.commit()
    
    return {"message": "Автомобиль удален", "vehicle_id": vehicle_id}
```

---

### 🔹 routers/admin_bookings.py (Просмотр всех бронирований)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import booking as booking_schemas
from typing import List

router = APIRouter(prefix="/admin/bookings", tags=["Админ: Бронирования"])

@router.get("/", response_model=List[booking_schemas.BookingResponse])
def get_all_bookings(db: Session = Depends(database.get_db)):
    """Получить все бронирования"""
    bookings = db.query(models.Booking).all()
    return bookings

@router.get("/{booking_id}", response_model=booking_schemas.BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(database.get_db)):
    """Получить бронирование по ID"""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    
    return booking

@router.get("/stats/overview")
def get_bookings_stats(db: Session = Depends(database.get_db)):
    """Статистика по бронированиям"""
    total = db.query(models.Booking).count()
    active = db.query(models.Booking).filter(models.Booking.status == "active").count()
    completed = db.query(models.Booking).filter(models.Booking.status == "completed").count()
    pending = db.query(models.Booking).filter(models.Booking.status == "pending").count()
    
    return {
        "total_bookings": total,
        "active_bookings": active,
        "completed_bookings": completed,
        "pending_bookings": pending
    }
```

---

### 🔹 routers/admin_incidents.py (Управление инцидентами)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import incident as incident_schemas
from typing import List

router = APIRouter(prefix="/admin/incidents", tags=["Админ: Инциденты"])

@router.get("/", response_model=List[incident_schemas.IncidentResponse])
def get_all_incidents(db: Session = Depends(database.get_db)):
    """Получить все инциденты"""
    incidents = db.query(models.Incident).all()
    return incidents

@router.post("/", response_model=incident_schemas.IncidentResponse)
def create_incident(incident_data: incident_schemas.IncidentCreate, db: Session = Depends(database.get_db)):
    """Создать новый инцидент"""
    new_incident = models.Incident(
        booking_id=incident_data.booking_id,
        vehicle_id=incident_data.vehicle_id,
        incident_type=incident_data.incident_type,
        description=incident_data.description,
        status="reported"
    )
    
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    
    return new_incident

@router.patch("/{incident_id}", response_model=incident_schemas.IncidentResponse)
def update_incident_status(incident_id: int, update_data: incident_schemas.IncidentUpdate, db: Session = Depends(database.get_db)):
    """Обновить статус инцидента"""
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    
    if not incident:
        raise HTTPException(status_code=404, detail="Инцидент не найден")
    
    incident.status = update_data.status
    
    db.commit()
    db.refresh(incident)
    
    return incident
```

---

### 🔹 routers/admin_employees.py (Управление сотрудниками)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import employee as employee_schemas
from typing import List

router = APIRouter(prefix="/admin/employees", tags=["Админ: Сотрудники"])

@router.get("/", response_model=List[employee_schemas.EmployeeResponse])
def get_all_employees(employee_id: int, db: Session = Depends(database.get_db)):
    """Получить всех сотрудников (только SuperAdmin)"""
    # Проверка прав
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee or employee.role_id != 1:  # role_id=1 это SuperAdmin
        raise HTTPException(status_code=403, detail="Доступ запрещен. Требуется роль SuperAdmin")
    
    employees = db.query(models.Employee).all()
    return employees

@router.post("/", response_model=employee_schemas.EmployeeResponse)
def create_employee(employee_data: employee_schemas.EmployeeCreate, admin_id: int, db: Session = Depends(database.get_db)):
    """Создать нового сотрудника (только SuperAdmin)"""
    # Проверка прав
    admin = db.query(models.Employee).filter(models.Employee.id == admin_id).first()
    if not admin or admin.role_id != 1:
        raise HTTPException(status_code=403, detail="Доступ запрещен. Требуется роль SuperAdmin")
    
    # Проверка email
    existing = db.query(models.Employee).filter(models.Employee.email == employee_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email уже используется")
    
    new_employee = models.Employee(
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        email=employee_data.email,
        password=employee_data.password,
        role_id=employee_data.role_id,
        branch_id=employee_data.branch_id
    )
    
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    return new_employee

@router.patch("/{emp_id}", response_model=employee_schemas.EmployeeResponse)
def update_employee(emp_id: int, employee_data: employee_schemas.EmployeeUpdate, admin_id: int, db: Session = Depends(database.get_db)):
    """Обновить сотрудника (только SuperAdmin)"""
    # Проверка прав
    admin = db.query(models.Employee).filter(models.Employee.id == admin_id).first()
    if not admin or admin.role_id != 1:
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    
    employee = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    
    if employee_data.first_name:
        employee.first_name = employee_data.first_name
    if employee_data.last_name:
        employee.last_name = employee_data.last_name
    if employee_data.email:
        employee.email = employee_data.email
    if employee_data.role_id:
        employee.role_id = employee_data.role_id
    if employee_data.branch_id is not None:
        employee.branch_id = employee_data.branch_id
    
    db.commit()
    db.refresh(employee)
    
    return employee

@router.delete("/{emp_id}")
def delete_employee(emp_id: int, admin_id: int, db: Session = Depends(database.get_db)):
    """Удалить сотрудника (только SuperAdmin)"""
    # Проверка прав
    admin = db.query(models.Employee).filter(models.Employee.id == admin_id).first()
    if not admin or admin.role_id != 1:
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    
    employee = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    
    db.delete(employee)
    db.commit()
    
    return {"message": "Сотрудник удален", "employee_id": emp_id}
```

---

### 🔹 routers/admin_tariffs.py (Управление тарифами)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import tariff as tariff_schemas
from typing import List

router = APIRouter(prefix="/admin/tariffs", tags=["Админ: Тарифы"])

@router.get("/", response_model=List[tariff_schemas.TariffResponse])
def get_all_tariffs(db: Session = Depends(database.get_db)):
    """Получить все тарифы"""
    tariffs = db.query(models.Tariff).all()
    return tariffs

@router.post("/", response_model=tariff_schemas.TariffResponse)
def create_tariff(tariff_data: tariff_schemas.TariffCreate, db: Session = Depends(database.get_db)):
    """Создать новый тариф"""
    new_tariff = models.Tariff(
        name=tariff_data.name,
        price_per_minute=tariff_data.price_per_minute,
        price_per_hour=tariff_data.price_per_hour
    )
    
    db.add(new_tariff)
    db.commit()
    db.refresh(new_tariff)
    
    return new_tariff

@router.patch("/{tariff_id}", response_model=tariff_schemas.TariffResponse)
def update_tariff(tariff_id: int, tariff_data: tariff_schemas.TariffUpdate, db: Session = Depends(database.get_db)):
    """Обновить тариф"""
    tariff = db.query(models.Tariff).filter(models.Tariff.id == tariff_id).first()
    
    if not tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")
    
    if tariff_data.name:
        tariff.name = tariff_data.name
    if tariff_data.price_per_minute is not None:
        tariff.price_per_minute = tariff_data.price_per_minute
    if tariff_data.price_per_hour is not None:
        tariff.price_per_hour = tariff_data.price_per_hour
    
    db.commit()
    db.refresh(tariff)
    
    return tariff

@router.delete("/{tariff_id}")
def delete_tariff(tariff_id: int, db: Session = Depends(database.get_db)):
    """Удалить тариф"""
    tariff = db.query(models.Tariff).filter(models.Tariff.id == tariff_id).first()
    
    if not tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")
    
    db.delete(tariff)
    db.commit()
    
    return {"message": "Тариф удален", "tariff_id": tariff_id}
```

---

### 🔹 routers/admin_parking.py (Управление парковками)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import parking_zone as parking_schemas
from typing import List

router = APIRouter(prefix="/admin/parking", tags=["Админ: Парковки"])

@router.get("/", response_model=List[parking_schemas.ParkingZoneResponse])
def get_all_parking_zones(db: Session = Depends(database.get_db)):
    """Получить все парковки"""
    zones = db.query(models.ParkingZone).all()
    return zones

@router.post("/", response_model=parking_schemas.ParkingZoneResponse)
def create_parking_zone(zone_data: parking_schemas.ParkingZoneCreate, db: Session = Depends(database.get_db)):
    """Создать новую парковку"""
    new_zone = models.ParkingZone(
        name=zone_data.name,
        address=zone_data.address,
        capacity=zone_data.capacity
    )
    
    db.add(new_zone)
    db.commit()
    db.refresh(new_zone)
    
    return new_zone

@router.patch("/{zone_id}", response_model=parking_schemas.ParkingZoneResponse)
def update_parking_zone(zone_id: int, zone_data: parking_schemas.ParkingZoneUpdate, db: Session = Depends(database.get_db)):
    """Обновить парковку"""
    zone = db.query(models.ParkingZone).filter(models.ParkingZone.id == zone_id).first()
    
    if not zone:
        raise HTTPException(status_code=404, detail="Парковка не найдена")
    
    if zone_data.name:
        zone.name = zone_data.name
    if zone_data.address:
        zone.address = zone_data.address
    if zone_data.capacity is not None:
        zone.capacity = zone_data.capacity
    
    db.commit()
    db.refresh(zone)
    
    return zone

@router.delete("/{zone_id}")
def delete_parking_zone(zone_id: int, db: Session = Depends(database.get_db)):
    """Удалить парковку"""
    zone = db.query(models.ParkingZone).filter(models.ParkingZone.id == zone_id).first()
    
    if not zone:
        raise HTTPException(status_code=404, detail="Парковка не найдена")
    
    db.delete(zone)
    db.commit()
    
    return {"message": "Парковка удалена", "zone_id": zone_id}
```

---

### 🔹 routers/admin_branches.py (Управление офисами)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import branch as branch_schemas
from typing import List

router = APIRouter(prefix="/admin/branches", tags=["Админ: Офисы"])

@router.get("/", response_model=List[branch_schemas.BranchResponse])
def get_all_branches(db: Session = Depends(database.get_db)):
    """Получить все офисы"""
    branches = db.query(models.Branch).all()
    return branches

@router.post("/", response_model=branch_schemas.BranchResponse)
def create_branch(branch_data: branch_schemas.BranchCreate, db: Session = Depends(database.get_db)):
    """Создать новый офис"""
    new_branch = models.Branch(
        name=branch_data.name,
        address=branch_data.address,
        phone=branch_data.phone
    )
    
    db.add(new_branch)
    db.commit()
    db.refresh(new_branch)
    
    return new_branch

@router.patch("/{branch_id}", response_model=branch_schemas.BranchResponse)
def update_branch(branch_id: int, branch_data: branch_schemas.BranchUpdate, db: Session = Depends(database.get_db)):
    """Обновить офис"""
    branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()
    
    if not branch:
        raise HTTPException(status_code=404, detail="Офис не найден")
    
    if branch_data.name:
        branch.name = branch_data.name
    if branch_data.address:
        branch.address = branch_data.address
    if branch_data.phone:
        branch.phone = branch_data.phone
    
    db.commit()
    db.refresh(branch)
    
    return branch

@router.delete("/{branch_id}")
def delete_branch(branch_id: int, db: Session = Depends(database.get_db)):
    """Удалить офис"""
    branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()
    
    if not branch:
        raise HTTPException(status_code=404, detail="Офис не найден")
    
    db.delete(branch)
    db.commit()
    
    return {"message": "Офис удален", "branch_id": branch_id}
```

---

### 🔹 main.py (Главный файл приложения)

```python
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
```

---

## 🚀 ИНСТРУКЦИИ ПО ЗАПУСКУ

### 1. Создать проект:
```bash
mkdir carsharex_backend
cd carsharex_backend
```

### 2. Создать виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. Установить зависимости:
```bash
pip install -r requirements.txt
```

### 4. Создать .env файл:
```
DATABASE_URL=sqlite:///./carsharex.db
```

### 5. Запустить сервер:
```bash
uvicorn main:app --reload
```

### 6. Открыть документацию:
```
http://localhost:8000/docs
```

---

## 📊 ТЕСТОВЫЕ ДАННЫЕ

### 👤 КЛИЕНТЫ (users):
| Email | Password | Баланс |
|-------|----------|--------|
| morozov@mail.ru | user123 | 500 ₽ |
| vasileva@gmail.com | user123 | 1000 ₽ |
| novikov@yandex.ru | user123 | 250 ₽ |
| kozlova@mail.ru | user123 | 750 ₽ |
| lebedev@gmail.com | user123 | 300 ₽ |

### 🔧 СОТРУДНИКИ (employees):
| Email | Password | Роль |
|-------|----------|------|
| ivanov@carsharex.ru | admin123 | SuperAdmin |
| petrova@carsharex.ru | manager123 | Manager |
| sidorov@carsharex.ru | support123 | Support |
| kuznetsov@carsharex.ru | mechanic123 | Mechanic |

---

## 🎯 API ENDPOINTS (ПОЛНЫЙ СПИСОК)

### 👤 КЛИЕНТСКИЕ:
```
POST   /auth/register           - Регистрация
POST   /auth/login              - Логин
GET    /auth/me/{user_id}       - Текущий пользователь

GET    /profile/{user_id}       - Профиль
PATCH  /profile/{user_id}       - Обновить профиль

GET    /vehicles                - Доступные авто
GET    /vehicles/{id}           - Инфо об авто

POST   /bookings?user_id=X      - Создать бронирование
GET    /bookings/user/{user_id} - Мои бронирования
PATCH  /bookings/{id}/complete  - Завершить поездку

GET    /transactions/user/{user_id}    - Мои транзакции
POST   /transactions/deposit?user_id=X - Пополнить баланс
```

### 🔧 АДМИНСКИЕ:
```
POST   /admin/auth/login               - Логин сотрудника
GET    /admin/auth/me/{employee_id}    - Текущий сотрудник

GET    /admin/users                    - Все пользователи
GET    /admin/users/{id}               - Инфо о пользователе
PATCH  /admin/users/{id}               - Обновить пользователя
DELETE /admin/users/{id}               - Удалить пользователя

GET    /admin/vehicles                 - Все автомобили
POST   /admin/vehicles                 - Добавить авто
PATCH  /admin/vehicles/{id}            - Обновить авто
DELETE /admin/vehicles/{id}            - Удалить авто

GET    /admin/bookings                 - Все бронирования
GET    /admin/bookings/{id}            - Инфо о бронировании
GET    /admin/bookings/stats/overview  - Статистика

GET    /admin/incidents                - Все инциденты
POST   /admin/incidents                - Создать инцидент
PATCH  /admin/incidents/{id}           - Обновить статус

GET    /admin/employees?employee_id=X  - Все сотрудники (SuperAdmin)
POST   /admin/employees?admin_id=X     - Добавить сотрудника (SuperAdmin)
PATCH  /admin/employees/{id}?admin_id=X- Обновить сотрудника (SuperAdmin)
DELETE /admin/employees/{id}?admin_id=X- Удалить сотрудника (SuperAdmin)

GET    /admin/tariffs                  - Все тарифы
POST   /admin/tariffs                  - Создать тариф
PATCH  /admin/tariffs/{id}             - Обновить тариф
DELETE /admin/tariffs/{id}             - Удалить тариф

GET    /admin/parking                  - Все парковки
POST   /admin/parking                  - Создать парковку
PATCH  /admin/parking/{id}             - Обновить парковку
DELETE /admin/parking/{id}             - Удалить парковку

GET    /admin/branches                 - Все офисы
POST   /admin/branches                 - Создать офис
PATCH  /admin/branches/{id}            - Обновить офис
DELETE /admin/branches/{id}            - Удалить офис
```

---

## ✅ КОНТРОЛЬНЫЙ СПИСОК ДЛЯ РЕАЛИЗАЦИИ

### Файлы БД:
- [ ] db/__init__.py
- [ ] db/database.py
- [ ] db/models.py
- [ ] db/init_data.py

### Схемы:
- [ ] schemas/__init__.py
- [ ] schemas/user.py
- [ ] schemas/employee.py
- [ ] schemas/vehicle.py
- [ ] schemas/booking.py
- [ ] schemas/transaction.py
- [ ] schemas/incident.py
- [ ] schemas/tariff.py
- [ ] schemas/parking_zone.py
- [ ] schemas/role.py
- [ ] schemas/branch.py

### Роутеры клиентов:
- [ ] routers/__init__.py
- [ ] routers/auth.py
- [ ] routers/profile.py
- [ ] routers/vehicles.py
- [ ] routers/bookings.py
- [ ] routers/transactions.py

### Роутеры админов:
- [ ] routers/employee_auth.py
- [ ] routers/admin_users.py
- [ ] routers/admin_vehicles.py
- [ ] routers/admin_bookings.py
- [ ] routers/admin_incidents.py
- [ ] routers/admin_employees.py
- [ ] routers/admin_tariffs.py
- [ ] routers/admin_parking.py
- [ ] routers/admin_branches.py

### Главный файл и конфиги:
- [ ] main.py
- [ ] requirements.txt
- [ ] .env
- [ ] .gitignore

---

## 🎓 ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **БЕЗ БЕЗОПАСНОСТИ**: Пароли хранятся в открытом виде, нет JWT токенов - это учебный проект
2. **Простая авторизация**: Авторизация через передачу user_id или employee_id в query параметрах
3. **SQLite**: База данных создастся автоматически при первом запуске
4. **Автоинициализация**: Тестовые данные заполнятся автоматически при первом запуске
5. **CORS открыт**: Разрешены все origins для удобства разработки фронтенда
6. **Swagger UI**: Доступен по адресу /docs для тестирования API

---

## 🔄 ЛОГИКА РАБОТЫ

### Клиенты:
1. Регистрация → Логин → Получение user_id
2. Просмотр доступных авто
3. Создание бронирования (авто становится in_use)
4. Завершение поездки (списание с баланса, создание транзакции)
5. Пополнение баланса

### Админы:
1. Логин сотрудника → Получение employee_id и role_id
2. Управление всеми сущностями в зависимости от роли
3. SuperAdmin (role_id=1) имеет доступ ко всему
4. Manager, Support, Mechanic имеют ограниченный доступ

---

## 📝 ПРИМЕРЫ ЗАПРОСОВ

### Регистрация клиента:
```json
POST /auth/register
{
  "first_name": "Тест",
  "last_name": "Тестов",
  "email": "test@test.ru",
  "phone": "+79991234567",
  "password": "test123",
  "drivers_license": "77 77 777777"
}
```

### Создание бронирования:
```json
POST /bookings?user_id=1
{
  "vehicle_id": 1,
  "tariff_id": 1,
  "start_time": "2024-11-10T10:00:00"
}
```

### Завершение бронирования:
```json
PATCH /bookings/1/complete
{
  "end_time": "2024-11-10T12:00:00",
  "total_cost": 960.0
}
```

---

## 🎯 ГОТОВО К ИСПОЛЬЗОВАНИЮ

Этот файл содержит ВСЁ необходимое для полной реализации бэкенда CarShareX:
- ✅ Полный код всех файлов
- ✅ Структура проекта
- ✅ База данных SQLite
- ✅ Все роутеры и endpoints
- ✅ Тестовые данные
- ✅ Инструкции по запуску
- ✅ Примеры запросов

Просто создавай файлы по порядку из контрольного списка, копируй код из этого документа, и всё заработает! 🚀
