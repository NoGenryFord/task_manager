/**
 * Task Manager Frontend - Edit Task Page Controller
 * ================================================
 *
 * This file manages the "Edit Task" form functionality including:
 * - Form pre-population with existing task data
 * - Form validation and submission for updates
 * - User feedback messages (success/error)
 * - Loading states during API calls
 * - Navigation after successful task update
 *
 */

// ========================================
// User Interface Functions
// ========================================

/**
 * Display feedback messages to the user.
 * Automatically removes existing messages and shows new ones with appropriate styling.
 *
 * @param {string} message - The message text to display
 * @param {string} type - Message type: "success" (green) or "error" (red)
 */
function showMessage(message, type = "success") {
  // Remove any existing message to avoid duplication
  const existingMessage = document.querySelector(".message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message element with appropriate styling
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  // Insert message at the top of the form container
  const formContainer = document.querySelector(".form_container");
  formContainer.insertBefore(messageDiv, formContainer.firstChild);

  // Auto-remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

/**
 * Toggle the form's loading state during API operations.
 * Disables form interaction and shows visual feedback.
 *
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoading(isLoading) {
  const form = document.getElementById("edit_task_form");
  const submitBtn = form.querySelector(".btn_primary");

  if (isLoading) {
    // Enable loading state: disable form and show loading indicator
    form.classList.add("form_loading");
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Updating Task...";
  } else {
    // Disable loading state: restore normal form functionality
    form.classList.remove("form_loading");
    submitBtn.disabled = false;
    submitBtn.textContent = "💾 Update Task";
  }
}

// ========================================
// Form Handling and Validation
// ========================================

/**
 * Initialize the edit task form functionality.
 * Sets up form submission handling, validation, and API communication.
 */
document.addEventListener("DOMContentLoaded", () => {
  const editTaskForm = document.getElementById("edit_task_form");

  if (editTaskForm) {
    editTaskForm.addEventListener("submit", async (event) => {
      // Prevent default browser form submission
      event.preventDefault();

      // Extract task ID from form data attribute (set by template)
      const taskId = editTaskForm.getAttribute("data-task-id");

      // Extract and validate form data
      const formData = new FormData(editTaskForm);
      const title = formData.get("title").trim();
      const description = formData.get("description").trim();
      const dueDate = formData.get("dueDate");
      const isDone = formData.get("is_done") === "on"; // Checkbox value

      // Client-side validation
      if (!title) {
        showMessage("❌ Please enter a task title", "error");
        return;
      }

      if (!dueDate) {
        showMessage("❌ Please select a due date", "error");
        return;
      }

      // Prepare task data for API submission
      const taskData = {
        title: title,
        description: description,
        due_date: dueDate,
        is_done: isDone,
      };

      // Show loading state during API call
      setLoading(true);

      try {
        // Submit updated task data to the server API
        const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          // Success: Show confirmation and redirect
          showMessage("✅ Task updated successfully!", "success");

          // Redirect to main page after brief delay
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          // Error: Parse and display server error message
          const errorData = await response.json();
          let errorMessage = "❌ Failed to update task";

          // Handle detailed validation errors from server
          if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage += ":\n" + errorData.details.join("\n");
          } else if (errorData.error) {
            errorMessage += ": " + errorData.error;
          }

          showMessage(errorMessage, "error");
        }
      } catch (error) {
        // Network or other unexpected errors
        console.error("Error updating task:", error);
        showMessage(
          "❌ Network error occurred. Please check your connection and try again.",
          "error"
        );
      } finally {
        // Always disable loading state when done
        setLoading(false);
      }
    });
  }
});
