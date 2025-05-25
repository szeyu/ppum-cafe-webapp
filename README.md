# 🍽️ PPUM Café Scan & Order System

A comprehensive full-stack web application for PPUM Hospital café ordering system with **JWT authentication**, **individual food tracking**, **multi-role management**, and **real-time order processing**.

## 🎯 Project Overview

This is a **production-ready full-stack implementation** featuring:
- ✅ **JWT Authentication System** with role-based access control
- ✅ **Individual Food Item Tracking** with separate status for each item
- ✅ **Multi-Role System** (User, Stall Owner, Admin)
- ✅ **FastAPI Backend** with SQLite database and background tasks
- ✅ **React Frontend** with modern UX and animations
- ✅ **Real-time Order Tracking** with dynamic preparation times
- ✅ **Comprehensive Admin Panel** with full CRUD operations
- ✅ **Enhanced Cart Experience** with floating cart and animations
- ✅ **Smart Notification System** for individual food readiness
- ✅ **Order Status Consistency** with automatic state management

## 🏗️ Architecture

```
ppum-cafe-webapp/
├── backend/                 # FastAPI + SQLite Backend
│   ├── main.py             # FastAPI app with background tasks
│   ├── models.py           # SQLAlchemy models (7 tables)
│   ├── schemas.py          # Pydantic schemas with validation
│   ├── crud.py             # Advanced CRUD operations
│   ├── database.py         # Database configuration
│   ├── start_server.py     # Server startup script
│   ├── requirements.txt    # Python dependencies
│   ├── ppum_cafe.db        # SQLite database
│   ├── cli/                # Command-line tools
│   │   ├── __init__.py     # CLI package initialization
│   │   ├── README.md       # Detailed CLI documentation
│   │   ├── seed_data.py    # Multi-role seed data
│   │   ├── reinit_database.py  # Interactive database reset
│   │   ├── quick_reinit.py     # Non-interactive quick reset
│   │   ├── reset_utils.py      # Selective table reset utilities
│   │   └── test_api.py         # API endpoint testing suite
│   └── routers/            # Modular API endpoints
│       ├── auth.py         # Authentication endpoints
│       ├── admin.py        # Admin management endpoints
│       ├── stall_owner.py  # Stall owner endpoints
│       ├── orders.py       # Order management
│       ├── menu_items.py   # Menu item operations
│       ├── stalls.py       # Stall management
│       ├── users.py        # User management
│       ├── notifications.py # Notification system
│       └── search.py       # Search functionality
│
└── frontend/               # React Frontend
    ├── src/
    │   ├── services/api.js # API service with JWT handling
    │   ├── context/        # React context for state management
    │   │   └── AppContext.js # Global app state
    │   ├── pages/          # All application pages
    │   │   ├── Home.js     # Main stall listing
    │   │   ├── StallMenu.js # Individual stall menus
    │   │   ├── Cart.js     # Shopping cart
    │   │   ├── Payment.js  # Payment processing
    │   │   ├── Orders.js   # Order tracking
    │   │   ├── Profile.js  # User profile
    │   │   ├── Login.js    # Authentication
    │   │   ├── Register.js # User registration
    │   │   ├── Admin.js    # Admin panel
    │   │   └── StallManagement.js # Stall owner interface
    │   └── components/     # Organized by functionality
    │       ├── shared/     # BottomNav, FloatingCartButton
    │       ├── stall-menu/ # MenuItemCard, MenuItemDetail
    │       ├── orders/     # OrderProgress, OrderTrackingDetail
    │       ├── cart/       # Cart components
    │       ├── admin/      # Admin panel components
    │       ├── stall-owner/ # Stall management components
    │       ├── auth/       # Authentication components
    │       ├── payment/    # Payment components
    │       ├── profile/    # Profile components
    │       └── home/       # Home page components
    └── package.json        # Node.js dependencies
```

## 🗄️ Database Schema (7 Tables)

### Core Tables:
1. **users** - Multi-role user accounts with JWT authentication
2. **stalls** - Food stall information with operational data
3. **menu_items** - Menu items with nutrition and preparation data
4. **orders** - Orders with estimated completion times
5. **order_items** - Individual items within orders
6. **food_trackers** - Individual food item tracking system
7. **notifications** - Real-time notification system

