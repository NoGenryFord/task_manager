/**
 * Task Manager Frontend - Main Page Controller
 * ==========================================
 *
 * This file manages the main task list page functionality including:
 * - Fetching and displaying tasks from the API
 * - Filtering tasks (all, active, completed)
 * - Sorting tasks (by date, by name)
 * - Task actions (edit, complete, delete)
 * - Dropdown menu interactions
 * - Dynamic UI updates
 *
 */

// ========================================
// Global State Management
// ========================================

// Current filter state for task display
let currentFilter = "all"; // Options: 'all', 'active', 'completed'

// Current sort method for task ordering
let currentSort = "date"; // Options: 'date', 'name'

// Cache of all tasks to avoid redundant API calls
let allTasks = []; // Stores complete task list for client-side filtering/sorting

// ========================================
// Utility Functions
// ========================================

/**
 * Format a date string for user-friendly display.
 * Provides contextual labels like "Today", "Tomorrow", "Overdue".
 *
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string with emoji indicators
 */
function formatDate(dateString) {
  // Handle empty or null dates
  if (!dateString) return "No due date";

  // Create date objects for comparison
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time components to compare only dates (not time)
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  // Return contextual date labels
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

// ========================================
// Data Management Functions
// ========================================

/**
 * Fetch all tasks from the server API.
 * Updates the global tasks cache for filtering/sorting.
 *
 * @returns {Promise<Array>} Promise resolving to array of task objects
 */
async function fetchTasks() {
  const response = await fetch("http://127.0.0.1:5000/tasks");
  const tasks = await response.json();
  allTasks = tasks; // Update global cache
  return tasks;
}

/**
 * Filter tasks based on completion status.
 *
 * @param {Array} tasks - Array of task objects to filter
 * @param {string} filter - Filter type: 'all', 'active', or 'completed'
 * @returns {Array} Filtered array of tasks
 */
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

/**
 * Sort tasks based on specified criteria.
 *
 * @param {Array} tasks - Array of task objects to sort
 * @param {string} sortBy - Sort method: 'date' or 'name'
 * @returns {Array} New sorted array of tasks (original array unchanged)
 */
function sortTasks(tasks, sortBy) {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "name":
        // Alphabetical sort by title (case-insensitive)
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      case "date":
      default:
        // Sort by due_date, putting tasks without date at the end
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1; // No date goes to end
        if (!b.due_date) return -1; // No date goes to end
        return new Date(a.due_date) - new Date(b.due_date);
    }
  });
}

// ========================================
// UI Rendering Functions
// ========================================

/**
 * Main function to render tasks in the UI.
 * Applies current filter and sort settings, then creates DOM elements for each task.
 *
 * @param {Array|null} tasksToRender - Optional array of tasks to render. If null, fetches from API.
 */
async function renderTasks(tasksToRender = null) {
  // Clear existing task items from the container
  // Note: We keep the task_header and only remove task_item elements
  const taskContainer = document.querySelector(".task_cards");
  const existingTasks = taskContainer.querySelectorAll(".task_item");
  existingTasks.forEach((task) => task.remove());

  // Get tasks data - either use provided tasks or fetch fresh data
  let tasks = tasksToRender;
  if (!tasks) {
    tasks = await fetchTasks();
  }

  // Apply current filtering and sorting preferences
  const filteredTasks = filterTasks(tasks, currentFilter);
  const sortedTasks = sortTasks(filteredTasks, currentSort);

  // Create DOM elements for each task
  sortedTasks.forEach((task) => {
    // Create task item container
    const taskItem = document.createElement("ul");
    taskItem.classList.add("task_item");

    // Build task HTML with dynamic content and status classes
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

    // Attach event listeners for task actions
    // Edit task button - redirects to edit page
    taskItem.querySelector(".edit_task").addEventListener("click", (e) => {
      const taskId = e.target.getAttribute("data-task-id");
      editTask(parseInt(taskId));
    });

    // Complete task button - toggles completion status
    taskItem.querySelector(".complete_task").addEventListener("click", (e) => {
      const taskId = e.target.getAttribute("data-task-id");
      completeTask(parseInt(taskId));
    });

    // Delete task button - removes task permanently
    taskItem.querySelector(".delete_task").addEventListener("click", (e) => {
      const taskId = e.target.getAttribute("data-task-id");
      deleteTask(parseInt(taskId));
    });

    // Add the completed task item to the container
    taskContainer.appendChild(taskItem);
  });
}

// ========================================
// Task Action Functions
// ========================================

/**
 * Navigate to the edit task page for a specific task.
 *
 * @param {number} taskId - The ID of the task to edit
 */
function editTask(taskId) {
  window.location.href = `/edit_task/${taskId}`;
}

/**
 * Mark a task as completed by updating its status via API.
 * Automatically re-renders the task list after successful update.
 *
 * @param {number} taskId - The ID of the task to complete
 */
async function completeTask(taskId) {
  try {
    // First, fetch the current task data
    const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`);
    if (!response.ok) {
      alert("Task not found");
      return;
    }

    // Get task data and set completion status
    const task = await response.json();
    task.is_done = true;

    // Send update request to API
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

    // Refresh the task display to show updated status
    renderTasks();
  } catch (error) {
    console.error("Error completing task:", error);
    alert("An error occurred while completing the task");
  }
}

/**
 * Delete a task permanently from the database.
 * Shows confirmation dialog before deletion.
 *
 * @param {number} taskId - The ID of the task to delete
 */
async function deleteTask(taskId) {
  try {
    // Confirm deletion with user
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    // Send delete request to API
    const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to delete task");
      return;
    }

    // Refresh the task display after successful deletion
    renderTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("An error occurred while deleting the task");
  }
}

// ========================================
// Application Initialization
// ========================================

/**
 * Initialize the task management application.
 * Sets up initial task rendering and event listeners.
 */
document.addEventListener("DOMContentLoaded", async () => {
  // Load and display tasks on page load
  await renderTasks();

  // Set up interactive elements for filtering and sorting
  setupEventListeners();
});

// ========================================
// Event Listener Management
// ========================================

/**
 * Set up all event listeners for the application.
 * Initializes filter and sort controls with proper active states.
 */
function setupEventListeners() {
  // Set initial active button states
  updateActiveButton("filter", "filter_all");
  updateActiveButton("sort", "sort_date");

  // Set up all button click handlers
  setupButtonEventListeners();
}

/**
 * Set up click event listeners for filter and sort buttons.
 * This function can be called multiple times to re-attach listeners after DOM updates.
 */
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

// ========================================
// UI State Management
// ========================================

/**
 * Update the active button styling and dropdown labels.
 * Manages visual feedback for current filter/sort selection.
 *
 * @param {string} type - Type of action: "filter" or "sort"
 * @param {string} activeClass - CSS class name of the button to mark as active
 */
function updateActiveButton(type, activeClass) {
  // Remove active class from all buttons of this type
  const prefix = type === "filter" ? "filter_" : "sort_";
  document.querySelectorAll(`button[class*="${prefix}"]`).forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to the newly selected button
  const activeButton = document.querySelector(`.${activeClass}`);
  if (activeButton) {
    activeButton.classList.add("active");
  }

  // Update dropdown label to show current selection
  if (type === "filter") {
    // Update filter dropdown with current selection
    const filterActions = document.querySelector(".filter_actions");
    const buttonText = activeButton
      ? activeButton.textContent.trim()
      : "All tasks";

    // Rebuild filter dropdown HTML with updated label
    filterActions.innerHTML = `🔍 ${buttonText.replace(/^[🔄📋✅]\s*/, "")} ▼
      <div class="popup">
        <button class="filter_all">📋 All tasks</button>
        <button class="filter_active">🔄 Active</button>
        <button class="filter_completed">✅ Completed</button>
      </div>`;

    // Re-attach event listeners after DOM update
    setupButtonEventListeners();

    // Restore active state to the correct button
    const newActiveButton = document.querySelector(`.${activeClass}`);
    if (newActiveButton) {
      newActiveButton.classList.add("active");
    }
  } else if (type === "sort") {
    // Update sort dropdown with current selection
    const sortActions = document.querySelector(".sort_actions");
    const buttonText = activeButton
      ? activeButton.textContent.trim()
      : "Sort by date";

    // Rebuild sort dropdown HTML with updated label
    sortActions.innerHTML = `🔄 ${buttonText.replace(/^[📅🔤]\s*/, "")} ▼
      <div class="popup">
        <button class="sort_date">📅 Sort by date</button>
        <button class="sort_name">🔤 Sort by name</button>
      </div>`;

    // Re-attach event listeners after DOM update
    setupButtonEventListeners();

    // Restore active state to the correct button
    const newActiveButton = document.querySelector(`.${activeClass}`);
    if (newActiveButton) {
      newActiveButton.classList.add("active");
    }
  }
}
