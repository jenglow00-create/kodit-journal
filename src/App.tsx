import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import Navigation from '@/components/layout/Navigation'
import MobileTabBar from '@/components/layout/MobileTabBar'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Journal from '@/pages/Journal'
import NewMaterial from '@/pages/NewMaterial'
import Export from '@/pages/Export'
import '@/styles/global.css'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Navigation />
      <main className="main-content">{children}</main>
      <MobileTabBar />
    </div>
  )
}

export default function App() {
  const { user, setUser } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!user) return <Login />

  return (
    <BrowserRouter>
      <ProtectedLayout>
        <Routes>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/new"     element={<NewMaterial />} />
          <Route path="/edit/:id" element={<NewMaterial />} />
          <Route path="/export"  element={<Export />} />
          <Route path="*"        element={<Navigate to="/" />} />
        </Routes>
      </ProtectedLayout>
    </BrowserRouter>
  )
}
