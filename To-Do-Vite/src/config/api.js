const API_URL = 'http://localhost:3000';

export const fetchBoards = async () => {
  const response = await fetch(`${API_URL}/boards`);
  if (!response.ok) throw new Error('Error al cargar los tableros');
  return response.json();
};

export const createBoard = async (name, category) => {
  const response = await fetch(`${API_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category }),
  });
  if (!response.ok) throw new Error('Error al crear el tablero');
  return response.json();
};

export const deleteBoard = async (name) => {
  const response = await fetch(`${API_URL}/boards/${name}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar el tablero');
};

export const fetchTasks = async (boardName, category) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks?category=${category}`);
  if (!response.ok) throw new Error('Error al cargar las tareas');
  return response.json();
};

export const createTask = async (boardName, text) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Error al crear la tarea');
  return response.json();
};

export const updateTask = async (boardName, taskId, updates) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Error al actualizar la tarea');
  return response.json();
};

export const deleteTask = async (boardName, taskId) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar la tarea');
};

export const deleteCompletedTasks = async (boardName) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks/completed`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar tareas completadas');
}; 