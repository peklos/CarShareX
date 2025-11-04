from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import booking as booking_schemas
from typing import List

router = APIRouter(prefix="/bookings", tags=["Бронирования клиента"])

@router.post("/", response_model=booking_schemas.BookingResponse)
def create_booking(booking_data: booking_schemas.BookingCreate, user_id: int, db: Session = Depends(database.get_db)):
    """Создать новое бронирование"""
    # Проверка автомобиля
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == booking_data.vehicle_id).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")

    if vehicle.status != "available":
        raise HTTPException(status_code=400, detail="Автомобиль недоступен")

    # Получение тарифа
    tariff = db.query(models.Tariff).filter(models.Tariff.id == booking_data.tariff_id).first()

    if not tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")

    # Расчет стоимости
    if tariff.price_per_hour:
        total_cost = tariff.price_per_hour * booking_data.duration_hours
    elif tariff.price_per_minute:
        total_cost = tariff.price_per_minute * (booking_data.duration_hours * 60)
    else:
        raise HTTPException(status_code=400, detail="У тарифа не указана цена")

    # Проверка баланса пользователя
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user.balance < total_cost:
        raise HTTPException(status_code=400, detail=f"Недостаточно средств. Требуется: {total_cost:.2f} ₽, доступно: {user.balance:.2f} ₽")

    # Списание с баланса
    user.balance -= total_cost

    # Создание бронирования
    new_booking = models.Booking(
        user_id=user_id,
        vehicle_id=booking_data.vehicle_id,
        tariff_id=booking_data.tariff_id,
        start_time=booking_data.start_time,
        total_cost=total_cost,
        status="active"
    )

    # Обновление статуса автомобиля
    vehicle.status = "in_use"

    # Создание транзакции
    transaction = models.Transaction(
        user_id=user_id,
        booking_id=None,  # Будет обновлено после коммита
        transaction_type="payment",
        amount=total_cost,
        description=f"Оплата бронирования автомобиля {vehicle.brand} {vehicle.model}",
        status="completed"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Обновляем booking_id в транзакции
    transaction.booking_id = new_booking.id
    db.add(transaction)
    db.commit()

    return new_booking

@router.get("/user/{user_id}", response_model=List[booking_schemas.BookingResponse])
def get_user_bookings(user_id: int, db: Session = Depends(database.get_db)):
    """Получить все бронирования пользователя"""
    bookings = db.query(models.Booking).filter(models.Booking.user_id == user_id).all()
    return bookings

@router.patch("/{booking_id}/complete", response_model=booking_schemas.BookingResponse)
def complete_booking(booking_id: int, complete_data: booking_schemas.BookingComplete, db: Session = Depends(database.get_db)):
    """Завершить бронирование"""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    if booking.status != "active":
        raise HTTPException(status_code=400, detail="Бронирование уже завершено")

    # Обновление бронирования
    booking.end_time = complete_data.end_time
    booking.total_cost = complete_data.total_cost
    booking.status = "completed"

    # Освобождение автомобиля
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == booking.vehicle_id).first()
    if vehicle:
        vehicle.status = "available"

    # Списание с баланса
    user = db.query(models.User).filter(models.User.id == booking.user_id).first()
    if user:
        user.balance -= complete_data.total_cost

    # Создание транзакции
    transaction = models.Transaction(
        user_id=booking.user_id,
        booking_id=booking.id,
        transaction_type="payment",
        amount=complete_data.total_cost,
        status="completed"
    )
    db.add(transaction)

    db.commit()
    db.refresh(booking)

    return booking
