"""MongoDB database connection manager."""
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import Optional

from app.config import get_settings
from app.db.models import AnalysisDocument

logger = logging.getLogger(__name__)

# Global client instance
_client: Optional[AsyncIOMotorClient] = None
_db = None


async def init_db():
    """Initialize MongoDB connection and Beanie ODM."""
    global _client, _db
    
    settings = get_settings()
    mongodb_url = settings.MONGODB_URL
    
    if not mongodb_url:
        logger.warning("⚠️  MONGODB_URL not set. Using in-memory storage (data will not persist).")
        return None
    
    try:
        # Create Motor client
        _client = AsyncIOMotorClient(mongodb_url)
        
        # Get database
        _db = _client.get_default_database()
        
        # Initialize Beanie with document models
        await init_beanie(
            database=_db,
            document_models=[AnalysisDocument]
        )
        
        logger.info(f"✅ MongoDB connected successfully to database: {_db.name}")
        return _db
        
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {str(e)}")
        logger.warning("⚠️  Falling back to in-memory storage")
        _client = None
        _db = None
        return None


async def close_db():
    """Close MongoDB connection."""
    global _client, _db
    
    if _client:
        _client.close()
        _client = None
        _db = None
        logger.info("👋 MongoDB connection closed")


def get_database():
    """Get the database instance."""
    return _db


def is_connected() -> bool:
    """Check if MongoDB is connected."""
    return _db is not None
