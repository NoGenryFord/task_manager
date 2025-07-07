// File: static/js/index.js
// This file contains the JavaScript code for managing tasks in a simple task management application.

// Global variables for filtering and sorting
let currentFilter = "all"; // 'all', 'active', 'completed'
let currentSort = "date"; // 'date', 'name'
let allTasks = []; // Store all tasks for filtering/sorting

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
  allTasks = tasks; // Store for filtering/sorting
  return tasks;
}

// Function to filter tasks
function filterTasks(tasks, filter) {
  switch (filter) {
    case "active":
      return tasks.filter((task) => !task.is_done);
    case "completed":
      return tasks.filter((task) => task.is_done);
    case "all":
    default:
      return tasks;
  }
}

// Function to sort tasks
function sortTasks(tasks, sortBy) {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      case "date":
      default:
        // Sort by due_date, putting tasks without date at the end
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
    }
  });
}

// Function to render tasks
async function renderTasks(tasksToRender = null) {
  // Clear existing tasks (remove all task_item elements, but keep task_header)
  const taskContainer = document.querySelector(".task_cards");
  const existingTasks = taskContainer.querySelectorAll(".task_item");
  existingTasks.forEach((task) => task.remove());

  // Use provided tasks or fetch new ones
  let tasks = tasksToRender;
  if (!tasks) {
    tasks = await fetchTasks();
  }

  // Apply current filter and sort
  const filteredTasks = filterTasks(tasks, currentFilter);
  const sortedTasks = sortTasks(filteredTasks, currentSort);

  sortedTasks.forEach((task) => {
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

// Function to edit a task (redirect to edit page)
function editTask(taskId) {
  window.location.href = `/edit_task/${taskId}`;
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

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  // First load and render tasks
  await renderTasks();

  // Then set up event listeners for filtering and sorting
  setupEventListeners();
});

// Function to set up event listeners
function setupEventListeners() {
  // Set initial active states
  updateActiveButton("filter", "filter_all");
  updateActiveButton("sort", "sort_date");

  // Setup button event listeners
  setupButtonEventListeners();
}

// Function to setup button event listeners (can be called multiple times)
function setupButtonEventListeners() {
  // Filter buttons
  const filterAll = document.querySelector(".filter_all");
  const filterActive = document.querySelector(".filter_active");
  const filterCompleted = document.querySelector(".filter_completed");

  if (filterAll) {
    filterAll.addEventListener("click", () => {
      currentFilter = "all";
      renderTasks(allTasks);
      updateActiveButton("filter", "filter_all");
      setupButtonEventListeners(); // Re-setup after update
    });
  }

  if (filterActive) {
    filterActive.addEventListener("click", () => {
      currentFilter = "active";
      renderTasks(allTasks);
      updateActiveButton("filter", "filter_active");
      setupButtonEventListeners(); // Re-setup after update
    });
  }

  if (filterCompleted) {
    filterCompleted.addEventListener("click", () => {
      currentFilter = "completed";
      renderTasks(allTasks);
      updateActiveButton("filter", "filter_completed");
      setupButtonEventListeners(); // Re-setup after update
    });
  }

  // Sort buttons
  const sortDate = document.querySelector(".sort_date");
  const sortName = document.querySelector(".sort_name");

  if (sortDate) {
    sortDate.addEventListener("click", () => {
      currentSort = "date";
      renderTasks(allTasks);
      updateActiveButton("sort", "sort_date");
      setupButtonEventListeners(); // Re-setup after update
    });
  }

  if (sortName) {
    sortName.addEventListener("click", () => {
      currentSort = "name";
      renderTasks(allTasks);
      updateActiveButton("sort", "sort_name");
      setupButtonEventListeners(); // Re-setup after update
    });
  }
}

// Function to update active button styling
function updateActiveButton(type, activeClass) {
  // Remove active class from all buttons of this type
  const prefix = type === "filter" ? "filter_" : "sort_";
  document.querySelectorAll(`button[class*="${prefix}"]`).forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to clicked button
  const activeButton = document.querySelector(`.${activeClass}`);
  if (activeButton) {
    activeButton.classList.add("active");
  }

  // Update label to show current selection
  if (type === "filter") {
    const filterActions = document.querySelector(".filter_actions");
    const buttonText = activeButton
      ? activeButton.textContent.trim()
      : "All tasks";
    filterActions.innerHTML = `🔍 ${buttonText.replace(/^[🔄📋✅]\s*/, "")} ▼
      <div class="popup">
        <button class="filter_all">📋 All tasks</button>
        <button class="filter_active">🔄 Active</button>
        <button class="filter_completed">✅ Completed</button>
      </div>`;

    // Re-setup event listeners and set active state
    setupButtonEventListeners();
    const newActiveButton = document.querySelector(`.${activeClass}`);
    if (newActiveButton) {
      newActiveButton.classList.add("active");
    }
  } else if (type === "sort") {
    const sortActions = document.querySelector(".sort_actions");
    const buttonText = activeButton
      ? activeButton.textContent.trim()
      : "Sort by date";
    sortActions.innerHTML = `🔄 ${buttonText.replace(/^[📅🔤]\s*/, "")} ▼
      <div class="popup">
        <button class="sort_date">📅 Sort by date</button>
        <button class="sort_name">🔤 Sort by name</button>
      </div>`;

    // Re-setup event listeners and set active state
    setupButtonEventListeners();
    const newActiveButton = document.querySelector(`.${activeClass}`);
    if (newActiveButton) {
      newActiveButton.classList.add("active");
    }
  }
}
