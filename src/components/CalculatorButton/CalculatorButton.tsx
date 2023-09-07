import React, { FC } from 'react'
import './CalculatorButton.css'

type Props = {
    bgColor: string
    buttonText: string | number
}

const CalculatorButton: FC<Props> = ({ bgColor, buttonText }) => {
    const handleDisplayText = (buttonText: string | number) => {
        if (buttonText === 'AC') localStorage.setItem('display', '')
        else if (
            typeof buttonText === 'number' ||
            (buttonText === ',' && localStorage.getItem('display'))
        ) {
            localStorage.setItem(
                'display',
                localStorage.getItem('display') + buttonText.toString()
            )
        }
    }
    return (
        <span>
            <button
                className="calculatorButton"
                onClick={() => {
                    handleDisplayText(buttonText)
                    console.log(localStorage.getItem('display'))
                }}
                style={{ background: bgColor }}
            >
                {buttonText}
            </button>
        </span>
    )
}

export default CalculatorButton
