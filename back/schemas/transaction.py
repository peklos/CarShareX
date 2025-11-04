from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionCreate(BaseModel):
    transaction_type: str
    amount: float
    description: Optional[str] = None
    booking_id: Optional[int] = None

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    booking_id: Optional[int]
    transaction_type: str
    amount: float
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True
