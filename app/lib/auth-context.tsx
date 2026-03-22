'use client'

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js'

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

function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const meta = supabaseUser.user_metadata ?? {}
  return {
    id: supabaseUser.id,
    name: meta.full_name ?? meta.name ?? supabaseUser.email?.split('@')[0] ?? 'User',
    email: supabaseUser.email ?? '',
    role: (meta.role as UserRole) ?? 'client',
    avatar: meta.avatar_url,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const supabaseRef = useRef<SupabaseClient | null>(null)

  function getSupabase(): SupabaseClient {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient()
    }
    return supabaseRef.current
  }

  useEffect(() => {
    const supabase = getSupabase()

    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  }

  const logout = async () => {
    await getSupabase().auth.signOut()
    setUser(null)
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
