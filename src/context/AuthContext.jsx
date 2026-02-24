import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const MOCK_USERS = [
    { id: 1, name: 'Dr. Sharma', email: 'admin@univ.edu', password: 'admin123', role: 'admin', avatar: 'DS' },
    { id: 2, name: 'Alex Johnson', email: 'alex@student.edu', password: 'student123', role: 'student', avatar: 'AJ' },
    { id: 3, name: 'Priya Patel', email: 'priya@student.edu', password: 'student123', role: 'student', avatar: 'PP' },
    { id: 4, name: 'Omar Hassan', email: 'omar@student.edu', password: 'student123', role: 'student', avatar: 'OH' },
]

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const login = useCallback(async (email, password) => {
        setLoading(true)
        setError('')
        await new Promise(res => setTimeout(res, 800)) // mock delay
        const found = MOCK_USERS.find(u => u.email === email && u.password === password)
        if (found) {
            const { password: _, ...safeUser } = found
            setUser(safeUser)
            setLoading(false)
            return { success: true, role: safeUser.role }
        } else {
            setError('Invalid email or password')
            setLoading(false)
            return { success: false }
        }
    }, [])

    const register = useCallback(async (name, email, password, role = 'student') => {
        setLoading(true)
        setError('')
        await new Promise(res => setTimeout(res, 800))
        const newUser = { id: Date.now(), name, email, role, avatar: name.split(' ').map(n => n[0]).join('').toUpperCase() }
        setUser(newUser)
        setLoading(false)
        return { success: true, role: newUser.role }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setError('')
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
