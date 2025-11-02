from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import models, database
from schemas import vehicle as vehicle_schemas
from typing import List, Optional

router = APIRouter(prefix="/vehicles", tags=["Автомобили для клиентов"])

@router.get("/", response_model=List[vehicle_schemas.VehicleResponse])
def get_available_vehicles(
    vehicle_type: Optional[str] = Query(None, description="Фильтр по типу: sedan, suv, electric, hybrid"),
    tariff_id: Optional[int] = Query(None, description="Фильтр по тарифу"),
    parking_zone_id: Optional[int] = Query(None, description="Фильтр по парковочной зоне"),
    brand: Optional[str] = Query(None, description="Фильтр по марке"),
    status: Optional[str] = Query("available", description="Фильтр по статусу"),
    db: Session = Depends(database.get_db)
):
    """Получить список автомобилей с фильтрацией"""
    query = db.query(models.Vehicle)

    # Применяем фильтры
    if status:
        query = query.filter(models.Vehicle.status == status)
    if vehicle_type:
        query = query.filter(models.Vehicle.vehicle_type == vehicle_type)
    if tariff_id:
        query = query.filter(models.Vehicle.tariff_id == tariff_id)
    if parking_zone_id:
        query = query.filter(models.Vehicle.parking_zone_id == parking_zone_id)
    if brand:
        query = query.filter(models.Vehicle.brand.ilike(f"%{brand}%"))

    vehicles = query.all()
    return vehicles

@router.get("/{vehicle_id}", response_model=vehicle_schemas.VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(database.get_db)):
    """Получить информацию об автомобиле"""
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")

    return vehicle
