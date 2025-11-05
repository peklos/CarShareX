"""
Скрипт для обновления всех image_url машин в базе данных на /car.png
"""
import sys
import os

# Добавляем родительскую директорию в путь для импорта модулей
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db import models
from db.database import DATABASE_URL

def update_vehicle_images():
    """Обновить все картинки автомобилей на /car.png"""
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        # Получаем все машины
        vehicles = db.query(models.Vehicle).all()

        print(f"Найдено машин: {len(vehicles)}")

        # Обновляем image_url для каждой машины
        updated_count = 0
        for vehicle in vehicles:
            if vehicle.image_url != "/car.png":
                vehicle.image_url = "/car.png"
                updated_count += 1

        db.commit()

        print(f"✅ Обновлено {updated_count} машин")
        print(f"Всех машин в базе: {len(vehicles)}")

    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_vehicle_images()
