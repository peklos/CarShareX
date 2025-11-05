from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import user as user_schemas
from pydantic import BaseModel

router = APIRouter(prefix="/profile", tags=["Профиль клиента"])


class TopUpBalanceRequest(BaseModel):
    amount: float

@router.get("/{user_id}", response_model=user_schemas.UserResponse)
def get_profile(user_id: int, db: Session = Depends(database.get_db)):
    """Получить профиль пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return user

@router.patch("/{user_id}", response_model=user_schemas.UserResponse)
def update_profile(user_id: int, user_data: user_schemas.UserUpdate, db: Session = Depends(database.get_db)):
    """Обновить профиль пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user_data.first_name:
        user.first_name = user_data.first_name
    if user_data.last_name:
        user.last_name = user_data.last_name
    if user_data.phone:
        user.phone = user_data.phone
    if user_data.drivers_license:
        user.drivers_license = user_data.drivers_license

    db.commit()
    db.refresh(user)

    return user


@router.post("/{user_id}/top-up", response_model=user_schemas.UserResponse)
def top_up_balance(user_id: int, request: TopUpBalanceRequest, db: Session = Depends(database.get_db)):
    """Пополнить баланс пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Сумма пополнения должна быть больше 0")

    # Обновляем баланс
    user.balance += request.amount

    # Создаем транзакцию
    transaction = models.Transaction(
        user_id=user_id,
        booking_id=None,
        transaction_type="deposit",
        amount=request.amount,
        description=f"Пополнение баланса на {request.amount:.2f} ₽",
        status="completed"
    )
    db.add(transaction)

    db.commit()
    db.refresh(user)

    return user
