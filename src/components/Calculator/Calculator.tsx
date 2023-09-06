import React from 'react'
import CalculatorDisplay from '../CalculatorDisplay/CalculatorDisplay'
import CalculatorTable from '../CalculatorTable/CalculatorTable'
import './Calculator.css'

const Calculator = () => {
    return (
        <div className="calculator-container">
            <CalculatorDisplay /> <CalculatorTable />
        </div>
    )
}

export default Calculator
