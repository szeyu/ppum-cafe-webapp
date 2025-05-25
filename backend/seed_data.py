import asyncio
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import crud

def seed_database():
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(models.User).first():
            print("Database already seeded!")
            return
        
        print("Seeding database...")
        
        # Create admin user
        admin_user_data = {
            "name": "PPUM Cafe Admin",
            "email": "ppumcafe1@email.com",
            "password": "admin123",
            "phone": "+60123456789",
            "role": "admin",
            "language_preference": "English"
        }
        
        admin_user = crud.create_user(db, crud.schemas.UserCreate(**admin_user_data))
        print(f"Created admin user: {admin_user.email}")
        
        # Create demo regular user
        demo_user_data = {
            "name": "John Doe",
            "email": "johndoe@email.com",
            "password": "password123",
            "phone": "+60123456789",
            "role": "user",
            "language_preference": "English"
        }
        
        demo_user = crud.create_user(db, crud.schemas.UserCreate(**demo_user_data))
        print(f"Created demo user: {demo_user.email}")
        
        # Create stalls
        stalls_data = [
            {
                "name": "Malay Delights",
                "cuisine_type": "Malay",
                "description": "Authentic Malay cuisine with traditional flavors",
                "rating": 4.5,
                "image_url": "/images/malay-stall.jpg",
                "average_prep_time": 12
            },
            {
                "name": "Western Corner",
                "cuisine_type": "Western",
                "description": "Delicious Western dishes and comfort food",
                "rating": 4.2,
                "image_url": "/images/western-stall.jpg",
                "average_prep_time": 15
            },
            {
                "name": "Chinese Kitchen",
                "cuisine_type": "Chinese",
                "description": "Traditional Chinese dishes with modern twists",
                "rating": 4.7,
                "image_url": "/images/chinese-stall.jpg",
                "average_prep_time": 10
            },
            {
                "name": "Indian Spice",
                "cuisine_type": "Indian",
                "description": "Aromatic Indian spices and authentic curries",
                "rating": 4.4,
                "image_url": "/images/indian-stall.jpg",
                "average_prep_time": 14
            }
        ]
        
        created_stalls = []
        for stall_data in stalls_data:
            stall = crud.create_stall(db, crud.schemas.StallCreate(**stall_data))
            created_stalls.append(stall)
            print(f"Created stall: {stall.name}")
        
        # Create stall owner accounts
        stall_owners_data = [
            {
                "name": "Ahmad Rahman",
                "email": "malay.owner@ppumcafe.com",
                "password": "stall123",
                "phone": "+60123456701",
                "role": "stall_owner",
                "stall_id": created_stalls[0].id,
                "language_preference": "English"
            },
            {
                "name": "Sarah Johnson",
                "email": "western.owner@ppumcafe.com",
                "password": "stall123",
                "phone": "+60123456702",
                "role": "stall_owner",
                "stall_id": created_stalls[1].id,
                "language_preference": "English"
            },
            {
                "name": "Li Wei Chen",
                "email": "chinese.owner@ppumcafe.com",
                "password": "stall123",
                "phone": "+60123456703",
                "role": "stall_owner",
                "stall_id": created_stalls[2].id,
                "language_preference": "English"
            },
            {
                "name": "Raj Patel",
                "email": "indian.owner@ppumcafe.com",
                "password": "stall123",
                "phone": "+60123456704",
                "role": "stall_owner",
                "stall_id": created_stalls[3].id,
                "language_preference": "English"
            }
        ]
        
        for owner_data in stall_owners_data:
            owner = crud.create_user(db, crud.schemas.UserCreate(**owner_data))
            print(f"Created stall owner: {owner.email} for {owner.managed_stall.name if owner.managed_stall else 'Unknown Stall'}")
        
        # Create menu items
        menu_items_data = [
            # Malay Delights
            {
                "stall_id": created_stalls[0].id,
                "name": "Nasi Lemak",
                "description": "Fragrant coconut rice with sambal, anchovies, peanuts, and boiled egg",
                "price": 8.50,
                "category": "Rice Dishes",
                "is_best_seller": True,
                "base_prep_time": 8,
                "complexity_multiplier": 1.2,
                "calories": 450,
                "protein": 15.0,
                "carbs": 65.0,
                "fat": 18.0,
                "is_hospital_friendly": False,
                "allergens": ["Nuts", "Eggs"]
            },
            {
                "stall_id": created_stalls[0].id,
                "name": "Mee Goreng",
                "description": "Spicy fried noodles with vegetables and your choice of protein",
                "price": 7.00,
                "category": "Noodles",
                "base_prep_time": 6,
                "complexity_multiplier": 1.0,
                "calories": 380,
                "protein": 12.0,
                "carbs": 55.0,
                "fat": 14.0,
                "is_hospital_friendly": True,
                "allergens": ["Gluten", "Soy"]
            },
            
            # Western Corner
            {
                "stall_id": created_stalls[1].id,
                "name": "Grilled Chicken Chop",
                "description": "Juicy grilled chicken breast with mashed potatoes and vegetables",
                "price": 12.90,
                "category": "Main Course",
                "is_best_seller": True,
                "base_prep_time": 15,
                "complexity_multiplier": 1.5,
                "calories": 520,
                "protein": 35.0,
                "carbs": 25.0,
                "fat": 22.0,
                "is_hospital_friendly": True,
                "allergens": ["Dairy"]
            },
            {
                "stall_id": created_stalls[1].id,
                "name": "Fish & Chips",
                "description": "Crispy battered fish with golden fries and tartar sauce",
                "price": 11.50,
                "category": "Main Course",
                "base_prep_time": 12,
                "complexity_multiplier": 1.3,
                "calories": 680,
                "protein": 28.0,
                "carbs": 45.0,
                "fat": 35.0,
                "is_hospital_friendly": False,
                "allergens": ["Gluten", "Fish"]
            },
            
            # Chinese Kitchen
            {
                "stall_id": created_stalls[2].id,
                "name": "Sweet & Sour Pork",
                "description": "Tender pork pieces in tangy sweet and sour sauce with pineapple",
                "price": 9.80,
                "category": "Pork Dishes",
                "is_best_seller": True,
                "base_prep_time": 10,
                "complexity_multiplier": 1.4,
                "calories": 420,
                "protein": 22.0,
                "carbs": 35.0,
                "fat": 18.0,
                "is_hospital_friendly": False,
                "allergens": ["Soy"]
            },
            {
                "stall_id": created_stalls[2].id,
                "name": "Vegetable Fried Rice",
                "description": "Wok-fried rice with mixed vegetables and soy sauce",
                "price": 6.50,
                "category": "Rice Dishes",
                "base_prep_time": 5,
                "complexity_multiplier": 0.8,
                "calories": 320,
                "protein": 8.0,
                "carbs": 58.0,
                "fat": 8.0,
                "is_hospital_friendly": True,
                "allergens": ["Soy", "Eggs"]
            },
            
            # Indian Spice
            {
                "stall_id": created_stalls[3].id,
                "name": "Chicken Biryani",
                "description": "Aromatic basmati rice with spiced chicken and traditional herbs",
                "price": 10.90,
                "category": "Rice Dishes",
                "is_best_seller": True,
                "base_prep_time": 18,
                "complexity_multiplier": 1.6,
                "calories": 480,
                "protein": 25.0,
                "carbs": 60.0,
                "fat": 15.0,
                "is_hospital_friendly": True,
                "allergens": ["Dairy"]
            },
            {
                "stall_id": created_stalls[3].id,
                "name": "Vegetable Curry",
                "description": "Mixed vegetables in rich coconut curry sauce",
                "price": 7.80,
                "category": "Vegetarian",
                "base_prep_time": 12,
                "complexity_multiplier": 1.1,
                "calories": 280,
                "protein": 6.0,
                "carbs": 35.0,
                "fat": 12.0,
                "is_hospital_friendly": True,
                "allergens": ["Coconut"]
            },
            
            # Additional items
            {
                "stall_id": created_stalls[1].id,
                "name": "Caesar Salad",
                "description": "Fresh romaine lettuce with parmesan cheese and croutons",
                "price": 8.90,
                "category": "Salads",
                "base_prep_time": 3,
                "complexity_multiplier": 0.5,
                "calories": 180,
                "protein": 8.0,
                "carbs": 12.0,
                "fat": 12.0,
                "is_hospital_friendly": True,
                "allergens": ["Dairy", "Gluten"]
            },
            {
                "stall_id": created_stalls[2].id,
                "name": "Wonton Soup",
                "description": "Delicate pork and shrimp wontons in clear broth",
                "price": 6.80,
                "category": "Soups",
                "base_prep_time": 7,
                "complexity_multiplier": 1.0,
                "calories": 220,
                "protein": 15.0,
                "carbs": 20.0,
                "fat": 8.0,
                "is_hospital_friendly": True,
                "allergens": ["Shellfish", "Gluten"]
            }
        ]
        
        for item_data in menu_items_data:
            item = crud.create_menu_item(db, crud.schemas.MenuItemCreate(**item_data))
            print(f"Created menu item: {item.name}")
        
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database() 