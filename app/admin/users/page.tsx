'use client'

import { useState } from 'react'

export default function AdminUsersPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'admin' | 'manager'>('admin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          full_name: fullName,
          role,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      setSuccess('User account created successfully')
      setUsername('')
      setPassword('')
      setFullName('')
      setRole('admin')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-sans">User Management</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">
          Create login accounts for admins and managers.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800/50 text-red-400 px-5 py-4 rounded-xl font-mono text-sm mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 px-5 py-4 rounded-xl font-mono text-sm mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div>
          <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="factory-input"
            placeholder="Worker name"
          />
        </div>

        <div>
          <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
            Username *
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="factory-input"
            placeholder="worker_name"
            required
          />
        </div>

        <div>
          <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
            Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="factory-input"
            placeholder="Temporary password"
            required
          />
        </div>

        <div>
          <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
            Role *
          </label>
          <select
            value={role}
            onChange={e => setRole(e.target.value as 'admin' | 'manager')}
            className="factory-input"
          >
            <option value="admin">Admin (submit receipts)</option>
            <option value="manager">Manager (approve & pay)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="factory-btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}

