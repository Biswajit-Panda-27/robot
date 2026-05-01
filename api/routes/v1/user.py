from fastapi import APIRouter, Depends
from api.models.user import User
from api.services.auth_service import AuthService
from api.schemas.user_schema import UserUpdate, AddressCreate, AddressUpdate
from api.controllers.user_ctrl import UserController

router = APIRouter(prefix="/user", tags=["User Profile"])

@router.get("/me")
async def get_me(current_user: User = Depends(AuthService.get_current_user)):
    return current_user

@router.patch("/update")
async def update_profile(
    data: UserUpdate, 
    current_user: User = Depends(AuthService.get_current_user)
):
    return await UserController.update_profile(current_user, data)

@router.post("/address")
async def add_address(
    data: AddressCreate, 
    current_user: User = Depends(AuthService.get_current_user)
):
    return await UserController.add_address(current_user, data)

@router.patch("/address/{address_id}")
async def update_address(
    address_id: str,
    data: AddressUpdate,
    current_user: User = Depends(AuthService.get_current_user)
):
    """
    Updates an existing address or sets it as default.
    """
    return await UserController.update_address(current_user, address_id, data)

@router.delete("/address/{address_id}")
async def delete_address(
    address_id: str, 
    current_user: User = Depends(AuthService.get_current_user)
):
    return await UserController.delete_address(current_user, address_id)
