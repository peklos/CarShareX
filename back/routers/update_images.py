from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import models, database
import random

router = APIRouter(prefix="/admin", tags=["Утилиты"])

@router.post("/update-car-images")
def update_car_images(db: Session = Depends(database.get_db)):
    """Обновить все картинки автомобилей на Loremflickr"""

    car_images = [
        "https://loremflickr.com/800/600/car?random=1",
        "https://loremflickr.com/800/600/car?random=2",
        "https://loremflickr.com/800/600/car?random=3",
        "https://loremflickr.com/800/600/car?random=4",
        "https://loremflickr.com/800/600/car?random=5"
    ]

    vehicles = db.query(models.Vehicle).all()
    updated_count = 0

    for vehicle in vehicles:
        vehicle.image_url = random.choice(car_images)
        updated_count += 1

    db.commit()

    return {
        "message": f"Обновлено {updated_count} автомобилей",
        "updated_count": updated_count
    }
