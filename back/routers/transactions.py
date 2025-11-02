from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import transaction as transaction_schemas
from typing import List

router = APIRouter(prefix="/transactions", tags=["Транзакции клиента"])

@router.get("/user/{user_id}", response_model=List[transaction_schemas.TransactionResponse])
def get_user_transactions(user_id: int, db: Session = Depends(database.get_db)):
    """Получить все транзакции пользователя"""
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()
    return transactions

@router.post("/deposit", response_model=transaction_schemas.TransactionResponse)
def deposit_balance(user_id: int, amount: float, db: Session = Depends(database.get_db)):
    """Пополнить баланс пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Сумма должна быть положительной")

    # Пополнение баланса
    user.balance += amount

    # Создание транзакции
    transaction = models.Transaction(
        user_id=user_id,
        transaction_type="deposit",
        amount=amount,
        status="completed"
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction
