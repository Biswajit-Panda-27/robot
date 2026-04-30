import motor.motor_asyncio
from beanie import init_beanie, Document
import os
import importlib
import inspect
import pkgutil

async def get_models():
    """
    Dynamically discover all Beanie Document subclasses in the api.models package.
    """
    models = []
    # Import the models package
    models_package = importlib.import_module("api.models")
    
    # Iterate through all modules in the api.models directory
    for _, module_name, is_pkg in pkgutil.iter_modules(models_package.__path__):
        if not is_pkg:
            # Import each module dynamically
            full_module_name = f"api.models.{module_name}"
            module = importlib.import_module(full_module_name)
            
            # Find all classes in the module that are subclasses of Beanie's Document
            for name, obj in inspect.getmembers(module, inspect.isclass):
                # Ensure it's a Document subclass AND it was defined in this specific file
                if issubclass(obj, Document) and obj is not Document:
                    if obj.__module__ == full_module_name:
                        models.append(obj)
    
    return models

async def init_db():
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME")
    
    if not mongo_uri or not db_name:
        raise ValueError("MONGO_URI and DB_NAME must be set in environment variables")

    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    
    # Dynamically discover all models
    document_models = await get_models()
    print(f"🔍 Discovered {len(document_models)} models: {[m.__name__ for m in document_models]}")
    
    print("🚀 Initializing Beanie...")
    await init_beanie(database=client[db_name], document_models=document_models)
    
    model_names = [model.__name__ for model in document_models]
    print(f"✅ Connected to MongoDB: {db_name}")
    print(f"📦 Registered Models: {', '.join(model_names)}")
