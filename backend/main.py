from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import asyncio
from datetime import datetime, timedelta, timezone

import models
import crud
from database import SessionLocal, engine, get_db

# Import all routers
from routers import auth, stalls, menu_items, orders, admin, stall_owner, search, notifications, users

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PPUM Café API",
    description="Backend API for PPUM Café Scan & Order System with Authentication",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Background task for food tracker updates
async def update_food_trackers_background():
    """Background task to simulate food preparation and update trackers"""
    while True:
        db = SessionLocal()
        try:
            # Get all queued and preparing trackers
            trackers = db.query(models.FoodTracker).filter(
                models.FoodTracker.status.in_(["Queued", "Preparing"])
            ).all()
            
            current_time = datetime.now()
            
            for tracker in trackers:
                # Start preparing if it's time
                if tracker.status == "Queued":
                    # Check if it's time to start preparing (based on queue position)
                    queue_delay = tracker.queue_position * 2  # 2 minutes per position
                    start_time = tracker.created_at + timedelta(minutes=queue_delay)
                    
                    if current_time >= start_time:
                        crud.update_food_tracker_status(db, tracker.id, "Preparing")
                
                # Mark as ready if preparation time is complete
                elif tracker.status == "Preparing" and tracker.prep_start_time:
                    ready_time = tracker.prep_start_time + timedelta(minutes=tracker.prep_duration_minutes)
                    
                    if current_time >= ready_time:
                        crud.update_food_tracker_status(db, tracker.id, "Ready")
                        
        except Exception as e:
            print(f"Error updating food trackers: {e}")
        finally:
            db.close()
        
        await asyncio.sleep(30)  # Check every 30 seconds

@app.on_event("startup")
async def startup_event():
    # Start background task
    asyncio.create_task(update_food_trackers_background())

# Include all routers
app.include_router(auth.router)
app.include_router(stalls.router)
app.include_router(menu_items.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(stall_owner.router)
app.include_router(search.router)
app.include_router(notifications.router)
app.include_router(users.router)

# Health check and root endpoints
@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "PPUM Café API is running"}

@app.get("/")
def read_root():
    """Root endpoint"""
    return {"message": "Welcome to PPUM Café API", "version": "2.0.0"}

# Additional stall-specific endpoints that don't fit in other routers
@app.get("/api/stalls/{stall_id}/categories")
def get_menu_categories(stall_id: int, db: Session = Depends(get_db)):
    """Get unique menu categories for a specific stall"""
    categories = db.query(models.MenuItem.category).filter(
        models.MenuItem.stall_id == stall_id
    ).distinct().all()
    return {"categories": [category[0] for category in categories]} 