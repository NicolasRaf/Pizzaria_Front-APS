import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import dotenv from 'dotenv';
import App from './App.tsx'

dotenv.config();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


