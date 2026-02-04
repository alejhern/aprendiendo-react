import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FiltersProvider } from './context/FiltersProvider.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FiltersProvider>
      <App />
    </FiltersProvider>
  </StrictMode>,
)
