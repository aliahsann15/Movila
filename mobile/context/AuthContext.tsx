import React, { createContext, useContext, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'

// Use 10.0.2.2 for Android emulator, localhost for iOS simulator
const API_URL = process.env.EXPO_PUBLIC_API_BASE || 'http://10.0.2.2:5000/api'

type User = Record<string, any> | null

type AuthContextType = {
  token: string | null
  user: User
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (payload: { fullName: string; email: string; password: string; bio?: string; profilePictureUrl?: string }) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (userId: string, payload: { fullName?: string; email?: string; bio?: string; password?: string; profilePictureUrl?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        const t = await SecureStore.getItemAsync('accessToken')
        if (t) {
          setToken(t)
          // set default header for fetch usage is done per-request below 
          // try to fetch profile
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${t}` },
          })
          if (res.ok) {
            const data = await res.json()
            setUser(data.data)
          } else {
            await SecureStore.deleteItemAsync('accessToken')
            setToken(null)
          }
        }
      } catch (e) {
        console.warn('Auth restore failed', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || `HTTP ${res.status}`)
      }
      const body = await res.json()
      
      const t = body.data?.token
      const u = body.data?.user

      if (!t) throw new Error('No token returned')
      await SecureStore.setItemAsync('accessToken', t)
      setToken(t)
      setUser(u ?? null)
      router.push('/(tabs)/Index')
    } catch (e) {
      throw e
    }
  }

  const signUp = async (payload: { fullName: string; email: string; password: string; bio?: string; profilePictureUrl?: string }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || `HTTP ${res.status}`)
      }
      const body = await res.json()
      
      const t = body.data?.token
      const u = body.data?.user
      if (!t) throw new Error('No token returned')
      await SecureStore.setItemAsync('accessToken', t)
      setToken(t)
      setUser(u ?? null)
      router.push('/(tabs)/Index')
    } catch (e) {
      throw e
    }
  }

  const signOut = async () => {
    await SecureStore.deleteItemAsync('accessToken')
    setToken(null)
    setUser(null)
    router.push('/login')
  }

  const updateProfile = async (userId: string, payload: { fullName?: string; email?: string; bio?: string; password?: string; profilePictureUrl?: string }) => {
    try {
      const t = await SecureStore.getItemAsync('accessToken')
      if (!t) throw new Error('No token found')
      
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${t}`
        },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || `HTTP ${res.status}`)
      }
      
      const body = await res.json()
      const updatedUser = body.data
      setUser(updatedUser ?? null)
    } catch (e) {
      console.error('Update profile error:', e)
      throw e
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
