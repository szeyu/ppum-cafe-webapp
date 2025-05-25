#!/usr/bin/env python3
"""
Database Reset Utilities
Collection of utility functions for resetting specific parts of the database.
"""

import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import crud
from datetime import datetime

def reset_orders_only():
    """Reset only orders, order_items, food_trackers, and notifications"""
    db = SessionLocal()
    
    try:
        print("🔄 Resetting orders and related data...")
        
        # Clear in dependency order
        print("   - Clearing notifications...")
        db.query(models.Notification).delete()
        
        print("   - Clearing food trackers...")
        db.query(models.FoodTracker).delete()
        
        print("   - Clearing order items...")
        db.query(models.OrderItem).delete()
        
        print("   - Clearing orders...")
        db.query(models.Order).delete()
        
        db.commit()
        print("✅ Orders reset successfully!")
        
    except Exception as e:
        print(f"❌ Error resetting orders: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def reset_menu_items_only():
    """Reset only menu items (preserves stalls and users)"""
    db = SessionLocal()
    
    try:
        print("🔄 Resetting menu items...")
        
        # Clear menu items (this will cascade to order_items if there are any)
        print("   - Clearing menu items...")
        db.query(models.MenuItem).delete()
        
        db.commit()
        print("✅ Menu items reset successfully!")
        
    except Exception as e:
        print(f"❌ Error resetting menu items: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def reset_users_only():
    """Reset only users (preserves stalls and menu items)"""
    db = SessionLocal()
    
    try:
        print("🔄 Resetting users...")
        
        # First clear user-dependent data
        print("   - Clearing notifications...")
        db.query(models.Notification).delete()
        
        print("   - Clearing food trackers...")
        db.query(models.FoodTracker).delete()
        
        print("   - Clearing order items...")
        db.query(models.OrderItem).delete()
        
        print("   - Clearing orders...")
        db.query(models.Order).delete()
        
        print("   - Clearing users...")
        db.query(models.User).delete()
        
        db.commit()
        print("✅ Users reset successfully!")
        
    except Exception as e:
        print(f"❌ Error resetting users: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def reseed_users_only():
    """Reseed only the users (admin, demo user, stall owners)"""
    db = SessionLocal()
    
    try:
        print("🌱 Reseeding users...")
        
        # Get existing stalls for stall owners
        stalls = db.query(models.Stall).all()
        
        if not stalls:
            print("⚠️  No stalls found! Please reseed stalls first.")
            return
        
        # Create admin user (only if doesn't exist)
        existing_admin = db.query(models.User).filter(models.User.email == "admin@ppumcafe.com").first()
        if not existing_admin:
            admin_user_data = {
                "name": "PPUM Cafe Admin",
                "email": "admin@ppumcafe.com",
                "password": "admin123",
                "phone": "+60123456789",
                "role": "admin",
                "language_preference": "English"
            }
            admin_user = crud.create_user(db, crud.schemas.UserCreate(**admin_user_data))
            print(f"   - Created admin user: {admin_user.email}")
        else:
            print(f"   - Admin user already exists: admin@ppumcafe.com")
        
        # Create demo regular user (only if doesn't exist)
        existing_demo = db.query(models.User).filter(models.User.email == "johndoe@email.com").first()
        if not existing_demo:
            demo_user_data = {
                "name": "John Doe",
                "email": "johndoe@email.com",
                "password": "password123",
                "phone": "+60123456789",
                "role": "user",
                "language_preference": "English"
            }
            demo_user = crud.create_user(db, crud.schemas.UserCreate(**demo_user_data))
            print(f"   - Created demo user: {demo_user.email}")
        else:
            print(f"   - Demo user already exists: johndoe@email.com")
        
        # Create stall owner accounts (only if they don't exist)
        stall_owners_data = [
            {
                "name": "Ahmad Rahman",
                "email": "malay.owner@ppumcafe.com",
                "password": "stall123",
                "phone": "+60123456701",
                "role": "stall_owner",
                "stall_id": stalls[0].id if len(stalls) > 0 else None,
                "language_preference": "English"
            },
            {
                "name": "Sarah Johnson",
                "email": "western.owner@ppumcafe.com",
                "password": "stall123",
                "phone": "+60123456702",
                "role": "stall_owner",
                "stall_id": stalls[1].id if len(stalls) > 1 else None,
                "language_preference": "English"
            },
            {
                "name": "Li Wei Chen",
                "email": "chinese.owner@ppumcafe.com",
                "password": "stall123",
                "phone": "+60123456703",
                "role": "stall_owner",
                "stall_id": stalls[2].id if len(stalls) > 2 else None,
                "language_preference": "English"
            },
            {
                "name": "Raj Patel",
                "email": "indian.owner@ppumcafe.com",
                "password": "stall123",
                "phone": "+60123456704",
                "role": "stall_owner",
                "stall_id": stalls[3].id if len(stalls) > 3 else None,
                "language_preference": "English"
            }
        ]
        
        for owner_data in stall_owners_data:
            if owner_data["stall_id"]:
                # Check if this stall owner already exists
                existing_owner = db.query(models.User).filter(models.User.email == owner_data["email"]).first()
                if not existing_owner:
                    owner = crud.create_user(db, crud.schemas.UserCreate(**owner_data))
                    print(f"   - Created stall owner: {owner.email}")
                else:
                    print(f"   - Stall owner already exists: {owner_data['email']}")
        
        print("✅ Users reseeded successfully!")
        
    except Exception as e:
        print(f"❌ Error reseeding users: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def get_database_stats():
    """Get current database statistics"""
    db = SessionLocal()
    
    try:
        stats = {
            "users": db.query(models.User).count(),
            "stalls": db.query(models.Stall).count(),
            "menu_items": db.query(models.MenuItem).count(),
            "orders": db.query(models.Order).count(),
            "order_items": db.query(models.OrderItem).count(),
            "food_trackers": db.query(models.FoodTracker).count(),
            "notifications": db.query(models.Notification).count()
        }
        
        return stats
        
    finally:
        db.close()

def print_database_stats():
    """Print current database statistics"""
    print("\n📊 Current Database Statistics:")
    print("=" * 35)
    
    stats = get_database_stats()
    
    for table, count in stats.items():
        print(f"   {table.replace('_', ' ').title():<15}: {count:>4}")
    
    total_records = sum(stats.values())
    print(f"   {'Total Records':<15}: {total_records:>4}")

def main():
    """Interactive utility menu"""
    
    print("🛠️  Database Reset Utilities")
    print("=" * 30)
    
    while True:
        print("\nSelect an option:")
        print("1. View database statistics")
        print("2. Reset orders only")
        print("3. Reset menu items only") 
        print("4. Reset users only")
        print("5. Reseed users only")
        print("6. Exit")
        
        choice = input("\n❓ Enter choice (1-6): ").strip()
        
        if choice == "1":
            print_database_stats()
            
        elif choice == "2":
            confirm = input("\n⚠️  Reset all orders? (yes/no): ").lower().strip()
            if confirm in ['yes', 'y']:
                reset_orders_only()
            else:
                print("🚫 Operation cancelled")
                
        elif choice == "3":
            confirm = input("\n⚠️  Reset all menu items? (yes/no): ").lower().strip()
            if confirm in ['yes', 'y']:
                reset_menu_items_only()
            else:
                print("🚫 Operation cancelled")
                
        elif choice == "4":
            confirm = input("\n⚠️  Reset all users? This will also reset orders! (yes/no): ").lower().strip()
            if confirm in ['yes', 'y']:
                reset_users_only()
            else:
                print("🚫 Operation cancelled")
                
        elif choice == "5":
            confirm = input("\n🌱 Reseed users? (yes/no): ").lower().strip()
            if confirm in ['yes', 'y']:
                reseed_users_only()
            else:
                print("🚫 Operation cancelled")
                
        elif choice == "6":
            print("👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice. Please enter 1-6.")

if __name__ == "__main__":
    main() 