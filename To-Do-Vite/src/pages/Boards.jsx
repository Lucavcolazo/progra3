import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardsQuery } from '../hooks/useBoardsQuery';
import { useToast } from '../context/ToastContext';
import PageLayout from '../components/PageLayout';

const Boards = () => {
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardCategory, setNewBoardCategory] = useState('Personal');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    boardsQuery: { data: boards = [], isLoading, error },
    createBoardMutation,
    deleteBoardMutation
  } = useBoardsQuery();

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      try {
        await createBoardMutation.mutateAsync(
          { name: newBoardName, category: newBoardCategory },
          {
            onSuccess: () => {
              addToast('Tablero creado exitosamente', 'success');
              setNewBoardName('');
            },
            onError: () => {
              addToast('Error al crear el tablero', 'error');
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteBoard = async (boardName) => {
    try {
      await deleteBoardMutation.mutateAsync(boardName, {
        onSuccess: () => {
          addToast('Tablero eliminado exitosamente', 'success');
        },
        onError: () => {
          addToast('Error al eliminar el tablero', 'error');
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBoards = boards.filter(board => {
    if (filter === 'all') return true;
    return board.category === filter;
  });

  if (isLoading) {
    return (
      <PageLayout title="Mis Tableros">
        <div className="text-white text-xl text-center">Cargando tableros...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Mis Tableros">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
          Error al cargar los tableros
        </div>
      )}

      <form onSubmit={handleCreateBoard} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Nuevo tablero..."
            className="flex-1 p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
          />
          <select
            value={newBoardCategory}
            onChange={(e) => setNewBoardCategory(e.target.value)}
            className="p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
          >
            <option value="Personal">Personal</option>
            <option value="Universidad">Universidad</option>
          </select>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Crear
          </button>
        </div>
      </form>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'all' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('Personal')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'Personal' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Personal
        </button>
        <button
          onClick={() => setFilter('Universidad')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'Universidad' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Universidad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBoards.map(board => (
          <div
            key={board.name}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{board.name}</h3>
                <span className="text-white/60 text-sm">{board.category}</span>
              </div>
              <button
                onClick={() => handleDeleteBoard(board.name)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Eliminar
              </button>
            </div>
            <button
              onClick={() => navigate(`/board/${board.name}`)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Ver Tareas
            </button>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Boards; 