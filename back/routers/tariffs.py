from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import tariff as tariff_schemas
from typing import List

router = APIRouter(prefix="/tariffs", tags=["Тарифы"])

@router.get("/", response_model=List[tariff_schemas.TariffResponse])
def get_all_tariffs(db: Session = Depends(database.get_db)):
    """Получить все доступные тарифы"""
    tariffs = db.query(models.Tariff).all()
    return tariffs

@router.get("/{tariff_id}", response_model=tariff_schemas.TariffResponse)
def get_tariff(tariff_id: int, db: Session = Depends(database.get_db)):
    """Получить информацию о тарифе"""
    tariff = db.query(models.Tariff).filter(models.Tariff.id == tariff_id).first()

    if not tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")

    return tariff