### Advanced Features:
- **JWT Authentication** with bcrypt password hashing
- **Role-based Access Control** (user, stall_owner, admin)
- **Individual Food Tracking** with separate status per item
- **Dynamic Preparation Times** based on queue and complexity
- **Background Tasks** for real-time status updates
- **Comprehensive Relationships** with proper foreign keys
- **Order Status Consistency** with automatic updates

## 🔐 Authentication System

### User Roles:
- **👤 User**: Browse stalls, place orders, track food items
- **🏪 Stall Owner**: Manage their stall's orders and food preparation
- **👑 Admin**: Full system access and comprehensive management

### Authentication Features:
- **JWT Token-based** authentication with secure headers
- **Secure Password Hashing** with bcrypt
- **Protected Routes** with role verification
- **Token Management** in API service with automatic refresh
- **Session Persistence** with localStorage

### Demo Accounts:
```
Admin: admin@ppumcafe.com / admin123
User: johndoe@email.com / password123
Stall Owners: [cuisine].owner@ppumcafe.com / stall123
```

## 🍽️ Individual Food Tracking System

### Advanced Order Tracking:
- **Individual Item Status** for each food item in an order
- **Dynamic Preparation Times** based on complexity and current queue
- **Real-time Background Updates** every 30 seconds
- **Smart Notifications** triggered only when specific items are ready
- **Queue Position Tracking** for accurate timing estimates
- **Order Status Consistency** with automatic state management

### Food Tracker Statuses:
1. **Queued** - Item waiting to be prepared
2. **Preparing** - Currently being cooked
3. **Ready** - Ready for customer pickup
4. **Collected** - Customer has collected the item

### Order Status Progression:
- **"Accepted"** - Order placed, all items queued
- **"Preparing"** - Some items being prepared
- **"Partially Ready"** - Some items ready, others still preparing
- **"Ready for Pickup"** - All items ready for collection
- **"Completed"** - All items collected by customer

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ppum-cafe-webapp
```

2. **Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python cli/quick_reinit.py  # Quick database setup with demo data
python start_server.py  # Start the API server
```

3. **Frontend Setup (new terminal):**
```bash
cd frontend
npm install
npm start
```

4. **Access the application:**
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`
- **Admin Panel**: `http://localhost:3000/admin`
- **Stall Management**: `http://localhost:3000/stall-management`

## 🛠️ CLI Tools & Database Management

The project includes a comprehensive set of command-line tools for database management and API testing, organized in the `backend/cli/` directory.

### 📁 Available CLI Tools:

#### 1. **Interactive Database Reset** (`reinit_database.py`)
Complete database reinitialization with safety features:
```bash
cd backend
python cli/reinit_database.py
```
- ✅ Interactive prompts for safety confirmation
- ✅ Automatic backup creation with timestamps  
- ✅ Two reset methods: clear data OR recreate tables
- ✅ Comprehensive error handling with rollback
- 🎯 **Best for**: Production-like environments, team setups

#### 2. **Quick Database Reset** (`quick_reinit.py`)
Fast database reset for development workflows:
```bash
cd backend
python cli/quick_reinit.py
```
- ⚡ No user prompts - runs immediately
- ⚡ Automatic backup if database exists
- ⚡ Uses fastest reset method (clear data)
- 🎯 **Best for**: Development, CI/CD pipelines, rapid prototyping

#### 3. **Selective Reset Utilities** (`reset_utils.py`)
Surgical database operations for specific tables:
```bash
cd backend
python cli/reset_utils.py
```
- 🎯 Reset individual table groups (orders, users, menu items)
- 📊 View database statistics
- 🌱 Reseed specific data only
- 📋 Interactive menu system
- 🎯 **Best for**: Development debugging, testing specific features

#### 4. **API Testing Suite** (`test_api.py`)
Comprehensive testing of all API endpoints:
```bash
cd backend
python cli/test_api.py  # Ensure backend server is running first
```
- 🧪 Tests all 40+ API endpoints
- 🔐 JWT authentication flow testing
- 👥 Role-based access control verification
- 📋 Order creation and tracking tests
- 🎯 **Best for**: API development verification, regression testing

#### 5. **Database Seeding** (`seed_data.py`)
Standalone database seeding with demo data:
```bash
cd backend
python cli/seed_data.py
```
- 🌱 Creates demo accounts and sample data
- 🏪 Populates 4 stalls with 10+ menu items
- ⚡ Fast seeding without full database reset
- 🎯 **Best for**: Fresh setup, demo environment creation

