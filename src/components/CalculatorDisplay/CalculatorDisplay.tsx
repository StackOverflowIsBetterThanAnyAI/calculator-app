import React, { FC } from 'react'
import './CalculatorDisplay.css'

//const initialDisplayValue = 'Result to be displayed'

type Props = {
    localStorageValue: string
}

const CalculatorDisplay: FC<Props> = ({ localStorageValue }) => {
    /*const [toBeDisplayed, setToBeDisplayed] = useState(initialDisplayValue)

    useEffect(() => {
        setToBeDisplayed(localStorage.getItem('display') || 'fallback text')
    }, [localStorage.getItem('display')])*/

    return <div>{localStorageValue}</div>
}

export default CalculatorDisplay
