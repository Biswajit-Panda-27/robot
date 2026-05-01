from dotenv import load_dotenv
import os

# Load environment variables early
load_dotenv(".env.development")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.db.mongo import init_db
from api.routes import index
# Load environment variables
load_dotenv(".env.development")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Initialize DB
    try:
        await init_db()
    except Exception as e:
        import traceback
        print(f"❌ DB Initialization Error: {e}")
        traceback.print_exc()
    yield
    # Shutdown logic (if any)

app = FastAPI(title="Robot E-commerce API", lifespan=lifespan)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(index.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Robot E-commerce API"}