### 🔄 CLI Tool Comparison:

| Tool | Purpose | User Interaction | Backup | Speed | Best For |
|------|---------|------------------|--------|-------|----------|
| `reinit_database.py` | Full reset with safety | Interactive prompts | Yes | Moderate | Production, Teams |
| `quick_reinit.py` | Fast development reset | None | Auto | Fast | Development, CI/CD |
| `reset_utils.py` | Selective operations | Menu-driven | Optional | Variable | Debugging, Testing |
| `test_api.py` | API verification | None | N/A | Fast | API Development |
| `seed_data.py` | Initial data seeding | None | N/A | Fast | Fresh Setup, Demo Data |

### 📊 Database Operations Supported:

**Full Reset** (reinit_database.py, quick_reinit.py):
- ✅ All 7 tables: users, stalls, menu_items, orders, order_items, food_trackers, notifications
- ✅ Complete reseeding with demo data
- ✅ Demo accounts recreation

**Selective Reset** (reset_utils.py):
- 🎯 **Reset Orders Only**: Clear orders, order_items, food_trackers, notifications
- 🎯 **Reset Menu Items Only**: Clear menu_items (preserves users and stalls)  
- 🎯 **Reset Users Only**: Clear users and dependent data (preserves stalls/menu)
- 🎯 **Reseed Users Only**: Add fresh demo accounts to existing database
- 📊 **View Statistics**: Show record counts for all tables

### 🎉 Demo Accounts (Created by all reset tools):
```
👑 Admin: admin@ppumcafe.com / admin123
👤 User: johndoe@email.com / password123
🏪 Stall Owners: [cuisine].owner@ppumcafe.com / stall123
```

### 💡 Development Workflow Examples:

**Daily Development**:
```bash
python cli/quick_reinit.py  # Quick reset
python cli/test_api.py      # Verify APIs work
```

**Fresh Database Setup**:
```bash
python cli/seed_data.py     # Just add demo data (if empty DB)
# OR
python cli/quick_reinit.py  # Full reset + seed data
```

**Feature Testing**:
```bash
python cli/reset_utils.py   # Reset specific tables
# Choose option 2: Reset orders only
```

**Production Setup**:
```bash
python cli/reinit_database.py  # Interactive with backup
```

**Debugging**:
```bash
python cli/reset_utils.py   # View statistics first
# Choose option 1: View database statistics
```

> 📖 **Detailed Documentation**: See `backend/cli/README.md` for comprehensive usage guides, troubleshooting, and advanced features.

## 📡 API Endpoints (40+ Total)

### Authentication Endpoints:
```
POST /api/auth/register     # User registration with validation
POST /api/auth/login        # User login with JWT token
GET  /api/auth/me          # Get current authenticated user
```

### User Management:
```
POST /api/users/           # Create new user
GET  /api/users/{id}       # Get user profile
PUT  /api/users/{id}/language  # Update language preference
```

### Stall Management:
```
GET  /api/stalls/          # Get all active stalls
GET  /api/stalls/{id}      # Get specific stall details
POST /api/stalls/          # Create new stall (admin only)
PUT  /api/stalls/{id}      # Update stall (admin only)
DELETE /api/stalls/{id}    # Delete stall (admin only)
GET  /api/stalls/{id}/categories  # Get menu categories for stall
```

### Menu Item Management:
```
GET  /api/menu-items/      # Get menu items with filtering
GET  /api/menu-items/{id}  # Get specific menu item
POST /api/menu-items/      # Create menu item (admin only)
PUT  /api/menu-items/{id}  # Update menu item (admin only)
DELETE /api/menu-items/{id} # Delete menu item (admin only)
```

### Order System:
```
POST /api/orders/          # Create order with tracking
GET  /api/orders/user/{id} # Get user's orders
GET  /api/orders/{id}      # Get specific order
GET  /api/orders/{id}/tracking  # Get detailed tracking info
PUT  /api/orders/food-trackers/{id}/status  # Update food status
```

### Admin Endpoints (15+ endpoints):
```
GET  /api/admin/stats      # Dashboard statistics
GET  /api/admin/users      # All users management
POST /api/admin/users      # Create admin/stall owner accounts
GET  /api/admin/users/by-role/{role}  # Users by role
PUT  /api/admin/users/change-role     # Change user roles
DELETE /api/admin/users/{id}          # Delete users
GET  /api/admin/stalls     # Stall management
GET  /api/admin/menu-items # Menu item management
GET  /api/admin/orders     # Order management
DELETE /api/admin/orders/{id}  # Delete orders
```

