"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "./auth-types"

type AuthContextType = {
  authState: AuthState
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuthState({
          user,
          isAuthenticated: true,
        })
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  // Update the login function to set cookies as well as localStorage
  const login = (user: User) => {
    // Store user in localStorage for client-side access
    localStorage.setItem("user", JSON.stringify(user))

    // Also set a cookie for server-side access
    document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=2592000; SameSite=Strict` // 30 days

    setAuthState({
      user,
      isAuthenticated: true,
    })
  }

  // Update the logout function to clear cookies as well
  const logout = () => {
    localStorage.removeItem("user")
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setAuthState({
      user: null,
      isAuthenticated: false,
    })
  }

  return <AuthContext.Provider value={{ authState, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
