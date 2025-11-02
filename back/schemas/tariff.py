from pydantic import BaseModel
from typing import Optional

class TariffCreate(BaseModel):
    name: str
    price_per_minute: Optional[float] = None
    price_per_hour: Optional[float] = None

class TariffUpdate(BaseModel):
    name: Optional[str] = None
    price_per_minute: Optional[float] = None
    price_per_hour: Optional[float] = None

class TariffResponse(BaseModel):
    id: int
    name: str
    price_per_minute: Optional[float]
    price_per_hour: Optional[float]

    class Config:
        from_attributes = True
