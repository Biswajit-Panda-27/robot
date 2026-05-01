from api.models.user import User, Address
from api.utils.s3 import upload_image_to_s3, delete_image_from_s3
from api.schemas.user_schema import UserUpdate, AddressCreate, AddressUpdate
from fastapi import HTTPException, UploadFile

class UserController:
    @staticmethod
    async def update_profile(current_user: User, data: UserUpdate):
        """
        Updates basic profile info: Name, Mobile, Secondary Mobile.
        """
        # Use model_dump to get only the fields that were actually provided in the request
        update_data = data.model_dump(exclude_unset=True)
        
        # If avatar is being updated or removed, try to delete the old one from S3
        if "avatar" in update_data and current_user.avatar:
            if current_user.avatar.startswith("https://"):
                await delete_image_from_s3(current_user.avatar)

        for field, value in update_data.items():
            setattr(current_user, field, value)
        
        await current_user.save()
        return current_user

    @staticmethod
    async def upload_avatar(current_user: User, file: UploadFile):
        """
        Uploads avatar to S3 and updates user record.
        """
        try:
            # Upload to S3 (stored in 'avatars' folder)
            s3_url = await upload_image_to_s3(file, folder="avatars")
            
            # Update user record
            current_user.avatar = s3_url
            await current_user.save()
            
            return {"success": True, "avatar": s3_url}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def add_address(current_user: User, address_data: AddressCreate):
        """
        Adds a new address. If is_default is True, unsets others.
        """
        if address_data.is_default:
            # Unset other defaults
            for addr in current_user.addresses:
                addr.is_default = False
        
        # If this is the very first address, make it default automatically
        is_first = len(current_user.addresses) == 0
        
        new_address = Address(
            label=address_data.label or "Home",
            state=address_data.state,
            city=address_data.city,
            landmark=address_data.landmark,
            pincode=address_data.pincode,
            is_default=address_data.is_default or is_first
        )
        
        current_user.addresses.append(new_address)
        await current_user.save()
        return current_user

    @staticmethod
    async def update_address(current_user: User, address_id: str, data: AddressUpdate):
        """
        Updates an existing address by ID.
        """
        target_addr = next((addr for addr in current_user.addresses if addr.id == address_id), None)
        if not target_addr:
            raise HTTPException(status_code=404, detail="Address not found.")

        # If setting this as default, unset others
        if data.is_default is True:
            for addr in current_user.addresses:
                addr.is_default = False
            target_addr.is_default = True

        # Map other fields
        if data.label is not None: target_addr.label = data.label
        if data.state is not None: target_addr.state = data.state
        if data.city is not None: target_addr.city = data.city
        if data.landmark is not None: target_addr.landmark = data.landmark
        if data.pincode is not None: target_addr.pincode = data.pincode

        await current_user.save()
        return current_user

    @staticmethod
    async def delete_address(current_user: User, address_id: str):
        """
        Deletes an address. If we delete the default, set another as default if available.
        """
        was_default = any(addr.id == address_id and addr.is_default for addr in current_user.addresses)
        
        current_user.addresses = [addr for addr in current_user.addresses if addr.id != address_id]
        
        # If we deleted the default, make the first remaining one default
        if was_default and len(current_user.addresses) > 0:
            current_user.addresses[0].is_default = True
            
        await current_user.save()
        return current_user
