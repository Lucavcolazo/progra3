import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit, isEditing, onSaveEdit, onCancelEdit, uppercase }) {
  const [editText, setEditText] = useState(todo.text);

  if (isEditing) {
    return (
      <li className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl mb-3 border border-white/30 group shadow">
        <input
          className="flex-1 px-3 py-2 rounded-lg border border-purple-900/30 focus:outline-none focus:border-purple-900 text-purple-900 bg-white"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSaveEdit(editText); if (e.key === 'Escape') onCancelEdit(); }}
        />
        <button
          className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white ml-1 transition-colors"
          onClick={() => onSaveEdit(editText)}
          title="Guardar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 text-purple-900 ml-1 transition-colors"
          onClick={onCancelEdit}
          title="Cancelar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl mb-3 hover:bg-white transition-all duration-200 border border-white/30 group shadow">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-200
          ${todo.completed ? 'bg-white border-purple-600' : 'bg-transparent border-white/70 hover:bg-purple-100'}
        `}
        aria-label={todo.completed ? 'Desmarcar tarea' : 'Completar tarea'}
      >
        {todo.completed ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 group-hover:text-green-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )}
      </button>
      <span 
        className={`flex-1 text-purple-900 text-lg ${
          todo.completed ? 'line-through opacity-60' : ''
        }`}
      >
        {uppercase ? todo.text.toUpperCase() : todo.text}
      </span>
      <button
        className="p-2 rounded-full bg-white/60 hover:bg-purple-100 text-purple-900 ml-1 transition-colors"
        onClick={() => onEdit(todo)}
        title="Editar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
        </svg>
      </button>
      <button 
        onClick={() => onDelete(todo.id)}
        className="opacity-80 hover:opacity-100 transition-opacity duration-200 text-white bg-white/60 hover:bg-red-200 rounded-full p-2 shadow ml-1"
        aria-label="Eliminar tarea"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-900 group-hover:text-red-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  );
} 