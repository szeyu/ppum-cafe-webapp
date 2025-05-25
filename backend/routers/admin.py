from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

import models
import schemas
import crud
from database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

def require_admin(current_user: models.User = Depends(get_current_user)):
    """Require admin role for access"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin role required."
        )
    return current_user

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Get admin dashboard statistics"""
    total_users = db.query(models.User).count()
    total_stalls = db.query(models.Stall).count()
    total_menu_items = db.query(models.MenuItem).count()
    total_orders = db.query(models.Order).count()
    
    # Get users by role
    users_by_role = {}
    for role in ["user", "stall_owner", "admin"]:
        count = db.query(models.User).filter(models.User.role == role).count()
        users_by_role[role] = count
    
    return {
        "total_users": total_users,
        "total_stalls": total_stalls,
        "total_menu_items": total_menu_items,
        "total_orders": total_orders,
        "users_by_role": users_by_role
    }

# Stall management endpoints
@router.delete("/stalls/{stall_id}")
def delete_stall(stall_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Delete a stall and all associated data"""
    db_stall = crud.get_stall(db, stall_id=stall_id)
    if db_stall is None:
        raise HTTPException(status_code=404, detail="Stall not found")
    
    try:
        # Delete associated menu items first
        db.query(models.MenuItem).filter(models.MenuItem.stall_id == stall_id).delete()
        
        # Delete the stall
        db.delete(db_stall)
        db.commit()
        
        return {"message": "Stall deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting stall: {str(e)}")

@router.put("/stalls/{stall_id}")
def update_stall(stall_id: int, stall: schemas.StallCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Update a stall"""
    db_stall = crud.get_stall(db, stall_id=stall_id)
    if db_stall is None:
        raise HTTPException(status_code=404, detail="Stall not found")
    
    # Update stall fields
    for field, value in stall.dict().items():
        setattr(db_stall, field, value)
    
    try:
        db.commit()
        db.refresh(db_stall)
        return db_stall
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating stall: {str(e)}")

@router.post("/stalls")
def create_stall_admin(stall: schemas.StallCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Create a new stall (admin only)"""
    return crud.create_stall(db=db, stall=stall)

# Menu item management endpoints
@router.get("/menu-items")
def get_admin_menu_items(db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Get all menu items with stall information for admin panel"""
    menu_items = db.query(models.MenuItem).options(joinedload(models.MenuItem.stall)).all()
    return menu_items

@router.delete("/menu-items/{item_id}")
def delete_menu_item(item_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Delete a menu item"""
    db_item = crud.get_menu_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    try:
        db.delete(db_item)
        db.commit()
        return {"message": "Menu item deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting menu item: {str(e)}")

@router.put("/menu-items/{item_id}")
def update_menu_item(item_id: int, item: schemas.MenuItemCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Update a menu item"""
    db_item = crud.get_menu_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Update item fields
    for field, value in item.dict().items():
        setattr(db_item, field, value)
    
    try:
        db.commit()
        db.refresh(db_item)
        return db_item
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating menu item: {str(e)}")

@router.post("/menu-items")
def create_menu_item_admin(item: schemas.MenuItemCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Create a new menu item (admin only)"""
    return crud.create_menu_item(db=db, item=item)

# Order management endpoints
@router.get("/orders")
def get_all_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Get all orders for admin panel"""
    orders = db.query(models.Order).options(
        joinedload(models.Order.user),
        joinedload(models.Order.order_items).joinedload(models.OrderItem.menu_item)
    ).offset(skip).limit(limit).all()
    return orders

@router.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Delete an order and all associated data"""
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    try:
        # Delete associated food trackers
        db.query(models.FoodTracker).filter(models.FoodTracker.order_id == order_id).delete()
        
        # Delete associated order items
        db.query(models.OrderItem).filter(models.OrderItem.order_id == order_id).delete()
        
        # Delete the order
        db.delete(db_order)
        db.commit()
        
        return {"message": "Order deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting order: {str(e)}")

# User management endpoints
@router.get("/users")
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Get all users for admin panel"""
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.post("/users", response_model=schemas.User)
def create_user_by_admin(
    user: schemas.UserCreateByAdmin, 
    password_confirmation: str,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(require_admin)
):
    """Create a new user by admin with role assignment"""
    # Check if email already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password confirmation
    if user.password != password_confirmation:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Validate role
    valid_roles = ["user", "stall_owner", "admin"]
    if user.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")
    
    # Create user with hashed password
    user_data = schemas.UserRegister(
        email=user.email,
        password=user.password,
        full_name=user.full_name,
        phone_number=user.phone_number,
        language_preference=user.language_preference
    )
    
    db_user = crud.create_user_with_password(db=db, user=user_data)
    
    # Update role
    db_user.role = user.role
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.get("/users/by-role/{role}")
def get_users_by_role(
    role: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(require_admin)
):
    """Get users filtered by role"""
    valid_roles = ["user", "stall_owner", "admin"]
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")
    
    users = db.query(models.User).filter(models.User.role == role).offset(skip).limit(limit).all()
    return users

@router.put("/users/change-role")
def change_user_role(
    role_change: dict,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(require_admin)
):
    """Change a user's role"""
    user_id = role_change.get("user_id")
    new_role = role_change.get("new_role")
    
    if not user_id or not new_role:
        raise HTTPException(status_code=400, detail="user_id and new_role are required")
    
    # Validate role
    valid_roles = ["user", "stall_owner", "admin"]
    if new_role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")
    
    # Get user
    user = crud.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from changing their own role
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    
    # Update role
    old_role = user.role
    user.role = new_role
    
    try:
        db.commit()
        db.refresh(user)
        return {
            "message": f"User role changed from {old_role} to {new_role}",
            "user": user
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating user role: {str(e)}")

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(require_admin)):
    """Delete a user"""
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deleting themselves
    if db_user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    try:
        db.delete(db_user)
        db.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}") 