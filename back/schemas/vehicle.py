from pydantic import BaseModel
from typing import Optional

class VehicleCreate(BaseModel):
    license_plate: str
    brand: str
    model: str
    vehicle_type: str
    parking_zone_id: Optional[int] = None
    tariff_id: Optional[int] = None

class VehicleUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    vehicle_type: Optional[str] = None
    status: Optional[str] = None
    parking_zone_id: Optional[int] = None
    tariff_id: Optional[int] = None

class VehicleResponse(BaseModel):
    id: int
    license_plate: str
    brand: str
    model: str
    vehicle_type: str
    status: str
    parking_zone_id: Optional[int]
    tariff_id: Optional[int]

    class Config:
        from_attributes = True
