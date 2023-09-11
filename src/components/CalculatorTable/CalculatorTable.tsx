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

    // ref of algebraic sign (positive or negative value)
    const signIsPositive = useRef<boolean>(true)

    // ref for parantheses calculations (left or right parantheses)
    const paranthesesCounter = useRef<{ left: number; right: number }>({
        left: 0,
        right: 0,
    })
    const leftParenthesis = useRef<boolean>(true)

    // handles what is displayed on the display
    const handleDisplayText = (buttonText: string | number): void => {
        if (typeof buttonText === 'number') {
            setLocalStorageValueInput(
                checkForStartingZero(displayedText) + buttonText.toString()
            )
        } else if (buttonText === ',' && allowCommaUsage(displayedText)) {
            setLocalStorageValueInput(displayedText + buttonText.toString())
        } else if (buttonText === 'AC') {
            setLocalStorageValueInput('')
            signIsPositive.current = true
        } else if (buttonText === 'DEL') {
            setLocalStorageValueInput(
                displayedText?.slice(0, displayedText.length - 1) || ''
            )
            if (displayedText === '') signIsPositive.current = true
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

    // chekcs if the user is allowed to use a Comma
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

    // toggles the algebraic sign of the first set of numbers, TODO: change it for every set
    const checkForAlgebraicSign = (displayedText: string | null): void => {
        signIsPositive.current = toggleAlgebraicSign(signIsPositive.current)
        const symbol = signIsPositive.current ? '' : '-'

        if (displayedText?.charAt(0) === '-') {
            displayedText = displayedText.slice(1)
        }
        setLocalStorageValueInput(symbol + displayedText)
    }

    // toggles the state for the algebraic sign
    const toggleAlgebraicSign = (currentSign: boolean) => {
        return !currentSign
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
            displayedText.charAt(displayedText.length - 1) !== ' '
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

        if (
            paranthesesCounter.current.left === paranthesesCounter.current.right
        )
            leftParenthesis.current = true

        let upcomingSign = leftParenthesis.current ? '(' : ')'

        // whenever the user wants to have left parantheses and the last block is just
        // a set of numbers, a multiplication is added right in front of the parantheses
        if (
            !isNaN(
                parseInt(displayedText?.charAt(displayedText.length - 1) || '')
            ) ||
            paranthesesCounter.current.left === paranthesesCounter.current.right
        )
            if (
                paranthesesCounter.current.left ===
                paranthesesCounter.current.right
            ) {
                addMultiplication = displayedText ? ' x ' : ''
            } else {
                upcomingSign = ')'
            }
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

    const calculateResult = (displayedText: string | null): void => {
        setLocalStorageValueOutput(`The result from ${displayedText} is 5.`)
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
