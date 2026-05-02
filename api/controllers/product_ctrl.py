from typing import List, Optional
from api.models.product import Product
from api.schemas.product_schema import ProductCreate, ProductUpdate
from beanie import PydanticObjectId

async def get_all_products(category: Optional[str] = None) -> List[Product]:
    if category:
        return await Product.find(Product.product_category == category).to_list()
    return await Product.find_all().to_list()

async def get_product_by_id(product_id: str) -> Optional[Product]:
    return await Product.get(product_id)

async def create_product(data: ProductCreate) -> Product:
    product = Product(**data.model_dump())
    await product.insert()
    return product

async def update_product(product_id: str, data: ProductUpdate) -> Optional[Product]:
    product = await Product.get(product_id)
    if not product:
        return None
    
    update_data = data.model_dump(exclude_unset=True)
    await product.set(update_data)
    return product

async def delete_product(product_id: str) -> bool:
    product = await Product.get(product_id)
    if not product:
        return False
    await product.delete()
    return True
