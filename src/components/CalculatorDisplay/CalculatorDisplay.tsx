import './CalculatorDisplay.css'
import BlinkingCursor from '../BlinkingCursor/BlinkingCursor'
import { FC } from 'react'

type Props = {
    sessionStorageValueInput: string
    sessionStorageValueOutput: string
}

const CalculatorDisplay: FC<Props> = ({
    sessionStorageValueInput,
    sessionStorageValueOutput,
}) => {
    return (
        <div className="calculatorDisplay" data-testid="display">
            <div style={{ flexDirection: 'column' }}>
                {sessionStorageValueInput}
                <BlinkingCursor />
            </div>
            <span className="calculatorDisplay-result">
                {sessionStorageValueOutput}
            </span>
        </div>
    )
}

export default CalculatorDisplay
