import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageLayout title="¡Hola, Luca!" showBackButton={false}>
      <div className="text-center">
        <p className="text-white/80 mb-8 text-lg">Bienvenido a tu gestor de tareas</p>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/boards')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Ver Tableros
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Configuraciones
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home; 