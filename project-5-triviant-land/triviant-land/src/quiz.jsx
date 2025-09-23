import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Question from './components/Question'
import './quiz.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Question />
  </StrictMode>,
)
