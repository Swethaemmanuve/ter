import React, { useContext, useEffect, useState } from 'react'

export type signInType = {
    email: string
    password: string
}
export type authContextType = {
    getToken:()=>void
    user: any
}

export const AuthContext = React.createContext<authContextType | null>(null)

type authProviderProps = {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: authProviderProps) => {
    const [user, setUser]: any = useState(null)
    const [loading, setLoading] = useState(true)


    const getToken=()=>{
        const token = localStorage.getItem('idToken')
        if (token) {
            setUser(token)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        getToken()
    }, [])

    return (
        <AuthContext.Provider value={{ user, getToken }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
export const useAuthContext = () => useContext(AuthContext)
