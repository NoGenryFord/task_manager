// File: static/js/add_task.js
// This file contains the JavaScript code for handling the addition of tasks in the task management application.

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
  const form = document.getElementById("add_task_form");
  const submitBtn = form.querySelector(".btn_primary");

  if (isLoading) {
    form.classList.add("form_loading");
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Creating Task...";
  } else {
    form.classList.remove("form_loading");
    submitBtn.disabled = false;
    submitBtn.textContent = "✅ Create Task";
  }
}

// Function to handle form submission for adding a task
document.addEventListener("DOMContentLoaded", () => {
  const addTaskForm = document.getElementById("add_task_form");

  if (addTaskForm) {
    addTaskForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent the default form submission

      // Validate form
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
          showMessage(
            `❌ Failed to create task: ${errorData.error || "Unknown error"}`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error adding task:", error);
        showMessage(
          "❌ Network error. Please check your connection and try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    });
  }
});
