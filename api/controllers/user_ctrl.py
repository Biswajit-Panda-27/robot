from api.models.user import User, Address
from api.schemas.user_schema import UserUpdate, AddressCreate, AddressUpdate
from fastapi import HTTPException

class UserController:
    @staticmethod
    async def update_profile(current_user: User, data: UserUpdate):
        """
        Updates basic profile info: Name, Mobile, Secondary Mobile.
        """
        if data.name is not None: current_user.name = data.name
        if data.mobile is not None: current_user.mobile = data.mobile
        if data.secondary_mobile is not None: current_user.secondary_mobile = data.secondary_mobile
        if data.dob is not None: current_user.dob = data.dob
        if data.avatar is not None: current_user.avatar = data.avatar
        
        await current_user.save()
        return current_user

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
