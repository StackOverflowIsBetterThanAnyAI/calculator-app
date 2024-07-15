// checks if last Character is ')'
export const checkForClosingParanthesis = (
    displayedText: string | null
): string => {
    if (displayedText?.charAt(displayedText.length - 1) === ')') return ' x '
    return ''
}
