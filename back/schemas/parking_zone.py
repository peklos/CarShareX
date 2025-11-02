from pydantic import BaseModel
from typing import Optional

class ParkingZoneCreate(BaseModel):
    name: str
    address: str
    capacity: int = 10

class ParkingZoneUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    capacity: Optional[int] = None

class ParkingZoneResponse(BaseModel):
    id: int
    name: str
    address: str
    capacity: int

    class Config:
        from_attributes = True
