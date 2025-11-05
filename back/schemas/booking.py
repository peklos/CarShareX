from pydantic import BaseModel, validator
from datetime import datetime, date
from typing import Optional

class BookingCreate(BaseModel):
    vehicle_id: int
    tariff_id: int
    start_date: date  # Дата начала (без времени)
    end_date: date  # Дата окончания (без времени)

    @validator('start_date', 'end_date', pre=True)
    def parse_date(cls, v):
        """Конвертируем строку в date"""
        if isinstance(v, str):
            # Если передана полная дата-время, берем только дату
            if 'T' in v or ' ' in v:
                return datetime.fromisoformat(v.replace('Z', '+00:00').split('T')[0].split(' ')[0]).date()
            try:
                return datetime.fromisoformat(v).date()
            except ValueError:
                raise ValueError(f"Неверный формат даты: {v}")
        return v

    @validator('end_date')
    def validate_end_date(cls, v, values):
        """Проверяем, что дата окончания больше даты начала"""
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError("Дата окончания должна быть позже даты начала")
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
