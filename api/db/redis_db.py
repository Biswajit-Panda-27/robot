import redis.asyncio as redis
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")

# Create a Redis client instance
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

async def init_redis():
    """
    Checks if Redis is reachable and prints status.
    """
    try:
        await redis_client.ping()
        print(f"[RE-CONNECTED] Connected to Redis: {REDIS_URL}")
        return True
    except Exception as e:
        print(f"[RE-ERROR] Redis Connection Error: {e}")
        return False

async def set_code(key: str, value: str, expire_seconds: int = 600):
    """
    Stores a value in Redis with a Time-To-Live (TTL).
    Default is 10 minutes (600 seconds).
    """
    await redis_client.set(key, value, ex=expire_seconds)

async def get_code(key: str) -> str:
    """
    Retrieves a value from Redis. Returns None if expired or not found.
    """
    return await redis_client.get(key)

async def delete_code(key: str):
    """
    Removes a code from Redis immediately.
    """
    await redis_client.delete(key)
