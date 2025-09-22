#!/usr/bin/env python3
"""
Debug script to check Railway environment variables and database connection.
Run this in Railway's shell to diagnose deployment issues.
"""

import os
import sys

def debug_railway_env():
    """Debug Railway environment variables and database connection."""
    
    print("=== Railway Environment Debug ===")
    print(f"Python version: {sys.version}")
    print(f"Current working directory: {os.getcwd()}")
    
    # Check critical environment variables
    critical_vars = [
        'DATABASE_URL',
        'SECRET_KEY', 
        'DEBUG',
        'ALLOWED_HOSTS',
        'PORT',
        'RAILWAY_ENVIRONMENT'
    ]
    
    print("\n=== Environment Variables ===")
    for var in critical_vars:
        value = os.getenv(var)
        if var == 'DATABASE_URL' and value:
            # Mask password in DATABASE_URL for security
            masked_value = value.split('@')[0].split(':')[0] + ':***@' + '@'.join(value.split('@')[1:]) if '@' in value else value
            print(f"{var}: {masked_value}")
        else:
            print(f"{var}: {value}")
    
    # Test database connection
    print("\n=== Database Connection Test ===")
    try:
        import dj_database_url
        database_url = os.getenv('DATABASE_URL')
        
        if not database_url:
            print("❌ DATABASE_URL is not set!")
            return False
            
        print(f"✅ DATABASE_URL found: {database_url.split('@')[0].split(':')[0]}:***@{database_url.split('@')[1] if '@' in database_url else 'N/A'}")
        
        # Parse database config
        db_config = dj_database_url.parse(database_url, conn_max_age=600, ssl_require=True)
        print(f"✅ Database config parsed successfully")
        print(f"   Engine: {db_config['ENGINE']}")
        print(f"   Host: {db_config['HOST']}")
        print(f"   Port: {db_config['PORT']}")
        print(f"   Database: {db_config['NAME']}")
        print(f"   User: {db_config['USER']}")
        
        # Test actual connection
        try:
            import psycopg2
            conn = psycopg2.connect(
                host=db_config['HOST'],
                port=db_config['PORT'],
                database=db_config['NAME'],
                user=db_config['USER'],
                password=db_config['PASSWORD']
            )
            conn.close()
            print("✅ Database connection successful!")
            return True
            
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            return False
            
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_django_settings():
    """Test Django settings loading."""
    print("\n=== Django Settings Test ===")
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings_railway')
        
        import django
        django.setup()
        
        from django.conf import settings
        from django.db import connection
        
        print("✅ Django settings loaded successfully")
        print(f"   Settings module: {settings.SETTINGS_MODULE}")
        print(f"   Database engine: {settings.DATABASES['default']['ENGINE']}")
        print(f"   Database host: {settings.DATABASES['default']['HOST']}")
        
        # Test database connection through Django
        connection.ensure_connection()
        print("✅ Django database connection successful!")
        
        return True
        
    except Exception as e:
        print(f"❌ Django settings error: {e}")
        return False

if __name__ == "__main__":
    print("Starting Railway deployment debug...")
    
    env_ok = debug_railway_env()
    django_ok = test_django_settings()
    
    print("\n=== Summary ===")
    if env_ok and django_ok:
        print("✅ All checks passed! Railway deployment should work.")
        sys.exit(0)
    else:
        print("❌ Issues found. Check the errors above.")
        sys.exit(1)
