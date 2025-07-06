"""
Database Creation Script
This script creates the database and tables for the Task Manager application.
"""

from app import app, db, Task
import sys

def create_database():
    """Create database and all tables"""
    try:
        with app.app_context():
            # Create all tables
            db.create_all()
            print("✅ Database and tables created successfully!")
            
            # Check if tables exist
            tables = db.engine.table_names()
            print(f"📋 Created tables: {', '.join(tables)}")
            
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        sys.exit(1)

if __name__ == '__main__':
    create_database()
