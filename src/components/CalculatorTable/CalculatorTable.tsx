import { FC, useCallback, useEffect, useRef } from 'react'
import CalculatorButton from '../CalculatorButton/CalculatorButton'
import './CalculatorTable.css'
import { checkForStartingZero } from '../../calculatorLogic/checkForStartingZero'
import { checkForClosingParanthesis } from '../../calculatorLogic/checkForClosingParanthesis'
import { checkForDeletedSpace } from '../../calculatorLogic/checkForDeletedSpace'
import { allowCommaUsage } from '../../calculatorLogic/allowCommaUsage'
import { addArithmeticOperator } from '../../calculatorLogic/addArithmeticOperator'
import { calculateLeftParantheses } from '../../calculatorLogic/calculateLeftParantheses'
import { calculateRightParantheses } from '../../calculatorLogic/calculateRightParantheses'
import { removeSetOfParantheses } from '../../calculatorLogic/removeSetOfParantheses'
import { calculateResult } from '../../calculatorLogic/calculateResult'

type Props = {
    setSessionStorageValueInput: (newValue: string) => void
    setSessionStorageValueOutput: (newValue: string) => void
}

const COLOR_NUMBERS: string = '#f8b8a5'
const COLOR_SYMBOLS: string = '#f19e5b'
const COLOR_EQUALS: string = '#d66658'

type tableCharacterProps = [string | number, string]

const tableCharacters: tableCharacterProps[] = [
    ['AC', COLOR_SYMBOLS],
    ['/', COLOR_SYMBOLS],
    ['x', COLOR_SYMBOLS],
    ['DEL', COLOR_SYMBOLS],
    [7, COLOR_NUMBERS],
    [8, COLOR_NUMBERS],
    [9, COLOR_NUMBERS],
    ['-', COLOR_SYMBOLS],
    [4, COLOR_NUMBERS],
    [5, COLOR_NUMBERS],
    [6, COLOR_NUMBERS],
    ['+', COLOR_SYMBOLS],
    [1, COLOR_NUMBERS],
    [2, COLOR_NUMBERS],
    [3, COLOR_NUMBERS],
    ['()', COLOR_SYMBOLS],
    [0, COLOR_NUMBERS],
    [',', COLOR_SYMBOLS],
    ['+/-', COLOR_SYMBOLS],
    ['=', COLOR_EQUALS],
]

