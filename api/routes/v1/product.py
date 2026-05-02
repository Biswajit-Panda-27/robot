from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from api.controllers import product_ctrl
from api.schemas.product_schema import ProductCreate, ProductUpdate
from api.models.product import Product

router = APIRouter()

@router.get("/", response_model=List[Product])
async def get_products(category: Optional[str] = Query(None)):
    return await product_ctrl.get_all_products(category)

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await product_ctrl.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=Product)
async def create_product(data: ProductCreate):
    return await product_ctrl.create_product(data)

@router.patch("/{product_id}", response_model=Product)
async def update_product(product_id: str, data: ProductUpdate):
    product = await product_ctrl.update_product(product_id, data)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    success = await product_ctrl.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}
