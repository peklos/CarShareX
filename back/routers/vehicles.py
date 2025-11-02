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
