'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  spent_on: string
  created_at: string
}

const currentMonth = new Date().toISOString().slice(0, 7)

export default function ExpensesPage() {
  const [month, setMonth] = useState(currentMonth)
  const [category, setCategory] = useState('operations')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [spentOn, setSpentOn] = useState(new Date().toISOString().slice(0, 10))
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const total = useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses])

  const loadExpenses = async (selectedMonth: string) => {
    const startDate = `${selectedMonth}-01`
    const endDate = new Date(`${selectedMonth}-01T00:00:00Z`)
    endDate.setUTCMonth(endDate.getUTCMonth() + 1)
    const endDateText = endDate.toISOString().slice(0, 10)

    const { data } = await supabase
      .from('expenses')
      .select('id, category, description, amount, spent_on, created_at')
      .gte('spent_on', startDate)
      .lt('spent_on', endDateText)
      .order('spent_on', { ascending: false })
      .limit(300)

    if (data) {
      setExpenses((data as Expense[]).map(expense => ({ ...expense, amount: Number(expense.amount || 0) })))
    }
  }

  useEffect(() => {
    loadExpenses(month)
  }, [month])

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
    await loadExpenses(month)
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
      await loadExpenses(month)
      if (editingId === id) {
        setEditingId(null)
        setDescription('')
        setAmount('')
      }
    }
    setLoading(false)
  }

  const reportTitle = month
    ? new Date(`${month}-01`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : ''

  const buildReportText = () => {
    const lines: string[] = [
      `Ali Duct Factory — Expense Report`,
      `Period: ${reportTitle}`,
      `Generated: ${new Date().toLocaleString()}`,
      ``,
      `EXPENSES`,
      `--------`,
    ]
    expenses.forEach((e, i) => {
      lines.push(`${i + 1}. ${e.description}`)
      lines.push(`   Date: ${new Date(e.spent_on).toLocaleDateString()} | Category: ${e.category} | Amount: ${Math.round(e.amount).toLocaleString('en-IQ')} IQD`)
    })
    lines.push(``)
    lines.push(`TOTAL: ${Math.round(total).toLocaleString('en-IQ')} IQD`)
    return lines.join('\n')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const text = buildReportText()
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expense-report-${month}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => {
    const text = buildReportText()
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Print-only header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#000' }}>Ali Duct Factory &mdash; Expense Report</h1>
        <p style={{ color: '#444' }} className="text-sm">Period: {reportTitle}</p>
        <p style={{ color: '#888' }} className="text-xs">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Monthly Expense Reports</h1>
          <p className="text-gray-500 text-sm font-mono mt-1">Track factory spending month by month.</p>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Report Month</label>
            <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="factory-input" />
          </div>
          {expenses.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                title="Print report"
                className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-mono text-xs py-2 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" /></svg>
                Print
              </button>
              <button
                onClick={handleDownload}
                title="Download as text file"
                className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-mono text-xs py-2 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                Download
              </button>
              <button
                onClick={handleWhatsApp}
                title="Share via WhatsApp"
                className="flex items-center gap-1.5 bg-green-900/40 hover:bg-green-900/60 text-green-400 border border-green-800/50 font-mono text-xs py-2 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-800/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-mono">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 mb-8 print:hidden">
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

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 print:bg-white print:border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">
            {month ? new Date(`${month}-01`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : ''} Expenses
          </h2>
          <p className="text-orange-400 font-mono text-sm">Total: {Math.round(total).toLocaleString('en-IQ')} IQD</p>
        </div>
        {expenses.length === 0 ? (
          <p className="text-gray-500 font-mono text-sm">No expenses recorded for this month.</p>
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
                  <p className="text-rose-400 font-semibold print:text-black">{Math.round(expense.amount).toLocaleString('en-IQ')} IQD</p>
                  <div className="flex items-center gap-3 mt-1 sm:mt-0 print:hidden">
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