### Stall Owner Endpoints (8+ endpoints):
```
GET  /api/stall-owner/orders        # View stall's orders
GET  /api/stall-owner/food-trackers # View food trackers
PUT  /api/stall-owner/food-trackers/{id}/status  # Update food status
GET  /api/stall-owner/stall         # Get stall information
GET  /api/stall-owner/menu-items    # Manage menu items
POST /api/stall-owner/menu-items    # Create menu items
PUT  /api/stall-owner/menu-items/{id}   # Update menu items
DELETE /api/stall-owner/menu-items/{id} # Delete menu items
```

### Notification & Search:
```
GET  /api/notifications/user/{id}   # Get user notifications
PUT  /api/notifications/{id}/read   # Mark notification as read
GET  /api/search/menu-items        # Search menu items
GET  /api/search/stalls            # Search stalls
```

## 🎨 Frontend Features

### Technology Stack:
- **React 19.1.0** with modern hooks and context
- **React Router 7.6.0** for navigation
- **Tailwind CSS 3.4.0** for styling
- **Custom API Service** with JWT token management

### Key Pages:
- **Home** - Stall listing with search functionality
- **StallMenu** - Individual stall menus with category filtering
- **Cart** - Shopping cart with multi-stall support
- **Payment** - Payment processing with order creation
- **Orders** - Real-time order tracking with individual food status
- **Profile** - User profile management
- **Admin** - Comprehensive admin panel
- **StallManagement** - Stall owner interface

### Enhanced UX Features:
- **Floating Cart Button** with smooth animations
- **Add-to-Cart Animations** with visual feedback
- **Real-time Updates** with background polling
- **Protected Routes** with authentication guards
- **Responsive Design** optimized for mobile
- **Error Handling** with graceful degradation

## 🔧 Admin Panel Features

### Comprehensive Management System:
- **📊 Dashboard**: Real-time statistics and system overview
- **🏪 Stall Management**: Complete CRUD operations for stalls
- **🍽️ Menu Management**: Full menu item control with nutrition data
- **📋 Order Management**: View and manage all system orders
- **👥 User Management**: Multi-role user account management

### Admin Capabilities:
- **Create Admin/Stall Owner Accounts** with role assignment
- **Manage Stall Information** including cuisine types and ratings
- **Control Menu Items** with pricing, categories, and availability
- **Monitor Order Activity** with detailed customer information
- **Change User Roles** and manage permissions
- **System Statistics** with real-time data

## 🏪 Stall Management System

### Stall Owner Interface:
- **📋 Order Management**: View orders containing their stall's items
- **🍽️ Food Tracking**: Manage individual food item preparation
- **⏱️ Status Updates**: Mark items through preparation stages
- **📊 Real-time Dashboard**: Live view of all food items in preparation
- **🍽️ Menu Management**: Create, edit, and manage their menu items

### Status Update Flow:
1. **Queued** → **Preparing** (Start cooking)
2. **Preparing** → **Ready** (Food ready for pickup)
3. **Ready** → **Collected** (Customer collected)

## 🔄 Real-Time Background Tasks

### Automated Processes:
- **Food Status Updates** every 30 seconds
- **Queue Position Management** with dynamic timing
- **Notification Generation** for ready items
- **Order Status Calculation** based on individual items
- **Preparation Time Simulation** with realistic delays

### Smart Timing System:
- **Base Preparation Time** per menu item
- **Complexity Multipliers** for different food types
- **Queue Position Delays** (2 minutes per position)
- **Dynamic Ready Times** based on current load

## 🔔 Notification System

### Notification Types:
- **Order Confirmation** when order is placed
- **Food Ready** when individual items are ready
- **Item Collected** when items are marked as collected
- **Order Complete** when all items are ready

### Features:
- **Individual Item Notifications** (not just order-level)
- **Rich Notifications** with food names and order details
- **Read/Unread Status** tracking
- **Real-time Updates** without page refresh

## 🧪 Testing

### API Testing:
```bash
cd backend
python cli/test_api.py
```

