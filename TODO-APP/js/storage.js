const TASKS_KEY = "todo_tasks";
const FILTER_KEY = "todo_filter";

export const saveTasks = (tasks) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const loadTasks = () => {
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFilter = (filter) => {
  sessionStorage.setItem(FILTER_KEY, filter);
};

export const loadFilter = () => {
  return sessionStorage.getItem(FILTER_KEY) || "all";
};