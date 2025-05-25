from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Stall, MenuItem
from schemas import Stall as StallSchema, StallCreate
from routers.auth import get_current_user
from models import User

router = APIRouter(prefix="/api/stalls", tags=["stalls"])

@router.get("/", response_model=List[StallSchema])
async def get_stalls(db: Session = Depends(get_db)):
    """Get all active stalls"""
    stalls = db.query(Stall).filter(Stall.is_active == True).all()
    return stalls

@router.get("/{stall_id}", response_model=StallSchema)
async def get_stall(stall_id: int, db: Session = Depends(get_db)):
    """Get a specific stall by ID"""
    stall = db.query(Stall).filter(Stall.id == stall_id).first()
    if not stall:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stall not found"
        )
    return stall

@router.post("/", response_model=StallSchema)
async def create_stall(
    stall_data: StallCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new stall (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create stalls"
        )
    
    new_stall = Stall(**stall_data.model_dump())
    db.add(new_stall)
    db.commit()
    db.refresh(new_stall)
    return new_stall

@router.put("/{stall_id}", response_model=StallSchema)
async def update_stall(
    stall_id: int,
    stall_data: StallCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a stall (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update stalls"
        )
    
    stall = db.query(Stall).filter(Stall.id == stall_id).first()
    if not stall:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stall not found"
        )
    
    # Update stall fields
    for field, value in stall_data.model_dump(exclude_unset=True).items():
        setattr(stall, field, value)
    
    db.commit()
    db.refresh(stall)
    return stall

@router.delete("/{stall_id}")
async def delete_stall(
    stall_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a stall (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete stalls"
        )
    
    stall = db.query(Stall).filter(Stall.id == stall_id).first()
    if not stall:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stall not found"
        )
    
    # Delete associated menu items first
    db.query(MenuItem).filter(MenuItem.stall_id == stall_id).delete()
    
    # Delete the stall
    db.delete(stall)
    db.commit()
    
    return {"message": "Stall deleted successfully"} 