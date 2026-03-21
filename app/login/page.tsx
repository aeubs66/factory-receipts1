'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'manager') {
        router.push('/manager')
      } else {
        router.push('/admin')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden" style={{ padding: '2rem' }}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-6" style={{ maxWidth: 420 }}>
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">FactoryPay</h1>
          <p className="text-gray-500 text-sm font-mono">Receipt Management System</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6 font-sans">Sign in to your account</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-800/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-5 font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="factory-input"
                placeholder="you@factory.com"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="factory-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="factory-btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-600 text-xs font-mono text-center">
              Contact your system administrator to get access
            </p>
          </div>
        </div>

        {/* Role hint */}
        <div className="mt-4 flex gap-3">
          <div className="flex-1 bg-gray-900/50 border border-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-orange-400 text-xs font-mono mb-1">👷 ADMIN</div>
            <div className="text-gray-500 text-xs">Submit receipts</div>
          </div>
          <div className="flex-1 bg-gray-900/50 border border-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-emerald-400 text-xs font-mono mb-1">👔 MANAGER</div>
            <div className="text-gray-500 text-xs">Approve & pay</div>
          </div>
        </div>
      </div>
    </div>
  )
}
