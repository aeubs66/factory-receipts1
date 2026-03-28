'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Worker {
  id: string
  name: string
  monthly_salary: number
}

interface SalaryPayment {
  id: string
  worker_id: string
  worker_name: string
  month: string
  amount: number
<<<<<<< HEAD
  days_absent: number
=======
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
  note: string | null
}

const monthValue = new Date().toISOString().slice(0, 7)

export default function SalariesPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [payments, setPayments] = useState<SalaryPayment[]>([])
  const [selectedWorkerId, setSelectedWorkerId] = useState('')
  const [month, setMonth] = useState(monthValue)
<<<<<<< HEAD
  const [daysAbsent, setDaysAbsent] = useState('0')
=======
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
<<<<<<< HEAD
  const [editingId, setEditingId] = useState<string | null>(null)
=======
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef

  const selectedWorker = useMemo(
    () => workers.find(worker => worker.id === selectedWorkerId),
    [workers, selectedWorkerId],
  )

  const loadData = async () => {
    const [{ data: workersData }, { data: paymentData }] = await Promise.all([
      supabase.from('workers').select('id, name, monthly_salary').order('name', { ascending: true }),
<<<<<<< HEAD
      supabase.from('salary_payments').select('id, worker_id, worker_name, month, amount, days_absent, note').order('month', { ascending: false }),
=======
      supabase.from('salary_payments').select('id, worker_id, worker_name, month, amount, note').order('month', { ascending: false }),
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
    ])

    if (workersData) {
      const typedWorkers = (workersData as Worker[]).map(worker => ({ ...worker, monthly_salary: Number(worker.monthly_salary || 0) }))
      setWorkers(typedWorkers)
      if (!selectedWorkerId && typedWorkers[0]) {
        setSelectedWorkerId(typedWorkers[0].id)
        setAmount(String(typedWorkers[0].monthly_salary || ''))
      }
    }

    if (paymentData) {
      setPayments((paymentData as SalaryPayment[]).map(payment => ({ ...payment, amount: Number(payment.amount || 0) })))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedWorker) {
<<<<<<< HEAD
      const absent = Number(daysAbsent) || 0
      const [yearStr, monthStr] = month.split('-')
      const daysInMonth = new Date(Number(yearStr), Number(monthStr), 0).getDate() || 30
      const dailyRate = selectedWorker.monthly_salary / daysInMonth
      const calculatedAmount = Math.max(0, selectedWorker.monthly_salary - (dailyRate * absent))
      setAmount(calculatedAmount ? calculatedAmount.toLocaleString('en-US') : '')
    }
  }, [selectedWorker, daysAbsent, month])

  useEffect(() => {
    const fetchAbsences = async () => {
      if (!selectedWorkerId || !month || editingId) return
      
      const [year, m] = month.split('-')
      const startDate = `${month}-01`
      const endDate = new Date(Number(year), Number(m), 0).toISOString().split('T')[0]

      const { count } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('worker_id', selectedWorkerId)
        .eq('status', 'absent')
        .gte('date', startDate)
        .lte('date', endDate)

      if (count !== null) {
        setDaysAbsent(String(count))
      }
    }
    
    fetchAbsences()
  }, [selectedWorkerId, month, editingId])
=======
      setAmount(String(selectedWorker.monthly_salary || ''))
    }
  }, [selectedWorker])
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorker) return

    setLoading(true)
    setError('')

<<<<<<< HEAD
    const payload = {
      worker_id: selectedWorker.id,
      worker_name: selectedWorker.name,
      month: `${month}-01`,
      amount: Number(amount.replace(/,/g, '')),
      days_absent: Number(daysAbsent) || 0,
      note: note || null,
    }

    if (editingId) {
      const { error: updateError } = await supabase.from('salary_payments').update(payload).eq('id', editingId)
      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
      setEditingId(null)
    } else {
      const { error: insertError } = await supabase.from('salary_payments').insert(payload)
      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
    }

    setNote('')
    setDaysAbsent('0')
