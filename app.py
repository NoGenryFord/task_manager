from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

# Database configuration (SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    is_done = db.Column(db.Boolean, default=False)

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
        'is_done': task.is_done
    } for task in tasks]), 200


# Create a new task
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    new_task = Task(title=data['title'], description=data['description'], is_done=data.get('is_done', False))
    db.session.add(new_task)
    db.session.commit()
    return jsonify({
        'id': new_task.id,
        'title': new_task.title,
        'description': new_task.description,
        'is_done': new_task.is_done
    }), 201

# Update a task
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    updated_data = request.json
    task.title = updated_data.get('title', task.title)
    task.description = updated_data.get('description', task.description)
    task.is_done = updated_data.get('is_done', task.is_done)
    db.session.commit()
    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'is_done': task.is_done
    }), 200

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