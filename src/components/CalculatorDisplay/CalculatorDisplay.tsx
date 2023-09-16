import React, { FC } from 'react'
import './CalculatorDisplay.css'
import BlinkingCursor from '../BlinkingCursor/BlinkingCursor'

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
            {localStorageValueInput}
            <BlinkingCursor />
            <br />
            <span className="calculatorDisplay-result">
                {localStorageValueOutput}
            </span>
        </div>
    )
}

export default CalculatorDisplay
