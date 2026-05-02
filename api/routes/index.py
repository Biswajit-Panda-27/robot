from fastapi import APIRouter
from api.routes.v1 import auth, user, product

router = APIRouter()

# Register V1 Routes
router.include_router(auth.router, prefix="/v1", tags=["Auth"])
router.include_router(user.router, prefix="/v1", tags=["User"])
router.include_router(product.router, prefix="/v1/products", tags=["Products"])

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "robot-ecommerce"}
