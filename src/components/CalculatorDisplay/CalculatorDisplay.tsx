import React, { FC } from 'react'
import './CalculatorDisplay.css'
import BlinkingCursor from '../BlinkingCursor/BlinkingCursor'

type Props = {
    sessionStorageValueInput: string
    sessionStorageValueOutput: string
}

const CalculatorDisplay: FC<Props> = ({
    sessionStorageValueInput,
    sessionStorageValueOutput,
}) => {
    return (
        <div className="calculatorDisplay">
            {sessionStorageValueInput}
            <BlinkingCursor />
            <br />
            <span className="calculatorDisplay-result">
                {sessionStorageValueOutput}
            </span>
        </div>
    )
}

export default CalculatorDisplay
