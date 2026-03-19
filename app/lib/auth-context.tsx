'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'client' | 'contractor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    // Mock auth - in production, verify against backend
    const mockUsers: Record<string, User> = {
      'client@example.com': {
        id: '1',
        name: 'Sarah Mitchell',
        email: 'client@example.com',
        role: 'client',
      },
      'contractor@example.com': {
        id: '2',
        name: 'John Garcia',
        email: 'contractor@example.com',
        role: 'contractor',
      },
      'admin@nexusoperations.org': {
        id: '3',
        name: 'Brianna Gomez',
        email: 'admin@nexusoperations.org',
        role: 'admin',
      },
    }

    if (mockUsers[email]) {
      setUser(mockUsers[email])
      localStorage.setItem('nexus_user', JSON.stringify(mockUsers[email]))
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nexus_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
