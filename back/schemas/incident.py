from pydantic import BaseModel
from typing import Optional

class IncidentCreate(BaseModel):
    booking_id: Optional[int] = None
    vehicle_id: int
    incident_type: str
    description: str

class IncidentUpdate(BaseModel):
    status: str

class IncidentResponse(BaseModel):
    id: int
    booking_id: Optional[int]
    vehicle_id: int
    user_id: Optional[int]
    incident_type: str
    description: str
    status: str

    class Config:
        from_attributes = True
