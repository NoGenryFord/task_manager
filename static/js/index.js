//Task array example
const tasks = [
  {
    id: 1,
    title: "Buy groceries",
    description: "Milk, Bread, Eggs",
    status: "Active",
  },
  {
    id: 2,
    title: "Complete project report",
    description: "Finish the report by Friday",
    status: "Complete",
  },
];

// Container for task cards
const taskContainer = document.querySelector(".task_cards");

// Function to render tasks
function renderTasks() {
  //taskContainer.innerHTML = ""; // Clear existing tasks
  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
        <ul class="task_item">
          <li><span class="task_name">${task.title}</span></li>
          <li><span class="task_description">${task.description}</span></li>
          <li><span class="task_status ${task.status.toLowerCase()}">${
      task.status
    }</span></li>
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
        </ul>
    `;
    taskContainer.appendChild(taskItem);
  });
}

// Call renderTasks to display initial tasks
renderTasks();