const CalculatorTable: FC<Props> = ({
    setSessionStorageValueInput,
    setSessionStorageValueOutput,
}) => {
    // current value in local storage
    const displayedText = sessionStorage.getItem('display')

    // ref for current set of numbers
    const currentSetOfNumbers = useRef<number>(0)

    // ref for parantheses calculations (left or right parantheses)
    const paranthesesCounter = useRef<{ left: number; right: number }>({
        left: 0,
        right: 0,
    })

    // handles what is displayed on the display
    const handleDisplayText = (buttonText: string | number): void => {
        if (typeof buttonText === 'number') {
            handleNumberInput(displayedText, buttonText)
            setSessionStorageValueOutput('')
        } else if (buttonText === ',' && allowCommaUsage(displayedText)) {
            setSessionStorageValueInput(displayedText + buttonText.toString())
            setSessionStorageValueOutput('')
        } else if (buttonText === 'AC') {
            setSessionStorageValueOutput('')
            setSessionStorageValueInput('')
        } else if (buttonText === 'DEL') {
            setSessionStorageValueInput(
                displayedText?.slice(0, displayedText.length - 1) || ''
            )
            setSessionStorageValueOutput('')
        } else if (buttonText === '+/-') {
            checkForAlgebraicSign(displayedText)
            setSessionStorageValueOutput('')
        } else if (['+', '-', '/', 'x'].includes(buttonText)) {
            displayedText !== null &&
                setSessionStorageValueInput(
                    displayedText +
                        addArithmeticOperator(displayedText, buttonText)
                )
            setSessionStorageValueOutput('')
        } else if (buttonText === '()') {
            addParantheses(displayedText)
            setSessionStorageValueOutput('')
        } else if (buttonText === '=') displayResult(displayedText)
    }

    // whole logic for number inputs
    const handleNumberInput = useCallback(
        (displayedText: string | null, buttonText: number): void => {
            if (
                displayedText &&
                !isNaN(
                    parseFloat(displayedText?.charAt(displayedText.length - 2))
                ) &&
                displayedText?.charAt(displayedText.length - 1) === ' '
            )
                return
            setSessionStorageValueInput(
                checkForStartingZero(displayedText) +
                    checkForClosingParanthesis(displayedText) +
                    checkForDeletedSpace(displayedText) +
                    buttonText.toString()
            )
        },
        [setSessionStorageValueInput]
    )

    // toggles the algebraic sign for the current set of numbers
    const checkForAlgebraicSign = useCallback(
        (displayedText: string | null): void => {
            // no actions allowed if the displayedText is equal to the default text or null
            if (!displayedText || !/\d/.test(displayedText)) return
            const splitText: string[] | undefined = displayedText
                ?.split(' ')
                .filter((item) => item !== '')
            // the content of the current set of numbers
            currentSetOfNumbers.current = splitText
                ? parseFloat(splitText[splitText.length - 1])
                : -1

            // if latest set of numbers only contains +, -, / or x, no toggle should happen
            if (
                isNaN(currentSetOfNumbers.current) &&
                splitText &&
                splitText[splitText.length - 1].length === 1
            )
                return

            // the sets which are not the current one
            const splicedText: string =
                splitText?.splice(0, splitText.length - 1).join(' ') || ''

            // calculates the amount of parantheses
            let paranthesesCounter: number = 0
            for (let i = 0; i < (splitText?.toString().length ?? 1); i++) {
                if (splitText?.toString().charAt(i) === '(') {
                    paranthesesCounter++
                } else break
            }

            // if the current number of sets is not negative / does not start with '(-' ...
            if (
                !splitText
                    ?.toString()
                    .substring(paranthesesCounter - 1)
                    .startsWith('(-')
            )
                // ... set the input to the sets which have not been touched, the persisting parantheses, (- and the actual set of numbers ...
                setSessionStorageValueInput(
                    `${splicedText} ${splitText
                        ?.toString()
                        .substring(0, paranthesesCounter)}(-${splitText
                        ?.toString()
                        .substring(paranthesesCounter)}`
                )
            // ... otherwise set the input to the sets which have not been touched, the persisting parantheses and the current set of numbers,
            // but remove one paranthesis and the negative sign
            // additionally check if the amount of left and right parantheses is the same
            // if so, also remove one closing paranthesis
            else {
                const leftParantheses = (splitText[0].match(/\(/g) || []).length
                const rightParantheses = (splitText[0].match(/\)/g) || [])
                    .length

                const invertedText = `${splicedText} ${splitText
                    .toString()
                    .substring(0, paranthesesCounter - 1)}${splitText
                    .toString()
                    .substring(paranthesesCounter - 1)
                    .slice(2)}`

                setSessionStorageValueInput(
                    leftParantheses === rightParantheses
                        ? invertedText.replace(/\)/, '')
                        : invertedText
                )
            }
        },
        [setSessionStorageValueInput]
    )

    // whole logic for parantheses
    const addParantheses = useCallback(
        (displayedText: string | null): void => {
            paranthesesCounter.current = {
                left: calculateLeftParantheses(displayedText),
                right: calculateRightParantheses(displayedText),
            }

            let addMultiplication: string = ''

            let upcomingSign: string = '('

            // right paranthesis if the amount of left parantheses is greater than the amount of the right ones
            if (
                paranthesesCounter.current.left >
                paranthesesCounter.current.right
            )
                upcomingSign = ')'

            // right paranthesis after number and if the amount of left parantheses is greater than the amount of the right
            if (
                paranthesesCounter.current.left >
                    paranthesesCounter.current.right &&
                !isNaN(
                    parseFloat(
                        displayedText?.charAt(displayedText.length - 1) || ''
                    )
                )
            )
                upcomingSign = ')'
            // left paranthesis after number and if the amount of left parantheses equals the amount of the right ones
            // x right in front of the left paranthesis right after a number and if the amount of left parantheses is euqal to the amount of right ones
            else if (
                paranthesesCounter.current.left ===
                    paranthesesCounter.current.right &&
                !isNaN(
                    parseFloat(
                        displayedText?.charAt(displayedText.length - 1) || ''
                    )
                )
            ) {
                upcomingSign = '('
                addMultiplication =
                    paranthesesCounter.current.left ===
                    paranthesesCounter.current.right
                        ? ' x '
                        : ''
            }

            // x between right and left paranthesis if the amount of left parantheses euqals the amount of right ones
            else if (
                displayedText?.charAt(displayedText.length - 1) === ')' &&
                paranthesesCounter.current.left ===
                    paranthesesCounter.current.right
            )
                addMultiplication = ' x '
            // after a left paranthesis there is always another one
            else if (displayedText?.charAt(displayedText.length - 1) === '(')
                upcomingSign = '('
            // there is a left paranthesis after an arithmetic operator
            else if (
                displayedText?.endsWith(' ') &&
                displayedText?.charAt(displayedText.length - 1) === ')'
            )
                upcomingSign = '('
            else if (
                displayedText?.endsWith(' ') &&
                displayedText?.charAt(displayedText.length - 1) !== ')'
            )
                if (
                    ['+', '-', '/', 'x'].includes(
                        displayedText?.charAt(displayedText.length - 2) || ''
                    )
                )
                    upcomingSign = '('
                else upcomingSign = 'x ('
            else if (
                ['+', '-', '/', 'x'].includes(
                    displayedText?.charAt(displayedText.length - 1) || ''
                )
            )
                upcomingSign = ' ('

            setSessionStorageValueInput(
                `${displayedText || ''}${addMultiplication}${upcomingSign}`
            )
        },
        [setSessionStorageValueInput]
    )

    // calculates the result
    const displayResult = useCallback(
        (displayedText: string | null): void => {
            paranthesesCounter.current = {
                left: calculateLeftParantheses(displayedText),
                right: calculateRightParantheses(displayedText),
            }

            // removes all arithmetic operators if they are at the end and the space was deleted
            switch (displayedText?.slice(displayedText.length - 2)) {
                case ' +':
                case ' -':
                case ' /':
                case ' x':
                    displayedText =
                        displayedText?.slice(0, displayedText?.length - 2) || ''
                    break
            }
            // removes all arithmetic operators if they are at the
            switch (displayedText?.slice(displayedText.length - 3)) {
                case ' + ':
                case ' - ':
                case ' / ':
                case ' x ':
                    displayedText =
                        displayedText?.slice(0, displayedText?.length - 3) || ''
                    break
            }

            // adds missing closing parantheses
            for (
                let i = 0;
                i <
                paranthesesCounter.current.left -
                    paranthesesCounter.current.right;
                i++
            ) {
                displayedText += ')'
            }

            // removes unnecessary opening parantheses
            while (displayedText?.charAt(displayedText.length - 1) === '(') {
                displayedText = displayedText.slice(0, displayedText.length - 1)
            }

            // removes unnecessary closing paranthesis which could have been left by toggling the algebraic sign
            if (
                displayedText?.charAt(displayedText.length - 1) === ')' &&
                paranthesesCounter.current.right ===
                    paranthesesCounter.current.left + 1
            )
                displayedText = displayedText.slice(0, displayedText.length - 1)

            // create array with set of numbers
            const splitText: string[] | undefined = displayedText
                ?.split(' ')
                .filter((item) => item !== '')

            splitText && removeSetOfParantheses(splitText)
            displayedText = splitText?.join(' ') || ''

            // removes all arithmetic operators if they are at the end
            switch (displayedText?.slice(displayedText.length - 2)) {
                case ' +':
                case ' -':
                case ' /':
                case ' x':
                    displayedText =
                        displayedText?.slice(0, displayedText?.length - 2) || ''
                    break
            }
            // removes all arithmetic operators if they are at the end and if parantheses are removed
            switch (displayedText?.slice(displayedText.length - 3)) {
                case ' + ':
                case ' - ':
                case ' / ':
                case ' x ':
                    displayedText =
                        displayedText?.slice(0, displayedText?.length - 3) || ''
                    break
            }

            // check if there are unnecessary parantheses
            displayedText =
                displayedText &&
                displayedText
                    .split(' ')
                    .map((item) => {
                        const pLeft = (item.match(/\(/g) || []).length
                        const pRight = (item.match(/\)/g) || []).length

                        if (pLeft === pRight && item.indexOf('-') === -1)
                            return item.replace(/[()]|--/g, '')
                        return item
                    })
                    .join(' ')

            displayedText &&
                setSessionStorageValueOutput(
                    isNaN(parseFloat(calculateResult(displayedText))) ||
                        calculateResult(displayedText) === 'Infinity'
                        ? `Please do not devide by zero.`
                        : `Result: ${calculateResult(displayedText)}`
                )
            setSessionStorageValueInput(displayedText || '')
        },
        [setSessionStorageValueInput, setSessionStorageValueOutput]
    )

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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
        addParantheses,
        checkForAlgebraicSign,
        displayResult,
        displayedText,
        handleNumberInput,
        setSessionStorageValueInput,
        setSessionStorageValueOutput,
    ])

    useEffect(() => {
        const handleFocusTrap = (e: KeyboardEvent) => {
            const focusableButtons = Array.from(
                document.querySelectorAll('button')
            )
            const firstButton = focusableButtons[0]
            const lastButton = focusableButtons[focusableButtons.length - 1]
            const buttonRows = Math.ceil(tableCharacters.length / 4)

            // current button
            const findButtonIndex = (button: HTMLButtonElement) =>
                focusableButtons.indexOf(button)

            // focus button because of its index
            const focusButtonAtIndex = (index: number) => {
                if (index >= 0 && index < focusableButtons.length) {
                    focusableButtons[index]?.focus()
                }
            }

            if (
                e.key === 'Tab' &&
                !e.shiftKey &&
                document.activeElement === lastButton
            ) {
                e.preventDefault()
                firstButton?.focus()
            }

            if (
                e.key === 'Tab' &&
                e.shiftKey &&
                document.activeElement === firstButton
            ) {
                e.preventDefault()
                lastButton?.focus()
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                const currentIndex = findButtonIndex(
                    document.activeElement as HTMLButtonElement
                )
                const nextRowStartIndex = (currentIndex / 4 + 1) * 4
                if (nextRowStartIndex < focusableButtons.length) {
                    focusButtonAtIndex(nextRowStartIndex)
                } else {
                    focusButtonAtIndex(currentIndex - (buttonRows - 1) * 4)
                }
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault()
                const currentIndex = findButtonIndex(
                    document.activeElement as HTMLButtonElement
                )
                const previousRowStartIndex = (currentIndex / 4 - 1) * 4
                if (previousRowStartIndex >= 0) {
                    focusButtonAtIndex(previousRowStartIndex)
                } else {
                    focusButtonAtIndex(currentIndex + (buttonRows - 1) * 4)
                }
            }

            if (e.key === 'ArrowRight') {
                e.preventDefault()
                const currentIndex = findButtonIndex(
                    document.activeElement as HTMLButtonElement
                )
                const nextIndex =
                    currentIndex % 4 === 3 ? currentIndex - 3 : currentIndex + 1
                if (nextIndex < focusableButtons.length) {
                    focusButtonAtIndex(nextIndex)
                }
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                const currentIndex = findButtonIndex(
                    document.activeElement as HTMLButtonElement
                )
                const prevIndex =
                    currentIndex % 4 === 0 ? currentIndex + 3 : currentIndex - 1
                if (prevIndex >= 0) {
                    focusButtonAtIndex(prevIndex)
                }
            }
        }

        document.addEventListener('keydown', handleFocusTrap)

        return () => {
            document.removeEventListener('keydown', handleFocusTrap)
        }
    }, [])

    return (
        <div className="calculatorTable">
            <table cellSpacing={0}>
                <tbody>
                    {Array.from({
                        length: Math.ceil(tableCharacters.length / 4),
                    }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {tableCharacters
                                .slice(rowIndex * 4, rowIndex * 4 + 4)
                                .map((item, columnIndex) => (
                                    <td key={columnIndex}>
                                        <CalculatorButton
                                            bgColor={item[1]}
                                            buttonText={item[0]}
                                            onClick={() => {
                                                handleDisplayText(item[0])
                                            }}
                                        />
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default CalculatorTable
