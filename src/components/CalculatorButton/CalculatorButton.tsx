import './CalculatorButton.css'
import { FC, MouseEventHandler } from 'react'

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
                data-testid={`button-${buttonText}`}
            >
                {buttonText}
            </button>
        </span>
    )
}

export default CalculatorButton
