from pydantic import BaseModel
from typing import Optional

class VehicleCreate(BaseModel):
    license_plate: str
    brand: str
    model: str
    vehicle_type: str
    year: Optional[int] = None
    color: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    parking_zone_id: Optional[int] = None
    tariff_id: Optional[int] = None

class VehicleUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    vehicle_type: Optional[str] = None
    year: Optional[int] = None
    color: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    parking_zone_id: Optional[int] = None
    tariff_id: Optional[int] = None

class VehicleResponse(BaseModel):
    id: int
    license_plate: str
    brand: str
    model: str
    vehicle_type: str
    year: Optional[int]
    color: Optional[str]
    image_url: Optional[str]
    description: Optional[str]
    status: str
    parking_zone_id: Optional[int]
    tariff_id: Optional[int]

    class Config:
        from_attributes = True
