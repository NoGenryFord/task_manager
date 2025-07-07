// File: static/js/edit_task.js
// This file contains the JavaScript code for handling the editing of tasks in the task management application.

// Function to show messages
function showMessage(message, type = "success") {
  // Remove existing messages
  const existingMessage = document.querySelector(".message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  // Insert before form
  const formContainer = document.querySelector(".form_container");
  formContainer.insertBefore(messageDiv, formContainer.firstChild);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Function to set loading state
function setLoading(isLoading) {
  const form = document.getElementById("edit_task_form");
  const submitBtn = form.querySelector(".btn_primary");

  if (isLoading) {
    form.classList.add("form_loading");
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Updating Task...";
  } else {
    form.classList.remove("form_loading");
    submitBtn.disabled = false;
    submitBtn.textContent = "💾 Update Task";
  }
}

// Function to handle form submission for editing a task
document.addEventListener("DOMContentLoaded", () => {
  const editTaskForm = document.getElementById("edit_task_form");

  if (editTaskForm) {
    editTaskForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent the default form submission

      // Get task ID from data attribute
      const taskId = editTaskForm.getAttribute("data-task-id");

      // Validate form
      const formData = new FormData(editTaskForm);
      const title = formData.get("title").trim();
      const description = formData.get("description").trim();
      const dueDate = formData.get("dueDate");
      const isDone = formData.get("is_done") === "on";

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
        due_date: dueDate,
        is_done: isDone,
      };

      setLoading(true);

      try {
        const response = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          showMessage("✅ Task updated successfully!", "success");

          // Redirect to main page after 2 seconds
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          const errorData = await response.json();
          let errorMessage = "❌ Failed to update task";

          if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage += ":\n" + errorData.details.join("\n");
          } else if (errorData.error) {
            errorMessage += ": " + errorData.error;
          }

          showMessage(errorMessage, "error");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        showMessage(
          "❌ Network error: Could not update task. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    });
  }
});
