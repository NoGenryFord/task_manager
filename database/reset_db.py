"""
Database Reset Script
This script resets the database by dropping all tables and recreating them with sample data.
"""

from app import app, db, Task
import os
import sys

def reset_database():
    """Reset database: drop all tables, recreate them, and add sample data"""
    try:
        with app.app_context():
            print("🔄 Resetting database...")
            
            # Drop all tables
            db.drop_all()
            print("🗑️  Dropped all existing tables")
            
            # Create all tables
            db.create_all()
            print("📋 Created new tables")
            
            # Add sample data
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
