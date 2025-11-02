from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import user as user_schemas
from typing import List

router = APIRouter(prefix="/admin/users", tags=["Админ: Пользователи"])

@router.get("/", response_model=List[user_schemas.UserResponse])
def get_all_users(db: Session = Depends(database.get_db)):
    """Получить всех пользователей"""
    users = db.query(models.User).all()
    return users

@router.get("/{user_id}", response_model=user_schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(database.get_db)):
    """Получить пользователя по ID"""
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return user

@router.patch("/{user_id}", response_model=user_schemas.UserResponse)
def update_user(user_id: int, user_data: user_schemas.UserUpdate, db: Session = Depends(database.get_db)):
    """Обновить данные пользователя"""
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

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(database.get_db)):
    """Удалить пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    db.delete(user)
    db.commit()

    return {"message": "Пользователь удален", "user_id": user_id}
