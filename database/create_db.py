"""
Task Manager Database Creation Script
===================================

This script initializes the SQLite database and creates all necessary tables
for the Task Manager application. It should be run once during initial setup
or when setting up a new development environment.

Features:
- Creates SQLite database file if it doesn't exist
- Initializes all database tables based on SQLAlchemy models
- Provides feedback on creation success/failure
- Lists created tables for verification

Usage:
    python database/create_db.py
"""

from app import app, db, Task
import sys

def create_database():
    """
    Create the database and all required tables.
    
    This function:
    1. Establishes the Flask application context
    2. Creates all tables defined in the SQLAlchemy models
    3. Verifies table creation was successful
    4. Provides user feedback
    
    Raises:
        SystemExit: If database creation fails
    """
    try:
        # Create Flask application context for database operations
        with app.app_context():
            # Create all database tables based on model definitions
            db.create_all()
            print("✅ Database and tables created successfully!")
            
            # Verify tables were created and display them
            tables = db.engine.table_names()
            print(f"📋 Created tables: {', '.join(tables)}")
            
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        print("💡 Make sure the app.py file is accessible and contains valid models")
        sys.exit(1)

if __name__ == '__main__':
    """
    Main execution block - runs when script is called directly.
    """
    print("🚀 Initializing Task Manager database...")
    create_database()
    print("🎉 Database setup complete!")
