from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import models, database

router = APIRouter(tags=["Утилиты"])

@router.post("/admin/update-car-images")
def update_car_images(db: Session = Depends(database.get_db)):
    """Обновить все картинки автомобилей"""

    car_image_url = "/car.png"

    vehicles = db.query(models.Vehicle).all()
    updated_count = 0

    for vehicle in vehicles:
        vehicle.image_url = car_image_url
        updated_count += 1

    db.commit()

    return {
        "message": f"Обновлено {updated_count} автомобилей",
        "updated_count": updated_count
    }

@router.get("/update-images")
def update_car_images_public(db: Session = Depends(database.get_db)):
    """Публичный эндпоинт для обновления картинок"""

    car_image_url = "/car.png"

    vehicles = db.query(models.Vehicle).all()
    updated_count = 0

    for vehicle in vehicles:
        vehicle.image_url = car_image_url
        updated_count += 1

    db.commit()

    return {
        "message": f"Обновлено {updated_count} автомобилей",
        "updated_count": updated_count
    }
