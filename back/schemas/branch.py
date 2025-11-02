from pydantic import BaseModel
from typing import Optional

class BranchCreate(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None

class BranchUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

class BranchResponse(BaseModel):
    id: int
    name: str
    address: str
    phone: Optional[str]

    class Config:
        from_attributes = True
