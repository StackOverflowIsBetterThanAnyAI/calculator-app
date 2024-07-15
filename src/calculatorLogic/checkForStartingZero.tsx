// checks if the user is allowed to type '0' or not
export const checkForStartingZero = (displayedText: string | null): string => {
    const splitDisplayedText: string[] | '' = displayedText
        ? displayedText.split(' ')
        : ''
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
            // splitDisplayedText.length is checked in case of displayedText being the default text
            splitDisplayedText.length &&
            splitDisplayedText[numberToCheck].charAt(0) === '0' &&
            splitDisplayedText[numberToCheck].charAt(1) !== ','
        )
            // latest typed '0' is removed
            return displayedText?.slice(0, displayedText.length - 1) || ''
    }
    // also check for negative numbers
    for (
        let i = 0;
        i < (splitDisplayedText ? splitDisplayedText[numberToCheck].length : 1);
        i++
    ) {
        if (
            // splitDisplayedText.length is checked in case of displayedText being the default text
            splitDisplayedText.length &&
            splitDisplayedText[numberToCheck].charAt(0) === '(' &&
            splitDisplayedText[numberToCheck].charAt(1) === '-' &&
            splitDisplayedText[numberToCheck].charAt(2) === '0' &&
            splitDisplayedText[numberToCheck].charAt(3) !== ','
        )
            // latest typed '0' is removed
            return displayedText?.slice(0, displayedText.length - 1) || ''
    }
    // change nothing
    return displayedText || ''
}
