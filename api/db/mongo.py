import motor.motor_asyncio
from beanie import init_beanie
import os

async def init_db():
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME")
    
    if not mongo_uri or not db_name:
        raise ValueError("MONGO_URI and DB_NAME must be set in environment variables")

    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    # We will add models to this list as we create them
    await init_beanie(database=client[db_name], document_models=[])
    print(f"✅ Connected to MongoDB: {db_name}")
