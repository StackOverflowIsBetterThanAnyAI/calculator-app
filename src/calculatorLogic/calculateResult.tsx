// calculates the result and returns a string to the display
export const calculateResult = (displayedText: string | null): string => {
    if (!displayedText) return ''

    // turns default xyyz text content into x.yz for the calculation process
    displayedText = displayedText.replace(/,/g, '.')

    // array which contains every set of numbers
    let splitText: string[] = displayedText.split(' ')

    // first calculation if the array contains parantheses, points or dashes
    let calculationContent: {
        parantheses: boolean
        points: boolean
        dashes: boolean
    } = returnCalculationContent(splitText)

    // first solve parantheses
    if (
        calculationContent.parantheses &&
        !calculationContent.points &&
        !calculationContent.dashes
    )
        return displayedText.replace(/[()]/g, '')

    if (calculationContent.parantheses)
        displayedText = recursiveParanthesesCalculation(displayedText)

    splitText = displayedText.split(' ')
    calculationContent = returnCalculationContent(splitText)

    // then solve points
    if (calculationContent.points && !calculationContent.parantheses) {
        displayedText = recursivePointCalculation(splitText).join(' ')
    }

    splitText = displayedText.split(' ')
    calculationContent = returnCalculationContent(splitText)

    // then solve dashes
    if (calculationContent.dashes && !calculationContent.parantheses) {
        displayedText = solveDashCalculation(splitText)
    }

    // returns a number with maximum four numbers after the comma
    return parseFloat(displayedText.replace(/--/g, ''))
        .toFixed(4)
        .replace(/0*$/, '')
        .replace(/\./, ',')
        .replace(/,$/, '')
}

// solves the parantheses calculations into easier input
const recursiveParanthesesCalculation = (displayedText: string): string => {
    // 1) scan displayedText for the first opening paranthesis
    // 2) scan displayedText for the first closing paranthesis
    // 3) if there is another opening paranthesis before the first closing paranthesis, the new one is the selected one
    // 4) if the first closing paranthesis has been found
    // - extract the calculation
    // - calculate the result
    // - insert it back
    // - and remove both parantheses
    // 5) repeat steps 1) to 4) until there are no parantheses left
    let indexOpeningParanthesis: number = 0
    let indexClosingParanthesis: number = 0
    // find the first opening and closing paranthesis
    for (let i = 0; i < displayedText.length; i++) {
        if (displayedText.charAt(i) === '(') {
            indexOpeningParanthesis = i
            continue
        }
        if (displayedText.charAt(i) === ')') {
            indexClosingParanthesis = i
            break
        }
    }

    if (indexClosingParanthesis > 0) {
        const insideParantheses: string = displayedText.slice(
            indexOpeningParanthesis + 1,
            indexClosingParanthesis
        )
        const splitText: string[] = insideParantheses.split(' ')
        const pointSolved: string[] = recursivePointCalculation(splitText)
        const dashSolved: string = solveDashCalculation(pointSolved)

        // return the calculated result back into the string
        const updatedDisplayedText: string =
            displayedText.slice(0, indexOpeningParanthesis) +
            dashSolved +
            displayedText.slice(indexClosingParanthesis + 1)

        // recursively process the remaining input
        return recursiveParanthesesCalculation(updatedDisplayedText)
    }
    return displayedText
}

// as long as there is a multiplication or division sign in the array,
// this function is calling itself and removes the signs by calculating results step by step
const recursivePointCalculation = (splitText: string[]): string[] => {
    if (splitText.length === 1) return splitText

    const pointSolvedCalculation: string[] = []
    let prevMultAdded: boolean = false
    for (let i = 1; i < splitText?.length; i += 2) {
        if (['x', '/'].includes(splitText[i])) {
            if (['x', '/'].includes(splitText[i - 2]) && prevMultAdded) {
                if (['x', '/'].includes(splitText[i + 2])) {
                    pointSolvedCalculation.push(splitText[i])
                    prevMultAdded = false
                } else {
                    pointSolvedCalculation.push(splitText[i], splitText[i + 1])
                    prevMultAdded = false
                }
            } else if (
                ['x', '/'].includes(splitText[i - 2]) &&
                !prevMultAdded
            ) {
                pointSolvedCalculation.push(
                    solvePointCalculation(
                        splitText[i - 1],
                        splitText[i],
                        splitText[i + 1]
                    )
                )

                prevMultAdded = true
            } else {
                pointSolvedCalculation.push(
                    solvePointCalculation(
                        splitText[i - 1],
                        splitText[i],
                        splitText[i + 1]
                    )
                )
                prevMultAdded = true
            }
        } else if (
            i === splitText.length - 2 &&
            ['+', '-'].includes(splitText[i])
        )
            if (['x', '/'].includes(splitText[i - 2])) {
                pointSolvedCalculation.push(splitText[i], splitText[i + 1])
                prevMultAdded = false
            } else {
                pointSolvedCalculation.push(
                    splitText[i - 1],
                    splitText[i],
                    splitText[i + 1]
                )
                prevMultAdded = false
            }
        else if (['x', '/'].includes(splitText[i - 2])) {
            pointSolvedCalculation.push(splitText[i])
            prevMultAdded = false
        } else {
            pointSolvedCalculation.push(splitText[i - 1], splitText[i])
            prevMultAdded = false
        }
    }

    // anything after + or - is cut off, but only when there is a x or / before the first + or - and if there are at least two x's or /'s
    let recursiveResult: string[]
    for (let i = 0; i < pointSolvedCalculation?.length; i++) {
        if (['x', '/'].includes(pointSolvedCalculation[i])) {
            recursiveResult = recursivePointCalculation([
                pointSolvedCalculation[i - 1],
                pointSolvedCalculation[i],
                pointSolvedCalculation[i + 1],
            ])
            recursiveResult &&
                pointSolvedCalculation.splice(i - 1, 3, recursiveResult[0])
            recursiveResult && i--
        }
    }
    return pointSolvedCalculation
}

// solves point calculations if algebraic sign is x or /
const solvePointCalculation = (
    valueOne: string,
    algebraicSign: string,
    valueTwo: string
): string => {
    switch (algebraicSign) {
        case 'x':
            return (parseFloat(valueOne) * parseFloat(valueTwo)).toString()
        default:
            return (parseFloat(valueOne) / parseFloat(valueTwo)).toString()
    }
}

// solves dashes only calculations
const solveDashCalculation = (splitText: string[]): string => {
    if (splitText.length === 1) return splitText[0]
    let result: number = 0

    for (let i = 0; i < splitText?.length; i++) {
        if (i <= splitText?.length - 2) {
            switch (splitText[i + 1]) {
                case '+':
                    result =
                        i === 0
                            ? parseFloat(splitText[i]) +
                              parseFloat(splitText[i + 2])
                            : result + parseFloat(splitText[i + 2])
                    break
                case '-':
                    result =
                        i === 0
                            ? parseFloat(splitText[i]) -
                              parseFloat(splitText[i + 2])
                            : result - parseFloat(splitText[i + 2])
                    break
            }
        }
    }
    return result.toString()
}

// returns an object which tells you if the input contains parantheses, + or /, and + or -
const returnCalculationContent = (splitText: string[] | null) => {
    return splitText
        ? {
              parantheses: splitText.some((content) => content.includes('(')),
              points: splitText.some(
                  (content) => content.includes('x') || content.includes('/')
              ),
              dashes: splitText.some(
                  (content) => content.includes('+') || content.includes('-')
              ),
          }
        : {
              parantheses: false,
              points: false,
              dashes: false,
          }
}
