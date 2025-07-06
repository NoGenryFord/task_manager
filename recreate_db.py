# File: recreate_db.py
from app import app, db, Task
import os

# Remove the existing database file
if os.path.exists('tasks.db'):
    os.remove('tasks.db')
    print("Removed existing database file")

# Create new database with updated schema
with app.app_context():
    # Drop all tables first
    db.drop_all()
    print("Dropped all existing tables")
    
    # Create all tables with new schema
    db.create_all()
    print("Created new database with updated schema")
    
    # Add some test data to verify it works
    test_task = Task(
        title='Test Task',
        description='This is a test task',
        due_date='2025-07-07',
        is_done=False
    )
    db.session.add(test_task)
    db.session.commit()
    print("Added test task to verify database works")
