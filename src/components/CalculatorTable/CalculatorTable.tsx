import React from 'react'
import CalculatorButton from '../CalculatorButton/CalculatorButton'
import './CalculatorTable.css'

function CalculatorTable() {
    const colorNumbers = '#f8b8a5'
    const colorSymbols = '#f19e5b'

    return (
        <div className="responsive-table">
            <table cellSpacing={0}>
                <tbody>
                    <tr>
                        <th>
                            <CalculatorButton
                                bgColor={colorSymbols}
                                text="AC"
                            />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorSymbols} text="/" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorSymbols} text="X" />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={colorSymbols}
                                text="DEL"
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="7" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="8" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="9" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorSymbols} text="-" />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="4" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="5" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="6" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorSymbols} text="+" />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="1" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="2" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="3" />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={colorSymbols}
                                text="()"
                            />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <CalculatorButton bgColor={colorNumbers} text="0" />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorSymbols} text="," />
                        </th>
                        <th>
                            <CalculatorButton
                                bgColor={colorSymbols}
                                text="+/-"
                            />
                        </th>
                        <th>
                            <CalculatorButton bgColor={colorSymbols} text="=" />
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default CalculatorTable
