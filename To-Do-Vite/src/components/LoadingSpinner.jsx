export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fadeIn">
      <div className="w-10 h-10 border-4 border-purple-900 border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-white text-lg font-semibold drop-shadow">{message}</span>
    </div>
  );
} 