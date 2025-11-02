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
        year=vehicle_data.year,
        color=vehicle_data.color,
        image_url=vehicle_data.image_url,
        description=vehicle_data.description,
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
    if vehicle_data.year is not None:
        vehicle.year = vehicle_data.year
    if vehicle_data.color:
        vehicle.color = vehicle_data.color
    if vehicle_data.image_url:
        vehicle.image_url = vehicle_data.image_url
    if vehicle_data.description:
        vehicle.description = vehicle_data.description
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
