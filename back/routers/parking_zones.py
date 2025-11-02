from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import parking_zone as parking_schemas
from typing import List

router = APIRouter(prefix="/parking-zones", tags=["Парковочные зоны"])

@router.get("/", response_model=List[parking_schemas.ParkingZoneResponse])
def get_all_parking_zones(db: Session = Depends(database.get_db)):
    """Получить все парковочные зоны"""
    zones = db.query(models.ParkingZone).all()
    return zones

@router.get("/{zone_id}", response_model=parking_schemas.ParkingZoneResponse)
def get_parking_zone(zone_id: int, db: Session = Depends(database.get_db)):
    """Получить информацию о парковочной зоне"""
    zone = db.query(models.ParkingZone).filter(models.ParkingZone.id == zone_id).first()

    if not zone:
        raise HTTPException(status_code=404, detail="Парковочная зона не найдена")

    return zone
