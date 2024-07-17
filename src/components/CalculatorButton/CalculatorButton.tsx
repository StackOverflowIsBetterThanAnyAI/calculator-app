import { FC, MouseEventHandler } from 'react'
import './CalculatorButton.css'

type Props = {
    bgColor: string
    buttonText: string | number
    onClick: MouseEventHandler
}

const CalculatorButton: FC<Props> = ({ bgColor, buttonText, onClick }) => {
    return (
        <span>
            <button
                className="calculatorButton"
                onClick={onClick}
                style={{ background: bgColor }}
            >
                {buttonText}
            </button>
        </span>
    )
}

export default CalculatorButton
