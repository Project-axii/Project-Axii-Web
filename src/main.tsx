import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './pages/App.tsx'
import  {ThemeProvider } from './components/theme/theme-context.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider> 
  </StrictMode>,
)
