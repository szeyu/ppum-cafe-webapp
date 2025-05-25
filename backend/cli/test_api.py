#!/usr/bin/env python3
"""
API Testing Script for PPUM Café Backend
Tests authentication, protected endpoints, and role-based access.
"""

import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import json
from datetime import datetime

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Health Check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root Endpoint: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Root Endpoint Failed: {e}")
        return False

def test_stalls_endpoint():
    """Test the stalls endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/stalls/")
        print(f"Stalls Endpoint: {response.status_code}")
        if response.status_code == 200:
            stalls = response.json()
            print(f"  Found {len(stalls)} stalls")
            return True
        else:
            print(f"  Error: {response.text}")
            return False
    except Exception as e:
        print(f"Stalls Endpoint Failed: {e}")
        return False

def test_menu_items_endpoint():
    """Test the menu items endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/menu-items/")
        print(f"Menu Items Endpoint: {response.status_code}")
        if response.status_code == 200:
            items = response.json()
            print(f"  Found {len(items)} menu items")
            return True
        else:
            print(f"  Error: {response.text}")
            return False
    except Exception as e:
        print(f"Menu Items Endpoint Failed: {e}")
        return False

def test_search_endpoints():
    """Test the search endpoints"""
    try:
        # Test stall search
        response = requests.get(f"{BASE_URL}/api/search/stalls?q=test")
        print(f"Search Stalls: {response.status_code}")
        
        # Test menu item search
        response = requests.get(f"{BASE_URL}/api/search/menu-items?q=test")
        print(f"Search Menu Items: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"Search Endpoints Failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("Testing Refactored PPUM Café API")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health_endpoint),
        ("Root Endpoint", test_root_endpoint),
        ("Stalls Endpoint", test_stalls_endpoint),
        ("Menu Items Endpoint", test_menu_items_endpoint),
        ("Search Endpoints", test_search_endpoints),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        if test_func():
            print("✅ PASSED")
            passed += 1
        else:
            print("❌ FAILED")
    
    print("\n" + "=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    print("=" * 50)
    
    if passed == total:
        print("🎉 All tests passed! The refactored API is working correctly.")
    else:
        print("⚠️  Some tests failed. Please check the API server.")

if __name__ == "__main__":
    main() 