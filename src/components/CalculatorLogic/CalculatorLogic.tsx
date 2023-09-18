// checks if the user is allowed to type '0' or not
export const checkForStartingZero = (displayedText: string | null): string => {
    const splitDisplayedText = displayedText?.split(' ') || ''
    const numberToCheck = splitDisplayedText ? splitDisplayedText.length - 1 : 0

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
export const removeSetOfParantheses = (
    splitText: string[] | undefined
): string => {
    for (
        let i = 0;
        i < (splitText ? splitText[splitText.length - 1].length : 1);
        i++
    ) {
        if (!splitText) return ''
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
    splitText = splitText?.filter((item) => item !== '')
    return splitText ? splitText[splitText.length - 1] : ''
}

export const calculateResult = (displayedText: string | null): string => {
    if (!displayedText) return ''

    const splitText = displayedText.split(' ')
    const calculationContent = {
        parantheses: splitText.some((content) => content.includes('(')),
        points: splitText.some(
            (content) => content.includes('x') || content.includes('/')
        ),
        dashes: splitText.some(
            (content) => content.includes('+') || content.includes('-')
        ),
    }
    if (
        calculationContent.dashes &&
        !calculationContent.parantheses &&
        !calculationContent.points
    ) {
        // splitText:   0   1   2   3   4   5   6
        //              123 +   123 +   123 +   123
        let result = 0

        for (let i = 0; i < splitText.length; i++) {
            if (i <= splitText.length - 2) {
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
            console.log('FOR', result)
        }
    }
    if (calculationContent.points && !calculationContent.parantheses) {
        // splitText:   0   1   2   3   4   5   6   7   8   9   10  11  12
        //              122 +   123 x   124 +   125 +   126 x   127 +   128
        // scan every odd index for x or /
        // create a function that solves this pair and returns it afterwards
        // a new array is created with the old items and the returned value

        const pointSolvedCalculation = []
        for (let i = 1; i < splitText.length; i += 2) {
            console.log(i)
            if (['x', '/'].includes(splitText[i])) {
                /*const result = solvePointCalculation(
                    splitText[i - 1],
                    splitText[i],
                    splitText[i + 1]
                )
                console.log(result, 'result')

                const updatedSplitText = splitText
                    .slice(0, i - 1)
                    .concat(result)
                    .concat(splitText.slice(3, splitText.length))
                console.log(splitText, 'splitText')
                console.log(updatedSplitText, 'updatedSplitText')*/
                pointSolvedCalculation.push(
                    solvePointCalculation(
                        splitText[i - 1],
                        splitText[i],
                        splitText[i + 1]
                    )
                )
            } else pointSolvedCalculation.push(splitText[i - 1], splitText[i])
        }
        console.log(pointSolvedCalculation)
    }
    return displayedText
}

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
