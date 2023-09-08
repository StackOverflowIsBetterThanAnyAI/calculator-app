import React, { FC } from 'react'
import './CalculatorDisplay.css'

type Props = {
    localStorageValue: string
}

const CalculatorDisplay: FC<Props> = ({ localStorageValue }) => {
    return <div>{localStorageValue}</div>
}

export default CalculatorDisplay
