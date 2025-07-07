# Task Manager Application

A comprehensive web-based task management system built with Flask and modern web technologies. This application provides a robust solution for organizing, tracking, and managing tasks with an intuitive user interface and RESTful API architecture.

## Executive Summary

The Task Manager is a full-stack web application designed for efficient task management. It features a Model-View-Controller (MVC) architecture with a Flask backend, SQLite database integration, and a responsive frontend. The application emphasizes security, user experience, and code quality while maintaining professional development standards.

## Key Features

### Core Functionality

- **Complete CRUD Operations**: Create, read, update, and delete tasks
- **Advanced Filtering**: Filter tasks by status (Active, Completed, All)
- **Intelligent Sorting**: Sort by due date, creation date, or priority
- **Status Management**: Track task completion and overdue items
- **Date Intelligence**: Automatic recognition of "Today", "Tomorrow", and overdue tasks

### Technical Excellence

- **RESTful API**: Comprehensive REST endpoints for all operations
- **Input Validation**: Server-side and client-side validation with sanitization
- **Security Measures**: XSS protection and SQL injection prevention
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Error Handling**: Comprehensive error management and user feedback

### User Experience

- **Modern Interface**: Clean design with gradient elements
- **Interactive Elements**: Hover effects, animations, and visual feedback
- **Accessibility**: Keyboard navigation and screen reader compatibility
- **Performance**: Optimized loading and smooth interactions

## Technology Stack

### Backend Technologies

- **Flask Framework**: Lightweight WSGI web application framework
- **SQLAlchemy ORM**: Database abstraction layer and object-relational mapping
- **SQLite Database**: Lightweight, serverless database engine
- **Python 3.x**: Primary programming language

### Frontend Technologies

- **HTML5**: Semantic markup with modern standards
- **CSS3**: Advanced styling with Flexbox, Grid, and animations
- **Vanilla JavaScript**: Pure JavaScript without external dependencies
- **Responsive Design**: Mobile-first approach with media queries

### Development Tools

- **MVC Architecture**: Model-View-Controller design pattern
- **RESTful API**: Representational State Transfer architectural style
- **JSON**: Data interchange format for API communication

## Project Architecture

### Directory Structure

```
task_manager/
├── app.py                    # Flask application entry point and route definitions
├── requirements.txt          # Python package dependencies
├── README.md                # Project documentation (English)
├── README_CZ.md             # Project documentation (Czech)
├── .gitignore               # Git ignore rules for Python projects
├── database/                # Database management utilities
│   ├── create_db.py         # Database initialization script
│   ├── delete_db.py         # Database removal utility
│   ├── reset_db.py          # Database reset with sample data
│   └── recreate_db.py       # Legacy database recreation script
├── tasks.db                 # SQLite database file (auto-generated)
├── templates/               # Jinja2 HTML templates
│   ├── index.html           # Main task dashboard
│   ├── add_task.html        # Task creation form
│   └── edit_task.html       # Task modification form
└── static/                  # Static web assets
    ├── styles/
    │   └── style.css        # Application stylesheet
    ├── js/
    │   ├── index.js         # Dashboard functionality
    │   ├── add_task.js      # Task creation logic
    │   └── edit_task.js     # Task editing logic
    └── favicon.ico          # Application icon
```

### Database Schema

```sql
Tasks Table:
- id (INTEGER PRIMARY KEY): Unique task identifier
- title (VARCHAR(200)): Task title/name
- description (TEXT): Detailed task description
- due_date (DATE): Task deadline
- is_done (BOOLEAN): Completion status
- created_at (DATETIME): Creation timestamp
```

## Installation and Setup

### System Requirements

- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Minimum 50MB free disk space

### Installation Steps

#### 1. Repository Setup

```bash
git clone https://github.com/NoGenryFord/task_manager.git
cd task_manager
```

#### 2. Python Virtual Environment (Recommended)

```bash
# Windows Command Prompt
python -m venv .venv
.venv/Scripts/activate

# Windows PowerShell
python -m venv .venv
.venv/Scripts/Activate.ps1

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### 3. Dependency Installation

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 4. Database Initialization

```bash
# Create database with sample data
python database/reset_db.py

# Or create empty database
python database/create_db.py
```

#### 5. Application Launch

```bash
python app.py
```

#### 6. Access Application

Open your web browser and navigate to: `http://127.0.0.1:5000`

## Database Management

The application includes comprehensive database management utilities for development and maintenance.

### Available Commands

#### Database Creation

```bash
python database/create_db.py
```

Creates an empty database with the required schema.

#### Database Reset with Sample Data

```bash
python database/reset_db.py
```

Recreates the database and populates it with sample tasks for testing and demonstration purposes.

#### Database Removal

```bash
python database/delete_db.py
```

Completely removes the database file. **Warning**: This action is irreversible.

### Sample Data

The reset script includes diverse sample tasks demonstrating:

- Various task statuses (Active, Completed)
- Different due dates (Past, Present, Future)
- Realistic task descriptions and priorities

## API Documentation

The Task Manager provides a comprehensive RESTful API for programmatic access to all functionality.

### Base URL

```
http://127.0.0.1:5000/api
```

### Authentication

Currently, the API operates without authentication for development purposes. In production environments, implement appropriate authentication mechanisms.

