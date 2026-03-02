import {
  initializeTasks, getTasks, addTask,
  toggleTask, deleteTask,
  clearCompleted, getFilteredTasks,
  updatePriority
} from "./tasks.js";

import {
  saveTasks, loadTasks,
  saveFilter, loadFilter
} from "./storage.js";

import {
  fetchTasks, createTask,
  updateTask, deleteTaskServer
} from "./api.js";

let currentFilter = loadFilter();

const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const filters = document.getElementById("filters");
const stats = document.getElementById("stats");
const loadBtn = document.getElementById("load-server");
const clearBtn = document.getElementById("clear-completed");

initializeTasks(loadTasks());
render();

function saveAndRender() {
  saveTasks(getTasks());
  render();
}

function render() {
  taskList.innerHTML = "";
  const tasks = getFilteredTasks(currentFilter);

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.className = "flex justify-between items-center bg-zinc-700 p-2 rounded";

    li.innerHTML = `
      <div class="flex items-center gap-2">
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span class="task-text ${task.completed ? "completed" : ""}">
          ${task.text} (${task.priority})
        </span>
      </div>
      <button class="delete-btn text-red-400">✖</button>
    `;

    li.addEventListener("dblclick", () => startPriorityEdit(task, li));
    taskList.appendChild(li);
  });

  const total = getTasks().length;
  const completed = getTasks().filter(t => t.completed).length;
  stats.textContent = `Всего: ${total} | Выполнено: ${completed}`;
}

taskList.addEventListener("change", async e => {
  if (e.target.type === "checkbox") {
    const id = e.target.closest("li").dataset.id;
    toggleTask(id);
    saveAndRender();
    await updateTask(id, e.target.checked);
  }
});

taskList.addEventListener("click", async e => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.closest("li").dataset.id;
    deleteTask(id);
    saveAndRender();
    await deleteTaskServer(id);
  }
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const task = addTask(text, prioritySelect.value);
  saveAndRender();

  await createTask(task);
  input.value = "";
});

filters.addEventListener("click", e => {
  if (e.target.dataset.filter) {
    currentFilter = e.target.dataset.filter;
    saveFilter(currentFilter);

    document.querySelectorAll(".filter-btn")
      .forEach(btn => btn.classList.toggle("active",
        btn.dataset.filter === currentFilter));

    render();
  }
});

loadBtn.addEventListener("click", async () => {
  const serverTasks = await fetchTasks();
  serverTasks.forEach(t => {
    const task = addTask(t.title, "medium");
    task.completed = t.completed;
  });
  saveAndRender();
});

clearBtn.addEventListener("click", () => {
  if (confirm("Удалить выполненные задачи?")) {
    clearCompleted();
    saveAndRender();
  }
});

function startPriorityEdit(task, li) {
  const select = document.createElement("select");
  ["low", "medium", "high"].forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    if (p === task.priority) option.selected = true;
    select.appendChild(option);
  });

  li.appendChild(select);
  select.focus();

  select.addEventListener("change", () => {
    updatePriority(task.id, select.value);
    saveAndRender();
  });

  select.addEventListener("blur", () => select.remove());
}