import React, { FC, useRef } from 'react'
import CalculatorButton from '../CalculatorButton/CalculatorButton'
import './CalculatorTable.css'

type Props = {
    setLocalStorageValue: (newValue: string) => void
}

const COLOR_NUMBERS = '#f8b8a5'
const COLOR_SYMBOLS = '#f19e5b'
const COLOR_EQUALS = '#d66658'

const CalculatorTable: FC<Props> = ({ setLocalStorageValue }) => {
    // current value in local storage
    const displayedText = localStorage.getItem('display')

    // state of algebraic sign
    const signIsPositive = useRef(true)

    const handleDisplayText = (buttonText: string | number) => {
        if (typeof buttonText === 'number') {
            setLocalStorageValue(
                checkForStartingZero(displayedText) + buttonText.toString()
            )
        } else if (buttonText === ',' && allowCommaUsage(displayedText)) {
            setLocalStorageValue(displayedText + buttonText.toString())
        } else if (buttonText === 'AC') {
            setLocalStorageValue('')
            signIsPositive.current = true
        } else if (buttonText === 'DEL') {
            setLocalStorageValue(
                displayedText?.slice(0, displayedText.length - 1) || ''
            )
            if (displayedText === '') signIsPositive.current = true
        } else if (buttonText === '+/-') checkForAlgebraicSign(displayedText)
        else if (['+', '-', '/', 'x'].includes(buttonText))
            setLocalStorageValue(
                displayedText + addArithmeticOperator(displayedText, buttonText)
            )
        //else if (buttonText === '=') calculateResult(displayedText)
        else if (buttonText === '()') addParantheses(displayedText)
    }

    const checkForStartingZero = (displayedText: string | null) => {
        const splitDisplayedText = displayedText?.split(' ') || ''
        const numberToCheck = splitDisplayedText
            ? splitDisplayedText.length - 1
            : 0

        if (
            displayedText?.length === 1 &&
            displayedText.charAt(0) === '0' &&
            displayedText.charAt(1) !== ','
        )
            return displayedText.charAt(1)

        for (let i = 0; i < splitDisplayedText[numberToCheck].length; i++) {
            if (
                splitDisplayedText[numberToCheck].charAt(0) === '0' &&
                splitDisplayedText[numberToCheck].charAt(1) !== ','
            )
                return displayedText?.slice(0, displayedText.length - 1)
        }
        return displayedText
    }

    const allowCommaUsage = (displayedText: string | null) => {
        if (!displayedText) return false

        const splitDisplayedText = displayedText.split(' ')
        const numberToCheck = splitDisplayedText.length - 1

        if (!splitDisplayedText[numberToCheck].length) return false
        for (let i = 0; i < splitDisplayedText[numberToCheck].length; i++) {
            if (splitDisplayedText[numberToCheck].charAt(i) === ',')
                return false
        }
        return true
    }

    const checkForAlgebraicSign = (displayedText: string | null): void => {
        signIsPositive.current = toggleAlgebraicSign(signIsPositive.current)
        const symbol = signIsPositive.current ? '' : '-'
        if (displayedText?.charAt(0) === '-') {
            displayedText = displayedText.slice(1)
        }
        setLocalStorageValue(symbol + displayedText)
    }

    const toggleAlgebraicSign = (currentSign: boolean) => {
        return !currentSign
    }

    const addArithmeticOperator = (
        displayedText: string | null,
        buttonText: string
    ): string => {
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

    //const calculateResult = (displayedText: string | null) => {}

    const addParantheses = (displayedText: string | null) => {
        let addMultiplication = ''
        if (
            !isNaN(
                parseInt(displayedText?.charAt(displayedText.length - 1) || '')
            )
        )
            addMultiplication = ' x '
        setLocalStorageValue(`${displayedText}${addMultiplication} (`)
    }

    // TODO: still problematic: 000000 possible after arithmetic sign

    return (
        <div className="responsive-table">
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
