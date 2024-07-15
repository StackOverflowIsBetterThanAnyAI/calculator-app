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
