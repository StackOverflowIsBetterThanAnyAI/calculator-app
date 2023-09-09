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
        } else if (buttonText === 'AC') setLocalStorageValue('')
        else if (buttonText === 'DEL')
            setLocalStorageValue(
                displayedText?.slice(0, displayedText.length - 1) || ''
            )
        else if (buttonText === '+/-') checkForAlgebraicSign(displayedText)
        else if (['+', '-', '/', 'x'].includes(buttonText))
            setLocalStorageValue(
                displayedText + addArithmeticOperator(displayedText, buttonText)
            )
        //else if (buttonText === '=') calculateResult(displayedText)
        //else if (buttonText === '()') addParantheses(displayedText)
    }

    const checkForStartingZero = (displayedText: string | null) => {
        if (
            displayedText?.length === 1 &&
            displayedText.charAt(0) === '0' &&
            displayedText.charAt(1) !== ','
        )
            return displayedText.charAt(1)
        return displayedText
    }

    const allowCommaUsage = (displayedText: string | null) => {
        if (!displayedText) return false
        for (let i = 0; i < displayedText.length; i++) {
            if (displayedText.charAt(i) === ',') {
                return false
            }
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
        return displayedText ? ` ${buttonText} ` : ''
    }

    //const calculateResult = (displayedText: string | null) => {}

    //const addParantheses = (displayedText: string | null) => {}

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
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="/"
                                onClick={() => {
                                    handleDisplayText('/')
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="x"
                                onClick={() => {
                                    handleDisplayText('x')
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="DEL"
                                onClick={() => {
                                    handleDisplayText('DEL')
                                    console.log(localStorage.getItem('display'))
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
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={8}
                                onClick={() => {
                                    handleDisplayText(8)
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={9}
                                onClick={() => {
                                    handleDisplayText(9)
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="-"
                                onClick={() => {
                                    handleDisplayText('-')
                                    console.log(localStorage.getItem('display'))
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
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={5}
                                onClick={() => {
                                    handleDisplayText(5)
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={6}
                                onClick={() => {
                                    handleDisplayText(6)
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="+"
                                onClick={() => {
                                    handleDisplayText('+')
                                    console.log(localStorage.getItem('display'))
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
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={2}
                                onClick={() => {
                                    handleDisplayText(2)
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_NUMBERS}
                                buttonText={3}
                                onClick={() => {
                                    handleDisplayText(3)
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="()"
                                onClick={() => {
                                    handleDisplayText('()')
                                    console.log(localStorage.getItem('display'))
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
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText=","
                                onClick={() => {
                                    handleDisplayText(',')
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_SYMBOLS}
                                buttonText="+/-"
                                onClick={() => {
                                    handleDisplayText('+/-')
                                    console.log(localStorage.getItem('display'))
                                }}
                            />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={COLOR_EQUALS}
                                buttonText="="
                                onClick={() => {
                                    handleDisplayText('=')
                                    console.log(localStorage.getItem('display'))
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
