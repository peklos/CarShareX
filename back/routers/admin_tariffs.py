from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import tariff as tariff_schemas
from typing import List

router = APIRouter(prefix="/admin/tariffs", tags=["Админ: Тарифы"])

@router.get("/", response_model=List[tariff_schemas.TariffResponse])
def get_all_tariffs(db: Session = Depends(database.get_db)):
    """Получить все тарифы"""
    tariffs = db.query(models.Tariff).all()
    return tariffs

@router.post("/", response_model=tariff_schemas.TariffResponse)
def create_tariff(tariff_data: tariff_schemas.TariffCreate, db: Session = Depends(database.get_db)):
    """Создать новый тариф"""
    new_tariff = models.Tariff(
        name=tariff_data.name,
        price_per_minute=tariff_data.price_per_minute,
        price_per_hour=tariff_data.price_per_hour
    )

    db.add(new_tariff)
    db.commit()
    db.refresh(new_tariff)

    return new_tariff

@router.patch("/{tariff_id}", response_model=tariff_schemas.TariffResponse)
def update_tariff(tariff_id: int, tariff_data: tariff_schemas.TariffUpdate, db: Session = Depends(database.get_db)):
    """Обновить тариф"""
    tariff = db.query(models.Tariff).filter(models.Tariff.id == tariff_id).first()

    if not tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")

    if tariff_data.name:
        tariff.name = tariff_data.name
    if tariff_data.price_per_minute is not None:
        tariff.price_per_minute = tariff_data.price_per_minute
    if tariff_data.price_per_hour is not None:
        tariff.price_per_hour = tariff_data.price_per_hour

    db.commit()
    db.refresh(tariff)

    return tariff

@router.delete("/{tariff_id}")
def delete_tariff(tariff_id: int, db: Session = Depends(database.get_db)):
    """Удалить тариф"""
    tariff = db.query(models.Tariff).filter(models.Tariff.id == tariff_id).first()

    if not tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")

    db.delete(tariff)
    db.commit()

    return {"message": "Тариф удален", "tariff_id": tariff_id}
