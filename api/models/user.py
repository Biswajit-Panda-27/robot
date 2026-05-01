from typing import Optional, Literal, List
from datetime import datetime
from beanie import Document
from pydantic import BaseModel, EmailStr, Field
from pymongo import IndexModel, ASCENDING
import uuid

class Address(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: Optional[str] = "Home" 
    state: Optional[str] = None
    city: Optional[str] = None
    landmark: Optional[str] = None
    pincode: Optional[str] = None
    is_default: bool = False

class User(Document):
    # Core Identity
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr 
    mobile: Optional[str] = None
    secondary_mobile: Optional[str] = None
    
    # Premium Identity
    dob: Optional[str] = None
    avatar: Optional[str] = None # URL or Base64
    
    # Auth Methods
    password: Optional[str] = None 
    google_id: Optional[str] = None 
    
    # Profile & Location
    addresses: List[Address] = []
    
    # Metadata & Security
    is_active: bool = True
    role: Literal["user", "admin"] = "user"
    is_verified: bool = False 
    
    # Flow Control
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
        ]
