from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, EmailStr
from api.models.user import User
from api.services.auth_service import AuthService
from api.utils.email import send_verification_email, send_otp_email
from api.db.redis_db import set_code, get_code, delete_code
import uuid
import random
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Helper for Google Login ---
class GoogleLoginRequest(BaseModel):
    token: str

@router.post("/google")
async def google_login(request: GoogleLoginRequest):
    google_user = AuthService.verify_google_token(request.token)
    if not google_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google Token")

    user = await User.find_one(User.email == google_user["email"])
    if not user:
        user = User(name=google_user["name"], email=google_user["email"], google_id=google_user["google_id"], is_verified=True)
        await user.insert()
    else:
        if not user.google_id:
            user.google_id = google_user["google_id"]
            await user.save()

    access_token = AuthService.create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"name": user.name, "email": user.email, "role": user.role}
    }

# --- Production-Grade Email Registration ---

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr

@router.post("/register")
async def register_user(request: RegisterRequest, background_tasks: BackgroundTasks):
    existing_user = await User.find_one(User.email == request.email)
    if existing_user and existing_user.is_verified:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    if not existing_user:
        existing_user = User(name=request.name, email=request.email, is_verified=False)
        await existing_user.insert()
    
    token = str(uuid.uuid4())
    await set_code(f"verify:{token}", request.email, expire_seconds=86400) # 24h
    
    # Send email in the background (Non-blocking)
    background_tasks.add_task(send_verification_email, request.email, token, request.name)
    
    return {"message": "Registration link sent! Please check your inbox (including spam)."}

class SetPasswordRequest(BaseModel):
    token: str
    password: str

@router.post("/set-password")
async def set_password(request: SetPasswordRequest):
    email = await get_code(f"verify:{request.token}")
    if not email:
        raise HTTPException(status_code=400, detail="The link is invalid or has expired.")
    
    user = await User.find_one(User.email == email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    user.password = AuthService.get_password_hash(request.password)
    user.is_verified = True
    await user.save()
    await delete_code(f"verify:{request.token}")
    
    return {"message": "Your account is now active! Please log in."}

# --- Production-Grade Login with OTP ---

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
async def login_user(request: LoginRequest, background_tasks: BackgroundTasks):
    user = await User.find_one(User.email == request.email)
    if not user or not user.password or not user.is_verified:
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    
    if not AuthService.verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    
    otp = str(random.randint(100000, 999999))
    await set_code(f"otp:{request.email}", otp, expire_seconds=600) # 10m
    
    # Send OTP in the background (Non-blocking)
    background_tasks.add_task(send_otp_email, request.email, otp)
    
    return {"message": "A security code has been sent to your email."}

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

@router.post("/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    stored_otp = await get_code(f"otp:{request.email}")
    if not stored_otp or stored_otp != request.otp:
        raise HTTPException(status_code=401, detail="Invalid or expired security code.")
    
    user = await User.find_one(User.email == request.email)
    await delete_code(f"otp:{request.email}")
    
    access_token = AuthService.create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"name": user.name, "email": user.email, "role": user.role}
    }
