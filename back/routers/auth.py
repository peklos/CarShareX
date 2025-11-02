from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models, database
from schemas import user as user_schemas

router = APIRouter(prefix="/auth", tags=["Авторизация клиентов"])

@router.post("/register", response_model=user_schemas.UserResponse)
def register(user_data: user_schemas.UserCreate, db: Session = Depends(database.get_db)):
    """Регистрация нового пользователя"""
    # Проверка email
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    # Проверка телефона
    existing_phone = db.query(models.User).filter(models.User.phone == user_data.phone).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Телефон уже зарегистрирован")

    # Создание пользователя
    new_user = models.User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        phone=user_data.phone,
        password=user_data.password,  # БЕЗ хеширования
        drivers_license=user_data.drivers_license,
        balance=0.0
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login")
def login(login_data: user_schemas.UserLogin, db: Session = Depends(database.get_db)):
    """Вход пользователя"""
    user = db.query(models.User).filter(models.User.email == login_data.email).first()

    if not user or user.password != login_data.password:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    return {
        "message": "Вход выполнен успешно",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone,
            "balance": user.balance
        }
    }

@router.get("/me/{user_id}", response_model=user_schemas.UserResponse)
def get_current_user(user_id: int, db: Session = Depends(database.get_db)):
    """Получить данные текущего пользователя"""
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return user
