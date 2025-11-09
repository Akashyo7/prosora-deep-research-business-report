from fastapi import APIRouter
from app.api.endpoints import health, research

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(research.router, tags=["research"])