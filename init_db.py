from app import db, Task, app

# Create the database and tables
# This script initializes the database and adds sample data for testing purposes.
def initialize_database():
    with app.app_context():  # Create a Flask application context
        db.create_all()  # Create tables based on SQLAlchemy models
        print("Database initialized successfully!")

        # Adding sample data
        task1 = Task(title="Task 1", description="Milk, bread, Eggs", is_done=False)
        task2 = Task(title="Task 2", description="Complete the report", is_done=True)
        db.session.add(task1)
        db.session.add(task2)
        db.session.commit()
        print("Sample tasks added successfully!")

if __name__ == "__main__":
    initialize_database()