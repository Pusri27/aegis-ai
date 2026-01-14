from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import get_settings, CORS_ORIGINS
from app.api.routes import analysis, feedback, history
from app.memory.vector_store import init_vector_store

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("🚀 Starting AegisAI Backend...")
    
    # Initialize MongoDB (optional, falls back to in-memory if not configured)
    from app.db import init_db
    await init_db()
    
    # Initialize vector store
    init_vector_store()
    logger.info("✅ Vector store initialized")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down AegisAI Backend...")
    from app.db import close_db
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Autonomous Explainable AI Decision System",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["Analysis"])
app.include_router(feedback.router, prefix="/api/v1/feedback", tags=["Feedback"])
app.include_router(history.router, prefix="/api/v1/history", tags=["History"])


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "message": "Welcome to AegisAI - Autonomous Explainable AI Decision System"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
