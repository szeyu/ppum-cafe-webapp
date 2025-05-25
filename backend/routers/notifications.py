from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
import crud
from database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("/user/{user_id}")
def read_user_notifications(
    user_id: int, 
    unread_only: bool = False, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get notifications for a specific user"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access these notifications")
    
    query = db.query(models.Notification).filter(models.Notification.user_id == user_id)
    
    if unread_only:
        query = query.filter(models.Notification.is_read == False)
    
    notifications = query.order_by(models.Notification.created_at.desc()).all()
    return notifications

@router.put("/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Mark a notification as read"""
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    
    return {"message": "Notification marked as read"} 