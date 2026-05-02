from typing import Optional, List
from datetime import datetime
from beanie import Document
from pydantic import Field

class Product(Document):
    # Basic Info
    product_name: str = Field(..., min_length=2)
    product_description: str = Field(..., min_length=5)
    
    # Pricing & Discounts
    product_price: float = Field(..., gt=0)
    product_discounted_price: Optional[float] = Field(default=None, gt=0)
    product_discount_percentage: Optional[int] = Field(default=0, ge=0, le=100)
    product_discount_offer: Optional[str] = None # e.g. "Summer Sale", "Launch Offer"
    
    # Categorization
    product_category: str = Field(default="General") 
    
    # Media
    product_image: str
    product_gallery: List[str] = []
    
    # Inventory
    product_stock: int = Field(default=0, ge=0)
    
    # Discovery & Social Proof
    product_rating: float = Field(default=0, ge=0, le=5)
    product_reviews_count: int = Field(default=0, ge=0)
    product_reviews: Optional[str] = None
    
    # Detailed Info
    product_features: List[str] = [] # Key highlights
    product_specs: List[dict] = [] # Technical details [{ "label": "CPU", "value": "Quad-core 2.4GHz" }]
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "products"
        # Indexing for faster search/filtering
        indexes = [
            "product_name",
            "product_category",
            "product_price"
        ]
