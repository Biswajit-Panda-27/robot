import os
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from api.models.user import User
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests

# Force load environment variables for this service
load_dotenv(".env.development")

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "robotsecretkey")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60000))
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

print(f"🔐 AuthService initialized with Secret Key: {SECRET_KEY[:4]}****")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain password against a hashed one using direct bcrypt.
        """
        try:
            return bcrypt.checkpw(
                plain_password.encode('utf-8'), 
                hashed_password.encode('utf-8')
            )
        except Exception:
            return False

    @staticmethod
    def get_password_hash(password: str) -> str:
        """
        Hash a password using direct bcrypt.
        """
        # Generate a salt and hash the password
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def verify_google_token(token: str) -> Optional[dict]:
        """
        Verifies either a Google ID Token or an Access Token.
        """
        try:
            # First try as ID Token (Standard)
            try:
                idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
                return {
                    "google_id": idinfo['sub'],
                    "email": idinfo['email'],
                    "name": idinfo.get('name', 'Google User'),
                    "picture": idinfo.get('picture')
                }
            except ValueError:
                # If not an ID Token, try as Access Token (UserInfo API)
                import requests as req
                response = req.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}")
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "google_id": data['sub'],
                        "email": data['email'],
                        "name": data.get('name', 'Google User'),
                        "picture": data.get('picture')
                    }
                return None
        except Exception as e:
            print(f"❌ Google Token Verification Failed: {e}")
            return None

    @staticmethod
    async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
        print(f"🔍 Security Check - Incoming Token: {token[:10]}...")
        print(f"🔐 Using Secret Key for decode: {SECRET_KEY[:4]}****")
        
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            print(f"✅ Token decoded successfully for: {email}")
            if email is None:
                print("❌ Token payload missing 'sub' field")
                raise credentials_exception
        except JWTError as e:
            print(f"❌ JWT Decode Error: {e}")
            raise credentials_exception
            
        user = await User.find_one(User.email == email)
        if user is None:
            print(f"❌ User not found in DB for email: {email}")
            raise credentials_exception
        return user
