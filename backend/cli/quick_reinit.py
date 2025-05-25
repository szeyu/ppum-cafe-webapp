#!/usr/bin/env python3
"""
Quick Database Reinitialization Script
Run this script to quickly clear and reseed the database without user interaction.
Usage: python quick_reinit.py
"""

import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime
from reinit_database import reinit_database, check_database_exists

def quick_reinit():
    """Quickly reinitialize database without user prompts"""
    
    print("⚡ Quick Database Reinitialization")
    print("=" * 40)
    
    db_exists = check_database_exists()
    
    if db_exists:
        print("📊 Existing database found - will clear and reseed")
        
        # Create backup with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        print(f"💾 Creating backup: ppum_cafe_backup_{timestamp}.db")
        
        # Use clear_data method (faster)
        method = "clear_data"
        create_backup = True
        
    else:
        print("📊 No existing database - will create fresh")
        method = "recreate_tables"
        create_backup = False
    
    # Perform reinitialization
    try:
        reinit_database(method=method, create_backup=create_backup)
        print("\n✅ Quick reinitialization completed!")
        
    except Exception as e:
        print(f"\n❌ Quick reinitialization failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    quick_reinit() 