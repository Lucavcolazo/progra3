export default function ErrorMessage({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="flex items-center justify-center my-4 animate-fadeIn">
      <div className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4">
        <span className="font-semibold">{message}</span>
        {onClose && (
          <button className="text-white/80 hover:text-white text-lg" onClick={onClose}>&times;</button>
        )}
      </div>
    </div>
  );
} 