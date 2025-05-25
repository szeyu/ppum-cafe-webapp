# PPUM Café Backend API

## Quick Start

### Prerequisites
- Python 3.8+
- Virtual environment activated
- Dependencies installed (`pip install -r requirements.txt`)

### Running the Backend

#### Method 1: Using uvicorn directly (Recommended)
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Method 2: Using the startup script
```bash
python start_server.py
```

#### Method 3: Using Python module
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Server Information
- **URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

### Development Features
- **Auto-reload**: Server automatically restarts when code changes
- **CORS**: Configured for frontend at http://localhost:3000
- **Background Tasks**: Food tracker updates run automatically

### Testing the API
Run the test script to verify all endpoints:
```bash
python test_api.py
```

### API Structure
The API is organized into modular routers:
- `/api/auth/*` - Authentication endpoints
- `/api/stalls/*` - Stall management
- `/api/menu-items/*` - Menu item operations
- `/api/orders/*` - Order processing
- `/api/admin/*` - Admin operations
- `/api/stall-owner/*` - Stall owner interface
- `/api/search/*` - Search functionality
- `/api/notifications/*` - Notification system
- `/api/users/*` - User management

### Stopping the Server
Press `Ctrl+C` in the terminal where the server is running. 