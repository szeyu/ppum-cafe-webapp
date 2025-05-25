#!/bin/bash

# PPUM Café Web Application Startup Script
# Cross-platform compatible (Linux, macOS, Windows with Git Bash/WSL)
# Usage: ./start_app.sh [--reset]
# --reset: Reinitialize the database before starting

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect operating system
detect_os() {
    case "$(uname -s)" in
        Linux*)     OS=Linux;;
        Darwin*)    OS=Mac;;
        CYGWIN*)    OS=Windows;;
        MINGW*)     OS=Windows;;
        MSYS*)      OS=Windows;;
        *)          OS="Unknown";;
    esac
}

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get Python command
get_python_cmd() {
    if command_exists python3; then
        echo "python3"
    elif command_exists python; then
        # Check if it's Python 3
        if python --version 2>&1 | grep -q "Python 3"; then
            echo "python"
        else
            echo ""
        fi
    else
        echo ""
    fi
}

# Function to get virtual environment activation script
get_venv_activate() {
    if [ "$OS" = "Windows" ]; then
        echo "venv/Scripts/activate"
    else
        echo "venv/bin/activate"
    fi
}

# Function to get pip command
get_pip_cmd() {
    if command_exists pip3; then
        echo "pip3"
    elif command_exists pip; then
        echo "pip"
    else
        echo ""
    fi
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend... (OS: $OS)"
    
    # Navigate to backend directory
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found!"
        exit 1
    fi
    
    cd backend
    
    # Get Python command
    PYTHON_CMD=$(get_python_cmd)
    if [ -z "$PYTHON_CMD" ]; then
        print_error "Python 3 not found! Please install Python 3.7+"
        print_status "Download from: https://www.python.org/downloads/"
        exit 1
    fi
    print_status "Using Python command: $PYTHON_CMD"
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_status "Creating virtual environment..."
        $PYTHON_CMD -m venv venv
        print_success "Virtual environment created"
    else
        print_status "Virtual environment already exists"
    fi
    
    # Activate virtual environment
    VENV_ACTIVATE=$(get_venv_activate)
    print_status "Activating virtual environment..."
    
    if [ -f "$VENV_ACTIVATE" ]; then
        source "$VENV_ACTIVATE"
        print_success "Virtual environment activated"
    else
        print_error "Virtual environment activation script not found: $VENV_ACTIVATE"
        exit 1
    fi
    
    # Get pip command
    PIP_CMD=$(get_pip_cmd)
    if [ -z "$PIP_CMD" ]; then
        print_error "pip not found!"
        exit 1
    fi
    
    # Upgrade pip first
    print_status "Upgrading pip..."
    $PIP_CMD install --upgrade pip
    
    # Install requirements
    if [ -f "requirements.txt" ]; then
        print_status "Installing Python dependencies..."
        $PIP_CMD install -r requirements.txt
        print_success "Dependencies installed"
    else
        print_warning "requirements.txt not found, skipping dependency installation"
    fi
    
    # Handle database initialization
    local reset_db=false
    if [[ "$1" == "--reset" ]]; then
        reset_db=true
        print_status "Database reset requested"
    fi
    
    # Check if database exists (check multiple possible names)
    local db_exists=false
    for db_file in "ppum_cafe.db" "database.db" "app.db" "*.db"; do
        if [ -f "$db_file" ]; then
            db_exists=true
            break
        fi
    done
    
    # Reinitialize database if needed
    if [ "$reset_db" = true ] || [ "$db_exists" = false ]; then
        if [ "$reset_db" = true ]; then
            print_status "Resetting database..."
        else
            print_status "Database not found, initializing..."
        fi
        
        # Check if CLI tools exist
        if [ -d "cli" ]; then
            print_status "Using CLI tools for database initialization..."
            if [ -f "cli/reinit_database.py" ]; then
                $PYTHON_CMD cli/reinit_database.py --force
            elif [ -f "cli/quick_reinit.py" ]; then
                $PYTHON_CMD cli/quick_reinit.py
            elif [ -f "cli/seed_data.py" ]; then
                $PYTHON_CMD cli/seed_data.py
            else
                print_warning "CLI tools found but no reinit script available"
                # Fallback to old method
                if [ -f "reinit_database.py" ]; then
                    $PYTHON_CMD reinit_database.py
                elif [ -f "seed_data.py" ]; then
                    $PYTHON_CMD seed_data.py
                fi
            fi
        else
            # Fallback to root directory scripts
            if [ -f "reinit_database.py" ]; then
                print_status "Using reinit_database.py..."
                $PYTHON_CMD reinit_database.py
            elif [ -f "seed_data.py" ]; then
                print_status "Using seed_data.py..."
                $PYTHON_CMD seed_data.py
            else
                print_warning "No database initialization script found"
            fi
        fi
        print_success "Database initialized"
    else
        print_status "Using existing database"
    fi
    
    # Start backend server
    print_status "Starting backend server..."
    if [ -f "start_server.py" ]; then
        $PYTHON_CMD start_server.py &
        BACKEND_PID=$!
    elif [ -f "main.py" ]; then
        $PYTHON_CMD main.py &
        BACKEND_PID=$!
    elif [ -f "app.py" ]; then
        $PYTHON_CMD app.py &
        BACKEND_PID=$!
    else
        print_error "No backend startup script found!"
        print_status "Looking for: start_server.py, main.py, or app.py"
        exit 1
    fi
    
    print_success "Backend server started (PID: $BACKEND_PID)"
    
    # Wait a moment for backend to start
    print_status "Waiting for backend to initialize..."
    sleep 5
    
    # Check if backend is running (cross-platform process check)
    if [ "$OS" = "Windows" ]; then
        # On Windows, use tasklist to check if process exists
        if tasklist //FI "PID eq $BACKEND_PID" 2>/dev/null | grep -q "$BACKEND_PID"; then
            print_success "Backend is running on http://localhost:8000"
        else
            print_error "Backend failed to start!"
            exit 1
        fi
    else
        # On Unix-like systems, use kill -0
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_success "Backend is running on http://localhost:8000"
        else
            print_error "Backend failed to start!"
            exit 1
        fi
    fi
    
    # Return to root directory
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    # Navigate to frontend directory
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found!"
        exit 1
    fi
    
    cd frontend
    
    # Check if Node.js is installed
    if ! command_exists node; then
        print_error "Node.js not found! Please install Node.js 16+"
        case "$OS" in
            "Windows") print_status "Download from: https://nodejs.org/ or use: winget install OpenJS.NodeJS";;
            "Mac") print_status "Install with: brew install node or download from https://nodejs.org/";;
            "Linux") print_status "Install with: sudo apt install nodejs npm (Ubuntu/Debian) or equivalent";;
        esac
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm not found! Please install npm"
        exit 1
    fi
    
    # Display Node.js and npm versions
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    print_status "Node.js version: $NODE_VERSION"
    print_status "npm version: $NPM_VERSION"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
        print_success "Frontend dependencies installed"
    else
        print_status "Frontend dependencies already installed"
    fi
    
    # Start frontend server
    print_status "Starting frontend server..."
    
    # Use different approaches based on OS
    if [ "$OS" = "Windows" ]; then
        # On Windows, npm start might need special handling
        npm start &
        FRONTEND_PID=$!
    else
        npm start &
        FRONTEND_PID=$!
    fi
    
    print_success "Frontend server started (PID: $FRONTEND_PID)"
    
    # Return to root directory
    cd ..
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down servers..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        if [ "$OS" = "Windows" ]; then
            # On Windows, use taskkill
            taskkill //PID $BACKEND_PID //F 2>/dev/null || true
        else
            # On Unix-like systems, use kill
            kill $BACKEND_PID 2>/dev/null || true
        fi
        print_status "Backend server stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        if [ "$OS" = "Windows" ]; then
            # On Windows, use taskkill
            taskkill //PID $FRONTEND_PID //F 2>/dev/null || true
        else
            # On Unix-like systems, use kill
            kill $FRONTEND_PID 2>/dev/null || true
        fi
        print_status "Frontend server stopped"
    fi
    
    print_success "Application shutdown complete"
}

