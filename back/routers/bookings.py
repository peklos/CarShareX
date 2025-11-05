from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import booking as booking_schemas
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/bookings", tags=["Бронирования клиента"])


class CostCalculationRequest(BaseModel):
    tariff_id: int
    start_date: str  # Дата в формате YYYY-MM-DD
    end_date: str  # Дата в формате YYYY-MM-DD


class CostCalculationResponse(BaseModel):
    tariff_id: int
    tariff_name: str
    days_count: int
    total_cost: float
    price_per_day: float

@router.post("/", response_model=booking_schemas.BookingResponse)
def create_booking(booking_data: booking_schemas.BookingCreate, user_id: int, db: Session = Depends(database.get_db)):
    """Создать новое бронирование (только посуточная аренда)"""
    from datetime import datetime

    try:
        print(f"🔍 Получен запрос на бронирование: {booking_data.dict()}")
        print(f"🔍 User ID: {user_id}")
    except Exception as e:
        print(f"⚠️ Ошибка логирования: {e}")

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

    # Расчет количества дней
    days_count = (booking_data.end_date - booking_data.start_date).days

    if days_count <= 0:
        raise HTTPException(status_code=400, detail="Дата окончания должна быть позже даты начала")

    # Расчет стоимости (за день = 24 часа по почасовому тарифу)
    if tariff.price_per_hour:
        # Цена за день = цена за час * 24 часа
        price_per_day = tariff.price_per_hour * 24
        total_cost = price_per_day * days_count
    elif tariff.price_per_minute:
        # Цена за день = цена за минуту * 1440 минут (24 часа)
        price_per_day = tariff.price_per_minute * 1440
        total_cost = price_per_day * days_count
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

    # Конвертируем даты в datetime (начало дня для start_date, конец дня для end_date)
    start_datetime = datetime.combine(booking_data.start_date, datetime.min.time())
    end_datetime = datetime.combine(booking_data.end_date, datetime.max.time())

    # Создание бронирования
    new_booking = models.Booking(
        user_id=user_id,
        vehicle_id=booking_data.vehicle_id,
        tariff_id=booking_data.tariff_id,
        start_time=start_datetime,
        end_time=end_datetime,
        duration_hours=None,  # Не используем для посуточной аренды
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
        description=f"Оплата бронирования автомобиля {vehicle.brand} {vehicle.model} на {days_count} дн.",
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
    """Рассчитать стоимость бронирования (только посуточная аренда)"""
    from datetime import datetime

    # Получение тарифа
    tariff = db.query(models.Tariff).filter(models.Tariff.id == request.tariff_id).first()

    if not tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")

    # Парсим даты
    try:
        start_date = datetime.fromisoformat(request.start_date).date()
        end_date = datetime.fromisoformat(request.end_date).date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат даты. Используйте YYYY-MM-DD")

    # Расчет количества дней
    days_count = (end_date - start_date).days

    if days_count <= 0:
        raise HTTPException(status_code=400, detail="Дата окончания должна быть позже даты начала")

    # Расчет стоимости (за день = 24 часа по почасовому тарифу)
    if tariff.price_per_hour:
        price_per_day = tariff.price_per_hour * 24
        total_cost = price_per_day * days_count
    elif tariff.price_per_minute:
        price_per_day = tariff.price_per_minute * 1440
        total_cost = price_per_day * days_count
    else:
        raise HTTPException(status_code=400, detail="У тарифа не указана цена")

    total_cost = round(total_cost, 2)
    price_per_day = round(price_per_day, 2)

    return CostCalculationResponse(
        tariff_id=tariff.id,
        tariff_name=tariff.name,
        days_count=days_count,
        total_cost=total_cost,
        price_per_day=price_per_day
    )
