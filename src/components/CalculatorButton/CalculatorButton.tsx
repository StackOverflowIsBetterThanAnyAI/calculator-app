import React, { FC } from 'react'
import './CalculatorButton.css'

type Props = {
    bgColor: string
    text: string
}
const CalculatorButton: FC<Props> = ({ bgColor, text }) => {
    return (
        <span className="calculatorButton" style={{ background: bgColor }}>
            {text}
        </span>
    )
}

export default CalculatorButton
