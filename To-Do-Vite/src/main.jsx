import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { SettingsProvider } from './context/SettingsContext'
import './index.css'
import { ToastProvider } from './context/ToastContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SettingsProvider>
          <RouterProvider router={router} />
        </SettingsProvider>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
