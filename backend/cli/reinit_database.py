import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from seed_data import seed_database

def clear_all_data():
    """Clear all data from all tables while preserving table structure"""
    db = SessionLocal()
    
    try:
        print("🗑️  Clearing all existing data...")
        
        # Clear tables in reverse dependency order to avoid foreign key conflicts
        print("   - Clearing notifications...")
        db.query(models.Notification).delete()
        
        print("   - Clearing food trackers...")
        db.query(models.FoodTracker).delete()
        
        print("   - Clearing order items...")
        db.query(models.OrderItem).delete()
        
        print("   - Clearing orders...")
        db.query(models.Order).delete()
        
        print("   - Clearing menu items...")
        db.query(models.MenuItem).delete()
        
        print("   - Clearing users...")
        db.query(models.User).delete()
        
        print("   - Clearing stalls...")
        db.query(models.Stall).delete()
        
        # Commit the changes
        db.commit()
        print("✅ All data cleared successfully!")
        
    except Exception as e:
        print(f"❌ Error clearing data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def drop_and_recreate_tables():
    """Drop all tables and recreate them from scratch"""
    print("🔄 Dropping and recreating all tables...")
    
    try:
        # Drop all tables
        print("   - Dropping existing tables...")
        models.Base.metadata.drop_all(bind=engine)
        
        # Recreate all tables
        print("   - Creating tables from models...")
        models.Base.metadata.create_all(bind=engine)
        
        print("✅ Tables recreated successfully!")
        
    except Exception as e:
        print(f"❌ Error recreating tables: {e}")
        raise

def check_database_exists():
    """Check if database file exists"""
    db_file = "ppum_cafe.db"
    return os.path.exists(db_file)

def backup_database():
    """Create a backup of the current database"""
    import shutil
    from datetime import datetime
    
    db_file = "ppum_cafe.db"
    if os.path.exists(db_file):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"ppum_cafe_backup_{timestamp}.db"
        
        try:
            shutil.copy2(db_file, backup_file)
            print(f"✅ Database backed up to: {backup_file}")
            return backup_file
        except Exception as e:
            print(f"⚠️  Warning: Could not create backup: {e}")
            return None
    else:
        print("ℹ️  No existing database to backup")
        return None

def reinit_database(method="clear_data", create_backup=True):
    """
    Reinitialize the database using one of two methods:
    - 'clear_data': Clear all data but keep table structure
    - 'recreate_tables': Drop and recreate all tables
    """
    
    print("🚀 Starting database reinitialization...")
    print(f"   Method: {method}")
    
    # Create backup if requested and database exists
    backup_file = None
    if create_backup and check_database_exists():
        backup_file = backup_database()
    
    try:
        if method == "clear_data":
            # Method 1: Clear data but keep table structure
            clear_all_data()
            
        elif method == "recreate_tables":
            # Method 2: Drop and recreate tables
            drop_and_recreate_tables()
            
        else:
            raise ValueError(f"Invalid method: {method}. Use 'clear_data' or 'recreate_tables'")
        
        # Reseed the database
        print("\n🌱 Reseeding database with fresh data...")
        seed_database()
        
        print("\n🎉 Database reinitialization completed successfully!")
        
        if backup_file:
            print(f"   💾 Backup available at: {backup_file}")
        
        print("\n📋 Demo Accounts Created:")
        print("   👑 Admin: admin@ppumcafe.com / admin123")
        print("   👤 User: johndoe@email.com / password123")
        print("   🏪 Stall Owners: [cuisine].owner@ppumcafe.com / stall123")
        
    except Exception as e:
        print(f"\n❌ Database reinitialization failed: {e}")
        
        if backup_file:
            print(f"   💾 Backup available for restoration: {backup_file}")
        
        sys.exit(1)

def main():
    """Main function with user interaction"""
    
    print("=" * 60)
    print("🍽️  PPUM Café Database Reinitialization Tool")
    print("=" * 60)
    
    # Check if database exists
    db_exists = check_database_exists()
    
    if db_exists:
        print("📊 Current database detected!")
        
        # Ask for confirmation
        print("\n⚠️  WARNING: This will completely reset the database!")
        print("   All existing data will be lost (users, orders, menu items, etc.)")
        
        response = input("\n❓ Do you want to continue? (yes/no): ").lower().strip()
        
        if response not in ['yes', 'y']:
            print("🚫 Operation cancelled by user")
            sys.exit(0)
        
        # Ask for backup
        backup_response = input("\n💾 Create backup before proceeding? (y/n): ").lower().strip()
        create_backup = backup_response in ['yes', 'y']
        
        # Ask for method
        print("\n🔧 Choose reinitialization method:")
        print("   1. Clear data only (faster, keeps table structure)")
        print("   2. Recreate tables (slower, ensures fresh schema)")
        
        method_choice = input("\n❓ Enter choice (1 or 2): ").strip()
        
        if method_choice == "1":
            method = "clear_data"
        elif method_choice == "2":
            method = "recreate_tables"
        else:
            print("❌ Invalid choice. Using default method (clear_data)")
            method = "clear_data"
        
    else:
        print("📊 No existing database found - will create fresh database")
        create_backup = False
        method = "recreate_tables"
    
    print(f"\n🏁 Starting reinitialization...")
    print(f"   📊 Database exists: {db_exists}")
    print(f"   💾 Create backup: {create_backup}")
    print(f"   🔧 Method: {method}")
    
    # Perform the reinitialization
    reinit_database(method=method, create_backup=create_backup)

if __name__ == "__main__":
    main() 