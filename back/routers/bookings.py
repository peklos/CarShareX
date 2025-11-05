from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import booking as booking_schemas
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/bookings", tags=["Бронирования клиента"])


class CostCalculationRequest(BaseModel):
    tariff_id: int
    duration_hours: float


class CostCalculationResponse(BaseModel):
    tariff_id: int
    tariff_name: str
    duration_hours: float
    total_cost: float
    price_per_hour: float = None
    price_per_minute: float = None

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
    total_minutes = booking_data.duration_hours * 60

    # Приоритет: сначала смотрим почасовую цену, потом поминутную
    if tariff.price_per_hour and total_minutes >= 60:
        # Используем почасовой тариф, если бронирование больше часа
        total_cost = tariff.price_per_hour * booking_data.duration_hours
    elif tariff.price_per_minute:
        # Используем поминутный тариф
        total_cost = tariff.price_per_minute * total_minutes
    elif tariff.price_per_hour:
        # Если только почасовой тариф, округляем до часа
        total_cost = tariff.price_per_hour * max(1, booking_data.duration_hours)
    else:
        raise HTTPException(status_code=400, detail="У тарифа не указана цена")

    # Округляем до 2 знаков после запятой
    total_cost = round(total_cost, 2)

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


@router.post("/calculate-cost", response_model=CostCalculationResponse)
def calculate_booking_cost(request: CostCalculationRequest, db: Session = Depends(database.get_db)):
    """Рассчитать стоимость бронирования"""
    # Получение тарифа
    tariff = db.query(models.Tariff).filter(models.Tariff.id == request.tariff_id).first()

    if not tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")

    # Расчет стоимости (используем ту же логику, что и при создании бронирования)
    total_minutes = request.duration_hours * 60

    if tariff.price_per_hour and total_minutes >= 60:
        total_cost = tariff.price_per_hour * request.duration_hours
    elif tariff.price_per_minute:
        total_cost = tariff.price_per_minute * total_minutes
    elif tariff.price_per_hour:
        total_cost = tariff.price_per_hour * max(1, request.duration_hours)
    else:
        raise HTTPException(status_code=400, detail="У тарифа не указана цена")

    total_cost = round(total_cost, 2)

    return CostCalculationResponse(
        tariff_id=tariff.id,
        tariff_name=tariff.name,
        duration_hours=request.duration_hours,
        total_cost=total_cost,
        price_per_hour=tariff.price_per_hour,
        price_per_minute=tariff.price_per_minute
    )
