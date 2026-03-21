'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.role !== 'manager') {
        router.replace('/login')
        return
      }

      setUserName(profile.full_name)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <div className="hidden md:block">
        <Sidebar role="manager" userName={userName} />
      </div>
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
        {children}
      </main>
      <MobileNav role="manager" />
    </div>
  )
}
