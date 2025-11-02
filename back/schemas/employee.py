from pydantic import BaseModel, EmailStr
from typing import Optional

class EmployeeLogin(BaseModel):
    email: EmailStr
    password: str

class EmployeeResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role_id: int
    branch_id: Optional[int]

    class Config:
        from_attributes = True

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role_id: int
    branch_id: Optional[int] = None

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role_id: Optional[int] = None
    branch_id: Optional[int] = None
