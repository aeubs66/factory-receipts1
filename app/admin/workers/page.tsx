'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Worker {
  id: string
  name: string
}

export default function WorkersPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workers, setWorkers] = useState<Worker[]>([])

  const loadWorkers = async () => {
    const { data } = await supabase
      .from('workers')
      .select('id, name')
      .order('name', { ascending: true })

    if (data) {
      setWorkers(data as Worker[])
    }
  }

  useEffect(() => {
    loadWorkers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('workers')
        .insert({ name })

      if (insertError) throw insertError

      setName('')
      await loadWorkers()
    } catch (err: any) {
      setError(err.message || 'Failed to add worker')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-sans">Workers</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">
          Add worker names once, then select them when submitting receipts.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800/50 text-red-400 px-5 py-4 rounded-xl font-mono text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <div>
          <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
            Worker Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="factory-input"
            placeholder="e.g. Ayoub"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="factory-btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? 'Adding...' : 'Add Worker'}
        </button>
      </form>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold font-sans text-sm uppercase tracking-wide text-gray-400 mb-4">
          Existing Workers
        </h2>
        {workers.length === 0 ? (
          <p className="text-gray-600 text-sm font-mono">No workers yet.</p>
        ) : (
          <ul className="space-y-2">
            {workers.map(w => (
              <li key={w.id} className="text-gray-200 text-sm font-mono flex items-center justify-between">
                <span>{w.name}</span>
                <span className="text-gray-600 text-xs truncate max-w-[200px]">{w.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

