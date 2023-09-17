import React, { FC, useRef } from 'react'
import CalculatorButton from '../CalculatorButton/CalculatorButton'
import './CalculatorTable.css'
import * as CalculatorLogic from '../CalculatorLogic/CalculatorLogic'

type Props = {
    setLocalStorageValueInput: (newValue: string) => void
    setLocalStorageValueOutput: (newValue: string) => void
}

const COLOR_NUMBERS: string = '#f8b8a5'
const COLOR_SYMBOLS: string = '#f19e5b'
const COLOR_EQUALS: string = '#d66658'

const CalculatorTable: FC<Props> = ({
    setLocalStorageValueInput,
    setLocalStorageValueOutput,
}) => {
    // current value in local storage
    const displayedText = localStorage.getItem('display')

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
            setLocalStorageValueOutput('')
        } else if (
            buttonText === ',' &&
            CalculatorLogic.allowCommaUsage(displayedText)
        ) {
            setLocalStorageValueInput(displayedText + buttonText.toString())
            setLocalStorageValueOutput('')
        } else if (buttonText === 'AC') {
            setLocalStorageValueOutput('')
            setLocalStorageValueInput('')
        } else if (buttonText === 'DEL') {
            setLocalStorageValueInput(
                displayedText?.slice(0, displayedText.length - 1) || ''
            )
            setLocalStorageValueOutput('')
        } else if (buttonText === '+/-') {
            checkForAlgebraicSign(displayedText)
            setLocalStorageValueOutput('')
        } else if (['+', '-', '/', 'x'].includes(buttonText)) {
            setLocalStorageValueInput(
                displayedText +
                    CalculatorLogic.addArithmeticOperator(
                        displayedText,
                        buttonText
                    )
            )
            setLocalStorageValueOutput('')
        } else if (buttonText === '()') {
            addParantheses(displayedText)
            setLocalStorageValueOutput('')
        } else if (buttonText === '=') displayResult(displayedText)
    }

    // whole logic for number inputs
    const handleNumberInput = (
        displayedText: string | null,
        buttonText: number
    ): void => {
        if (
            displayedText &&
            !isNaN(parseInt(displayedText?.charAt(displayedText.length - 2))) &&
            displayedText?.charAt(displayedText.length - 1) === ' '
        )
            return
        setLocalStorageValueInput(
            CalculatorLogic.checkForStartingZero(displayedText) +
                CalculatorLogic.checkForClosingParanthesis(displayedText) +
                CalculatorLogic.checkForDeletedSpace(displayedText) +
                buttonText.toString()
        )
    }

    // toggles the algebraic sign for the current set of numbers
    const checkForAlgebraicSign = (displayedText: string | null): void => {
        const splitText: string[] | undefined = displayedText
            ?.split(' ')
            .filter((item) => item !== '')
        // the content of the current set of numbers
        currentSetOfNumbers.current = splitText
            ? parseInt(splitText[splitText.length - 1])
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

        // if the current number of sets is not negative ...
        if (
            !splitText
                ?.toString()
                .substring(paranthesesCounter - 1)
                .startsWith('(-')
        )
            // ... set the input to the sets which have not been touched, the persisting parantheses, (- and the actual set of numbers ...
            setLocalStorageValueInput(
                `${splicedText} ${splitText
                    ?.toString()
                    .substring(0, paranthesesCounter)}(-${splitText
                    ?.toString()
                    .substring(paranthesesCounter)}`
            )
        // ... otherwise set the input to the sets which have not been touched, the persisting parantheses and the current set of numbers,
        // but remove one paranthesis and the negative sign
        else
            setLocalStorageValueInput(
                `${splicedText} ${splitText
                    .toString()
                    .substring(0, paranthesesCounter - 1)}${splitText
                    .toString()
                    .substring(paranthesesCounter - 1)
                    .slice(2)}`
            )
    }

    // whole logic for parantheses
    const addParantheses = (displayedText: string | null): void => {
        paranthesesCounter.current = {
            left: CalculatorLogic.calculateLeftParantheses(displayedText),
            right: CalculatorLogic.calculateRightParantheses(displayedText),
        }

        let addMultiplication: string = ''

        let upcomingSign: string = '('

        // right paranthesis if the amount of left parantheses is greater than the amount of the right ones
        if (paranthesesCounter.current.left > paranthesesCounter.current.right)
            upcomingSign = ')'

        // right paranthesis after number and if the amount of left parantheses is greater than the amount of the right
        if (
            paranthesesCounter.current.left >
                paranthesesCounter.current.right &&
            !isNaN(
                parseInt(displayedText?.charAt(displayedText.length - 1) || '')
            )
        )
            upcomingSign = ')'
        // left paranthesis after number and if the amount of left parantheses equals the amount of the right ones
        // x right in front of the left paranthesis right after a number and if the amount of left parantheses is euqal to the amount of right ones
        else if (
            paranthesesCounter.current.left ===
                paranthesesCounter.current.right &&
            !isNaN(
                parseInt(displayedText?.charAt(displayedText.length - 1) || '')
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
            paranthesesCounter.current.left === paranthesesCounter.current.right
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

        setLocalStorageValueInput(
            `${displayedText}${addMultiplication}${upcomingSign}`
        )
    }

    // calculates the result
    const displayResult = (displayedText: string | null): void => {
        paranthesesCounter.current = {
            left: CalculatorLogic.calculateLeftParantheses(displayedText),
            right: CalculatorLogic.calculateRightParantheses(displayedText),
        }

        // adds missing closing parantheses
        for (
            let i = 0;
            i <
            paranthesesCounter.current.left - paranthesesCounter.current.right;
            i++
        ) {
            displayedText += ')'
        }

        // removes unnecessary opening parantheses
        while (displayedText?.charAt(displayedText.length - 1) === '(') {
            displayedText = displayedText.slice(0, displayedText.length - 1)
        }

        // create array with set of numbers
        const splitText: string[] | undefined = displayedText
            ?.split(' ')
            .filter((item) => item !== '')

        CalculatorLogic.removeSetOfParantheses(splitText)
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
        CalculatorLogic.calculateResult(displayedText)
        setLocalStorageValueOutput(`Result: ${displayedText}`)
        setLocalStorageValueInput(displayedText || '')
    }

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
