import './CalculatorButton.css'
import { FC, MouseEventHandler } from 'react'

type CalculatorButtonProps = {
    bgColor: string
    buttonText: string | number
    handleClick: MouseEventHandler
}

const CalculatorButton: FC<CalculatorButtonProps> = ({
    bgColor,
    buttonText,
    handleClick,
}) => {
    return (
        <span>
            <button
                className="calculatorButton"
                onClick={handleClick}
                style={{ background: bgColor }}
                data-testid={`button-${buttonText}`}
            >
                {buttonText}
            </button>
        </span>
    )
}

export default CalculatorButton
