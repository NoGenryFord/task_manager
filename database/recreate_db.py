"""
Database Recreation Script (Legacy)
This script is kept for backward compatibility.
For new development, use reset_db.py instead.
"""

from app import app, db, Task
import os

def recreate_database():
    """Legacy function to recreate database"""
    print("⚠️  This script is deprecated. Please use 'reset_db.py' instead.")
    print("🔄 Recreating database...")
    
    # Remove the existing database file if it exists
    db_path = 'tasks.db'
    if os.path.exists(db_path):
        os.remove(db_path)
        print("🗑️  Removed existing database file")

    # Create new database with updated schema
    with app.app_context():
        # Drop all tables first
        db.drop_all()
        print("🗑️  Dropped all existing tables")
        
        # Create all tables with new schema
        db.create_all()
        print("📋 Created new database with updated schema")
        
        # Add some test data to verify it works
        test_task = Task(
            title='Test Task',
            description='This is a test task',
            due_date='2025-07-07',
            is_done=False
        )
        db.session.add(test_task)
        db.session.commit()
        print("✅ Added test task to verify database works")

if __name__ == '__main__':
    recreate_database()
