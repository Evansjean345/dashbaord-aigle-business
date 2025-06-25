import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {User} from '@/types/auth.types'

interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    setUser: (user: User | null) => void
    setIsAuthenticated: (value: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({user}),
            setIsAuthenticated: (value) => set({isAuthenticated: value}),
        }),
        {
            name: 'auth-storage',
        }
    )
)
