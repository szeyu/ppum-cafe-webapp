from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
import crud
from database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get a specific user"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user")
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}/language")
def update_user_language(user_id: int, language: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Update user's language preference"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    db_user = crud.update_user_language(db, user_id=user_id, language=language)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Language updated successfully"} 