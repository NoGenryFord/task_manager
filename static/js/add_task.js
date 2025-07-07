/**
 * Task Manager Frontend - Add Task Page Controller
 * ===============================================
 *
 * This file manages the "Add Task" form functionality including:
 * - Form validation and submission
 * - User feedback messages (success/error)
 * - Loading states during API calls
 * - Navigation after successful task creation
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

  // Auto-remove message after 5 seconds for better UX
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
  const form = document.getElementById("add_task_form");
  const submitBtn = form.querySelector(".btn_primary");

  if (isLoading) {
    // Enable loading state: disable form and show loading indicator
    form.classList.add("form_loading");
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Creating Task...";
  } else {
    // Disable loading state: restore normal form functionality
    form.classList.remove("form_loading");
    submitBtn.disabled = false;
    submitBtn.textContent = "✅ Create Task";
  }
}

// ========================================
// Form Handling and Validation
// ========================================

/**
 * Initialize the add task form functionality.
 * Sets up form submission handling, validation, and API communication.
 */
document.addEventListener("DOMContentLoaded", () => {
  const addTaskForm = document.getElementById("add_task_form");

  if (addTaskForm) {
    addTaskForm.addEventListener("submit", async (event) => {
      // Prevent default browser form submission
      event.preventDefault();

      // Extract and validate form data
      const formData = new FormData(addTaskForm);
      const title = formData.get("title").trim();
      const description = formData.get("description").trim();
      const dueDate = formData.get("dueDate");

      if (!title) {
        showMessage("❌ Please enter a task title", "error");
        return;
      }

      if (!dueDate) {
        showMessage("❌ Please select a due date", "error");
        return;
      }

      const taskData = {
        title: title,
        description: description,
        dueDate: dueDate,
      };

      setLoading(true);

      try {
        const response = await fetch("http://127.0.0.1:5000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          showMessage("✅ Task created successfully!", "success");
          addTaskForm.reset(); // Clear the form

          // Redirect to main page after 2 seconds
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          const errorData = await response.json();
          let errorMessage = "❌ Failed to create task";

          if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage += ":\n" + errorData.details.join("\n");
          } else if (errorData.error) {
            errorMessage += ": " + errorData.error;
          }

          showMessage(errorMessage, "error");
        }
      } catch (error) {
        // Network or other unexpected errors
        console.error("Error adding task:", error);
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
