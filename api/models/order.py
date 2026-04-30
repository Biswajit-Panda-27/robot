from typing import List, Optional, Literal
from datetime import datetime
from beanie import Document, Link
from pydantic import BaseModel, Field
from api.models.user import User, Address

class OrderItem(BaseModel):
    product_id: str # The ID of the product
    name: str
    price: float
    quantity: int
    img: str

class Order(Document):
    # Link to the user who placed the order
    user: Link[User]
    
    # Snapshot of items and prices at the time of purchase
    items: List[OrderItem]
    
    # Financial Details
    subtotal: float
    shipping_fee: float = 0.0
    total_amount: float
    
    # Snapshot of the shipping address used
    shipping_address: Address
    
    # Status Management
    payment_status: Literal["Pending", "Paid", "Failed"] = "Pending"
    order_status: Literal["Processing", "Shipped", "Delivered", "Cancelled"] = "Processing"
    
    # Payment Tracking
    transaction_id: Optional[str] = None
    payment_method: Optional[str] = "Stripe" # or "Razorpay", etc.
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "orders"
        # Indexing for fast order lookups
        indexes = [
            "user",
            "order_status",
            "created_at"
        ]