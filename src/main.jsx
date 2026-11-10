import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import EmployeePortal from './app/EmployeePortal.jsx'
import './app/styles.css'

function ProjectRouter() {
  return window.location.pathname.replace(/\/$/, '') === '/employee' ? <EmployeePortal /> : <App />
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProjectRouter />
  </React.StrictMode>,
)
