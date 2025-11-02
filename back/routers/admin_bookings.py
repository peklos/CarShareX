from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import booking as booking_schemas
from typing import List

router = APIRouter(prefix="/admin/bookings", tags=["Админ: Бронирования"])

@router.get("/", response_model=List[booking_schemas.BookingResponse])
def get_all_bookings(db: Session = Depends(database.get_db)):
    """Получить все бронирования"""
    bookings = db.query(models.Booking).all()
    return bookings

@router.get("/{booking_id}", response_model=booking_schemas.BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(database.get_db)):
    """Получить бронирование по ID"""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    return booking

@router.get("/stats/overview")
def get_bookings_stats(db: Session = Depends(database.get_db)):
    """Статистика по бронированиям"""
    total = db.query(models.Booking).count()
    active = db.query(models.Booking).filter(models.Booking.status == "active").count()
    completed = db.query(models.Booking).filter(models.Booking.status == "completed").count()
    pending = db.query(models.Booking).filter(models.Booking.status == "pending").count()

    return {
        "total_bookings": total,
        "active_bookings": active,
        "completed_bookings": completed,
        "pending_bookings": pending
    }
