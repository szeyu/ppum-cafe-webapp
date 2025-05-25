from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
import crud
from database import get_db

router = APIRouter(prefix="/api/search", tags=["search"])

@router.get("/menu-items")
def search_menu_items(q: str, stall_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Search menu items by name or description"""
    query = db.query(models.MenuItem).filter(
        models.MenuItem.name.contains(q) | models.MenuItem.description.contains(q)
    )
    
    if stall_id:
        query = query.filter(models.MenuItem.stall_id == stall_id)
    
    return query.all()

@router.get("/stalls")
def search_stalls(q: str, db: Session = Depends(get_db)):
    """Search stalls by name or description"""
    stalls = db.query(models.Stall).filter(
        models.Stall.name.contains(q) | models.Stall.description.contains(q)
    ).all()
    return stalls 