
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Draaien from './components/Wheel'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Draaien />
  </StrictMode>,
)
