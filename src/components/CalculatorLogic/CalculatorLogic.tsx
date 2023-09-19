// checks if the user is allowed to type '0' or not
export const checkForStartingZero = (displayedText: string | null): string => {
    const splitDisplayedText = displayedText?.split(' ') || ''
    const numberToCheck = splitDisplayedText ? splitDisplayedText.length - 1 : 0

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

    const splitDisplayedText = displayedText.split(' ')
    const numberToCheck = splitDisplayedText.length - 1

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
    const lastCharIsComma =
        displayedText?.charAt(displayedText.length - 1) === ','
    const addSpace =
        displayedText?.charAt(displayedText.length - 1) === ' ' ? '' : ' '
    const returnText = lastCharIsComma
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
    let counterLeftParantheses = 0
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
    let counterRightParantheses = 0
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
            const newSplitText = splitText
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
    let splitText = displayedText.split(' ')
    console.log(splitText, displayedText, 'splitText, displayedText 1')

    // first calculation if the array contains parantheses, points or dashes
    let calculationContent = returnCalculationContent(splitText)
    console.log(calculationContent, 'calculationContent 1')

    if (calculationContent.points && !calculationContent.parantheses) {
        displayedText = recursivePointCalculation(splitText).join(' ')
    }

    splitText = displayedText.split(' ')
    console.log(splitText, displayedText, 'splitText, displayedText 2')

    calculationContent = returnCalculationContent(splitText)
    console.log(calculationContent, 'calculationContent 2')

    if (calculationContent.dashes && !calculationContent.parantheses) {
        displayedText = solveDashCalculation(splitText)
    }

    return displayedText
}

// as long as there is a multiplication or division sign in the array,
// this function is calling itself and removes the signs by calculating results step by step
const recursivePointCalculation = (splitText: string[]): string[] => {
    console.log(splitText, 'splitText rec')
    const pointSolvedCalculation = []
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
    console.log(pointSolvedCalculation, 'pointSolvedCalculation rec')
    // enything after + or - is cut off, but only when there is a x or / before the first + or - and if there are at least two x's or /'s
    let recursiveResult
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
    console.log(pointSolvedCalculation, 'pointSolvedCalculation is returned')
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
    console.log(splitText, 'splitText dash')
    let result = 0

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
    console.log(result, 'result is returned')
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
