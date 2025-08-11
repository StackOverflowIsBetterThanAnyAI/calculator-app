import { useEffect } from 'react'

export const useKeyboardInput = (
    addArithmeticOperator: (
        displayedText: string | null,
        buttonText: string
    ) => string,
    addParantheses: (displayedText: string | null) => void,
    allowCommaUsage: (displayedText: string | null) => boolean,
    checkForAlgebraicSign: (displayedText: string | null) => void,
    displayResult: (displayedText: string | null) => void,
    displayedText: string | null,
    handleNumberInput: (
        displayedText: string | null,
        buttonText: number
    ) => void,
    setSessionStorageValueInput: (newValue: string) => void,
    setSessionStorageValueOutput: (newValue: string) => void
) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                displayedText &&
                displayedText?.length > 48 &&
                !['Delete', 'Backspace'].includes(e.key)
            ) {
                return
            }
            if (
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(
                    e.key
                )
            ) {
                handleNumberInput(displayedText, parseInt(e.key))
                setSessionStorageValueOutput('')
            }
            if (e.key === ',' && allowCommaUsage(displayedText)) {
                setSessionStorageValueInput(displayedText + e.key.toString())
                setSessionStorageValueOutput('')
            }
            if (['+', '-', '/', '*', 'x'].includes(e.key)) {
                displayedText !== null &&
                    setSessionStorageValueInput(
                        displayedText +
                            addArithmeticOperator(
                                displayedText,
                                e.key.replace(/\*/g, 'x')
                            )
                    )
                setSessionStorageValueOutput('')
            }
            if (e.key === '(' || e.key === ')') {
                addParantheses(displayedText)
                setSessionStorageValueOutput('')
            }
            if (e.key === 'Control') {
                checkForAlgebraicSign(displayedText)
                setSessionStorageValueOutput('')
            }
            if (e.key === 'Backspace') {
                setSessionStorageValueInput(
                    displayedText?.slice(0, displayedText.length - 1) || ''
                )
                setSessionStorageValueOutput('')
            }
            if (e.key === 'Delete') {
                setSessionStorageValueOutput('')
                setSessionStorageValueInput('')
            }
            if (e.key === 'Enter') {
                e.preventDefault()
                displayResult(displayedText)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [
        addArithmeticOperator,
        addParantheses,
        allowCommaUsage,
        checkForAlgebraicSign,
        displayResult,
        displayedText,
        handleNumberInput,
        setSessionStorageValueInput,
        setSessionStorageValueOutput,
    ])
}
