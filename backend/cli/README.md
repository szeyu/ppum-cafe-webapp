# 🛠️ PPUM Café CLI Tools

Command-line utilities for managing the PPUM Café database and testing API functionality.

## 📁 Directory Structure

```
backend/cli/
├── __init__.py             # Package initialization
├── README.md               # This documentation
├── seed_data.py            # Multi-role seed data
├── reinit_database.py      # Interactive full database reset
├── quick_reinit.py         # Non-interactive quick reset
├── reset_utils.py          # Selective table reset utilities
└── test_api.py             # API endpoint testing suite
```

## 🚀 Quick Usage

```bash
# Navigate to backend directory first
cd backend

# Full interactive database reset
python cli/reinit_database.py

# Quick reset without prompts
python cli/quick_reinit.py

# Selective reset utilities
python cli/reset_utils.py

# Test all API endpoints
python cli/test_api.py
```

---

## 📋 Script Comparison & Use Cases

### 1. **`reinit_database.py`** - Full Interactive Database Reset

**🎯 Purpose**: Complete database reinitialization with user interaction and safety features

**✨ Features**:
- Interactive prompts for safety confirmation
- Automatic backup creation with timestamps
- Two reset methods: clear data OR recreate tables
- Comprehensive error handling with rollback
- Progress indicators and detailed logging

**🔧 Best For**:
- Production-like environments
- When you need backups before reset
- Team environments where safety is crucial
- First-time setup or major schema changes

**💻 Usage**:
```bash
python cli/reinit_database.py
```

**📊 Interactive Flow**:
1. Detects existing database
2. Warns about data loss
3. Asks for confirmation (yes/no)
4. Offers backup creation (y/n)
5. Chooses reset method (1: clear data, 2: recreate tables)
6. Performs reset and reseeding
7. Shows demo account credentials

---

### 2. **`quick_reinit.py`** - Non-Interactive Quick Reset

**🎯 Purpose**: Fast database reset for development workflows

**✨ Features**:
- No user prompts - runs immediately
- Automatic backup if database exists
- Uses fastest reset method (clear data)
- Minimal output, maximum speed
- Perfect for automation/scripts

**🔧 Best For**:
- Development environments
- CI/CD pipelines
- Rapid prototyping
- Automated testing setups
- When you need to reset frequently

**💻 Usage**:
```bash
python cli/quick_reinit.py
```

**⚡ Automatic Behavior**:
- Existing DB: Creates backup → Clears data → Reseeds
- No DB: Creates fresh database with seed data

---

### 3. **`reset_utils.py`** - Selective Table Reset Utilities

**🎯 Purpose**: Surgical database operations for specific tables

**✨ Features**:
- Reset individual table groups
- View database statistics
- Reseed specific data only
- Interactive menu system
- Preserves other data when possible

**🔧 Best For**:
- Development debugging
- Testing specific features
- Preserving user data while resetting orders
- Menu item updates without losing users
- Fine-grained database control

**💻 Usage**:
```bash
python cli/reset_utils.py
```

**📋 Interactive Menu Options**:
1. **View Statistics** - Show record counts for all tables
2. **Reset Orders Only** - Clear orders, order_items, food_trackers, notifications
3. **Reset Menu Items Only** - Clear menu_items (preserves users and stalls)
4. **Reset Users Only** - Clear users and dependent data (preserves stalls/menu)
5. **Reseed Users Only** - Add fresh demo accounts to existing database
6. **Exit** - Close the utility

**🎯 Use Case Examples**:
- **Testing Orders**: Reset orders only to test order flow with existing users
- **Menu Updates**: Reset menu items to test new menu structure
- **User Testing**: Reset users to test authentication with existing menu data
- **Account Recovery**: Reseed users if demo accounts are corrupted

---

### 4. **`test_api.py`** - API Endpoint Testing Suite

**🎯 Purpose**: Comprehensive testing of all API endpoints and authentication

**✨ Features**:
- Tests all 40+ API endpoints
- JWT authentication flow testing
- Role-based access control verification
- Order creation and tracking tests
- Admin and stall owner functionality tests
- Detailed success/failure reporting

**🔧 Best For**:
- API development verification
- Integration testing
- Regression testing after changes
- Deployment validation
- Documentation verification

**💻 Usage**:
```bash
# Ensure backend server is running first
python start_server.py

# In another terminal:
python cli/test_api.py
```

**🧪 Test Coverage**:
- **Authentication**: Register, login, token validation
- **User Management**: Profile updates, role changes
- **Stall Operations**: CRUD operations, menu management
- **Order Flow**: Cart creation, payment, tracking
- **Admin Functions**: User management, system statistics
- **Stall Owner Functions**: Order management, food tracking
- **Security**: Protected endpoints, role-based access

---

### 5. **`seed_data.py`** - Database Seeding Utility

**🎯 Purpose**: Populate database with initial demo data and accounts

**✨ Features**:
- Creates all demo user accounts (admin, user, stall owners)
- Populates 4 food stalls with different cuisines
- Adds 10+ menu items with nutrition data
- Checks for existing data to prevent duplicates
- Comprehensive error handling with rollback

