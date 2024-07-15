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
