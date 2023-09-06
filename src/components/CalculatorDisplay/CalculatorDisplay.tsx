import React, { useEffect, useState } from 'react'
import './CalculatorDisplay.css'

localStorage.setItem('display', 'Result to be Displayed')

const CalculatorDisplay = () => {
    const [toBeDisplayed, setToBeDisplayed] = useState('')

    useEffect(() => {
        setToBeDisplayed(localStorage.getItem('display') || 'fallback text')
    }, [])

    const a = 'Hans'
    localStorage.setItem('display', a)

    return <div>{toBeDisplayed}</div>
}

export default CalculatorDisplay