**🔧 Best For**:
- Initial database setup
- Creating fresh demo environment
- Standalone seeding without full reset
- Custom database initialization scripts

**💻 Usage**:
```bash
python cli/seed_data.py
```

**🌱 Data Created**:
- **4 Stalls**: Malay Delights, Western Corner, Chinese Kitchen, Indian Spice
- **6 Users**: 1 admin, 1 regular user, 4 stall owners
- **10+ Menu Items**: Complete with pricing, nutrition, and allergen data
- **Demo Accounts**: Ready-to-use login credentials

**⚠️ Note**: Only seeds if database is empty - won't overwrite existing data

---

## 🔄 When to Use Which Script

### **Development Workflow**:
```bash
# Daily development - quick reset
python cli/quick_reinit.py

# Testing specific features - selective reset
python cli/reset_utils.py  # Choose specific option

# API development - test endpoints
python cli/test_api.py
```

### **Production/Staging Setup**:
```bash
# Safe, interactive reset with backup
python cli/reinit_database.py
```

### **Debugging Scenarios**:
```bash
# Check what's in database
python cli/reset_utils.py  # Option 1: View statistics

# Reset just orders to test order flow
python cli/reset_utils.py  # Option 2: Reset orders only

# Add fresh users if accounts corrupted
python cli/reset_utils.py  # Option 5: Reseed users only
```

### **Testing Scenarios**:
```bash
# Full system test
python cli/quick_reinit.py && python cli/test_api.py

# Test menu changes
python cli/reset_utils.py  # Reset menu items
python cli/test_api.py     # Verify API still works
```

---

## 📊 Database Tables Affected

### **Full Reset Scripts** (`reinit_database.py`, `quick_reinit.py`):
- ✅ **users** - All user accounts
- ✅ **stalls** - All food stalls
- ✅ **menu_items** - All menu items
- ✅ **orders** - All customer orders
- ✅ **order_items** - Individual items in orders
- ✅ **food_trackers** - Individual food tracking
- ✅ **notifications** - All notifications

### **Selective Reset Options** (`reset_utils.py`):

**Reset Orders Only**:
- ✅ orders, order_items, food_trackers, notifications
- ❌ Preserves: users, stalls, menu_items

**Reset Menu Items Only**:
- ✅ menu_items
- ❌ Preserves: users, stalls, orders (if no foreign key conflicts)

**Reset Users Only**:
- ✅ users, orders, order_items, food_trackers, notifications
- ❌ Preserves: stalls, menu_items

**Reseed Users Only**:
- ➕ Adds: admin, demo user, stall owners
- ❌ Preserves: all existing data

---

## 🎉 Demo Accounts Created

After any reset operation, these demo accounts are available:

```
👑 Admin Account:
   Email: admin@ppumcafe.com
   Password: admin123
   Access: Full system administration

👤 Regular User:
   Email: johndoe@email.com
   Password: password123
   Access: Browse stalls, place orders

🏪 Stall Owners:
   Email: malay.owner@ppumcafe.com
   Email: western.owner@ppumcafe.com
   Email: chinese.owner@ppumcafe.com
   Email: indian.owner@ppumcafe.com
   Password: stall123 (for all)
   Access: Manage respective stall orders
```

---

## 💡 Tips & Best Practices

### **Development Tips**:
- Use `quick_reinit.py` for daily development
- Use `reset_utils.py` when testing specific features
- Always run `test_api.py` after making API changes

### **Safety Tips**:
- Use `reinit_database.py` in production-like environments
- Always create backups before major resets
- Check database statistics before and after operations

### **Troubleshooting**:
- If imports fail, ensure you're running from `backend/` directory
- If database is locked, stop the backend server first
- If tests fail, ensure backend server is running on port 8000

### **Performance Notes**:
- `clear_data` method is faster than `recreate_tables`
- `quick_reinit.py` uses the fastest method automatically
- Selective resets are fastest for specific testing needs

---

## 🚨 Important Notes

1. **Run from Backend Directory**: Always execute CLI scripts from the `backend/` directory
2. **Server Status**: Stop backend server before database resets to avoid file locks
3. **Backup Safety**: Backups are created automatically with timestamps
4. **Demo Data**: All scripts create the same demo accounts and menu structure
5. **Path Dependencies**: Scripts automatically handle import paths from cli subdirectory 

### 🔄 CLI Tool Comparison:

| Tool | Purpose | User Interaction | Backup | Speed | Best For |
|------|---------|------------------|--------|-------|----------|
| `reinit_database.py` | Full reset with safety | Interactive prompts | Yes | Moderate | Production, Teams |
| `quick_reinit.py` | Fast development reset | None | Auto | Fast | Development, CI/CD |
| `reset_utils.py` | Selective operations | Menu-driven | Optional | Variable | Debugging, Testing |
| `test_api.py` | API verification | None | N/A | Fast | API Development |
| `seed_data.py` | Initial data seeding | None | N/A | Fast | Fresh Setup, Demo Data | 