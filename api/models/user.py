from typing import Optional, Literal
from datetime import datetime
from beanie import Document
from pydantic import BaseModel, EmailStr, Field
from pymongo import IndexModel, ASCENDING

class Address(BaseModel):
    state: Optional[str] = None
    city: Optional[str] = None
    landmark: Optional[str] = None
    pincode: Optional[str] = None

class User(Document):
    # Core Identity
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr 
    
    # Auth Methods
    password: Optional[str] = None 
    google_id: Optional[str] = None 
    
    # Profile & Location
    address: Optional[Address] = None
    
    # Metadata & Security
    is_active: bool = True
    role: Literal["user", "admin"] = "user"
    is_verified: bool = False 
    
    # Flow Control (Required for Email/OTP flow)
    verification_token: Optional[str] = None 
    otp_code: Optional[str] = None 
    otp_expires_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        indexes = [
            IndexModel([("email", ASCENDING)], unique=True),
            IndexModel([("google_id", ASCENDING)], unique=True, sparse=True),
        ]
        use_revision = True 
