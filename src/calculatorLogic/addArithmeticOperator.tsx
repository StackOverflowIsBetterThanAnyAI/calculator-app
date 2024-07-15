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
        // use case: '123 - ' with space
        !['(', '+', '-', '/', 'x'].includes(
            displayedText.charAt(displayedText.length - 1)
        ) && // use case: '123 -' with the additional space deleted
        (!['+', '-', '/', 'x'].includes(
            displayedText.charAt(displayedText.length - 2)
        ) ||
            // use case: (-1 is not filtered out
            (displayedText.charAt(displayedText.length - 3) === '(' &&
                displayedText.charAt(displayedText.length - 2) === '-'))
        ? returnText
        : ''
}
