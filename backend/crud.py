from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_
from typing import List, Optional
import models
import schemas
from datetime import datetime, timedelta
import random
import string
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Authentication CRUD
def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    
    # Update last login
    user.last_login = datetime.now()
    db.commit()
    return user

def create_user_with_password(db: Session, user: schemas.UserRegister):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password_hash=hashed_password,
        language_preference=user.language_preference
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password_hash=hashed_password,
        role=user.role,
        stall_id=user.stall_id,
        language_preference=user.language_preference
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user_by_admin(db: Session, user: schemas.UserCreateByAdmin):
    """Create user by admin (for stall owners and other admins)"""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password_hash=hashed_password,
        role=user.role,
        stall_id=user.stall_id,
        language_preference="English"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users_by_role(db: Session, role: str, skip: int = 0, limit: int = 100):
    """Get users by role"""
    return db.query(models.User).options(
        joinedload(models.User.managed_stall)
    ).filter(models.User.role == role).offset(skip).limit(limit).all()

def get_stall_orders(db: Session, stall_id: int, skip: int = 0, limit: int = 100):
    """Get orders for a specific stall"""
    return db.query(models.Order).options(
        joinedload(models.Order.order_items).joinedload(models.OrderItem.menu_item),
        joinedload(models.Order.order_items).joinedload(models.OrderItem.stall),
        joinedload(models.Order.food_trackers).joinedload(models.FoodTracker.menu_item),
        joinedload(models.Order.user)
    ).join(models.OrderItem).filter(
        models.OrderItem.stall_id == stall_id
    ).order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()

def get_stall_food_trackers(db: Session, stall_id: int, status: Optional[str] = None):
    """Get food trackers for a specific stall"""
    query = db.query(models.FoodTracker).options(
        joinedload(models.FoodTracker.menu_item),
        joinedload(models.FoodTracker.order).joinedload(models.Order.user)
    ).filter(models.FoodTracker.stall_id == stall_id)
    
    if status:
        query = query.filter(models.FoodTracker.status == status)
    
    return query.order_by(models.FoodTracker.estimated_ready_time).all()

def update_food_tracker_by_stall_owner(db: Session, tracker_id: int, status: str, stall_id: int):
    """Update food tracker status by stall owner (with stall verification)"""
    tracker = db.query(models.FoodTracker).filter(
        and_(
            models.FoodTracker.id == tracker_id,
            models.FoodTracker.stall_id == stall_id
        )
    ).first()
    
    if not tracker:
        return None
    
    return update_food_tracker_status(db, tracker_id, status)

