# File: app.py
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import html
import re


app = Flask(__name__)

# Database configuration (SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.String(10), nullable=True)  
    is_done = db.Column(db.Boolean, default=False)

# Input validation and sanitization functions
def sanitize_input(text):
    """Sanitize text input to prevent XSS attacks"""
    if not text:
        return ""
    # HTML escape
    text = html.escape(text.strip())
    # Remove potentially dangerous characters
    text = re.sub(r'[<>"\']', '', text)
    return text

def validate_task_data(data):
    """Validate task data and return errors if any"""
    errors = []
    
    # Validate title
    title = data.get('title', '').strip()
    if not title:
        errors.append("Title is required")
    elif len(title) > 100:
        errors.append("Title must be 100 characters or less")
    
    # Validate description
    description = data.get('description', '').strip()
    if len(description) > 500:
        errors.append("Description must be 500 characters or less")
    
    # Validate due_date format
    due_date = data.get('dueDate') or data.get('due_date')
    if due_date and not re.match(r'^\d{4}-\d{2}-\d{2}$', due_date):
        errors.append("Due date must be in YYYY-MM-DD format")
    
    return errors

# Home route
@app.route('/')
def home_page():
    return render_template('index.html')

# Route to add a new task
@app.route('/add_task')
def add_task_page():
    return render_template('add_task.html')

# Route to edit a task
@app.route('/edit_task/<int:task_id>')
def edit_task_page(task_id):
    task = Task.query.get(task_id)
    if not task:
        return "Task not found", 404
    return render_template('edit_task.html', task=task)

# Favicon route
@app.route('/favicon.ico')
def favicon():
    return '', 204  # Return empty response with 204 No Content

# Initialize the database
@app.before_request
def create_tables():
    db.create_all()

# Get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date,
        'is_done': task.is_done
    } for task in tasks]), 200

# Get a single task
@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
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


# Create a new task
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    
    # Validate input data
    errors = validate_task_data(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400
    
    # Sanitize inputs
    title = sanitize_input(data.get('title'))
    description = sanitize_input(data.get('description', ''))
    due_date = data.get('dueDate')
    
    try:
        new_task = Task(
            title=title,
            description=description,
            due_date=due_date,  
            is_done=data.get('is_done', False)
        )
        db.session.add(new_task)
        db.session.commit()
        
        return jsonify({
            'id': new_task.id,
            'title': new_task.title,
            'description': new_task.description,
            'due_date': new_task.due_date,  
            'is_done': new_task.is_done
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create task"}), 500

# Update a task
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.json
    
    # Validate input data
    errors = validate_task_data(data)
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    try:
        # Sanitize and update task
        if 'title' in data:
            task.title = sanitize_input(data['title'])
        if 'description' in data:
            task.description = sanitize_input(data['description'])
        if 'due_date' in data:
            task.due_date = data['due_date']
        if 'is_done' in data:
            task.is_done = data['is_done']
            
        db.session.commit()
        
        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date,  
            'is_done': task.is_done
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update task"}), 500

# Delete a task
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)