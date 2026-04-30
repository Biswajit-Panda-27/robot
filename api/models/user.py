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
    password: Optional[str] = None # Optional because Google users don't have one
    google_id: Optional[str] = None # Unique ID from Google
    
    # Profile & Location
    address: Optional[Address] = None
    
    # Metadata & Security
    is_active: bool = True
    role: Literal["user", "admin"] = "user"
    
    # Flow Control
    is_verified: bool = False # For the Email OTP flow later
    
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
