from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, TYPE_CHECKING
from datetime import datetime

# Use TYPE_CHECKING to avoid circular imports
if TYPE_CHECKING:
    from models import User as UserModel

# Authentication Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    language_preference: str = "English"

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    language_preference: str = "English"
    role: str = "user"  # user, stall_owner, admin
    stall_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserCreateByAdmin(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    role: str  # admin or stall_owner
    stall_id: Optional[int] = None  # Required for stall_owner

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    managed_stall: Optional["Stall"] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User  # Remove the forward reference quotes

class TokenData(BaseModel):
    email: Optional[str] = None

# Stall Schemas
class StallBase(BaseModel):
    name: str
    cuisine_type: str
    description: Optional[str] = None
    rating: float = 0.0
    image_url: Optional[str] = None
    is_active: bool = True
    average_prep_time: int = 10

class StallCreate(StallBase):
    pass

class Stall(StallBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# MenuItem Schemas
class MenuItemBase(BaseModel):
    stall_id: int
    name: str
    description: Optional[str] = None
    price: float
    category: str
    is_best_seller: bool = False
    is_available: bool = True
    image_url: Optional[str] = None
    base_prep_time: int = 5
    complexity_multiplier: float = 1.0
    calories: Optional[int] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    is_hospital_friendly: bool = False
    allergens: Optional[List[str]] = None

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: int
    current_queue_count: int
    created_at: datetime
    stall: Optional[Stall] = None
    
    class Config:
        from_attributes = True

# Food Tracker Schemas
class FoodTrackerBase(BaseModel):
    status: str
    queue_position: int
    estimated_ready_time: datetime
    prep_duration_minutes: int

class FoodTracker(FoodTrackerBase):
    id: int
    order_id: int
    order_item_id: int
    menu_item_id: int
    stall_id: int
    item_number: int
    actual_ready_time: Optional[datetime] = None
    prep_start_time: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    menu_item: Optional[MenuItem] = None
    stall: Optional[Stall] = None
    
    class Config:
        from_attributes = True

# Order Schemas
class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(BaseModel):
    id: int
    menu_item_id: int
    stall_id: int
    quantity: int
    unit_price: float
    total_price: float
    menu_item: Optional[MenuItem] = None
    stall: Optional[Stall] = None
    food_trackers: List[FoodTracker] = []
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    payment_method: str
    items: List[OrderItemCreate]

class OrderCreate(OrderBase):
    user_id: int

class Order(BaseModel):
    id: int
    user_id: int
    order_number: str
    status: str
    payment_method: str
    subtotal: float
    service_fee: float
    total_amount: float
    estimated_completion_time: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    order_items: List[OrderItem] = []
    food_trackers: List[FoodTracker] = []
    user: Optional[User] = None
    
    class Config:
        from_attributes = True

# Enhanced Notification Schemas
class NotificationBase(BaseModel):
    title: str
    message: str
    notification_type: str = "info"

class NotificationCreate(NotificationBase):
    user_id: int
    order_id: int
    food_tracker_id: Optional[int] = None

class Notification(NotificationBase):
    id: int
    user_id: int
    order_id: int
    food_tracker_id: Optional[int] = None
    is_read: bool
    created_at: datetime
    food_tracker: Optional[FoodTracker] = None
    
    class Config:
        from_attributes = True

# Cart Schemas
class CartItem(BaseModel):
    menu_item_id: int
    quantity: int

class Cart(BaseModel):
    items: List[CartItem]
    user_id: int

# Response Schemas
class StallWithBestSeller(Stall):
    best_seller: Optional[str] = None

class MenuItemWithNutrition(MenuItem):
    nutrition: dict

class OrderSummary(BaseModel):
    subtotal: float
    service_fee: float
    total: float
    total_calories: int
    items_by_stall: dict

class OrderTrackingResponse(BaseModel):
    order: Order
    food_trackers: List[FoodTracker]
    ready_items: List[FoodTracker]
    preparing_items: List[FoodTracker]
    queued_items: List[FoodTracker] 