### Endpoints Overview

#### Task Management

##### Retrieve All Tasks

- **Method**: `GET`
- **Endpoint**: `/tasks`
- **Description**: Returns all tasks in the database
- **Response Format**: JSON array of task objects
- **Success Code**: 200 OK

##### Retrieve Single Task

- **Method**: `GET`
- **Endpoint**: `/tasks/{id}`
- **Description**: Returns a specific task by ID
- **Parameters**:
  - `id` (integer): Task identifier
- **Response Format**: JSON task object
- **Success Code**: 200 OK
- **Error Codes**: 404 Not Found

##### Create New Task

- **Method**: `POST`
- **Endpoint**: `/tasks`
- **Description**: Creates a new task
- **Request Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Task Title (required)",
    "description": "Detailed description (optional)",
    "due_date": "YYYY-MM-DD (optional)"
  }
  ```
- **Success Code**: 201 Created
- **Error Codes**: 400 Bad Request, 422 Unprocessable Entity

##### Update Existing Task

- **Method**: `PUT`
- **Endpoint**: `/tasks/{id}`
- **Description**: Updates an existing task
- **Parameters**:
  - `id` (integer): Task identifier
- **Request Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Updated Title (optional)",
    "description": "Updated description (optional)",
    "due_date": "YYYY-MM-DD (optional)",
    "is_done": true/false (optional)
  }
  ```
- **Success Code**: 200 OK
- **Error Codes**: 400 Bad Request, 404 Not Found, 422 Unprocessable Entity

##### Delete Task

- **Method**: `DELETE`
- **Endpoint**: `/tasks/{id}`
- **Description**: Permanently removes a task
- **Parameters**:
  - `id` (integer): Task identifier
- **Success Code**: 204 No Content
- **Error Codes**: 404 Not Found

### Data Models

#### Task Object Structure

```json
{
  "id": 1,
  "title": "Example Task",
  "description": "Task description",
  "due_date": "2025-07-15",
  "is_done": false,
  "created_at": "2025-07-07T10:30:00"
}
```

### Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "status_code": 400
}
```

## User Interface Features

### Dashboard Functionality

- **Task Overview**: Comprehensive view of all tasks with status indicators
- **Advanced Filtering**: Filter by completion status (All, Active, Completed)
- **Intelligent Sorting**: Sort by due date, creation date, or alphabetical order
- **Visual Status Indicators**: Color-coded task status and overdue notifications
- **Interactive Elements**: Hover effects and smooth animations

### Form Management

- **Real-time Validation**: Immediate feedback on form inputs
- **Date Intelligence**: Natural language date recognition
- **Error Prevention**: Client-side and server-side validation
- **User Feedback**: Success and error message system
- **Accessibility**: Keyboard navigation and screen reader support

## Security Considerations

### Implemented Security Measures

- **Input Validation**: Comprehensive server-side validation for all user inputs
- **XSS Protection**: HTML escaping and content sanitization
- **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries
- **Error Handling**: Sanitized error messages to prevent information disclosure

### Production Recommendations

- Implement user authentication and authorization
- Enable HTTPS/TLS encryption
- Add rate limiting for API endpoints
- Implement session management with secure cookies
- Configure Content Security Policy (CSP) headers

## Performance and Optimization

### Current Optimizations

- **Database Indexing**: Optimized queries with proper indexing
- **Static Asset Caching**: Efficient loading of CSS and JavaScript
- **Minimal Dependencies**: Lightweight framework selection
- **Responsive Design**: Optimized for various screen sizes

## Development Guidelines

### Code Quality Standards

- **Documentation**: Comprehensive inline comments and docstrings
- **Error Handling**: Robust exception management throughout the application
- **Code Structure**: Clean, maintainable MVC architecture
- **Testing**: Built-in validation and error checking

### Practices Implemented

- RESTful API design principles
- Semantic HTML markup
- Modern CSS methodologies (BEM-like naming conventions)
- Progressive enhancement approach
- Accessibility compliance (WCAG guidelines)

## Browser Compatibility

### Supported Browsers

- **Chrome**: Version 80+
- **Firefox**: Version 75+
- **Safari**: Version 13+
- **Edge**: Version 80+

### Feature Requirements

- JavaScript ES6+ support
- CSS Flexbox and Grid support
- Fetch API compatibility
- Local Storage support

## Troubleshooting

### Common Issues and Solutions

#### Database Connection Errors

```bash
# Solution: Reset the database
python database/reset_db.py
```

#### Port Already in Use

```bash
# Check which process is using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Kill the process or change port in app.py
```

#### Permission Errors

```bash
# Ensure proper file permissions
chmod 755 database/
chmod 644 database/*.py
```

#### Module Not Found Errors

```bash
# Verify virtual environment activation
pip list
pip install -r requirements.txt
```

### Diagnostic Commands

```bash
# System diagnostics
python --version
pip list
netstat -an | findstr 5000  # Windows
lsof -i :5000               # macOS/Linux
```

### Code Standards

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Include comprehensive comments
- Maintain consistent indentation (4 spaces)
- Write self-documenting code

## Language Versions

- 🇬🇧 **English**: `README.md`
- 🇨🇿 **Czech**: `README_CZ.md`
