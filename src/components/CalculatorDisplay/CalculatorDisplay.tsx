import React, { useEffect, useState } from 'react'
import './CalculatorDisplay.css'

const initialDisplayValue = 'Result to be displayed'

const CalculatorDisplay = () => {
    const [toBeDisplayed, setToBeDisplayed] = useState(initialDisplayValue)

    useEffect(() => {
        setToBeDisplayed(localStorage.getItem('display') || 'fallback text')
    }, [localStorage.getItem('display')])

    return <div>{toBeDisplayed}</div>
}

export default CalculatorDisplay
