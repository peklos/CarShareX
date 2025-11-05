from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import models, database

router = APIRouter(prefix="/admin", tags=["Утилиты"])

@router.post("/update-car-images")
def update_car_images(db: Session = Depends(database.get_db)):
    """Обновить все картинки автомобилей"""

    car_image_url = "https://www.ixbt.com/img/n1/news/2024/10/1/cc7b4f9fc16e8192047257514d86572e_large.jpg"

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