=======
    const { error: insertError } = await supabase.from('salary_payments').insert({
      worker_id: selectedWorker.id,
      worker_name: selectedWorker.name,
      month: `${month}-01`,
      amount: Number(amount),
      note: note || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setNote('')
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
    await loadData()
    setLoading(false)
  }

<<<<<<< HEAD
  const handleEdit = (payment: SalaryPayment) => {
    setEditingId(payment.id)
    setSelectedWorkerId(payment.worker_id)
    setMonth(payment.month.substring(0, 7))
    setDaysAbsent(String(payment.days_absent || 0))
    setAmount(payment.amount ? payment.amount.toLocaleString('en-US') : '')
    setNote(payment.note || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this salary payment?')) return
    setLoading(true)
    const { error: deleteError } = await supabase.from('salary_payments').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
    } else {
      await loadData()
      if (editingId === id) {
        setEditingId(null)
        setNote('')
        setDaysAbsent('0')
      }
    }
    setLoading(false)
  }

=======
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-sans">Salary Management</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">Track monthly salary payments per worker.</p>
      </div>

      {error && <div className="bg-red-900/30 border border-red-800/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-mono">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Worker</label>
            <select
              value={selectedWorkerId}
              onChange={e => setSelectedWorkerId(e.target.value)}
              className="factory-input"
              required
            >
              {workers.map(worker => (
                <option key={worker.id} value={worker.id}>{worker.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Month</label>
            <input
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="factory-input"
              required
            />
          </div>

          <div>
<<<<<<< HEAD
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Days Absent</label>
            <input
              type="number"
              min="0"
              max="31"
              value={daysAbsent}
              onChange={e => setDaysAbsent(e.target.value)}
              className="factory-input"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Amount</label>
            <input
              type="text"
              value={amount}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '')
                setAmount(val ? Number(val).toLocaleString('en-US') : '')
              }}
=======
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
              className="factory-input"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Note</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="factory-input"
              placeholder="Optional"
            />
          </div>
        </div>

<<<<<<< HEAD
        <div className="flex gap-3">
          <button type="submit" disabled={loading || !workers.length} className="factory-btn-primary flex-1">
            {loading ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Salary Payment' : 'Record Salary Payment')}
          </button>
          {editingId && (
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEditingId(null)
                setNote('')
                setDaysAbsent('0')
              }}
              className="factory-btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
=======
        <button type="submit" disabled={loading || !workers.length} className="factory-btn-primary w-full">
          {loading ? 'Saving...' : 'Record Salary Payment'}
        </button>
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
      </form>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Recent Salary Payments</h2>
        {payments.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm">No salary payments recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {payments.map(payment => (
<<<<<<< HEAD
              <li key={payment.id} className="border border-gray-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{payment.worker_name}</p>
                  <p className="text-gray-500 text-xs font-mono">
                    {new Date(payment.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    {payment.days_absent > 0 && ` · ${payment.days_absent} days absent`}
                  </p>
                  {payment.note && <p className="text-gray-400 text-xs mt-1">{payment.note}</p>}
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <p className="text-emerald-400 font-semibold">{Math.round(payment.amount).toLocaleString('en-IQ')} IQD</p>
                  <div className="flex items-center gap-3 mt-1 sm:mt-0">
                    <button onClick={() => handleEdit(payment)} className="text-blue-400 hover:text-blue-300 text-xs transition-colors">Edit</button>
                    <button onClick={() => handleDelete(payment.id)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Delete</button>
                  </div>
                </div>
=======
              <li key={payment.id} className="border border-gray-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-white text-sm font-semibold">{payment.worker_name}</p>
                  <p className="text-gray-500 text-xs font-mono">{new Date(payment.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                  {payment.note && <p className="text-gray-400 text-xs mt-1">{payment.note}</p>}
                </div>
                <p className="text-emerald-400 font-semibold">${payment.amount.toFixed(2)}</p>
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
