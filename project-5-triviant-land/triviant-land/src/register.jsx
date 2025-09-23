import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RegisterForm from './components/register.jsx'
import './components/css/register.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RegisterForm />
    </StrictMode>,
)
