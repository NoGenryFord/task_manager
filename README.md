# 📋 Task Manager

Web application for task management with dynamic frontend and REST API backend.

## ✨ Features

- 🎨 **Modern UI/UX** - Gradient design with animations
- 🗄️ **SQLite Database** - Local data storage
- 🔄 **REST API** - Full CRUD functionality
- 📅 **Smart Dates** - "Today", "Tomorrow", "Overdue"
- 🎯 **Form Validation** - Error messages

## 🛠️ Technologies

- **Backend**: Flask + SQLAlchemy
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Database**: SQLite
- **API**: RESTful JSON API

## 📁 Project Structure

```

task_manager/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Documentation (English)
├── README_CZ.md          # Documentation (Czech)
├── database/             # Database management scripts
│   ├── create_db.py      # Create database script
│   ├── delete_db.py      # Delete database script
│   ├── reset_db.py       # Reset database script
│   └── recreate_db.py    # Legacy recreate script
├── tasks.db              # SQLite database (auto-created)
├── templates/            # HTML templates
│   ├── index.html        # Main page
│   └── add_task.html     # Add task page
└── static/               # Static files
    ├── styles/
    │   └── style.css     # Styles
    └── js/
        ├── index.js      # Main page logic
        └── add_task.js   # Add task logic
```

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/NoGenryFord/task_manager.git
cd Task_Manager
```

### 2. Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv .venv
.venv/Scripts/activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Initialize Database

```bash
python database/reset_db.py
```

### 5. Start Server

```bash
python app.py
```

### 6. Open in Browser

Navigate to: `http://127.0.0.1:5000`

## 🗄️ Database Management

### Create Database

```bash
python database/create_db.py
```

### Reset Database with Sample Data

```bash
python database/reset_db.py
```

### Delete Database

```bash
python database/delete_db.py
```

## 📚 API Documentation

### Tasks Endpoints

#### Get All Tasks

- **GET** `/tasks`
- **Response**: JSON array of tasks

#### Get Single Task

- **GET** `/tasks/{id}`
- **Response**: JSON task object

#### Create Task

- **POST** `/tasks`
- **Request Body**:

```json
{
  "title": "Task title",
  "description": "Task description",
  "dueDate": "2025-07-10"
}
```

#### Update Task

- **PUT** `/tasks/{id}`
- **Request Body**:

```json
{
  "title": "New title",
  "description": "New description",
  "due_date": "2025-07-15",
  "is_done": true
}
```

#### Delete Task

- **DELETE** `/tasks/{id}`

### Pages

#### Home Page

- **GET** `/`
- Displays task list

#### Add Task Page

- **GET** `/add_task`
- Form for creating new task

## 🎯 Functionality

### ✅ Completed

- [x] CRUD operations for tasks
- [x] Modern UI with gradients and animations
- [x] Responsive design
- [x] Form validation
- [x] Smart date formatting
- [x] REST API
- [x] Popup action menus
- [x] Success/error messages

## 🐛 Known Issues

No critical issues at this time.

## 🔧 Development Setup

### Development Mode

Flask server runs in debug mode by default:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Database Schema

```sql
CREATE TABLE task (
    id INTEGER PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    due_date VARCHAR(10),
    is_done BOOLEAN DEFAULT 0
);
```

## 🆘 Need Help?

If you encounter issues:

1. Ensure Python is installed (version 3.7+)
2. Check if all dependencies are installed: `pip install -r requirements.txt`
3. Make sure port 5000 is not occupied by another application
4. Try restarting the server
5. Check terminal logs for detailed error information

### Diagnostic Commands:

```bash
# Check Python version
python --version

# Check installed packages
pip list

# Check available ports
netstat -an | findstr 5000
```

## 🌍 Language Versions

- 🇬🇧 **English**: `README.md`
- 🇨🇿 **Czech**: `README_CZ.md`

---
