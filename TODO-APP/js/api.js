const API_URL = "https://jsonplaceholder.typicode.com/todos";

export async function fetchTasks() {
  const res = await fetch(`${API_URL}?_limit=10`);
  if (!res.ok) throw new Error("Ошибка загрузки");
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });
  return res.json();
}

export async function updateTask(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
}

export async function deleteTaskServer(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}