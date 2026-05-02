from pydantic import BaseModel, Field
from typing import Optional, List

class ProductCreate(BaseModel):
    product_name: str = Field(..., min_length=2)
    product_description: str = Field(..., min_length=5)
    product_price: float = Field(..., gt=0)
    product_discounted_price: Optional[float] = Field(default=None, gt=0)
    product_discount_percentage: Optional[int] = Field(default=0, ge=0, le=100)
    product_discount_offer: Optional[str] = None
    product_category: str = "General"
    product_image: str
    product_gallery: List[str] = []
    product_stock: int = Field(default=0, ge=0)
    product_rating: float = Field(default=0, ge=0, le=5)
    product_reviews_count: int = Field(default=0, ge=0)
    product_reviews: Optional[str] = None
    product_features: List[str] = []
    product_specs: List[dict] = []

class ProductUpdate(BaseModel):
    product_name: Optional[str] = Field(default=None, min_length=2)
    product_description: Optional[str] = Field(default=None, min_length=5)
    product_price: Optional[float] = Field(default=None, gt=0)
    product_discounted_price: Optional[float] = Field(default=None, gt=0)
    product_discount_percentage: Optional[int] = Field(default=None, ge=0, le=100)
    product_discount_offer: Optional[str] = None
    product_category: Optional[str] = None
    product_image: Optional[str] = None
    product_gallery: Optional[List[str]] = None
    product_stock: Optional[int] = Field(default=None, ge=0)
    product_rating: Optional[float] = Field(default=None, ge=0, le=5)
    product_reviews_count: Optional[int] = Field(default=None, ge=0)
    product_reviews: Optional[str] = None
    product_features: Optional[List[str]] = None
    product_specs: Optional[List[dict]] = None
