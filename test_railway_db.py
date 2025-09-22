#!/usr/bin/env python3
"""
Railway Database Connection Test Script
Run this in Railway shell to verify DATABASE_URL is working correctly.
"""

import os
import sys

def test_railway_database():
    """Test Railway database connection and configuration."""
    
    print("=== Railway Database Connection Test ===")
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings_railway')
    
    try:
        import dj_database_url
        
        # Check DATABASE_URL
        url = os.getenv("DATABASE_URL")
        print(f"DATABASE_URL set: {bool(url)}")
        
        if not url:
            print("❌ DATABASE_URL is not set!")
            print("   → Add/link PostgreSQL service in Railway dashboard")
            print("   → Ensure Django service inherits DATABASE_URL")
            return False
            
        # Parse and display config
        cfg = dj_database_url.parse(url, conn_max_age=0, ssl_require=True)
        print(f"✅ Parsed host: {cfg.get('HOST')}")
        print(f"✅ Parsed name: {cfg.get('NAME')}")
        print(f"✅ Parsed user: {cfg.get('USER')}")
        print(f"✅ Parsed port: {cfg.get('PORT')}")
        
        # Test actual connection
        try:
            import psycopg
            conn = psycopg.connect(
                host=cfg['HOST'],
                port=cfg['PORT'],
                database=cfg['NAME'],
                user=cfg['USER'],
                password=cfg['PASSWORD']
            )
            conn.close()
            print("✅ Database connection successful!")
            return True
            
        except ImportError:
            # Fallback to psycopg2
            try:
                import psycopg2
                conn = psycopg2.connect(
                    host=cfg['HOST'],
                    port=cfg['PORT'],
                    database=cfg['NAME'],
                    user=cfg['USER'],
                    password=cfg['PASSWORD']
                )
                conn.close()
                print("✅ Database connection successful!")
                return True
            except Exception as e:
                print(f"❌ Database connection failed: {e}")
                return False
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            return False
            
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_django_migration():
    """Test Django migration with Railway settings."""
    print("\n=== Django Migration Test ===")
    
    try:
        import django
        django.setup()
        
        from django.core.management import execute_from_command_line
        
        print("Running Django migrations...")
        execute_from_command_line(['manage.py', 'migrate', '--verbosity=2'])
        print("✅ Django migrations completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Django migration failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Railway database configuration...")
    
    db_ok = test_railway_database()
    migration_ok = test_django_migration() if db_ok else False
    
    print("\n=== Summary ===")
    if db_ok and migration_ok:
        print("✅ All tests passed! Railway database is working correctly.")
        sys.exit(0)
    else:
        print("❌ Tests failed. Check the errors above.")
        sys.exit(1)
