from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

import models
import schemas
import crud
from database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/api/stall-owner", tags=["stall-owner"])

def require_stall_owner(current_user: models.User = Depends(get_current_user)):
    """Require stall_owner role for access"""
    if current_user.role != "stall_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Stall owner role required."
        )
    return current_user

@router.get("/orders")
def get_stall_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_owner: models.User = Depends(require_stall_owner)
):
    """Get orders for the stall owner's stall"""
    # Check if user has a stall assigned
    if not current_owner.stall_id:
        raise HTTPException(status_code=404, detail="No stall assigned to this owner")
    
    # Get orders that contain items from this stall
    orders = db.query(models.Order).join(models.OrderItem).join(models.MenuItem).filter(
        models.MenuItem.stall_id == current_owner.stall_id
    ).options(
        joinedload(models.Order.user),
        joinedload(models.Order.order_items).joinedload(models.OrderItem.menu_item)
    ).offset(skip).limit(limit).all()
    
    return orders

@router.get("/food-trackers")
def get_stall_food_trackers(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_owner: models.User = Depends(require_stall_owner)
):
    """Get food trackers for the stall owner's items"""
    # Check if user has a stall assigned
    if not current_owner.stall_id:
        raise HTTPException(status_code=404, detail="No stall assigned to this owner")
    
    # Build query for food trackers
    query = db.query(models.FoodTracker).join(models.MenuItem).filter(
        models.MenuItem.stall_id == current_owner.stall_id
    ).options(
        joinedload(models.FoodTracker.menu_item),
        joinedload(models.FoodTracker.order)
    )
    
    if status:
        query = query.filter(models.FoodTracker.status == status)
    
    trackers = query.all()
    return trackers

@router.put("/food-trackers/{tracker_id}/status")
def update_food_tracker_by_owner(
    tracker_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_owner: models.User = Depends(require_stall_owner)
):
    """Update food tracker status (stall owner only for their items)"""
    # Check if user has a stall assigned
    if not current_owner.stall_id:
        raise HTTPException(status_code=404, detail="No stall assigned to this owner")
    
    # Get the food tracker and verify it belongs to this stall
    tracker = db.query(models.FoodTracker).join(models.MenuItem).filter(
        models.FoodTracker.id == tracker_id,
        models.MenuItem.stall_id == current_owner.stall_id
    ).first()
    
    if not tracker:
        raise HTTPException(status_code=404, detail="Food tracker not found or not owned by your stall")
    
    # Validate status - Updated to match database model
    valid_statuses = ["Queued", "Preparing", "Ready", "Collected"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    # Update the tracker
    updated_tracker = crud.update_food_tracker_status(db, tracker_id, status)
    if not updated_tracker:
        raise HTTPException(status_code=500, detail="Failed to update food tracker")
    
    return {"message": f"Food tracker status updated to {status}"}

@router.get("/stall")
def get_stall_owner_stall(
    db: Session = Depends(get_db),
    current_owner: models.User = Depends(require_stall_owner)
):
    """Get the stall owned by the current stall owner"""
    if not current_owner.stall_id:
        raise HTTPException(status_code=404, detail="No stall assigned to this owner")
    
    stall = db.query(models.Stall).filter(models.Stall.id == current_owner.stall_id).first()
    if not stall:
        raise HTTPException(status_code=404, detail="Stall not found")
    
    return stall

@router.get("/menu-items")
def get_stall_menu_items(
    db: Session = Depends(get_db),
    current_owner: models.User = Depends(require_stall_owner)
):
    """Get menu items for the stall owner's stall"""
    # Check if user has a stall assigned
    if not current_owner.stall_id:
        raise HTTPException(status_code=404, detail="No stall assigned to this owner")
    
    menu_items = db.query(models.MenuItem).filter(models.MenuItem.stall_id == current_owner.stall_id).all()
    return menu_items

@router.post("/menu-items", response_model=schemas.MenuItem)
def create_stall_menu_item(
    item: schemas.MenuItemCreate,
    db: Session = Depends(get_db),
    current_owner: models.User = Depends(require_stall_owner)
):
    """Create a new menu item for the stall owner's stall"""
    # Check if user has a stall assigned
    if not current_owner.stall_id:
        raise HTTPException(status_code=404, detail="No stall assigned to this owner")
    
    # Ensure the item is being created for the owner's stall
    if item.stall_id != current_owner.stall_id:
        raise HTTPException(status_code=403, detail="Cannot create menu items for other stalls")
    
    return crud.create_menu_item(db=db, item=item)

@router.put("/menu-items/{item_id}", response_model=schemas.MenuItem)
def update_stall_menu_item(
    item_id: int,
    item: schemas.MenuItemCreate,
    db: Session = Depends(get_db),
    current_owner: models.User = Depends(require_stall_owner)
):
    """Update a menu item for the stall owner's stall"""
    # Check if user has a stall assigned
    if not current_owner.stall_id:
        raise HTTPException(status_code=404, detail="No stall assigned to this owner")
    
    # Get the menu item and verify it belongs to this stall
    db_item = db.query(models.MenuItem).filter(
        models.MenuItem.id == item_id,
        models.MenuItem.stall_id == current_owner.stall_id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found or not owned by your stall")
    
    # Ensure the item is being updated for the owner's stall
    if item.stall_id != current_owner.stall_id:
        raise HTTPException(status_code=403, detail="Cannot update menu items for other stalls")
    
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

@router.delete("/menu-items/{item_id}")
def delete_stall_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_owner: models.User = Depends(require_stall_owner)
):
    """Delete a menu item from the stall owner's stall"""
    # Check if user has a stall assigned
    if not current_owner.stall_id:
        raise HTTPException(status_code=404, detail="No stall assigned to this owner")
    
    # Get the menu item and verify it belongs to this stall
    db_item = db.query(models.MenuItem).filter(
        models.MenuItem.id == item_id,
        models.MenuItem.stall_id == current_owner.stall_id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found or not owned by your stall")
    
    try:
        db.delete(db_item)
        db.commit()
        return {"message": "Menu item deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting menu item: {str(e)}") 