from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from api.models.user import User
from api.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

class GoogleLoginRequest(BaseModel):
    token: str

@router.post("/google")
async def google_login(request: GoogleLoginRequest):
    # 1. Verify Google Token
    google_user = AuthService.verify_google_token(request.token)
    if not google_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google Token"
        )

    # 2. Check if user exists
    user = await User.find_one(User.email == google_user["email"])
    
    if not user:
        # Create new user if they don't exist
        user = User(
            name=google_user["name"],
            email=google_user["email"],
            google_id=google_user["google_id"],
            is_verified=True # Google users are already email-verified
        )
        await user.insert()
    else:
        # Link google_id if not already linked
        if not user.google_id:
            user.google_id = google_user["google_id"]
            await user.save()

    # 3. Create our own JWT Access Token
    access_token = AuthService.create_access_token(
        data={"sub": user.email, "role": user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }
