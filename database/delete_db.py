"""
Database Deletion Script
This script deletes the database file for the Task Manager application.
"""

import os
import sys

def delete_database():
    """Delete the database file"""
    db_path = 'tasks.db'
    
    try:
        if os.path.exists(db_path):
            # Ask for confirmation
            response = input(f"⚠️  Are you sure you want to delete '{db_path}'? This cannot be undone! (y/N): ")
            
            if response.lower() in ['y', 'yes']:
                os.remove(db_path)
                print(f"✅ Database '{db_path}' deleted successfully!")
            else:
                print("❌ Operation cancelled.")
        else:
            print(f"ℹ️  Database file '{db_path}' does not exist.")
            
    except Exception as e:
        print(f"❌ Error deleting database: {e}")
        sys.exit(1)

if __name__ == '__main__':
    delete_database()
