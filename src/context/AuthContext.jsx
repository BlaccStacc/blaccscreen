import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch, setToken, getToken } from '../api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    apiFetch('/auth/me')
      .then(setUser)
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const signInWithToken = (token, userData) => {
    setToken(token)
    setUser(userData)
  }

  const signOut = () => {
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    loading,
    signInWithToken,
    signOut
  }

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
