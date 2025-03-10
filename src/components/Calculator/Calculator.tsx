import './Calculator.css'
import CalculatorDisplay from '../CalculatorDisplay/CalculatorDisplay'
import CalculatorTable from '../CalculatorTable/CalculatorTable'
import useSessionStorage from '../../hooks/useSessionStorage'

const Calculator = () => {
    const [sessionStorageValueInput, setSessionStorageValueInput] =
        useSessionStorage(
            'display',
            'The Calculator Is Waiting For Your Actions.'
        )
    const [sessionStorageValueOutput, setSessionStorageValueOutput] =
        useSessionStorage('result', '')

    return (
        <div className="calculator-container">
            <CalculatorDisplay
                sessionStorageValueInput={sessionStorageValueInput}
                sessionStorageValueOutput={sessionStorageValueOutput}
            />
            <CalculatorTable
                setSessionStorageValueInput={setSessionStorageValueInput}
                setSessionStorageValueOutput={setSessionStorageValueOutput}
            />
        </div>
    )
}

export default Calculator
