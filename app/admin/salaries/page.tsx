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
  note: string | null
}

const monthValue = new Date().toISOString().slice(0, 7)

export default function SalariesPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [payments, setPayments] = useState<SalaryPayment[]>([])
  const [selectedWorkerId, setSelectedWorkerId] = useState('')
  const [month, setMonth] = useState(monthValue)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedWorker = useMemo(
    () => workers.find(worker => worker.id === selectedWorkerId),
    [workers, selectedWorkerId],
  )

  const loadData = async () => {
    const [{ data: workersData }, { data: paymentData }] = await Promise.all([
      supabase.from('workers').select('id, name, monthly_salary').order('name', { ascending: true }),
      supabase.from('salary_payments').select('id, worker_id, worker_name, month, amount, note').order('month', { ascending: false }),
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
      setAmount(String(selectedWorker.monthly_salary || ''))
    }
  }, [selectedWorker])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorker) return

    setLoading(true)
    setError('')

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
    await loadData()
    setLoading(false)
  }

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
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
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

        <button type="submit" disabled={loading || !workers.length} className="factory-btn-primary w-full">
          {loading ? 'Saving...' : 'Record Salary Payment'}
        </button>
      </form>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Recent Salary Payments</h2>
        {payments.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm">No salary payments recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {payments.map(payment => (
              <li key={payment.id} className="border border-gray-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-white text-sm font-semibold">{payment.worker_name}</p>
                  <p className="text-gray-500 text-xs font-mono">{new Date(payment.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                  {payment.note && <p className="text-gray-400 text-xs mt-1">{payment.note}</p>}
                </div>
                <p className="text-emerald-400 font-semibold">${payment.amount.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
