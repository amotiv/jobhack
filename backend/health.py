#!/usr/bin/env python3
"""
Simple health check for Railway deployment
"""
import os
import sys
from pathlib import Path

def simple_health_check():
    """Simple health check that doesn't require Django"""
    try:
        # Check if we can import Django
        import django
        return True
    except ImportError:
        return False

if __name__ == "__main__":
    if simple_health_check():
        print("Health check passed")
        sys.exit(0)
    else:
        print("Health check failed")
        sys.exit(1)
