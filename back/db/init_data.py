from sqlalchemy.orm import Session
from . import models
import random

def initialize_database(db: Session):
    """Инициализация базы данных тестовыми данными"""

    # Проверяем, есть ли уже данные
    if db.query(models.Role).count() > 0:
        print("ℹ️  База данных уже заполнена")
        return

    print("\n" + "="*50)
    print("🚀 Инициализация базы данных...")
    print("="*50 + "\n")

    # Картинка автомобиля (одна для всех)
    car_image_url = "https://www.ixbt.com/img/n1/news/2024/10/1/cc7b4f9fc16e8192047257514d86572e_large.jpg"

    def get_random_car_image():
        """Возвращает картинку автомобиля"""
        return car_image_url

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
        {"first_name": "Иван", "last_name": "Морозов", "email": "morozov@mail.ru", "phone": "+79161234572", "password": "user123", "drivers_license": "77 12 345678", "balance": 10000.0},
        {"first_name": "Елена", "last_name": "Васильева", "email": "vasileva@gmail.com", "phone": "+79161234573", "password": "user123", "drivers_license": "77 23 456789", "balance": 10000.0},
        {"first_name": "Михаил", "last_name": "Новиков", "email": "novikov@yandex.ru", "phone": "+79161234574", "password": "user123", "drivers_license": "77 34 567890", "balance": 10000.0},
        {"first_name": "Ольга", "last_name": "Козлова", "email": "kozlova@mail.ru", "phone": "+79161234575", "password": "user123", "drivers_license": "77 45 678901", "balance": 10000.0},
        {"first_name": "Александр", "last_name": "Лебедев", "email": "lebedev@gmail.com", "phone": "+79161234576", "password": "user123", "drivers_license": "77 56 789012", "balance": 10000.0}
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
        {"name": "Суточный", "price_per_minute": None, "price_per_hour": 100.0},  # ~2400₽ за сутки
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

    # Автомобили (расширенный список с фото и описаниями)
    vehicles_data = [
        # Sedans (Эконом)
        {"license_plate": "А123ВС777", "brand": "Kia", "model": "Rio", "vehicle_type": "sedan", "year": 2022, "color": "Белый", "image_url": "https://images.unsplash.com/photo-1609521263047-f8f205293f24", "description": "Комфортный седан для городских поездок", "status": "available", "parking_zone_id": 1, "tariff_id": 1},
        {"license_plate": "В456ЕК199", "brand": "Hyundai", "model": "Solaris", "vehicle_type": "sedan", "year": 2023, "color": "Серебристый", "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", "description": "Надежный седан с экономичным расходом", "status": "available", "parking_zone_id": 1, "tariff_id": 1},
        {"license_plate": "Е012ОР199", "brand": "Volkswagen", "model": "Polo", "vehicle_type": "sedan", "year": 2021, "color": "Синий", "image_url": "https://images.unsplash.com/photo-1583121274602-3e2820c69888", "description": "Немецкое качество и комфорт", "status": "available", "parking_zone_id": 3, "tariff_id": 1},
        {"license_plate": "К345СТ777", "brand": "Skoda", "model": "Rapid", "vehicle_type": "sedan", "year": 2022, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2", "description": "Просторный седан для дальних поездок", "status": "in_use", "parking_zone_id": 4, "tariff_id": 1},
        {"license_plate": "Р890ЭЮ199", "brand": "Kia", "model": "Rio", "vehicle_type": "sedan", "year": 2020, "color": "Красный", "image_url": "https://images.unsplash.com/photo-1609521263047-f8f205293f24", "description": "Экономичный городской автомобиль", "status": "maintenance", "parking_zone_id": None, "tariff_id": 1},
        {"license_plate": "Т111АВ777", "brand": "Renault", "model": "Logan", "vehicle_type": "sedan", "year": 2022, "color": "Серый", "image_url": "https://images.unsplash.com/photo-1590362891991-f776e747a588", "description": "Практичный седан для любых задач", "status": "available", "parking_zone_id": 2, "tariff_id": 1},
        {"license_plate": "У222ВО199", "brand": "Volkswagen", "model": "Jetta", "vehicle_type": "sedan", "year": 2023, "color": "Белый", "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341", "description": "Стильный седан премиум-класса", "status": "available", "parking_zone_id": 4, "tariff_id": 2},
        {"license_plate": "Ф333СМ777", "brand": "Toyota", "model": "Camry", "vehicle_type": "sedan", "year": 2023, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", "description": "Премиальный седан для деловых поездок", "status": "available", "parking_zone_id": 1, "tariff_id": 4},
        {"license_plate": "Х444НР199", "brand": "Hyundai", "model": "Elantra", "vehicle_type": "sedan", "year": 2022, "color": "Серебристый", "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2", "description": "Современный дизайн и технологии", "status": "available", "parking_zone_id": 3, "tariff_id": 1},
        {"license_plate": "Ц555ОТ777", "brand": "Skoda", "model": "Octavia", "vehicle_type": "sedan", "year": 2023, "color": "Синий", "image_url": "https://images.unsplash.com/photo-1583121274602-3e2820c69888", "description": "Вместительный и экономичный", "status": "available", "parking_zone_id": 5, "tariff_id": 2},

        # SUV (Кроссоверы)
        {"license_plate": "С789МН777", "brand": "Renault", "model": "Duster", "vehicle_type": "suv", "year": 2022, "color": "Оранжевый", "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf", "description": "Надежный внедорожник для любых дорог", "status": "available", "parking_zone_id": 2, "tariff_id": 2},
        {"license_plate": "Ч666ПУ199", "brand": "Nissan", "model": "Qashqai", "vehicle_type": "suv", "year": 2023, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b", "description": "Городской кроссовер с полным приводом", "status": "available", "parking_zone_id": 1, "tariff_id": 2},
        {"license_plate": "Ш777РФ777", "brand": "Hyundai", "model": "Tucson", "vehicle_type": "suv", "year": 2022, "color": "Белый", "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6", "description": "Просторный кроссовер для всей семьи", "status": "available", "parking_zone_id": 3, "tariff_id": 2},
        {"license_plate": "Щ888СХ199", "brand": "Kia", "model": "Sportage", "vehicle_type": "suv", "year": 2023, "color": "Серый", "image_url": "https://images.unsplash.com/photo-1609521263047-f8f205293f24", "description": "Спортивный кроссовер с мощным двигателем", "status": "available", "parking_zone_id": 4, "tariff_id": 2},
        {"license_plate": "Э999ТЦ777", "brand": "Volkswagen", "model": "Tiguan", "vehicle_type": "suv", "year": 2023, "color": "Синий", "image_url": "https://images.unsplash.com/photo-1562911791-c7a97b729ec5", "description": "Немецкое качество в формате SUV", "status": "available", "parking_zone_id": 5, "tariff_id": 4},
        {"license_plate": "Ю100УЧ199", "brand": "Toyota", "model": "RAV4", "vehicle_type": "suv", "year": 2023, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1581540222194-0def2dda95b8", "description": "Легендарная надежность Toyota", "status": "available", "parking_zone_id": 2, "tariff_id": 4},
        {"license_plate": "Я200ФШ777", "brand": "Mazda", "model": "CX-5", "vehicle_type": "suv", "year": 2022, "color": "Красный", "image_url": "https://images.unsplash.com/photo-1553440569-bcc63803a83d", "description": "Стильный японский кроссовер", "status": "available", "parking_zone_id": 1, "tariff_id": 2},
        {"license_plate": "А300ЩЫ199", "brand": "Honda", "model": "CR-V", "vehicle_type": "suv", "year": 2023, "color": "Серебристый", "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6", "description": "Практичный семейный кроссовер", "status": "available", "parking_zone_id": 3, "tariff_id": 2},

        # Electric (Электромобили)
        {"license_plate": "М678УФ199", "brand": "Tesla", "model": "Model 3", "vehicle_type": "electric", "year": 2023, "color": "Белый", "image_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89", "description": "Премиальный электромобиль с автопилотом", "status": "available", "parking_zone_id": 2, "tariff_id": 4},
        {"license_plate": "Н901ХЦ777", "brand": "Nissan", "model": "Leaf", "vehicle_type": "electric", "year": 2022, "color": "Синий", "image_url": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7", "description": "Доступный электромобиль для города", "status": "available", "parking_zone_id": 5, "tariff_id": 2},
        {"license_plate": "Б400ЭЮ777", "brand": "Tesla", "model": "Model Y", "vehicle_type": "electric", "year": 2023, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1617788138017-80ad40651399", "description": "Электрический кроссовер премиум", "status": "available", "parking_zone_id": 1, "tariff_id": 4},
        {"license_plate": "В500ЯА199", "brand": "Hyundai", "model": "Ioniq 5", "vehicle_type": "electric", "year": 2023, "color": "Серый", "image_url": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7", "description": "Инновационный электрокроссовер", "status": "available", "parking_zone_id": 4, "tariff_id": 4},
        {"license_plate": "Г600БВ777", "brand": "Volkswagen", "model": "ID.4", "vehicle_type": "electric", "year": 2023, "color": "Белый", "image_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89", "description": "Немецкий электромобиль нового поколения", "status": "available", "parking_zone_id": 2, "tariff_id": 4},
        {"license_plate": "Д700ГД199", "brand": "BMW", "model": "i4", "vehicle_type": "electric", "year": 2023, "color": "Синий", "image_url": "https://images.unsplash.com/photo-1617788138017-80ad40651399", "description": "Спортивный электрический седан BMW", "status": "available", "parking_zone_id": 5, "tariff_id": 4},
        {"license_plate": "Е800ЕЖ777", "brand": "Audi", "model": "e-tron", "vehicle_type": "electric", "year": 2023, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7", "description": "Роскошный электрический кроссовер", "status": "available", "parking_zone_id": 3, "tariff_id": 4},

        # Hybrid (Гибриды)
        {"license_plate": "О234ЧШ199", "brand": "Toyota", "model": "Prius", "vehicle_type": "hybrid", "year": 2022, "color": "Серебристый", "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", "description": "Экономичный гибрид для города", "status": "available", "parking_zone_id": 3, "tariff_id": 2},
        {"license_plate": "П567ЩЫ777", "brand": "Lexus", "model": "UX 300h", "vehicle_type": "hybrid", "year": 2023, "color": "Белый", "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2", "description": "Премиальный гибридный кроссовер", "status": "available", "parking_zone_id": 1, "tariff_id": 4},
        {"license_plate": "Ж900ЗИ199", "brand": "Toyota", "model": "Camry Hybrid", "vehicle_type": "hybrid", "year": 2023, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1583121274602-3e2820c69888", "description": "Бизнес-седан с гибридной установкой", "status": "available", "parking_zone_id": 2, "tariff_id": 4},
        {"license_plate": "З101КЛ777", "brand": "Honda", "model": "Accord Hybrid", "vehicle_type": "hybrid", "year": 2022, "color": "Синий", "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341", "description": "Надежный гибридный седан", "status": "available", "parking_zone_id": 4, "tariff_id": 2},
        {"license_plate": "И202МН199", "brand": "Lexus", "model": "NX 300h", "vehicle_type": "hybrid", "year": 2023, "color": "Серый", "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6", "description": "Роскошный гибридный кроссовер", "status": "available", "parking_zone_id": 5, "tariff_id": 4},
        {"license_plate": "К303ОП777", "brand": "Kia", "model": "Niro Hybrid", "vehicle_type": "hybrid", "year": 2022, "color": "Зеленый", "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", "description": "Компактный и экономичный гибрид", "status": "available", "parking_zone_id": 1, "tariff_id": 2},
        {"license_plate": "Л404РС199", "brand": "Toyota", "model": "RAV4 Hybrid", "vehicle_type": "hybrid", "year": 2023, "color": "Белый", "image_url": "https://images.unsplash.com/photo-1581540222194-0def2dda95b8", "description": "Гибридный кроссовер для приключений", "status": "available", "parking_zone_id": 3, "tariff_id": 4},

        # Premium (Премиум сегмент)
        {"license_plate": "М505ТУ777", "brand": "BMW", "model": "3 Series", "vehicle_type": "sedan", "year": 2023, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e", "description": "Спортивный премиум седан", "status": "available", "parking_zone_id": 2, "tariff_id": 4},
        {"license_plate": "Н606ФХ199", "brand": "Mercedes", "model": "C-Class", "vehicle_type": "sedan", "year": 2023, "color": "Серебристый", "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8", "description": "Классика немецкого премиума", "status": "available", "parking_zone_id": 4, "tariff_id": 4},
        {"license_plate": "О707ЦЧ777", "brand": "Audi", "model": "A4", "vehicle_type": "sedan", "year": 2023, "color": "Серый", "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6", "description": "Технологичный бизнес-седан", "status": "available", "parking_zone_id": 1, "tariff_id": 4},
        {"license_plate": "П808ШЩ199", "brand": "BMW", "model": "X5", "vehicle_type": "suv", "year": 2023, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b", "description": "Флагманский премиум кроссовер", "status": "available", "parking_zone_id": 5, "tariff_id": 4},
        {"license_plate": "Р909ЪЫ777", "brand": "Mercedes", "model": "GLE", "vehicle_type": "suv", "year": 2023, "color": "Белый", "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6", "description": "Роскошный кроссовер для дальних поездок", "status": "available", "parking_zone_id": 3, "tariff_id": 4},
        {"license_plate": "С010ЬЭ199", "brand": "Audi", "model": "Q7", "vehicle_type": "suv", "year": 2023, "color": "Синий", "image_url": "https://images.unsplash.com/photo-1562911791-c7a97b729ec5", "description": "Семиместный премиум внедорожник", "status": "available", "parking_zone_id": 2, "tariff_id": 4},
        {"license_plate": "Т111ЮЯ777", "brand": "Lexus", "model": "ES 250", "vehicle_type": "sedan", "year": 2023, "color": "Черный", "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", "description": "Комфортный премиум седан", "status": "available", "parking_zone_id": 4, "tariff_id": 4}
    ]

    for vehicle_data in vehicles_data:
        # Заменяем image_url на случайную картинку из доступных
        vehicle_data['image_url'] = get_random_car_image()
        vehicle = models.Vehicle(**vehicle_data)
        db.add(vehicle)

    db.commit()
    print("✅ Автомобили созданы (с рандомными картинками из 5 доступных в РФ)")

    # Бронирования (расширенный список)
    from datetime import datetime, timedelta
    bookings_data = [
        # Завершенные бронирования
        {"user_id": 1, "vehicle_id": 1, "tariff_id": 1, "start_time": datetime(2024, 10, 20, 9, 0), "end_time": datetime(2024, 10, 20, 10, 30), "total_cost": 720.0, "status": "completed"},
        {"user_id": 2, "vehicle_id": 2, "tariff_id": 2, "start_time": datetime(2024, 10, 20, 14, 0), "end_time": datetime(2024, 10, 20, 17, 0), "total_cost": 1050.0, "status": "completed"},
        {"user_id": 3, "vehicle_id": 3, "tariff_id": 2, "start_time": datetime(2024, 10, 21, 11, 0), "end_time": datetime(2024, 10, 21, 13, 30), "total_cost": 875.0, "status": "completed"},
        {"user_id": 4, "vehicle_id": 15, "tariff_id": 4, "start_time": datetime(2024, 10, 21, 16, 0), "end_time": datetime(2024, 10, 21, 18, 0), "total_cost": 1440.0, "status": "completed"},
        {"user_id": 5, "vehicle_id": 4, "tariff_id": 1, "start_time": datetime(2024, 10, 22, 19, 0), "end_time": datetime(2024, 10, 22, 20, 0), "total_cost": 480.0, "status": "completed"},
        {"user_id": 1, "vehicle_id": 6, "tariff_id": 2, "start_time": datetime(2024, 10, 23, 8, 30), "end_time": datetime(2024, 10, 23, 12, 0), "total_cost": 1225.0, "status": "completed"},
        {"user_id": 2, "vehicle_id": 7, "tariff_id": 1, "start_time": datetime(2024, 10, 23, 15, 0), "end_time": datetime(2024, 10, 23, 16, 30), "total_cost": 720.0, "status": "completed"},
        {"user_id": 3, "vehicle_id": 8, "tariff_id": 4, "start_time": datetime(2024, 10, 24, 10, 0), "end_time": datetime(2024, 10, 24, 14, 0), "total_cost": 2880.0, "status": "completed"},
        {"user_id": 4, "vehicle_id": 9, "tariff_id": 2, "start_time": datetime(2024, 10, 24, 18, 0), "end_time": datetime(2024, 10, 24, 21, 0), "total_cost": 1050.0, "status": "completed"},
        {"user_id": 5, "vehicle_id": 10, "tariff_id": 1, "start_time": datetime(2024, 10, 25, 7, 0), "end_time": datetime(2024, 10, 25, 9, 0), "total_cost": 960.0, "status": "completed"},
        {"user_id": 1, "vehicle_id": 11, "tariff_id": 2, "start_time": datetime(2024, 10, 25, 12, 0), "end_time": datetime(2024, 10, 25, 15, 30), "total_cost": 1225.0, "status": "completed"},
        {"user_id": 2, "vehicle_id": 12, "tariff_id": 4, "start_time": datetime(2024, 10, 26, 9, 0), "end_time": datetime(2024, 10, 26, 11, 0), "total_cost": 1440.0, "status": "completed"},
        {"user_id": 3, "vehicle_id": 13, "tariff_id": 1, "start_time": datetime(2024, 10, 26, 16, 0), "end_time": datetime(2024, 10, 26, 18, 30), "total_cost": 1200.0, "status": "completed"},
        {"user_id": 4, "vehicle_id": 14, "tariff_id": 2, "start_time": datetime(2024, 10, 27, 8, 0), "end_time": datetime(2024, 10, 27, 12, 0), "total_cost": 1400.0, "status": "completed"},
        {"user_id": 5, "vehicle_id": 16, "tariff_id": 4, "start_time": datetime(2024, 10, 27, 14, 0), "end_time": datetime(2024, 10, 27, 17, 0), "total_cost": 2160.0, "status": "completed"},
        {"user_id": 1, "vehicle_id": 17, "tariff_id": 1, "start_time": datetime(2024, 10, 28, 10, 0), "end_time": datetime(2024, 10, 28, 11, 0), "total_cost": 480.0, "status": "completed"},
        {"user_id": 2, "vehicle_id": 18, "tariff_id": 2, "start_time": datetime(2024, 10, 28, 15, 0), "end_time": datetime(2024, 10, 28, 18, 0), "total_cost": 1050.0, "status": "completed"},
        {"user_id": 3, "vehicle_id": 19, "tariff_id": 4, "start_time": datetime(2024, 10, 29, 9, 0), "end_time": datetime(2024, 10, 29, 13, 0), "total_cost": 2880.0, "status": "completed"},
        {"user_id": 4, "vehicle_id": 20, "tariff_id": 1, "start_time": datetime(2024, 10, 29, 16, 0), "end_time": datetime(2024, 10, 29, 17, 30), "total_cost": 720.0, "status": "completed"},
        {"user_id": 5, "vehicle_id": 21, "tariff_id": 2, "start_time": datetime(2024, 10, 30, 8, 0), "end_time": datetime(2024, 10, 30, 11, 0), "total_cost": 1050.0, "status": "completed"},
        {"user_id": 1, "vehicle_id": 22, "tariff_id": 4, "start_time": datetime(2024, 10, 30, 13, 0), "end_time": datetime(2024, 10, 30, 16, 0), "total_cost": 2160.0, "status": "completed"},
        {"user_id": 2, "vehicle_id": 23, "tariff_id": 1, "start_time": datetime(2024, 10, 31, 10, 0), "end_time": datetime(2024, 10, 31, 12, 0), "total_cost": 960.0, "status": "completed"},
        {"user_id": 3, "vehicle_id": 24, "tariff_id": 2, "start_time": datetime(2024, 10, 31, 14, 0), "end_time": datetime(2024, 10, 31, 17, 30), "total_cost": 1225.0, "status": "completed"},
        {"user_id": 4, "vehicle_id": 25, "tariff_id": 4, "start_time": datetime(2024, 11, 1, 9, 0), "end_time": datetime(2024, 11, 1, 12, 0), "total_cost": 2160.0, "status": "completed"},
        {"user_id": 5, "vehicle_id": 26, "tariff_id": 1, "start_time": datetime(2024, 11, 1, 15, 0), "end_time": datetime(2024, 11, 1, 16, 30), "total_cost": 720.0, "status": "completed"},

        # Активные бронирования
        {"user_id": 1, "vehicle_id": 5, "tariff_id": 1, "start_time": datetime(2024, 11, 2, 8, 0), "end_time": None, "total_cost": 0.0, "status": "active"},
        {"user_id": 3, "vehicle_id": 27, "tariff_id": 2, "start_time": datetime(2024, 11, 2, 10, 0), "end_time": None, "total_cost": 0.0, "status": "active"},

        # Ожидающие бронирования
        {"user_id": 2, "vehicle_id": 28, "tariff_id": 4, "start_time": datetime(2024, 11, 3, 9, 0), "end_time": None, "total_cost": 0.0, "status": "pending"},
        {"user_id": 4, "vehicle_id": 29, "tariff_id": 1, "start_time": datetime(2024, 11, 3, 14, 0), "end_time": None, "total_cost": 0.0, "status": "pending"},
        {"user_id": 5, "vehicle_id": 30, "tariff_id": 2, "start_time": datetime(2024, 11, 4, 10, 0), "end_time": None, "total_cost": 0.0, "status": "pending"}
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
