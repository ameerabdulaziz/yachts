"""
Nauttec Yacht Platform - FastAPI Backend
Fractional yacht ownership and charter platform
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import uvicorn

from database import get_db, engine
from models import Base
from routers import auth, yachts, bookings, ownership, shares, fuel_wallet
from config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nauttec Yacht Platform API",
    description="Fractional yacht ownership and charter platform with De Antonio yachts",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(yachts.router, prefix="/api/yachts", tags=["Yachts"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(ownership.router, prefix="/api/ownership", tags=["Ownership"])
app.include_router(shares.router, prefix="/api/shares", tags=["Share Trading"])
app.include_router(fuel_wallet.router, prefix="/api/fuel", tags=["Fuel Wallet"])

@app.get("/")
async def root():
    return {"message": "Nauttec Yacht Platform API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "nauttec-api"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if settings.environment == "development" else False
    )