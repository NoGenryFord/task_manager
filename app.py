"""
Task Manager Flask Application
=============================

A modern web-based task management application built with Flask framework.
This application provides REST API endpoints for CRUD operations on tasks,
with input validation, XSS protection, and a responsive frontend.

Features:
- Create, read, update, and delete tasks
- Input validation and sanitization
- XSS and SQL injection protection
- RESTful API design
- SQLite database with SQLAlchemy ORM
- Responsive web interface
"""

# Import required modules
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import html  # For HTML escaping to prevent XSS
import re   # For regex validation

# Initialize Flask application
app = Flask(__name__)

# Database configuration
# Using SQLite for simplicity 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable modification tracking for performance
db = SQLAlchemy(app)

# Database Models
# ===============

class Task(db.Model):
    """
    Task model representing a single task in the database.
    
    Attributes:
        id (int): Primary key, auto-incrementing task ID
        title (str): Task title, required, max 100 characters
        description (str): Task description, required, max 200 characters  
        due_date (str): Due date in YYYY-MM-DD format, optional
        is_done (bool): Task completion status, defaults to False
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.String(10), nullable=True)  # Format: YYYY-MM-DD
    is_done = db.Column(db.Boolean, default=False)

# Security and Validation Functions
# =================================

def sanitize_input(text):
    """
    Sanitize text input to prevent XSS attacks.
    
    This function performs multiple layers of security:
    1. HTML escaping to convert dangerous characters
    2. Removal of potentially dangerous characters
    3. Whitespace trimming
    
    Args:
        text (str): Raw input text to sanitize
        
    Returns:
        str: Sanitized text safe for database storage and display
    """
    if not text:
        return ""
    
    # HTML escape to prevent XSS attacks
    text = html.escape(text.strip())
    
    # Remove potentially dangerous characters as additional protection
    text = re.sub(r'[<>"\']', '', text)
    
    return text

def validate_task_data(data):
    """
    Comprehensive validation of task data.
    
    Validates all task fields according to business rules:
    - Title: required, max 100 characters
    - Description: optional, max 500 characters
    - Due date: optional, must be in YYYY-MM-DD format
    
    Args:
        data (dict): Dictionary containing task data from request
        
    Returns:
        list: List of validation error messages (empty if valid)
    """
    errors = []
    
    # Validate title field
    title = data.get('title', '').strip()
    if not title:
        errors.append("Title is required")
    elif len(title) > 100:
        errors.append("Title must be 100 characters or less")
    
    # Validate description field
    description = data.get('description', '').strip()
    if len(description) > 500:
        errors.append("Description must be 500 characters or less")
    
    # Validate due_date format (support both frontend naming conventions)
    due_date = data.get('dueDate') or data.get('due_date')
    if due_date and not re.match(r'^\d{4}-\d{2}-\d{2}$', due_date):
        errors.append("Due date must be in YYYY-MM-DD format")
    
    return errors

# Web Routes (Frontend Pages)
# ===========================

@app.route('/')
def home_page():
    """
    Render the main task management page.
    
    Returns:
        str: Rendered HTML template for the main page
    """
    return render_template('index.html')

@app.route('/add_task')
def add_task_page():
    """
    Render the add task form page.
    
    Returns:
        str: Rendered HTML template for adding new tasks
    """
    return render_template('add_task.html')

@app.route('/edit_task/<int:task_id>')
def edit_task_page(task_id):
    """
    Render the edit task form page.
    
    Args:
        task_id (int): ID of the task to edit
        
    Returns:
        str: Rendered HTML template for editing tasks or 404 error
    """
    task = Task.query.get(task_id)
    if not task:
        return "Task not found", 404
    return render_template('edit_task.html', task=task)

@app.route('/favicon.ico')
def favicon():
    """
    Handle favicon requests to prevent 404 errors.
    
    Returns:
        tuple: Empty response with 204 No Content status
    """
    return '', 204  # Return empty response with 204 No Content

# Application Initialization
# =========================

@app.before_request
def create_tables():
    """
    Initialize database tables before handling any requests.
    This ensures the database is ready for use.
    """
    db.create_all()

# REST API Endpoints
# ==================

@app.route('/tasks', methods=['GET'])
def get_tasks():
    """
    Retrieve all tasks from the database.
    
    Returns:
        tuple: JSON response containing list of all tasks and HTTP status 200
    """
    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date,
        'is_done': task.is_done
    } for task in tasks]), 200

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """
    Retrieve a specific task by ID.
    
    Args:
        task_id (int): The ID of the task to retrieve
        
    Returns:
        tuple: JSON response with task data and HTTP status, or error if not found
    """
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date,
        'is_done': task.is_done
    }), 200


@app.route('/tasks', methods=['POST'])
def add_task():
    """
    Create a new task.
    
    Expects JSON payload with task data:
    - title (required): Task title
    - description (optional): Task description  
    - dueDate (optional): Due date in YYYY-MM-DD format
    - is_done (optional): Completion status, defaults to False
    
    Returns:
        tuple: JSON response with created task data and HTTP status 201,
               or error response with HTTP status 400/500
    """
    data = request.json
    
    # Validate input data using our validation function
    errors = validate_task_data(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400
    
    # Sanitize inputs to prevent XSS attacks
    title = sanitize_input(data.get('title'))
    description = sanitize_input(data.get('description', ''))
    due_date = data.get('dueDate')  # Date format already validated
    
    try:
        # Create new task instance
        new_task = Task(
            title=title,
            description=description,
            due_date=due_date,  
            is_done=data.get('is_done', False)
        )
        
        # Save to database
        db.session.add(new_task)
        db.session.commit()
        
        # Return created task data
        return jsonify({
            'id': new_task.id,
            'title': new_task.title,
            'description': new_task.description,
            'due_date': new_task.due_date,  
            'is_done': new_task.is_done
        }), 201
        
    except Exception as e:
        # Rollback transaction on error and return error response
        db.session.rollback()
        return jsonify({"error": "Failed to create task"}), 500

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """
    Update an existing task.
    
    Args:
        task_id (int): ID of the task to update
        
    Expects JSON payload with task data (all fields optional):
    - title: New task title
    - description: New task description
    - due_date: New due date in YYYY-MM-DD format
    - is_done: New completion status
    
    Returns:
        tuple: JSON response with updated task data and HTTP status 200,
               or error response with HTTP status 400/404/500
    """
    # Check if task exists
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.json
    
    # Validate input data using our validation function
    errors = validate_task_data(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        # Update task fields if provided in request
        # Only update fields that are actually provided
        if 'title' in data:
            task.title = sanitize_input(data['title'])
        if 'description' in data:
            task.description = sanitize_input(data['description'])
        if 'due_date' in data:
            task.due_date = data['due_date']
        if 'is_done' in data:
            task.is_done = data['is_done']
            
        # Save changes to database
        db.session.commit()
        
        # Return updated task data
        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date,  
            'is_done': task.is_done
        }), 200
        
    except Exception as e:
        # Rollback transaction on error and return error response
        db.session.rollback()
        return jsonify({"error": "Failed to update task"}), 500

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """
    Delete a task from the database.
    
    Args:
        task_id (int): ID of the task to delete
        
    Returns:
        tuple: JSON response with success message and HTTP status 200,
               or error response with HTTP status 404
    """
    # Check if task exists
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    # Delete task from database
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({"message": "Task deleted successfully"}), 200


# Application Entry Point
# =======================

if __name__ == '__main__':
    """
    Run the Flask application in development mode.
    
    Configuration:
    - Debug mode: Enabled for development (shows detailed errors)
    - Host: 0.0.0.0 (accessible from any network interface)
    - Port: 5000 (standard Flask development port)
    """
    app.run(debug=True, host='0.0.0.0', port=5000)