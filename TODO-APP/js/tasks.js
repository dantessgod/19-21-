let tasks = [];

export const initializeTasks = (initial) => {
  tasks = [...initial];
};

export const getTasks = () => tasks;

export const addTask = (text, priority = "medium") => {
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    priority,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  return newTask;
};

export const toggleTask = (id) => {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
};

export const deleteTask = (id) => {
  tasks = tasks.filter(t => t.id !== id);
};

export const clearCompleted = () => {
  tasks = tasks.filter(t => !t.completed);
};

export const getFilteredTasks = (filter) => {
  if (filter === "active") return tasks.filter(t => !t.completed);
  if (filter === "completed") return tasks.filter(t => t.completed);
  return tasks;
};

export const updatePriority = (id, priority) => {
  const task = tasks.find(t => t.id === id);
  if (task) task.priority = priority;
};