import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Calculator from './components/Calculator/Calculator'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <Calculator />
    </React.StrictMode>
)
