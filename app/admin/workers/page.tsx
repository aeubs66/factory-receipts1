'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Worker {
  id: string
  name: string
  monthly_salary: number
}

export default function WorkersPage() {
  const [name, setName] = useState('')
  const [monthlySalary, setMonthlySalary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workers, setWorkers] = useState<Worker[]>([])

  const loadWorkers = async () => {
    const { data } = await supabase
      .from('workers')
      .select('id, name, monthly_salary')
      .order('name', { ascending: true })

    if (data) {
      setWorkers((data as Worker[]).map(w => ({ ...w, monthly_salary: Number(w.monthly_salary || 0) })))
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
        .insert({
          name,
          monthly_salary: monthlySalary ? Number(monthlySalary) : 0,
        })

      if (insertError) throw insertError

      setName('')
      setMonthlySalary('')
      await loadWorkers()
    } catch (err: any) {
      setError(err.message || 'Failed to add worker')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-sans">Workers</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">
          Manage workers and set a default monthly salary for payroll planning.
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
        <div>
          <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
            Monthly Salary
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={monthlySalary}
            onChange={e => setMonthlySalary(e.target.value)}
            className="factory-input"
            placeholder="e.g. 850"
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
              <li key={w.id} className="text-gray-200 text-sm font-mono flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-gray-800/60 pb-2">
                <span>{w.name}</span>
                <div className="flex flex-col sm:items-end">
                  <span className="text-emerald-400 text-xs">${w.monthly_salary.toFixed(2)} / month</span>
                  <span className="text-gray-600 text-xs truncate max-w-[220px]">{w.id}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
