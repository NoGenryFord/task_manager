"""
Task Manager Database Reset Script
=================================

This script completely resets the database by dropping all existing tables,
recreating them from scratch, and populating them with sample data for testing
and demonstration purposes.

⚠️  WARNING: This script will permanently delete all existing data!

Features:
- Drops all existing database tables
- Recreates tables based on current models
- Populates database with sample tasks for testing
- Provides comprehensive feedback during the process

Usage:
    python database/reset_db.py

Use Cases:
- Development environment setup
- Testing with fresh data
- Demonstration preparation
- Recovering from database corruption
"""

from app import app, db, Task
import os
import sys

def reset_database():
    """
    Completely reset the database with fresh sample data.
    
    This function performs the following operations:
    1. Drops all existing tables (⚠️  ALL DATA WILL BE LOST!)
    2. Recreates tables based on current SQLAlchemy models
    3. Populates the database with sample tasks for testing
    4. Provides detailed feedback throughout the process
    
    Warning:
        This operation is irreversible and will delete all existing data.
    """
    try:
        # Create Flask application context for database operations
        with app.app_context():
            print("🔄 Resetting database...")
            print("⚠️  WARNING: This will delete all existing data!")
            
            # Drop all existing tables and their data
            db.drop_all()
            print("🗑️  Dropped all existing tables")
            
            # Create fresh tables based on current models
            db.create_all()
            print("📋 Created new tables")
            
            # Populate database with sample data for testing and demonstration
            print("📝 Adding sample tasks...")
            sample_tasks = [
                Task(
                    title='Welcome Task',
                    description='This is a sample task to get you started!',
                    due_date='2025-07-10',
                    is_done=False
                ),
                Task(
                    title='Completed Example',
                    description='This task shows how completed tasks look',
                    due_date='2025-07-05',
                    is_done=True
                ),
                Task(
                    title='Overdue Example',
                    description='This task demonstrates overdue status',
                    due_date='2025-07-01',
                    is_done=False
                ),
                Task(
                    title='Alpha Task',
                    description='First in alphabetical order',
                    due_date='2025-07-15',
                    is_done=False
                ),
                Task(
                    title='Zebra Task',
                    description='Last in alphabetical order',
                    due_date='2025-07-08',
                    is_done=True
                ),
                Task(
                    title='Beta Project',
                    description='Second in alphabetical order',
                    due_date='2025-07-20',
                    is_done=False
                ),
                Task(
                    title='Urgent Meeting',
                    description='Very important meeting today',
                    due_date='2025-07-07',
                    is_done=False
                ),
                Task(
                    title='Done Shopping',
                    description='Already bought groceries',
                    due_date='2025-07-06',
                    is_done=True
                )
            ]
            
            for task in sample_tasks:
                db.session.add(task)
            
            db.session.commit()
            print("✅ Database reset successfully!")
            print(f"📊 Added {len(sample_tasks)} sample tasks")
            
    except Exception as e:
        print(f"❌ Error resetting database: {e}")
        sys.exit(1)

if __name__ == '__main__':
    # Ask for confirmation
    response = input("⚠️  This will delete all existing data! Continue? (y/N): ")
    
    if response.lower() in ['y', 'yes']:
        reset_database()
    else:
        print("❌ Operation cancelled.")
