from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

import models
import schemas
import crud
from database import get_db

router = APIRouter(prefix="/api/search", tags=["search"])

@router.get("/menu-items")
def search_menu_items(
    q: str, 
    stall_id: Optional[int] = None, 
    language: Optional[str] = Header("English"),
    db: Session = Depends(get_db)
):
    """Search menu items by name or description"""
    
    if language == "BM":
        # Search in BM fields when in BM mode
        query = db.query(models.MenuItem).filter(
            or_(
                models.MenuItem.name_bm.contains(q),
                models.MenuItem.description_bm.contains(q)
            )
        )
    else:
        # Search in English fields when in English mode
        query = db.query(models.MenuItem).filter(
            or_(
                models.MenuItem.name.contains(q),
                models.MenuItem.description.contains(q)
            )
        )
    
    if stall_id:
        query = query.filter(models.MenuItem.stall_id == stall_id)
    
    menu_items = query.all()
    
    # Transform results based on language preference
    if language == "BM":
        for item in menu_items:
            if item.name_bm:
                item.name = item.name_bm
            if item.description_bm:
                item.description = item.description_bm
            if item.category_bm:
                # Don't transform category for filtering compatibility
                pass
    
    return menu_items

@router.get("/stalls")
def search_stalls(
    q: str, 
    language: Optional[str] = Header("English"),
    db: Session = Depends(get_db)
):
    """Search stalls by name, description, or cuisine type"""
    
    if language == "BM":
        # Search in BM fields when in BM mode
        stalls = db.query(models.Stall).filter(
            or_(
                models.Stall.name_bm.contains(q),
                models.Stall.description_bm.contains(q),
                models.Stall.cuisine_type_bm.contains(q)
            )
        ).filter(models.Stall.is_active == True).all()
    else:
        # Search in English fields when in English mode
        stalls = db.query(models.Stall).filter(
            or_(
                models.Stall.name.contains(q),
                models.Stall.description.contains(q),
                models.Stall.cuisine_type.contains(q)
            )
        ).filter(models.Stall.is_active == True).all()
    
    # Transform results based on language preference
    if language == "BM":
        for stall in stalls:
            if stall.name_bm:
                stall.name = stall.name_bm
            if stall.cuisine_type_bm:
                stall.cuisine_type = stall.cuisine_type_bm
            if stall.description_bm:
                stall.description = stall.description_bm
    
    return stalls 