### Test Coverage:
- ✅ Authentication flow (register/login)
- ✅ Protected endpoint access
- ✅ Role-based authorization
- ✅ Order creation with tracking
- ✅ Food tracker updates
- ✅ Admin operations
- ✅ Stall owner operations

### Database Testing & Management:
```bash
# Quick database reset for testing
python cli/quick_reinit.py

# Test specific features with selective reset
python cli/reset_utils.py

# Full test workflow
python cli/quick_reinit.py && python cli/test_api.py
```

## 🛠️ Technical Implementation

### Backend (FastAPI):
- **JWT Authentication** with secure token handling
- **SQLAlchemy ORM** with relationship management
- **Pydantic Validation** for request/response schemas
- **Background Tasks** with asyncio
- **Role-based Middleware** for endpoint protection
- **CORS Configuration** for frontend integration

### Frontend (React):
- **Context API** for global state management
- **Protected Routes** with authentication guards
- **API Service** with token management
- **Component Organization** by functionality
- **Responsive Design** with Tailwind CSS
- **Error Boundaries** for graceful error handling

### Database Design:
- **Normalized Schema** with proper relationships
- **Indexing** on frequently queried fields
- **Cascade Operations** for data integrity
- **Timestamp Tracking** for audit trails

## 🚀 Production Readiness

### Security Features:
- **JWT Authentication** with secure tokens
- **Password Hashing** with bcrypt
- **Role-based Authorization** at API level
- **Input Validation** with Pydantic schemas
- **SQL Injection Protection** with SQLAlchemy ORM

### Performance Optimizations:
- **Database Indexing** on key fields
- **Efficient Queries** with relationship loading
- **Background Tasks** for non-blocking operations
- **Optimized Frontend** with proper state management
- **Component Memoization** to prevent unnecessary re-renders

### Scalability Considerations:
- **Modular Architecture** with clear separation of concerns
- **Stateless API Design** for horizontal scaling
- **Database Relationships** properly normalized
- **Component Architecture** for maintainability
- **Environment Configuration** ready for deployment

## 📱 Mobile-First Design

### UX Improvements:
- **Touch-friendly Interface** optimized for mobile devices
- **Smooth Animations** for cart interactions
- **Fast Navigation** with React Router
- **Progressive Loading** for better performance
- **Offline-ready Cart** management with localStorage

## 🎯 Key Achievements

### Core Features (100% Complete):
- ✅ **Full Authentication System** with JWT and multi-role support
- ✅ **Individual Food Tracking** with real-time status updates
- ✅ **Comprehensive Admin Panel** with complete CRUD operations
- ✅ **Stall Owner Management** interface for operational control
- ✅ **Enhanced Cart Experience** with animations and persistence
- ✅ **Real-time Order Tracking** with individual item status
- ✅ **Smart Notification System** for food readiness alerts
- ✅ **Background Task System** for automated updates
- ✅ **Mobile-first Responsive Design** throughout the application
- ✅ **Production-ready Architecture** with security best practices

### Technical Achievements:
- 🔐 **Secure Authentication** following industry standards
- 🍽️ **Individual Food Tracking** unprecedented in café systems
- 👥 **Multi-Role Architecture** for scalable management
- ⚡ **Real-time Updates** with background task simulation
- 📱 **Enhanced UX** with smooth animations and interactions
- 🛡️ **Production Security** with proper authorization
- 🎯 **Complete API Coverage** with 40+ endpoints
- 📊 **Advanced Admin Tools** for comprehensive management
- 🔄 **Order Status Consistency** with automatic state management
- 🏪 **Dedicated Stall Management** for operational efficiency

---

## 🎉 Conclusion

This implementation represents a **production-ready, enterprise-level** café ordering system that demonstrates advanced full-stack development skills:

- **🔐 Advanced Authentication** with JWT and multi-role support
- **🍽️ Individual Food Tracking** with real-time status updates
- **👥 Multi-Role Management** for scalable operations
- **⚡ Real-time Background Tasks** for dynamic updates
- **📱 Enhanced Mobile Experience** with smooth animations
- **🛡️ Production Security** with proper authorization
- **🎯 Comprehensive Testing** with full API coverage
- **📊 Advanced Analytics** with admin dashboard
- **🔄 Order Status Consistency** with automatic state management
- **🏪 Dedicated Stall Management** for operational efficiency

The system is **ready for real-world deployment** in a hospital café environment and showcases modern web development best practices! 🚀 