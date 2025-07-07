"""
Task Manager Database Deletion Script
====================================

This script safely deletes the SQLite database file for the Task Manager application.
It includes confirmation prompts to prevent accidental data loss.

⚠️  WARNING: This operation is irreversible and will permanently delete all data!

Features:
- Interactive confirmation before deletion
- Safe file existence checking
- Clear feedback on operation status
- Graceful error handling

Usage:
    python database/delete_db.py

Use Cases:
- Clean development environment reset
- Removing corrupted database files
- Starting fresh installation
- Cleanup after testing
"""

import os
import sys

def delete_database():
    """
    Safely delete the SQLite database file.
    
    This function:
    1. Checks if the database file exists
    2. Prompts user for confirmation (safety measure)
    3. Deletes the file if confirmed
    4. Provides appropriate feedback
    
    Warning:
        This operation permanently deletes all task data and cannot be undone.
    """
    db_path = 'tasks.db'
    
    try:
        if os.path.exists(db_path):
            # Interactive confirmation to prevent accidental deletion
            print(f"🗃️  Found database file: '{db_path}'")
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
