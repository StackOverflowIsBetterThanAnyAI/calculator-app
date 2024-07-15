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
