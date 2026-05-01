from fastapi import APIRouter
from api.routes.v1 import auth, user

router = APIRouter()

# Register V1 Routes
router.include_router(auth.router, prefix="/v1")
router.include_router(user.router, prefix="/v1")

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "robot-ecommerce"}
