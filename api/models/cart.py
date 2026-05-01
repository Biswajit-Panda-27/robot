from typing import List
from datetime import datetime
from beanie import Document, Link
from pydantic import BaseModel, Field
from api.models.user import User
from pymongo import IndexModel, ASCENDING

class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int = Field(default=1, gt=0)
    img: str

class Cart(Document):
    # Link to the user who owns this cart
    user: Link[User]
    
    # List of items in the cart
    items: List[CartItem] = []
    
    # Metadata
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "carts"
        # Ensure each user can only have ONE active cart
        indexes = [
            IndexModel([("user", ASCENDING)], unique=True)
        ]
