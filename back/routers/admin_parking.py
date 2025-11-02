from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import parking_zone as parking_schemas
from typing import List

router = APIRouter(prefix="/admin/parking", tags=["Админ: Парковки"])

@router.get("/", response_model=List[parking_schemas.ParkingZoneResponse])
def get_all_parking_zones(db: Session = Depends(database.get_db)):
    """Получить все парковки"""
    zones = db.query(models.ParkingZone).all()
    return zones

@router.post("/", response_model=parking_schemas.ParkingZoneResponse)
def create_parking_zone(zone_data: parking_schemas.ParkingZoneCreate, db: Session = Depends(database.get_db)):
    """Создать новую парковку"""
    new_zone = models.ParkingZone(
        name=zone_data.name,
        address=zone_data.address,
        capacity=zone_data.capacity
    )

    db.add(new_zone)
    db.commit()
    db.refresh(new_zone)

    return new_zone

@router.patch("/{zone_id}", response_model=parking_schemas.ParkingZoneResponse)
def update_parking_zone(zone_id: int, zone_data: parking_schemas.ParkingZoneUpdate, db: Session = Depends(database.get_db)):
    """Обновить парковку"""
    zone = db.query(models.ParkingZone).filter(models.ParkingZone.id == zone_id).first()

    if not zone:
        raise HTTPException(status_code=404, detail="Парковка не найдена")

    if zone_data.name:
        zone.name = zone_data.name
    if zone_data.address:
        zone.address = zone_data.address
    if zone_data.capacity is not None:
        zone.capacity = zone_data.capacity

    db.commit()
    db.refresh(zone)

    return zone

@router.delete("/{zone_id}")
def delete_parking_zone(zone_id: int, db: Session = Depends(database.get_db)):
    """Удалить парковку"""
    zone = db.query(models.ParkingZone).filter(models.ParkingZone.id == zone_id).first()

    if not zone:
        raise HTTPException(status_code=404, detail="Парковка не найдена")

    db.delete(zone)
    db.commit()

    return {"message": "Парковка удалена", "zone_id": zone_id}
