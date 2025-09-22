#!/usr/bin/env python3
"""
Simple health check script for Railway deployment
"""
import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

try:
    django.setup()
    from django.test import Client
    from django.urls import reverse
    
    client = Client()
    response = client.get('/api/health/')
    
    if response.status_code == 200:
        print("Health check passed!")
        sys.exit(0)
    else:
        print(f"Health check failed with status: {response.status_code}")
        sys.exit(1)
        
except Exception as e:
    print(f"Health check error: {e}")
    sys.exit(1)

