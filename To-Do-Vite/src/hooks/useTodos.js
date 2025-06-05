import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchTodos = async () => {
  const res = await fetch('http://localhost:3000/todos');
  if (!res.ok) throw new Error('Error al cargar tareas');
  const data = await res.json();
  return data;
};

const addTodo = async (text) => {
  const res = await fetch('http://localhost:3000/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, completed: false })
  });
  if (!res.ok) throw new Error('Error al agregar tarea');
  return res.json();
};

const editTodo = async ({ id, text }) => {
  const res = await fetch(`http://localhost:3000/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Error al editar tarea');
  return res.json();
};

const toggleTodo = async (todo) => {
  const res = await fetch(`http://localhost:3000/todos/${todo.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !todo.completed })
  });
  if (!res.ok) throw new Error('Error al actualizar tarea');
  return res.json();
};

const deleteTodo = async (id) => {
  const res = await fetch(`http://localhost:3000/todos/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar tarea');
  return id;
};

const clearCompleted = async () => {
  const res = await fetch('http://localhost:3000/todos/completed', {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al limpiar tareas completadas');
  return true;
};

export function useTodos(refetchInterval) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    keepPreviousData: true,
    refetchInterval: refetchInterval ? refetchInterval * 1000 : false,
  });

  const add = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] })
  });

  const edit = useMutation({
    mutationFn: editTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] })
  });

  const toggle = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] })
  });

  const remove = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] })
  });

  const clear = useMutation({
    mutationFn: clearCompleted,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] })
  });

  return {
    ...query,
    addTodo: add.mutate,
    addTodoAsync: add.mutateAsync,
    editTodo: edit.mutate,
    editTodoAsync: edit.mutateAsync,
    toggleTodo: toggle.mutate,
    toggleTodoAsync: toggle.mutateAsync,
    deleteTodo: remove.mutate,
    deleteTodoAsync: remove.mutateAsync,
    clearCompleted: clear.mutate,
    clearCompletedAsync: clear.mutateAsync,
    isAdding: add.isLoading,
    isEditing: edit.isLoading,
    isToggling: toggle.isLoading,
    isDeleting: remove.isLoading,
    isClearing: clear.isLoading,
  };
} 