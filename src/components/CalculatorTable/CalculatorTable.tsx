import React, { FC, useRef } from 'react'
import CalculatorButton from '../CalculatorButton/CalculatorButton'
import './CalculatorTable.css'

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
        } else if (buttonText === ',' && allowCommaUsage(displayedText)) {
            setLocalStorageValueInput(displayedText + buttonText.toString())
        } else if (buttonText === 'AC') {
            setLocalStorageValueOutput('')
            setLocalStorageValueInput('')
        } else if (buttonText === 'DEL') {
            setLocalStorageValueInput(
                displayedText?.slice(0, displayedText.length - 1) || ''
            )
        } else if (buttonText === '+/-') checkForAlgebraicSign(displayedText)
        else if (['+', '-', '/', 'x'].includes(buttonText))
            setLocalStorageValueInput(
                displayedText + addArithmeticOperator(displayedText, buttonText)
            )
        else if (buttonText === '()') addParantheses(displayedText)
        else if (buttonText === '=') calculateResult(displayedText)
    }

    // checks if the user is allowed to type '0' or not
    const checkForStartingZero = (displayedText: string | null): string => {
        const splitDisplayedText = displayedText?.split(' ') || ''
        const numberToCheck = splitDisplayedText
            ? splitDisplayedText.length - 1
            : 0

        // the latest set of numbers is checked if it starts with a '0' and a Comma
        for (let i = 0; i < splitDisplayedText[numberToCheck].length; i++) {
            if (
                splitDisplayedText[numberToCheck].charAt(0) === '0' &&
                splitDisplayedText[numberToCheck].charAt(1) !== ','
            )
                // latest typed '0' is removed
                return displayedText?.slice(0, displayedText.length - 1) || ''
        }
        // change nothing
        return displayedText || ''
    }

    // checks if last Character is ')'
    const checkForClosingParanthesis = (
        displayedText: string | null
    ): string => {
        if (displayedText?.charAt(displayedText.length - 1) === ')')
            return ' x '
        return ''
    }

    // checks if space after arithmetic operator has been deleted
    const checkForDeletedSpace = (displayedText: string | null): string => {
        if (
            displayedText &&
            ['+', '-', '/', 'x'].includes(
                displayedText?.charAt(displayedText.length - 1)
            )
        )
            return ' '
        return ''
    }

    // whole logic for number inputs
    const handleNumberInput = (
        displayedText: string | null,
        buttonText: number
    ): void => {
        setLocalStorageValueInput(
            checkForStartingZero(displayedText) +
                checkForClosingParanthesis(displayedText) +
                checkForDeletedSpace(displayedText) +
                buttonText.toString()
        )
    }

    // checks if the user is allowed to use a Comma
    const allowCommaUsage = (displayedText: string | null): boolean => {
        // no Comma is allowed in the beginning of a new set of numbers
        if (!displayedText) return false

        const splitDisplayedText = displayedText.split(' ')
        const numberToCheck = splitDisplayedText.length - 1

        if (!splitDisplayedText[numberToCheck].length) return false
        for (let i = 0; i < splitDisplayedText[numberToCheck].length; i++) {
            // there is only one single Comma allowed in each set of numbers
            if (splitDisplayedText[numberToCheck].charAt(i) === ',')
                return false
        }
        return true
    }

    // toggles the algebraic sign for the current set of numbers
    const checkForAlgebraicSign = (displayedText: string | null): void => {
        const splitText = displayedText
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
        let paranthesesCounter = 0
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

    // logic for the four arithmetic operators + - / x
    const addArithmeticOperator = (
        displayedText: string | null,
        buttonText: string
    ): string => {
        // in case there is no number after a Comma,
        // a '0' is added right in front of the arithmetic operator
        const lastCharIsComma =
            displayedText?.charAt(displayedText.length - 1) === ','
        const returnText = lastCharIsComma
            ? `0 ${buttonText} `
            : ` ${buttonText} `
        return displayedText &&
            ![' ', '(', '+', '-', '/', 'x'].includes(
                displayedText.charAt(displayedText.length - 1)
            )
            ? returnText
            : ''
    }

    // whole logic for parantheses
    const addParantheses = (displayedText: string | null): void => {
        paranthesesCounter.current = {
            left: calculateLeftParantheses(displayedText),
            right: calculateRightParantheses(displayedText),
        }

        let addMultiplication = ''

        let upcomingSign = '('

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

    // counts the number of left parantheses
    const calculateLeftParantheses = (displayedText: string | null): number => {
        if (!displayedText) return -1
        let counterLeftParantheses = 0
        for (let i = 0; i < displayedText.length; i++) {
            if (displayedText.charAt(i) === '(') counterLeftParantheses++
        }
        return counterLeftParantheses
    }

    // counts the number of right parantheses
    const calculateRightParantheses = (
        displayedText: string | null
    ): number => {
        if (!displayedText) return -1
        let counterRightParantheses = 0
        for (let i = 0; i < displayedText.length; i++) {
            if (displayedText.charAt(i) === ')') counterRightParantheses++
        }
        return counterRightParantheses
    }

    // calculates the result
    const calculateResult = (displayedText: string | null): void => {
        paranthesesCounter.current = {
            left: calculateLeftParantheses(displayedText),
            right: calculateRightParantheses(displayedText),
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

        // removes unnecessary set of parantheses
        if (displayedText?.slice(displayedText.length - 2) === '()')
            displayedText =
                displayedText?.slice(0, displayedText?.length - 2) || ''

        // removes all arithmetic operators if they are at the end
        switch (displayedText?.slice(displayedText.length - 3)) {
            case ' + ':
            case ' - ':
            case ' / ':
            case ' x ':
                displayedText =
                    displayedText?.slice(0, displayedText?.length - 3) || ''
                break
        }
        setLocalStorageValueOutput(`result: ${displayedText} is 5.`)
        setLocalStorageValueInput(displayedText || '')
    }

    return (
        <div className="calculatorTable">
            <table cellSpacing={0}>
                <tbody>
                    <tr>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="AC"
                                onClick={() => {
                                    handleDisplayText('AC')
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="/"
                                onClick={() => {
                                    handleDisplayText('/')
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="x"
                                onClick={() => {
                                    handleDisplayText('x')
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="DEL"
                                onClick={() => {
                                    handleDisplayText('DEL')
                                }}
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={7}
                                onClick={() => {
                                    handleDisplayText(7)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={8}
                                onClick={() => {
                                    handleDisplayText(8)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={9}
                                onClick={() => {
                                    handleDisplayText(9)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="-"
                                onClick={() => {
                                    handleDisplayText('-')
                                }}
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={4}
                                onClick={() => {
                                    handleDisplayText(4)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={5}
                                onClick={() => {
                                    handleDisplayText(5)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={6}
                                onClick={() => {
                                    handleDisplayText(6)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="+"
                                onClick={() => {
                                    handleDisplayText('+')
                                }}
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={1}
                                onClick={() => {
                                    handleDisplayText(1)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={2}
                                onClick={() => {
                                    handleDisplayText(2)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={3}
                                onClick={() => {
                                    handleDisplayText(3)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="()"
                                onClick={() => {
                                    handleDisplayText('()')
                                }}
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={0}
                                onClick={() => {
                                    handleDisplayText(0)
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText=","
                                onClick={() => {
                                    handleDisplayText(',')
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="+/-"
                                onClick={() => {
                                    handleDisplayText('+/-')
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_EQUALS}
                                buttonText="="
                                onClick={() => {
                                    handleDisplayText('=')
                                }}
                            />
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default CalculatorTable
