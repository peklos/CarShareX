from pydantic import BaseModel
from typing import Optional

class TransactionCreate(BaseModel):
    transaction_type: str
    amount: float
    booking_id: Optional[int] = None

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    booking_id: Optional[int]
    transaction_type: str
    amount: float
    status: str

    class Config:
        from_attributes = True
