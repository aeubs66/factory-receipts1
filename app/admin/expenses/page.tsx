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
  const [editingId, setEditingId] = useState<string | null>(null)

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

    if (editingId) {
      const { error: updateError } = await supabase.from('expenses').update({
        category,
        description,
        amount: Number(amount.replace(/,/g, '')),
        spent_on: spentOn,
      }).eq('id', editingId)
      
      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
      setEditingId(null)
    } else {
      const { error: insertError } = await supabase.from('expenses').insert({
        category,
        description,
        amount: Number(amount.replace(/,/g, '')),
        spent_on: spentOn,
      })
      
      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
    }

    setDescription('')
    setAmount('')
    await loadExpenses()
    setLoading(false)
  }

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setCategory(expense.category)
    setDescription(expense.description)
    setAmount(expense.amount ? expense.amount.toLocaleString('en-US') : '')
    setSpentOn(expense.spent_on)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return
    setLoading(true)
    const { error: deleteError } = await supabase.from('expenses').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
    } else {
      await loadExpenses()
      if (editingId === id) {
        setEditingId(null)
        setDescription('')
        setAmount('')
      }
    }
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
            <input 
              type="text" 
              value={amount} 
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '')
                setAmount(val ? Number(val).toLocaleString('en-US') : '')
              }} 
              className="factory-input" 
              required 
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="factory-btn-primary flex-1">
            {loading ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Expense' : 'Add Expense')}
          </button>
          {editingId && (
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEditingId(null)
                setDescription('')
                setAmount('')
              }}
              className="factory-btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Recent Expenses</h2>
          <p className="text-orange-400 font-mono text-sm">Total: {Math.round(total).toLocaleString('en-IQ')} IQD</p>
        </div>
        {expenses.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm">No expenses recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map(expense => (
              <li key={expense.id} className="border border-gray-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-white text-sm">{expense.description}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    {new Date(expense.spent_on).toLocaleDateString()} · {expense.category}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <p className="text-rose-400 font-semibold">{Math.round(expense.amount).toLocaleString('en-IQ')} IQD</p>
                  <div className="flex items-center gap-3 mt-1 sm:mt-0">
                    <button onClick={() => handleEdit(expense)} className="text-blue-400 hover:text-blue-300 text-xs transition-colors">Edit</button>
                    <button onClick={() => handleDelete(expense.id)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
