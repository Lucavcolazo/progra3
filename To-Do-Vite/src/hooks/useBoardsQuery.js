import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoards, createBoard, deleteBoard } from '../config/api';

export function useBoardsQuery() {
  const queryClient = useQueryClient();

  // Obtener tableros
  const boardsQuery = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  });

  // Crear tablero
  const createBoardMutation = useMutation({
    mutationFn: ({ name, category }) => createBoard(name, category),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });

  // Eliminar tablero
  const deleteBoardMutation = useMutation({
    mutationFn: (boardName) => deleteBoard(boardName),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
  });

  return {
    boardsQuery,
    createBoardMutation,
    deleteBoardMutation,
  };
} 