def update_user_language(db: Session, user_id: int, language: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.language_preference = language
        db.commit()
        db.refresh(db_user)
    return db_user

# Stall CRUD
def get_stalls(db: Session, skip: int = 0, limit: int = 100):
    stalls = db.query(models.Stall).filter(models.Stall.is_active == True).offset(skip).limit(limit).all()
    
    # Add best seller information
    result = []
    for stall in stalls:
        stall_dict = stall.__dict__.copy()
        # Get best seller item
        best_seller = db.query(models.MenuItem).filter(
            and_(models.MenuItem.stall_id == stall.id, models.MenuItem.is_best_seller == True)
        ).first()
        stall_dict['best_seller'] = best_seller.name if best_seller else None
        result.append(stall_dict)
    
    return result

def get_stall(db: Session, stall_id: int):
    return db.query(models.Stall).filter(models.Stall.id == stall_id).first()

def create_stall(db: Session, stall: schemas.StallCreate):
    db_stall = models.Stall(**stall.model_dump())
    db.add(db_stall)
    db.commit()
    db.refresh(db_stall)
    return db_stall

# MenuItem CRUD with Queue Management
def get_menu_items(db: Session, stall_id: Optional[int] = None, category: Optional[str] = None):
    query = db.query(models.MenuItem).options(
        joinedload(models.MenuItem.stall)
    ).filter(models.MenuItem.is_available == True)
    
    if stall_id:
        query = query.filter(models.MenuItem.stall_id == stall_id)
    
    if category:
        query = query.filter(models.MenuItem.category == category)
    
    return query.all()

def get_menu_item(db: Session, item_id: int):
    return db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()

def create_menu_item(db: Session, item: schemas.MenuItemCreate):
    db_item = models.MenuItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_menu_categories(db: Session, stall_id: int):
    categories = db.query(models.MenuItem.category).filter(
        and_(models.MenuItem.stall_id == stall_id, models.MenuItem.is_available == True)
    ).distinct().all()
    return [cat[0] for cat in categories]

def calculate_prep_time(db: Session, menu_item_id: int) -> int:
    """Calculate dynamic preparation time based on queue and complexity"""
    menu_item = get_menu_item(db, menu_item_id)
    if not menu_item:
        return 10  # Default fallback
    
    # Base calculation: base_prep_time * complexity_multiplier + queue_factor
    base_time = menu_item.base_prep_time * menu_item.complexity_multiplier
    queue_factor = menu_item.current_queue_count * 2  # 2 minutes per item in queue
    
    total_time = int(base_time + queue_factor)
    return max(total_time, 3)  # Minimum 3 minutes

def update_menu_item_queue(db: Session, menu_item_id: int, increment: int):
    """Update the queue count for a menu item"""
    menu_item = get_menu_item(db, menu_item_id)
    if menu_item:
        menu_item.current_queue_count = max(0, menu_item.current_queue_count + increment)
        db.commit()

# Order CRUD
def generate_order_number():
    """Generate a unique order number"""
    return ''.join(random.choices(string.digits, k=4))

def create_order_with_tracking(db: Session, order_data: schemas.OrderCreate):
    """Create order with individual food item tracking"""
    # Calculate totals
    subtotal = 0
    order_items_data = []
    
    for item in order_data.items:
        menu_item = get_menu_item(db, item.menu_item_id)
        if not menu_item:
            raise ValueError(f"Menu item {item.menu_item_id} not found")
        
        total_price = menu_item.price * item.quantity
        subtotal += total_price
        
        order_items_data.append({
            "menu_item_id": item.menu_item_id,
            "stall_id": menu_item.stall_id,
            "quantity": item.quantity,
            "unit_price": menu_item.price,
            "total_price": total_price,
            "menu_item": menu_item
        })
    
    service_fee = 1.50
    total_amount = subtotal + service_fee
    
    # Calculate estimated completion time (when all items will be ready)
    max_completion_time = datetime.now()
    
    # Create order
    db_order = models.Order(
        user_id=order_data.user_id,
        order_number=generate_order_number(),
        payment_method=order_data.payment_method,
        subtotal=subtotal,
        service_fee=service_fee,
        total_amount=total_amount
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items and food trackers
    for item_data in order_items_data:
        # Create order item
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            menu_item_id=item_data["menu_item_id"],
            stall_id=item_data["stall_id"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            total_price=item_data["total_price"]
        )
        db.add(db_order_item)
        db.commit()
        db.refresh(db_order_item)
        
        # Create individual food trackers for each quantity
        menu_item = item_data["menu_item"]
        for item_number in range(1, item_data["quantity"] + 1):
            # Calculate prep time and queue position
            prep_time = calculate_prep_time(db, menu_item.id)
            queue_position = menu_item.current_queue_count + item_number
            
            # Calculate estimated ready time
            estimated_ready = datetime.now() + timedelta(minutes=prep_time + (queue_position * 2))
            
            # Create food tracker
            food_tracker = models.FoodTracker(
                order_id=db_order.id,
                order_item_id=db_order_item.id,
                menu_item_id=menu_item.id,
                stall_id=menu_item.stall_id,
                item_number=item_number,
                queue_position=queue_position,
                estimated_ready_time=estimated_ready,
                prep_duration_minutes=prep_time
            )
            db.add(food_tracker)
            
            # Update max completion time
            if estimated_ready > max_completion_time:
                max_completion_time = estimated_ready
        
        # Update menu item queue count
        update_menu_item_queue(db, menu_item.id, item_data["quantity"])
    
    # Update order with estimated completion time
    db_order.estimated_completion_time = max_completion_time
    db.commit()
    
    # Create initial notification
    create_notification(db, schemas.NotificationCreate(
        user_id=order_data.user_id,
        order_id=db_order.id,
        title="Order Confirmed",
        message=f"Your order #{db_order.order_number} has been confirmed. Estimated completion: {max_completion_time.strftime('%H:%M')}",
        notification_type="success"
    ))
    
    return get_order_with_tracking(db, db_order.id)

def get_orders(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Order).options(
        joinedload(models.Order.order_items).joinedload(models.OrderItem.menu_item),
        joinedload(models.Order.order_items).joinedload(models.OrderItem.stall),
        joinedload(models.Order.food_trackers).joinedload(models.FoodTracker.menu_item),
        joinedload(models.Order.user)
    ).filter(models.Order.user_id == user_id).order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).options(
        joinedload(models.Order.order_items).joinedload(models.OrderItem.menu_item),
        joinedload(models.Order.order_items).joinedload(models.OrderItem.stall),
        joinedload(models.Order.food_trackers).joinedload(models.FoodTracker.menu_item),
        joinedload(models.Order.user)
    ).filter(models.Order.id == order_id).first()

def get_order_with_tracking(db: Session, order_id: int):
    """Get order with detailed food tracking information"""
    order = get_order(db, order_id)
    if not order:
        return None
    
    food_trackers = db.query(models.FoodTracker).options(
        joinedload(models.FoodTracker.menu_item),
        joinedload(models.FoodTracker.stall)
    ).filter(models.FoodTracker.order_id == order_id).all()
    
    return {
        "order": order,
        "food_trackers": food_trackers,
        "ready_items": [ft for ft in food_trackers if ft.status == "Ready"],
        "preparing_items": [ft for ft in food_trackers if ft.status == "Preparing"],
        "queued_items": [ft for ft in food_trackers if ft.status == "Queued"]
    }

def update_food_tracker_status(db: Session, tracker_id: int, status: str):
    """Update individual food tracker status"""
    tracker = db.query(models.FoodTracker).filter(models.FoodTracker.id == tracker_id).first()
    if not tracker:
        return None
    
    old_status = tracker.status
    tracker.status = status
    tracker.updated_at = datetime.now()
    
    if status == "Preparing" and old_status == "Queued":
        tracker.prep_start_time = datetime.now()
    elif status == "Ready" and old_status == "Preparing":
        tracker.actual_ready_time = datetime.now()
        
        # Create notification for ready item
        create_notification(db, schemas.NotificationCreate(
            user_id=tracker.order.user_id,
            order_id=tracker.order_id,
            food_tracker_id=tracker.id,
            title="Food Ready! 🍽️",
            message=f"Your {tracker.menu_item.name} (#{tracker.order.order_number}) is ready for pickup!",
            notification_type="food_ready"
        ))
        
        # Update menu item queue count
        update_menu_item_queue(db, tracker.menu_item_id, -1)
    elif status == "Collected" and old_status == "Ready":
        # Create notification for collected item
        create_notification(db, schemas.NotificationCreate(
            user_id=tracker.order.user_id,
            order_id=tracker.order_id,
            food_tracker_id=tracker.id,
            title="Item Collected ✅",
            message=f"Your {tracker.menu_item.name} (#{tracker.order.order_number}) has been collected!",
            notification_type="success"
        ))
    
    db.commit()
    
    # Check if order status should be updated
    update_order_status_based_on_trackers(db, tracker.order_id)
    
    return tracker

def update_order_status_based_on_trackers(db: Session, order_id: int):
    """Update order status based on food tracker statuses"""
    trackers = db.query(models.FoodTracker).filter(models.FoodTracker.order_id == order_id).all()
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    
    if not trackers or not order:
        return
    
    # Count different statuses
    ready_count = sum(1 for t in trackers if t.status == "Ready")
    collected_count = sum(1 for t in trackers if t.status == "Collected")
    preparing_count = sum(1 for t in trackers if t.status == "Preparing")
    queued_count = sum(1 for t in trackers if t.status == "Queued")
    total_count = len(trackers)
    
    # Determine new status based on tracker states
    if collected_count == total_count:
        # All items have been collected
        new_status = "Completed"
    elif ready_count + collected_count == total_count:
        # All items are either ready or collected
        if ready_count > 0:
            new_status = "Ready for Pickup"
        else:
            new_status = "Completed"  # This shouldn't happen but just in case
    elif ready_count + collected_count > 0:
        # Some items are ready/collected, others still preparing/queued
        new_status = "Partially Ready"
    elif preparing_count > 0:
        # Some items are being prepared
        new_status = "Preparing"
    else:
        # All items are still queued
        new_status = "Accepted"
    
    if order.status != new_status:
        order.status = new_status
        order.updated_at = datetime.now()
        db.commit()

# Notification CRUD
def create_notification(db: Session, notification: schemas.NotificationCreate):
    db_notification = models.Notification(**notification.model_dump())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_notifications(db: Session, user_id: int, unread_only: bool = False):
    query = db.query(models.Notification).options(
        joinedload(models.Notification.food_tracker).joinedload(models.FoodTracker.menu_item)
    ).filter(models.Notification.user_id == user_id)
    
    if unread_only:
        query = query.filter(models.Notification.is_read == False)
    
    return query.order_by(models.Notification.created_at.desc()).all()

def mark_notification_read(db: Session, notification_id: int):
    db_notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if db_notification:
        db_notification.is_read = True
        db.commit()
        db.refresh(db_notification)
    return db_notification

# Search functionality
def search_menu_items(db: Session, query: str, stall_id: Optional[int] = None):
    search_query = db.query(models.MenuItem).filter(
        and_(
            models.MenuItem.is_available == True,
            models.MenuItem.name.contains(query)
        )
    )
    
    if stall_id:
        search_query = search_query.filter(models.MenuItem.stall_id == stall_id)
    
    return search_query.all()

def search_stalls(db: Session, query: str):
    return db.query(models.Stall).filter(
        and_(
            models.Stall.is_active == True,
            models.Stall.name.contains(query)
        )
    ).all() 