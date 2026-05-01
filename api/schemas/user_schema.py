from pydantic import BaseModel
from typing import Optional, List

class AddressBase(BaseModel):
    label: Optional[str] = "Home"
    state: str
    city: str
    landmark: str
    pincode: str
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressUpdate(BaseModel):
    label: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    landmark: Optional[str] = None
    pincode: Optional[str] = None
    is_default: Optional[bool] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    mobile: Optional[str] = None
    secondary_mobile: Optional[str] = None
    dob: Optional[str] = None
    avatar: Optional[str] = None
