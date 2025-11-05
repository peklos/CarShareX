from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

class BookingCreate(BaseModel):
    vehicle_id: int
    tariff_id: int
    start_time: datetime  # datetime объект
    duration_hours: Optional[float] = 1.0  # Длительность бронирования в часах (по умолчанию 1 час)

    @validator('start_time', pre=True)
    def parse_start_time(cls, v):
        """Конвертируем строку ISO в datetime"""
        if isinstance(v, str):
            # Убираем 'Z' и заменяем на '+00:00' для корректного парсинга
            v = v.replace('Z', '+00:00')
            try:
                return datetime.fromisoformat(v)
            except ValueError:
                # Пробуем без timezone
                return datetime.fromisoformat(v.split('+')[0].split('Z')[0])
        return v

class BookingResponse(BaseModel):
    id: int
    user_id: int
    vehicle_id: int
    tariff_id: int
    start_time: datetime
    end_time: Optional[datetime]
    duration_hours: Optional[float]
    total_cost: float
    status: str

    class Config:
        from_attributes = True

class BookingComplete(BaseModel):
    end_time: datetime
    total_cost: float
