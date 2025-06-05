import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';

const PageLayout = ({ children, title, showBackButton = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-purple-300 transition-colors"
              >
                Volver
              </button>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout; 