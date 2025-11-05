from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookingCreate(BaseModel):
    vehicle_id: int
    tariff_id: int
    start_time: datetime
    duration_hours: float  # Длительность бронирования в часах

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
