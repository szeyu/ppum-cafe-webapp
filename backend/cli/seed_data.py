import asyncio
import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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
            "email": "admin@ppumcafe.com",
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
                "name_bm": "Selera Melayu",
                "cuisine_type": "Malay",
                "cuisine_type_bm": "Melayu",
                "description": "Authentic Malay cuisine with traditional flavors",
                "description_bm": "Masakan Melayu asli dengan rasa tradisional",
                "rating": 4.5,
                "image_url": "/images/malay-stall.jpg",
                "average_prep_time": 12
            },
            {
                "name": "Western Corner",
                "name_bm": "Sudut Barat",
                "cuisine_type": "Western",
                "cuisine_type_bm": "Barat",
                "description": "Delicious Western dishes and comfort food",
                "description_bm": "Hidangan Barat yang lazat dan makanan keselesaan",
                "rating": 4.2,
                "image_url": "/images/western-stall.jpg",
                "average_prep_time": 15
            },
            {
                "name": "Chinese Kitchen",
                "name_bm": "Dapur Cina",
                "cuisine_type": "Chinese",
                "cuisine_type_bm": "Cina",
                "description": "Traditional Chinese dishes with modern twists",
                "description_bm": "Hidangan Cina tradisional dengan sentuhan moden",
                "rating": 4.7,
                "image_url": "/images/chinese-stall.jpg",
                "average_prep_time": 10
            },
            {
                "name": "Indian Spice",
                "name_bm": "Rempah India",
                "cuisine_type": "Indian",
                "cuisine_type_bm": "India",
                "description": "Aromatic Indian spices and authentic curries",
                "description_bm": "Rempah India yang wangi dan kari yang asli",
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
                "name_bm": "Nasi Lemak",
                "description": "Fragrant coconut rice with sambal, anchovies, peanuts, and boiled egg",
                "description_bm": "Nasi lemak yang wangi dengan sambal, ikan bilis, kacang, dan telur rebus",
                "price": 8.50,
                "category": "Rice Dishes",
                "category_bm": "Hidangan Nasi",
                "is_best_seller": True,
                "base_prep_time": 8,
                "complexity_multiplier": 1.2,
                "calories": 450,
                "protein": 15.0,
                "carbs": 65.0,
                "fat": 18.0,
                "is_hospital_friendly": False,
                "allergens": ["Nuts", "Eggs"],
                "allergens_bm": ["Kacang", "Telur"]
            },
            {
                "stall_id": created_stalls[0].id,
                "name": "Mee Goreng",
                "name_bm": "Mee Goreng",
                "description": "Spicy fried noodles with vegetables and your choice of protein",
                "description_bm": "Mee goreng pedas dengan sayur-sayuran dan pilihan protein anda",
                "price": 7.00,
                "category": "Noodles",
                "category_bm": "Mee",
                "base_prep_time": 6,
                "complexity_multiplier": 1.0,
                "calories": 380,
                "protein": 12.0,
                "carbs": 55.0,
                "fat": 14.0,
                "is_hospital_friendly": True,
                "allergens": ["Gluten", "Soy"],
                "allergens_bm": ["Gluten", "Kacang Soya"]
            },
            
            # Western Corner
            {
                "stall_id": created_stalls[1].id,
                "name": "Grilled Chicken Chop",
                "name_bm": "Chop Ayam Panggang",
                "description": "Juicy grilled chicken breast with mashed potatoes and vegetables",
                "description_bm": "Dada ayam panggang yang juicy dengan kentang lenyek dan sayur-sayuran",
                "price": 12.90,
                "category": "Main Course",
                "category_bm": "Hidangan Utama",
                "is_best_seller": True,
                "base_prep_time": 15,
                "complexity_multiplier": 1.5,
                "calories": 520,
                "protein": 35.0,
                "carbs": 25.0,
                "fat": 22.0,
                "is_hospital_friendly": True,
                "allergens": ["Dairy"],
                "allergens_bm": ["Tenusu"]
            },
            {
                "stall_id": created_stalls[1].id,
                "name": "Fish & Chips",
                "name_bm": "Ikan & Kentang Goreng",
                "description": "Crispy battered fish with golden fries and tartar sauce",
                "description_bm": "Ikan bersalut tepung yang rangup dengan kentang goreng dan sos tartar",
                "price": 11.50,
                "category": "Main Course",
                "category_bm": "Hidangan Utama",
                "base_prep_time": 12,
                "complexity_multiplier": 1.3,
                "calories": 680,
                "protein": 28.0,
                "carbs": 45.0,
                "fat": 35.0,
                "is_hospital_friendly": False,
                "allergens": ["Gluten", "Fish"],
                "allergens_bm": ["Gluten", "Ikan"]
            },
            
            # Chinese Kitchen
            {
                "stall_id": created_stalls[2].id,
                "name": "Sweet & Sour Chicken",
                "name_bm": "Ayam Manis & Asam",
                "description": "Tender Chicken pieces in tangy sweet and sour sauce with pineapple",
                "description_bm": "Ayam lembut dalam saus manis dan asam dengan buah nenas",
                "price": 9.80,
                "category": "Chicken Dishes",
                "category_bm": "Hidangan Ayam",
                "is_best_seller": True,
                "base_prep_time": 10,
                "complexity_multiplier": 1.4,
                "calories": 420,
                "protein": 22.0,
                "carbs": 35.0,
                "fat": 18.0,
                "is_hospital_friendly": False,
                "allergens": ["Soy"],
                "allergens_bm": ["Kacang Soya"]
            },
            {
                "stall_id": created_stalls[2].id,
                "name": "Vegetable Fried Rice",
                "name_bm": "Nasi Goreng Sayur",
                "description": "Wok-fried rice with mixed vegetables and soy sauce",
                "description_bm": "Nasi goreng dengan sayur-sayuran dan saus kacang",
                "price": 6.50,
                "category": "Rice Dishes",
                "category_bm": "Hidangan Nasi",
                "base_prep_time": 5,
                "complexity_multiplier": 0.8,
                "calories": 320,
                "protein": 8.0,
                "carbs": 58.0,
                "fat": 8.0,
                "is_hospital_friendly": True,
                "allergens": ["Soy", "Eggs"],
                "allergens_bm": ["Kacang Soya", "Telur"]
            },
            
            # Indian Spice
            {
                "stall_id": created_stalls[3].id,
                "name": "Chicken Biryani",
                "name_bm": "Biryani Ayam",
                "description": "Aromatic basmati rice with spiced chicken and traditional herbs",
                "description_bm": "Nasi basmati yang wangi dengan ayam dan rempah tradisional",
                "price": 10.90,
                "category": "Rice Dishes",
                "category_bm": "Hidangan Nasi",
                "is_best_seller": True,
                "base_prep_time": 18,
                "complexity_multiplier": 1.6,
                "calories": 480,
                "protein": 25.0,
                "carbs": 60.0,
                "fat": 15.0,
                "is_hospital_friendly": True,
                "allergens": ["Dairy"],
                "allergens_bm": ["Tenusu"]
            },
            {
                "stall_id": created_stalls[3].id,
                "name": "Vegetable Curry",
                "name_bm": "Kari Sayur",
                "description": "Mixed vegetables in rich coconut curry sauce",
                "description_bm": "Sayur-sayuran dalam kari kelapa yang kaya",
                "price": 7.80,
                "category": "Vegetarian",
                "category_bm": "Hidangan Vegetarian",
                "base_prep_time": 12,
                "complexity_multiplier": 1.1,
                "calories": 280,
                "protein": 6.0,
                "carbs": 35.0,
                "fat": 12.0,
                "is_hospital_friendly": True,
                "allergens": ["Coconut"],
                "allergens_bm": ["Kelapa"]
            },
            
            # Additional items
            {
                "stall_id": created_stalls[1].id,
                "name": "Caesar Salad",
                "name_bm": "Salad Caesar",
                "description": "Fresh romaine lettuce with parmesan cheese and croutons",
                "description_bm": "Salad romaine dengan keju parmesan dan croutons",
                "price": 8.90,
                "category": "Salads",
                "category_bm": "Salad",
                "base_prep_time": 3,
                "complexity_multiplier": 0.5,
                "calories": 180,
                "protein": 8.0,
                "carbs": 12.0,
                "fat": 12.0,
                "is_hospital_friendly": True,
                "allergens": ["Dairy", "Gluten"],
                "allergens_bm": ["Tenusu", "Gluten"]
            },
            {
                "stall_id": created_stalls[2].id,
                "name": "Wonton Soup",
                "name_bm": "Sup Wonton",
                "description": "Delicate pork and shrimp wontons in clear broth",
                "description_bm": "Wonton daging dan udang dalam kaldu jernih",
                "price": 6.80,
                "category": "Soups",
                "category_bm": "Sup",
                "base_prep_time": 7,
                "complexity_multiplier": 1.0,
                "calories": 220,
                "protein": 15.0,
                "carbs": 20.0,
                "fat": 8.0,
                "is_hospital_friendly": True,
                "allergens": ["Shellfish", "Gluten"],
                "allergens_bm": ["Kerang", "Gluten"]
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