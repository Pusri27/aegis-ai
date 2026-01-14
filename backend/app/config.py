from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App
    APP_NAME: str = "AegisAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # OpenRouter API
    OPENROUTER_API_KEY: str
    OPENROUTER_MODEL: str = "xiaomi/mimo-v2-flash:free"
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_KEY: Optional[str] = None
    
    # Database
    DATABASE_URL: str
    
    # ChromaDB
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    
    # MongoDB Atlas (Optional)
    MONGODB_URL: Optional[str] = None
    
    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# Hardcoded CORS for simplicity
CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000", "https://*.vercel.app"]
