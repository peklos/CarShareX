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
