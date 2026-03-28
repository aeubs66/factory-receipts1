'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  spent_on: string
  created_at: string
}

export default function ExpensesPage() {
  const [category, setCategory] = useState('operations')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [spentOn, setSpentOn] = useState(new Date().toISOString().slice(0, 10))
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses])

  const loadExpenses = async () => {
    const { data } = await supabase
      .from('expenses')
      .select('id, category, description, amount, spent_on, created_at')
      .order('spent_on', { ascending: false })
      .limit(50)

    if (data) {
      setExpenses((data as Expense[]).map(expense => ({ ...expense, amount: Number(expense.amount || 0) })))
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('expenses').insert({
      category,
      description,
      amount: Number(amount),
      spent_on: spentOn,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setDescription('')
    setAmount('')
    await loadExpenses()
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-sans">Expense Tracker</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">Track all factory spending beyond worker receipts.</p>
      </div>

      {error && <div className="bg-red-900/30 border border-red-800/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-mono">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="factory-input">
              <option value="operations">Operations</option>
              <option value="equipment">Equipment</option>
              <option value="utilities">Utilities</option>
              <option value="maintenance">Maintenance</option>
              <option value="transport">Transport</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Spent On</label>
            <input type="date" value={spentOn} onChange={e => setSpentOn(e.target.value)} className="factory-input" required />
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="factory-input" required placeholder="e.g. Diesel for generator" />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Amount</label>
            <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="factory-input" required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="factory-btn-primary w-full">
          {loading ? 'Saving...' : 'Add Expense'}
        </button>
      </form>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Recent Expenses</h2>
          <p className="text-orange-400 font-mono text-sm">Total: ${total.toFixed(2)}</p>
        </div>
        {expenses.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm">No expenses recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map(expense => (
              <li key={expense.id} className="border border-gray-800 rounded-lg p-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-white text-sm">{expense.description}</p>
                  <p className="text-xs text-gray-500 font-mono">
                    {new Date(expense.spent_on).toLocaleDateString()} · {expense.category}
                  </p>
                </div>
                <p className="text-rose-400 font-semibold">${expense.amount.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
