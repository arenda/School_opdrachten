import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginForm from './components/login.jsx'
import './components/css/login.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <LoginForm />
    </StrictMode>,
)