# Function to check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    local missing_deps=()
    
    # Check Python
    if [ -z "$(get_python_cmd)" ]; then
        missing_deps+=("Python 3.7+")
    fi
    
    # Check Node.js
    if ! command_exists node; then
        missing_deps+=("Node.js 16+")
    fi
    
    # Check npm
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and try again."
        return 1
    fi
    
    print_success "All system requirements met"
    return 0
}

# Main execution
main() {
    # Detect operating system first
    detect_os
    
    print_status "Starting PPUM Café Web Application on $OS..."
    
    # Check if we're in the right directory
    if [ ! -d "frontend" ] && [ ! -d "backend" ]; then
        print_error "Please run this script from the project root directory"
        print_status "Expected directory structure:"
        print_status "  - frontend/"
        print_status "  - backend/"
        exit 1
    fi
    
    # Check system requirements
    if ! check_requirements; then
        exit 1
    fi
    
    # Parse command line arguments
    local reset_flag=""
    if [[ "$1" == "--reset" ]]; then
        reset_flag="--reset"
        print_warning "Database will be reset!"
    fi
    
    # Setup trap for cleanup
    trap cleanup EXIT INT TERM
    
    # Setup backend
    setup_backend "$reset_flag"
    
    # Setup frontend
    setup_frontend
    
    print_success "Both servers are running!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend:  http://localhost:8000"
    print_status "API Docs: http://localhost:8000/docs"
    print_status ""
    print_status "Press Ctrl+C to stop both servers"
    
    # Wait for user interrupt
    wait
}

# Run main function with all arguments
main "$@" 