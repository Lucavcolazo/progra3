import React, { useContext } from 'react'
import { SettingsContext } from './context/SettingsContext'
import { Link } from '@tanstack/react-router'

const Settings = () => {
  const { refetchInterval, setRefetchInterval, uppercase, setUppercase } = useContext(SettingsContext)

  return (
    <>
      {/* Fondo animado */}
      <div className="bg-animated-gradient"></div>
      {/* Burbujas animadas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${6 + Math.random() * 10}px`,
              height: `${6 + Math.random() * 10}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-${Math.random() * 20}px`,
              animation: `bubbleUp ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      {/* Contenido principal */}
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="w-full max-w-xl bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30 animate-fadeIn">
          <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-widest">Configuraciones</h2>
          <div className="mb-6">
            <label className="block text-lg text-purple-900 mb-2">
              Intervalo de Refetch de Tareas (segundos):
              <input
                type="number"
                min={1}
                value={refetchInterval}
                onChange={e => setRefetchInterval(Number(e.target.value))}
                className="ml-2 px-2 py-1 rounded border border-purple-300 focus:outline-none focus:border-purple-600"
              />
            </label>
          </div>
          <div className="mb-6">
            <label className="inline-flex items-center text-lg text-purple-900">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={e => setUppercase(e.target.checked)}
                className="mr-2"
              />
              Descripción en mayúsculas
            </label>
          </div>
          <div className="flex justify-center mt-8">
            <Link to="/home" className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors">Volver a Home</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings