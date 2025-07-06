// File: static/js/index.js
// This file contains the JavaScript code for managing tasks in a simple task management application.

// Fetch tasks from the server
async function fetchTasks() {
  const response = await fetch("http://127.0.0.1:5000/tasks");
  const tasks = await response.json();
  return tasks;
}

// Function to render tasks
async function renderTasks() {
  // Clear existing tasks
  const taskContainer = document.querySelector(".task_cards");
  //taskContainer.innerHTML = ""; // Clear the container

  const tasks = await fetchTasks();
  tasks.forEach((task) => {
    const taskItem = document.createElement("ul");
    taskItem.classList.add("task_item");
    taskItem.innerHTML = `
          <li><span class="task_name">${task.title}</span></li>
          <li><span class="task_description">${task.description}</span></li>
          <li><span class="task_status ${
            task.is_done ? "completed" : "active"
          }">${task.is_done ? "Completed" : "Active"}</span></li>
          <li>
            <span class="task_actions">
              Actions
              <div class="popup">
                <button class="edit_task">Edit</button>
                <button class="complete_task">Complete</button>
                <button class="delete_task">Delete</button>
              </div>
            </span>
          </li>
    `;

    // Event listeners for task actions
    taskItem.querySelector(".edit_task").addEventListener("click", () => {
      editTask(task.id);
    });
    taskItem.querySelector(".complete_task").addEventListener("click", () => {
      completeTask(task.id);
    });
    taskItem.querySelector(".delete_task").addEventListener("click", () => {
      deleteTask(task.id);
    });

    taskContainer.appendChild(taskItem);
  });
}

// Function to edit a task
async function editTask(taskId) {
  const task = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`).then(
    (res) => res.json()
  );
  if (!task) {
    alert("Task not found");
    return;
  }
  const newTitle = prompt("Enter new title:", task.title);
  const newDescription = prompt("Enter new description:", task.description);
  if (newTitle) task.title = newTitle;
  if (newDescription) task.description = newDescription;
  const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    alert("Failed to update task");
  }
  renderTasks(); // Re-render tasks
}

// Function to complete a task
async function completeTask(taskId) {
  const task = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`).then(
    (res) => res.json()
  );
  if (!task) {
    alert("Task not found");
    return;
  }
  task.is_done = true;
  await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  renderTasks(); // Re-render tasks
}

// Function to delete a task
async function deleteTask(taskId) {
  const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    alert("Failed to delete task");
  }
  renderTasks(); // Re-render tasks after deletion
}

// Call renderTasks to display initial tasks
renderTasks();
