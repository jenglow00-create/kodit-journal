import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      signInWithGoogle: async () => {
        set({ isLoading: true })
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        })
        set({ isLoading: false })
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null })
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'kodit-auth',
      partialize: (s) => ({ user: s.user }),
    }
  )
)
