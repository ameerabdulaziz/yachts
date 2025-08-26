"""
Nauttec Database Models - SQLAlchemy ORM
Yacht ownership, bookings, and share trading system
"""
from sqlalchemy import Column, String, Integer, Decimal, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String(20), unique=True)
    email = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    profile_image_url = Column(String)
    role = Column(String(20), default="renter")  # renter, owner, both, admin
    is_verified = Column(Boolean, default=False)
    fuel_wallet_balance = Column(Decimal(10, 2), default=0.00)
    google_id = Column(String, unique=True)
    facebook_id = Column(String, unique=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    yachts = relationship("Yacht", back_populates="owner")
    bookings = relationship("Booking", back_populates="user")
    share_purchases = relationship("SharePurchase", back_populates="user")
    share_listings = relationship("ShareListing", back_populates="seller")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.recipient_id", back_populates="recipient")
    fuel_transactions = relationship("FuelTransaction", back_populates="user")

class Yacht(Base):
    __tablename__ = "yachts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    location = Column(String(255), nullable=False)
    price_per_day = Column(Decimal(10, 2), nullable=False)
    capacity = Column(Integer, nullable=False)
    cabins = Column(Integer, nullable=False)
    length = Column(Decimal(5, 2))  # in meters
    year_built = Column(Integer)
    images = Column(JSON)  # Array of image URLs
    amenities = Column(JSON)  # Array of amenities
    owner_id = Column(String, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    rating = Column(Decimal(3, 2), default=0.00)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="yachts")
    bookings = relationship("Booking", back_populates="yacht")
    ownership_opportunities = relationship("OwnershipOpportunity", back_populates="yacht")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    yacht_id = Column(String, ForeignKey("yachts.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    guest_count = Column(Integer, nullable=False)
    total_price = Column(Decimal(10, 2), nullable=False)
    status = Column(String(20), default="pending")  # pending, confirmed, cancelled
    add_ons = Column(JSON)  # captain, catering, etc.
    payment_method = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    yacht = relationship("Yacht", back_populates="bookings")
    user = relationship("User", back_populates="bookings")

class OwnershipOpportunity(Base):
    __tablename__ = "ownership_opportunities"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    yacht_id = Column(String, ForeignKey("yachts.id"), nullable=False)
    share_price = Column(Decimal(10, 2), nullable=False)
    share_fraction = Column(String(10), nullable=False)  # "1/8", "1/6", etc.
    usage_days_per_year = Column(Integer, nullable=False)  # 48 days for 1/8 share
    total_shares = Column(Integer, nullable=False)
    available_shares = Column(Integer, nullable=False)
    financing = Column(JSON)  # Financing options
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    yacht = relationship("Yacht", back_populates="ownership_opportunities")
    share_purchases = relationship("SharePurchase", back_populates="opportunity")

class SharePurchase(Base):
    __tablename__ = "share_purchases"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    opportunity_id = Column(String, ForeignKey("ownership_opportunities.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    shares_purchased = Column(Integer, nullable=False)
    purchase_price = Column(Decimal(10, 2), nullable=False)
    purchase_date = Column(DateTime, server_default=func.now())
    
    # Relationships
    opportunity = relationship("OwnershipOpportunity", back_populates="share_purchases")
    user = relationship("User", back_populates="share_purchases")
    share_listings = relationship("ShareListing", back_populates="share_purchase")

class ShareListing(Base):
    __tablename__ = "share_listings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    share_purchase_id = Column(String, ForeignKey("share_purchases.id"), nullable=False)
    seller_id = Column(String, ForeignKey("users.id"), nullable=False)
    asking_price = Column(Decimal(10, 2), nullable=False)
    shares_for_sale = Column(Integer, nullable=False)
    status = Column(String(20), default="active")  # active, sold, cancelled
    right_of_first_refusal_expires = Column(DateTime)  # 30-day period
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    share_purchase = relationship("SharePurchase", back_populates="share_listings")
    seller = relationship("User", back_populates="share_listings")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(String, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="received_messages")

class FuelTransaction(Base):
    __tablename__ = "fuel_transactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    amount = Column(Decimal(10, 2), nullable=False)
    transaction_type = Column(String(20), nullable=False)  # topup, booking, refund
    description = Column(Text)
    booking_id = Column(String, ForeignKey("bookings.id"))
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="fuel_transactions")