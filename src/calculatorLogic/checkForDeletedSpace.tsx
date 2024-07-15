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
