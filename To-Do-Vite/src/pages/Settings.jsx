import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import PageLayout from '../components/PageLayout';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState({
    refetchInterval: settings.refetchInterval,
    uppercase: settings.uppercase
  });

  useEffect(() => {
    setLocalSettings({
      refetchInterval: settings.refetchInterval,
      uppercase: settings.uppercase
    });
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
  };

  const handleIntervalChange = (e) => {
    const value = Math.max(1, Math.min(60, parseInt(e.target.value) || 10));
    setLocalSettings(prev => ({ ...prev, refetchInterval: value }));
  };

  return (
    <PageLayout title="Configuraciones">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-white text-lg">
            Intervalo de Actualización (segundos)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.refetchInterval}
              onChange={handleIntervalChange}
              className="w-24 p-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
            />
            <span className="text-white/60 text-sm">(1-60 segundos)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-white text-lg">Mostrar texto en mayúsculas</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.uppercase}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, uppercase: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </PageLayout>
  );
};

export default Settings; 