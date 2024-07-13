import { useEffect, useState } from 'react'

const useSessionStorage = (key: string, initialValue: string) => {
    const [value, setValue] = useState<string>(() => {
        const storedValue = sessionStorage.getItem(key)
        return storedValue !== null ? storedValue : initialValue
    })

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key) {
                setValue(e.newValue || initialValue)
            }
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [key, initialValue])

    const setStoredValue = (newValue: string) => {
        setValue(newValue)
        sessionStorage.setItem(key, newValue)
    }

    return [value, setStoredValue] as const
}

export default useSessionStorage
