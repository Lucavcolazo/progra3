export default function Pagination({ page, total, limit, setPage }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        className="px-3 py-1 rounded bg-white/70 text-purple-900 font-bold disabled:opacity-40"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        &lt;
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-purple-900 text-white' : 'bg-white/70 text-purple-900'}`}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded bg-white/70 text-purple-900 font-bold disabled:opacity-40"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        &gt;
      </button>
    </div>
  );
} 