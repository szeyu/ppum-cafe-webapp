from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime

import models
import schemas
import crud
from database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/", response_model=schemas.OrderTrackingResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Create a new order with individual food tracking"""
    # Set the user_id from the authenticated user
    order.user_id = current_user.id
    
    db_order = crud.create_order_with_tracking(db=db, order_data=order)
    
    # Get the order with tracking information - db_order is already the tracking response
    return db_order

@router.get("/user/{user_id}")
def read_user_orders(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get orders for a specific user"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access these orders")
    orders = crud.get_orders(db, user_id=user_id, skip=skip, limit=limit)
    return orders

@router.get("/{order_id}/tracking", response_model=schemas.OrderTrackingResponse)
def get_order_tracking(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get detailed tracking information for an order"""
    # Check if user owns this order
    order = crud.get_order(db, order_id)
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Order not found")
    
    tracking_info = crud.get_order_with_tracking(db, order_id)
    return tracking_info

@router.get("/{order_id}")
def read_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get a specific order"""
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if user owns this order
    if db_order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this order")
    
    return db_order

@router.put("/food-trackers/{tracker_id}/status")
def update_food_tracker_status(tracker_id: int, status: str, db: Session = Depends(get_db)):
    """Update the status of a food tracker"""
    valid_statuses = ["Queued", "Preparing", "Ready", "Delivered"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    tracker = crud.update_food_tracker_status(db, tracker_id, status)
    if not tracker:
        raise HTTPException(status_code=404, detail="Food tracker not found")
    
    return {"message": f"Food tracker status updated to {status}"} 