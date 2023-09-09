import React from 'react'
import CalculatorDisplay from '../CalculatorDisplay/CalculatorDisplay'
import CalculatorTable from '../CalculatorTable/CalculatorTable'
import './Calculator.css'
import useLocalStorage from '../../hooks/useLocalStorage'

const Calculator = () => {
    const [localStorageValue, setLocalStorageValue] = useLocalStorage(
        'display',
        'The Calculator Is Waiting For Your Actions.'
    )

    return (
        <div className="calculator-container">
            <CalculatorDisplay localStorageValue={localStorageValue} />
            <CalculatorTable setLocalStorageValue={setLocalStorageValue} />
        </div>
    )
}

export default Calculator
