from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)  # Added for authentication
    role = Column(String(20), default="user")  # user, stall_owner, admin
    stall_id = Column(Integer, ForeignKey("stalls.id"), nullable=True)  # For stall owners
    language_preference = Column(String(10), default="English")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    orders = relationship("Order", back_populates="user")
    managed_stall = relationship("Stall", foreign_keys=[stall_id])

class Stall(Base):
    __tablename__ = "stalls"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_bm = Column(String(100), nullable=True)  # Bahasa Malaysia name
    cuisine_type = Column(String(50), nullable=False)
    cuisine_type_bm = Column(String(50), nullable=True)  # Bahasa Malaysia cuisine type
    description = Column(Text, nullable=True)
    description_bm = Column(Text, nullable=True)  # Bahasa Malaysia description
    rating = Column(Float, default=0.0)
    image_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    average_prep_time = Column(Integer, default=10)  # Average preparation time in minutes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    menu_items = relationship("MenuItem", back_populates="stall")
    order_items = relationship("OrderItem", back_populates="stall")

class MenuItem(Base):
    __tablename__ = "menu_items"
    
    id = Column(Integer, primary_key=True, index=True)
    stall_id = Column(Integer, ForeignKey("stalls.id"), nullable=False)
    name = Column(String(100), nullable=False)
    name_bm = Column(String(100), nullable=True)  # Bahasa Malaysia name
    description = Column(Text, nullable=True)
    description_bm = Column(Text, nullable=True)  # Bahasa Malaysia description
    price = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    category_bm = Column(String(50), nullable=True)  # Bahasa Malaysia category
    is_best_seller = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    image_url = Column(String(255), nullable=True)
    
    # Enhanced timing and complexity
    base_prep_time = Column(Integer, default=5)  # Base preparation time in minutes
    complexity_multiplier = Column(Float, default=1.0)  # Complexity factor for prep time
    current_queue_count = Column(Integer, default=0)  # Current orders in queue
    
    # Nutrition information
    calories = Column(Integer, nullable=True)
    protein = Column(Float, nullable=True)
    carbs = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    is_hospital_friendly = Column(Boolean, default=False)
    allergens = Column(JSON, nullable=True)  # Store as JSON array
    allergens_bm = Column(JSON, nullable=True)  # Bahasa Malaysia allergens
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    stall = relationship("Stall", back_populates="menu_items")
    order_items = relationship("OrderItem", back_populates="menu_item")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_number = Column(String(20), unique=True, nullable=False)
    status = Column(String(20), default="Accepted")  # Accepted, Preparing, Partially Ready, Completed, Cancelled
    payment_method = Column(String(20), nullable=False)  # Online Payment, Cash at Counter
    subtotal = Column(Float, nullable=False)
    service_fee = Column(Float, default=1.50)
    total_amount = Column(Float, nullable=False)
    estimated_completion_time = Column(DateTime(timezone=True), nullable=True)  # When all items will be ready
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")
    food_trackers = relationship("FoodTracker", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    stall_id = Column(Integer, ForeignKey("stalls.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    menu_item = relationship("MenuItem", back_populates="order_items")
    stall = relationship("Stall", back_populates="order_items")
    food_trackers = relationship("FoodTracker", back_populates="order_item")

class FoodTracker(Base):
    __tablename__ = "food_trackers"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    order_item_id = Column(Integer, ForeignKey("order_items.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    stall_id = Column(Integer, ForeignKey("stalls.id"), nullable=False)
    
    # Individual item tracking
    item_number = Column(Integer, nullable=False)  # For multiple quantities (1st, 2nd, 3rd item)
    status = Column(String(20), default="Queued")  # Queued, Preparing, Ready, Collected
    queue_position = Column(Integer, nullable=False)  # Position in stall's queue
    estimated_ready_time = Column(DateTime(timezone=True), nullable=False)
    actual_ready_time = Column(DateTime(timezone=True), nullable=True)
    
    # Timing details
    prep_start_time = Column(DateTime(timezone=True), nullable=True)
    prep_duration_minutes = Column(Integer, nullable=False)  # Calculated prep time
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="food_trackers")
    order_item = relationship("OrderItem", back_populates="food_trackers")
    menu_item = relationship("MenuItem")
    stall = relationship("Stall")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    food_tracker_id = Column(Integer, ForeignKey("food_trackers.id"), nullable=True)  # For individual item notifications
    title = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(20), default="info")  # info, success, warning, food_ready
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    food_tracker = relationship("FoodTracker") 