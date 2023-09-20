// checks if the user is allowed to type '0' or not
export const checkForStartingZero = (displayedText: string | null): string => {
    const splitDisplayedText: string[] | '' = displayedText?.split(' ') || ''
    const numberToCheck: number = splitDisplayedText
        ? splitDisplayedText.length - 1
        : 0

    // the latest set of numbers is checked if it starts with a '0' and a Comma
    for (
        let i = 0;
        i < (splitDisplayedText ? splitDisplayedText[numberToCheck].length : 1);
        i++
    ) {
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
export const checkForClosingParanthesis = (
    displayedText: string | null
): string => {
    if (displayedText?.charAt(displayedText.length - 1) === ')') return ' x '
    return ''
}

// checks if space after arithmetic operator has been deleted
export const checkForDeletedSpace = (displayedText: string | null): string => {
    if (
        displayedText &&
        ['+', '-', '/', 'x'].includes(
            displayedText?.charAt(displayedText.length - 1)
        )
    )
        return ' '
    return ''
}

// checks if the user is allowed to use a Comma
export const allowCommaUsage = (displayedText: string | null): boolean => {
    // no Comma is allowed in the beginning of a new set of numbers
    if (!displayedText) return false

    const splitDisplayedText: string[] = displayedText.split(' ')
    const numberToCheck: number = splitDisplayedText.length - 1

    if (!splitDisplayedText[numberToCheck].length) return false
    for (let i = 0; i < splitDisplayedText[numberToCheck].length; i++) {
        // there is only one single Comma allowed in each set of numbers
        if (splitDisplayedText[numberToCheck].charAt(i) === ',') return false
    }
    return true
}

// logic for the four arithmetic operators + - / x
export const addArithmeticOperator = (
    displayedText: string | null,
    buttonText: string
): string => {
    // in case there is no number after a Comma,
    // a '0' is added right in front of the arithmetic operator
    const lastCharIsComma: boolean =
        displayedText?.charAt(displayedText.length - 1) === ','
    const addSpace: '' | ' ' =
        displayedText?.charAt(displayedText.length - 1) === ' ' ? '' : ' '
    const returnText: string = lastCharIsComma
        ? `0 ${buttonText} `
        : `${addSpace}${buttonText} `
    return displayedText &&
        !['(', '+', '-', '/', 'x'].includes(
            displayedText.charAt(displayedText.length - 1)
        ) &&
        !['+', '-', '/', 'x'].includes(
            displayedText.charAt(displayedText.length - 2)
        )
        ? returnText
        : ''
}

// counts the number of left parantheses
export const calculateLeftParantheses = (
    displayedText: string | null
): number => {
    if (!displayedText) return -1
    let counterLeftParantheses: number = 0
    for (let i = 0; i < displayedText.length; i++) {
        if (displayedText.charAt(i) === '(') counterLeftParantheses++
    }
    return counterLeftParantheses
}

// counts the number of right parantheses
export const calculateRightParantheses = (
    displayedText: string | null
): number => {
    if (!displayedText) return -1
    let counterRightParantheses: number = 0
    for (let i = 0; i < displayedText.length; i++) {
        if (displayedText.charAt(i) === ')') counterRightParantheses++
    }
    return counterRightParantheses
}

// removes a set of unused parantheses at the end of the input string
export const removeSetOfParantheses = (
    splitText: string[] | undefined
): string => {
    if (!splitText) return ''
    for (let i = 0; i < splitText[splitText.length - 1]?.length; i++) {
        if (
            splitText[splitText.length - 1].charAt(i) === '(' &&
            splitText[splitText.length - 1].charAt(i + 1) === ')'
        ) {
            const newSplitText: string[] = splitText
            newSplitText[splitText.length - 1] =
                splitText[splitText.length - 1].substring(0, i) +
                splitText[splitText.length - 1].substring(i + 2)
            removeSetOfParantheses(newSplitText)
        }
    }
    splitText = splitText.filter((item) => item !== '')
    return splitText[splitText.length - 1]
}

// calculates the result and returns a string to the display
export const calculateResult = (displayedText: string | null): string => {
    if (!displayedText) return ''

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
        return displayedText.replaceAll('(', '').replaceAll(')', '')

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

    return displayedText
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
            return (parseInt(valueOne) * parseInt(valueTwo)).toString()
        default:
            return (parseInt(valueOne) / parseInt(valueTwo)).toString()
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
                            ? parseInt(splitText[i]) +
                              parseInt(splitText[i + 2])
                            : result + parseInt(splitText[i + 2])
                    break
                case '-':
                    result =
                        i === 0
                            ? parseInt(splitText[i]) -
                              parseInt(splitText[i + 2])
                            : result - parseInt(splitText[i + 2])
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
