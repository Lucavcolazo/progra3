import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Estado de los modales
  isSettingsModalOpen: false,
  isCreateBoardModalOpen: false,
  isEditTaskModalOpen: false,
  
  // Estado de filtros
  activeFilter: 'all',
  activeCategory: 'all',
  
  // Estado de paginación
  currentPage: 1,
  itemsPerPage: 4,
  
  // Acciones para modales
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),
  openCreateBoardModal: () => set({ isCreateBoardModalOpen: true }),
  closeCreateBoardModal: () => set({ isCreateBoardModalOpen: false }),
  openEditTaskModal: () => set({ isEditTaskModalOpen: true }),
  closeEditTaskModal: () => set({ isEditTaskModalOpen: false }),
  
  // Acciones para filtros
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  // Acciones para paginación
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ itemsPerPage: items }),
  
  // Reset del estado
  resetUIState: () => set({
    isSettingsModalOpen: false,
    isCreateBoardModalOpen: false,
    isEditTaskModalOpen: false,
    activeFilter: 'all',
    activeCategory: 'all',
    currentPage: 1,
    itemsPerPage: 4
  })
}));

export default useUIStore; 