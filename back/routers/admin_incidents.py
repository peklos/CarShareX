from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import incident as incident_schemas
from typing import List

router = APIRouter(prefix="/admin/incidents", tags=["Админ: Инциденты"])

@router.get("/", response_model=List[incident_schemas.IncidentResponse])
def get_all_incidents(db: Session = Depends(database.get_db)):
    """Получить все инциденты"""
    incidents = db.query(models.Incident).all()
    return incidents

@router.post("/", response_model=incident_schemas.IncidentResponse)
def create_incident(incident_data: incident_schemas.IncidentCreate, db: Session = Depends(database.get_db)):
    """Создать новый инцидент"""
    new_incident = models.Incident(
        booking_id=incident_data.booking_id,
        vehicle_id=incident_data.vehicle_id,
        incident_type=incident_data.incident_type,
        description=incident_data.description,
        status="reported"
    )

    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)

    return new_incident

@router.patch("/{incident_id}", response_model=incident_schemas.IncidentResponse)
def update_incident_status(incident_id: int, update_data: incident_schemas.IncidentUpdate, db: Session = Depends(database.get_db)):
    """Обновить статус инцидента"""
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()

    if not incident:
        raise HTTPException(status_code=404, detail="Инцидент не найден")

    incident.status = update_data.status

    db.commit()
    db.refresh(incident)

    return incident
