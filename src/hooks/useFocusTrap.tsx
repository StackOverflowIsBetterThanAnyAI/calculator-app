import { useEffect } from 'react'
import { TableCharacterProps } from '../constants/tableCharacters'

export const useFocusTrap = (tableCharacters: TableCharacterProps[]) => {
    useEffect(() => {
        const handleFocusTrap = (e: KeyboardEvent) => {
            const focusableButtons = Array.from(
                document.querySelectorAll('button')
            )
            const firstButton = focusableButtons[0]
            const lastButton = focusableButtons[focusableButtons.length - 1]
            const buttonRows = Math.ceil(tableCharacters.length / 4)

            // current button
            const findButtonIndex = (button: HTMLButtonElement) =>
                focusableButtons.indexOf(button)

            // focus button because of its index
            const focusButtonAtIndex = (index: number) => {
                if (index >= 0 && index < focusableButtons.length) {
                    focusableButtons[index]?.focus()
                }
            }

            if (
                e.key === 'Tab' &&
                !e.shiftKey &&
                document.activeElement === lastButton
            ) {
                e.preventDefault()
                firstButton?.focus()
            }

            if (
                e.key === 'Tab' &&
                e.shiftKey &&
                document.activeElement === firstButton
            ) {
                e.preventDefault()
                lastButton?.focus()
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                const currentIndex = findButtonIndex(
                    document.activeElement as HTMLButtonElement
                )
                const nextRowStartIndex = (currentIndex / 4 + 1) * 4
                if (nextRowStartIndex < focusableButtons.length) {
                    focusButtonAtIndex(nextRowStartIndex)
                } else {
                    focusButtonAtIndex(currentIndex - (buttonRows - 1) * 4)
                }
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault()
                const currentIndex = findButtonIndex(
                    document.activeElement as HTMLButtonElement
                )
                const previousRowStartIndex = (currentIndex / 4 - 1) * 4
                if (previousRowStartIndex >= 0) {
                    focusButtonAtIndex(previousRowStartIndex)
                } else {
                    focusButtonAtIndex(currentIndex + (buttonRows - 1) * 4)
                }
            }

            if (e.key === 'ArrowRight') {
                e.preventDefault()
                const currentIndex = findButtonIndex(
                    document.activeElement as HTMLButtonElement
                )
                const nextIndex =
                    currentIndex % 4 === 3 ? currentIndex - 3 : currentIndex + 1
                if (nextIndex < focusableButtons.length) {
                    focusButtonAtIndex(nextIndex)
                }
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                const currentIndex = findButtonIndex(
                    document.activeElement as HTMLButtonElement
                )
                const prevIndex =
                    currentIndex % 4 === 0 ? currentIndex + 3 : currentIndex - 1
                if (prevIndex >= 0) {
                    focusButtonAtIndex(prevIndex)
                }
            }
        }

        document.addEventListener('keydown', handleFocusTrap)

        return () => {
            document.removeEventListener('keydown', handleFocusTrap)
        }
    }, [tableCharacters])
}
