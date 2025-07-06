// File: static/js/add_task.js
// This file contains the JavaScript code for handling the addition of tasks in the task management application.

// Function to handle form submission for adding a task
document.addEventListener("DOMContentLoaded", () => {
  const addTaskForm = document.getElementById("add_task_form");

  if (addTaskForm) {
    addTaskForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent the default form submission

      const formData = new FormData(addTaskForm);
      const taskData = {
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
      };

      try {
        const response = await fetch("http://127.0.0.1:5000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          alert("Task added successfully!");
          addTaskForm.reset(); // Clear the form
        } else {
          alert("Failed to add task. Please try again.");
        }
      } catch (error) {
        console.error("Error adding task:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  }
});
