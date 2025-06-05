import TodoItem from './TodoItem'
import { useState } from 'react'

export default function TodoList({ todos, onToggle, onDelete, onEdit, editingId, onSaveEdit, onCancelEdit, uppercase }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  if (!todos.length) {
    return <div className="text-center text-white/80 py-8">No hay tareas.</div>;
  }

  // Calcular el total de páginas
  const totalPages = Math.ceil(todos.length / itemsPerPage);
  
  // Obtener los elementos de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTodos = todos.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {currentTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            isEditing={editingId === todo.id}
            onSaveEdit={text => onSaveEdit(todo.id, text)}
            onCancelEdit={onCancelEdit}
            uppercase={uppercase}
          />
        ))}
      </ul>
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-white/80 text-purple-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
          >
            Anterior
          </button>
          <span className="px-3 py-1 bg-white/80 text-purple-900 rounded-lg">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-white/80 text-purple-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
} 