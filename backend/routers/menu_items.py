from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from database import get_db
from models import MenuItem, Stall, User
from schemas import MenuItem as MenuItemSchema, MenuItemCreate
from routers.auth import get_current_user

router = APIRouter(prefix="/api/menu-items", tags=["menu-items"])

@router.get("/", response_model=List[MenuItemSchema])
async def get_menu_items(
    stall_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    is_available: Optional[bool] = Query(None),
    is_hospital_friendly: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """Get menu items with optional filtering"""
    query = db.query(MenuItem).options(joinedload(MenuItem.stall))
    
    if stall_id:
        query = query.filter(MenuItem.stall_id == stall_id)
    if category:
        query = query.filter(MenuItem.category == category)
    if is_available is not None:
        query = query.filter(MenuItem.is_available == is_available)
    if is_hospital_friendly is not None:
        query = query.filter(MenuItem.is_hospital_friendly == is_hospital_friendly)
    
    menu_items = query.all()
    return menu_items

@router.get("/{item_id}", response_model=MenuItemSchema)
async def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    """Get a specific menu item by ID"""
    menu_item = db.query(MenuItem).options(joinedload(MenuItem.stall)).filter(MenuItem.id == item_id).first()
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    return menu_item

@router.post("/", response_model=MenuItemSchema)
async def create_menu_item(
    item_data: MenuItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new menu item (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create menu items"
        )
    
    # Verify stall exists
    stall = db.query(Stall).filter(Stall.id == item_data.stall_id).first()
    if not stall:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stall not found"
        )
    
    new_item = MenuItem(**item_data.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    # Load the stall relationship
    db.refresh(new_item)
    return new_item

@router.put("/{item_id}", response_model=MenuItemSchema)
async def update_menu_item(
    item_id: int,
    item_data: MenuItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a menu item (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update menu items"
        )
    
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    # Update menu item fields
    for field, value in item_data.model_dump(exclude_unset=True).items():
        setattr(menu_item, field, value)
    
    db.commit()
    db.refresh(menu_item)
    return menu_item

@router.delete("/{item_id}")
async def delete_menu_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a menu item (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete menu items"
        )
    
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    db.delete(menu_item)
    db.commit()
    
    return {"message": "Menu item deleted successfully"} 