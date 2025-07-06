// File: static/js/index.js
// This file contains the JavaScript code for managing tasks in a simple task management application.

// Function to format date for display
function formatDate(dateString) {
  if (!dateString) return "No due date";

  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return "📅 Today";
  } else if (date.getTime() === tomorrow.getTime()) {
    return "📅 Tomorrow";
  } else if (date < today) {
    return "🔴 Overdue";
  } else {
    return `📅 ${dateString}`;
  }
}

// Fetch tasks from the server
async function fetchTasks() {
  const response = await fetch("http://127.0.0.1:5000/tasks");
  const tasks = await response.json();
  return tasks;
}

// Function to render tasks
async function renderTasks() {
  // Clear existing tasks (remove all task_item elements, but keep task_header)
  const taskContainer = document.querySelector(".task_cards");
  const existingTasks = taskContainer.querySelectorAll(".task_item");
  existingTasks.forEach((task) => task.remove());

  const tasks = await fetchTasks();
  tasks.forEach((task) => {
    const taskItem = document.createElement("ul");
    taskItem.classList.add("task_item");
    taskItem.innerHTML = `
          <li><span class="task_name">${task.title}</span></li>
          <li><span class="task_description">${
            task.description || "No description"
          }</span></li>
          <li><span class="task_due_date">${
            task.due_date ? formatDate(task.due_date) : "No due date"
          }</span></li>
          <li><span class="task_status ${
            task.is_done ? "completed" : "active"
          }">${task.is_done ? "Completed" : "Active"}</span></li>
          <li>
            <span class="task_actions">
              Actions
              <div class="popup">
                <button class="edit_task" data-task-id="${
                  task.id
                }">Edit</button>
                <button class="complete_task" data-task-id="${
                  task.id
                }">Complete</button>
                <button class="delete_task" data-task-id="${
                  task.id
                }">Delete</button>
              </div>
            </span>
          </li>
    `;

    // Event listeners for task actions
    taskItem.querySelector(".edit_task").addEventListener("click", (e) => {
      const taskId = e.target.getAttribute("data-task-id");
      editTask(parseInt(taskId));
    });
    taskItem.querySelector(".complete_task").addEventListener("click", (e) => {
      const taskId = e.target.getAttribute("data-task-id");
      completeTask(parseInt(taskId));
    });
    taskItem.querySelector(".delete_task").addEventListener("click", (e) => {
      const taskId = e.target.getAttribute("data-task-id");
      deleteTask(parseInt(taskId));
    });

    taskContainer.appendChild(taskItem);
  });
}

// Function to edit a task
async function editTask(taskId) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`);
    if (!response.ok) {
      alert("Task not found");
      return;
    }

    const task = await response.json();
    const newTitle = prompt("Enter new title:", task.title);
    const newDescription = prompt("Enter new description:", task.description);

    if (newTitle !== null && newTitle.trim() !== "") {
      task.title = newTitle.trim();
    }
    if (newDescription !== null) {
      task.description = newDescription.trim();
    }

    const updateResponse = await fetch(
      `http://127.0.0.1:5000/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );

    if (!updateResponse.ok) {
      alert("Failed to update task");
      return;
    }

    renderTasks(); // Re-render tasks
  } catch (error) {
    console.error("Error editing task:", error);
    alert("An error occurred while editing the task");
  }
}

// Function to complete a task
async function completeTask(taskId) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`);
    if (!response.ok) {
      alert("Task not found");
      return;
    }

    const task = await response.json();
    task.is_done = true;

    const updateResponse = await fetch(
      `http://127.0.0.1:5000/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );

    if (!updateResponse.ok) {
      alert("Failed to complete task");
      return;
    }

    renderTasks(); // Re-render tasks
  } catch (error) {
    console.error("Error completing task:", error);
    alert("An error occurred while completing the task");
  }
}

// Function to delete a task
async function deleteTask(taskId) {
  try {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to delete task");
      return;
    }

    renderTasks(); // Re-render tasks after deletion
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("An error occurred while deleting the task");
  }
}

// Call renderTasks to display initial tasks
renderTasks();
