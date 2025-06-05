function TodoFilters({ currentFilter, onFilterChange, onClearCompleted, completedCount = 0 }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      <button
        className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
          currentFilter === 'all'
            ? 'bg-white/20 text-white'
            : 'bg-white/5 text-white/70 hover:bg-white/10'
        }`}
        onClick={() => onFilterChange('all')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        Todas
      </button>
      <button
        className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
          currentFilter === 'active'
            ? 'bg-white/20 text-white'
            : 'bg-white/5 text-white/70 hover:bg-white/10'
        }`}
        onClick={() => onFilterChange('active')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Activas
      </button>
      <button
        className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
          currentFilter === 'completed'
            ? 'bg-white/20 text-white'
            : 'bg-white/5 text-white/70 hover:bg-white/10'
        }`}
        onClick={() => onFilterChange('completed')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Completadas
      </button>
      <button 
        onClick={onClearCompleted}
        className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-40"
        disabled={completedCount === 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Limpiar Completadas
      </button>
    </div>
  )
}

export default TodoFilters 