import React from 'react'
import CalculatorDisplay from '../CalculatorDisplay/CalculatorDisplay'
import CalculatorTable from '../CalculatorTable/CalculatorTable'
import './Calculator.css'
import useLocalStorage from '../../hooks/useLocalStorage'

const Calculator = () => {
    const [localStorageValueInput, setLocalStorageValueInput] = useLocalStorage(
        'display',
        'The Calculator Is Waiting For Your Actions.'
    )
    const [localStorageValueOutput, setLocalStorageValueOutput] =
        useLocalStorage('result', '')

    return (
        <div className="calculator-container">
            <CalculatorDisplay
                localStorageValueInput={localStorageValueInput}
                localStorageValueOutput={localStorageValueOutput}
            />
            <CalculatorTable
                setLocalStorageValueInput={setLocalStorageValueInput}
                setLocalStorageValueOutput={setLocalStorageValueOutput}
            />
        </div>
    )
}

export default Calculator
