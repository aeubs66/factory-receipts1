'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Worker {
  id: string
  name: string
  monthly_salary: number
<<<<<<< HEAD
  track_attendance: boolean
=======
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
}

export default function WorkersPage() {
  const [name, setName] = useState('')
  const [monthlySalary, setMonthlySalary] = useState('')
<<<<<<< HEAD
  const [trackAttendance, setTrackAttendance] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workers, setWorkers] = useState<Worker[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
=======
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workers, setWorkers] = useState<Worker[]>([])
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef

  const loadWorkers = async () => {
    const { data } = await supabase
      .from('workers')
<<<<<<< HEAD
      .select('id, name, monthly_salary, track_attendance')
      .order('name', { ascending: true })

    if (data) {
      setWorkers((data as Worker[]).map(w => ({ 
        ...w, 
        monthly_salary: Number(w.monthly_salary || 0),
        track_attendance: !!w.track_attendance
      })))
=======
      .select('id, name, monthly_salary')
      .order('name', { ascending: true })

    if (data) {
      setWorkers((data as Worker[]).map(w => ({ ...w, monthly_salary: Number(w.monthly_salary || 0) })))
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
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
<<<<<<< HEAD
      if (editingId) {
        const { error: updateError } = await supabase
          .from('workers')
          .update({
            name,
            monthly_salary: monthlySalary ? Number(monthlySalary.replace(/,/g, '')) : 0,
            track_attendance: trackAttendance,
          })
          .eq('id', editingId)
        if (updateError) throw updateError
        setEditingId(null)
      } else {
        const { error: insertError } = await supabase
          .from('workers')
          .insert({
            name,
            monthly_salary: monthlySalary ? Number(monthlySalary.replace(/,/g, '')) : 0,
            track_attendance: trackAttendance,
          })
        if (insertError) throw insertError
      }

      setName('')
      setMonthlySalary('')
      setTrackAttendance(false)
      await loadWorkers()
    } catch (err: any) {
      setError(err.message || 'Failed to save worker')
=======
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
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
  const handleEdit = (worker: Worker) => {
    setEditingId(worker.id)
    setName(worker.name)
    setMonthlySalary(worker.monthly_salary ? worker.monthly_salary.toLocaleString('en-US') : '')
    setTrackAttendance(worker.track_attendance)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this worker?')) return
    setLoading(true)
    const { error: deleteError } = await supabase.from('workers').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
    } else {
      await loadWorkers()
      if (editingId === id) {
        setEditingId(null)
        setName('')
        setMonthlySalary('')
        setTrackAttendance(false)
      }
    }
    setLoading(false)
  }

=======
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
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
<<<<<<< HEAD
            type="text"
            value={monthlySalary}
            onChange={e => {
              const val = e.target.value.replace(/[^0-9]/g, '')
              setMonthlySalary(val ? Number(val).toLocaleString('en-US') : '')
            }}
=======
            type="number"
            min="0"
            step="0.01"
            value={monthlySalary}
            onChange={e => setMonthlySalary(e.target.value)}
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
            className="factory-input"
            placeholder="e.g. 850"
          />
        </div>
<<<<<<< HEAD
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="trackAttendance"
            checked={trackAttendance}
            onChange={e => setTrackAttendance(e.target.checked)}
            className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-orange-500 focus:ring-orange-500"
          />
          <label htmlFor="trackAttendance" className="text-gray-300 text-sm font-mono cursor-pointer">
            Track daily attendance via Factory App
          </label>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="factory-btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Worker' : 'Add Worker')}
          </button>
          {editingId && (
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEditingId(null)
                setName('')
                setMonthlySalary('')
              }}
              className="factory-btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
=======
        <button
          type="submit"
          disabled={loading}
          className="factory-btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? 'Adding...' : 'Add Worker'}
        </button>
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
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
<<<<<<< HEAD
                <div className="flex items-center gap-2">
                  <span>{w.name}</span>
                  {w.track_attendance && (
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                      Tracking
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:items-end">
                  <span className="text-emerald-400 text-xs">{Math.round(w.monthly_salary).toLocaleString('en-IQ')} IQD / month</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gray-600 text-[10px] truncate max-w-[150px]">{w.id}</span>
                    <button onClick={() => handleEdit(w)} className="text-blue-400 hover:text-blue-300 text-xs transition-colors">Edit</button>
                    <button onClick={() => handleDelete(w.id)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Delete</button>
                  </div>
=======
                <span>{w.name}</span>
                <div className="flex flex-col sm:items-end">
                  <span className="text-emerald-400 text-xs">${w.monthly_salary.toFixed(2)} / month</span>
                  <span className="text-gray-600 text-xs truncate max-w-[220px]">{w.id}</span>
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
