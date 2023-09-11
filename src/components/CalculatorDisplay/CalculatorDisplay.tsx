import React, { FC } from 'react'
import './CalculatorDisplay.css'

type Props = {
    localStorageValueInput: string
    localStorageValueOutput: string
}

const CalculatorDisplay: FC<Props> = ({
    localStorageValueInput,
    localStorageValueOutput,
}) => {
    return (
        <div className="calculatorDisplay">
            {localStorageValueInput} <br />
            {localStorageValueOutput}
        </div>
    )
}

export default CalculatorDisplay
