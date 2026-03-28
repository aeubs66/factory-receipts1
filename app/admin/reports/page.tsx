'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface MonthlySeries {
  month: string
  receipts: number
  salaries: number
  expenses: number
  total: number
}

const currentMonth = new Date().toISOString().slice(0, 7)

export default function ReportsPage() {
  const [month, setMonth] = useState(currentMonth)
  const [receiptsTotal, setReceiptsTotal] = useState(0)
  const [salaryTotal, setSalaryTotal] = useState(0)
  const [expenseTotal, setExpenseTotal] = useState(0)
  const [monthlySeries, setMonthlySeries] = useState<MonthlySeries[]>([])

  const grandTotal = useMemo(() => receiptsTotal + salaryTotal + expenseTotal, [receiptsTotal, salaryTotal, expenseTotal])

  const loadReport = async (monthKey: string) => {
    const startDate = `${monthKey}-01`
    const endDate = new Date(`${monthKey}-01T00:00:00Z`)
    endDate.setUTCMonth(endDate.getUTCMonth() + 1)
    const endDateText = endDate.toISOString().slice(0, 10)

    const [receiptRes, salaryRes, expenseRes, receiptMonthly, salaryMonthly, expenseMonthly] = await Promise.all([
      supabase.from('receipts').select('amount').gte('purchase_date', startDate).lt('purchase_date', endDateText),
      supabase.from('salary_payments').select('amount').gte('month', startDate).lt('month', endDateText),
      supabase.from('expenses').select('amount').gte('spent_on', startDate).lt('spent_on', endDateText),
      supabase.from('receipts').select('purchase_date, amount').order('purchase_date', { ascending: false }).limit(300),
      supabase.from('salary_payments').select('month, amount').order('month', { ascending: false }).limit(300),
      supabase.from('expenses').select('spent_on, amount').order('spent_on', { ascending: false }).limit(300),
    ])

    const receiptSum = (receiptRes.data || []).reduce((sum, row: any) => sum + Number(row.amount || 0), 0)
    const salarySum = (salaryRes.data || []).reduce((sum, row: any) => sum + Number(row.amount || 0), 0)
    const expenseSum = (expenseRes.data || []).reduce((sum, row: any) => sum + Number(row.amount || 0), 0)

    setReceiptsTotal(receiptSum)
    setSalaryTotal(salarySum)
    setExpenseTotal(expenseSum)

    const accumulator = new Map<string, MonthlySeries>()

    ;(receiptMonthly.data || []).forEach((row: any) => {
      const key = String(row.purchase_date).slice(0, 7)
      if (!accumulator.has(key)) accumulator.set(key, { month: key, receipts: 0, salaries: 0, expenses: 0, total: 0 })
      accumulator.get(key)!.receipts += Number(row.amount || 0)
    })

    ;(salaryMonthly.data || []).forEach((row: any) => {
      const key = String(row.month).slice(0, 7)
      if (!accumulator.has(key)) accumulator.set(key, { month: key, receipts: 0, salaries: 0, expenses: 0, total: 0 })
      accumulator.get(key)!.salaries += Number(row.amount || 0)
    })

    ;(expenseMonthly.data || []).forEach((row: any) => {
      const key = String(row.spent_on).slice(0, 7)
      if (!accumulator.has(key)) accumulator.set(key, { month: key, receipts: 0, salaries: 0, expenses: 0, total: 0 })
      accumulator.get(key)!.expenses += Number(row.amount || 0)
    })

    const series = Array.from(accumulator.values())
      .map(row => ({ ...row, total: row.receipts + row.salaries + row.expenses }))
      .sort((a, b) => (a.month < b.month ? 1 : -1))
      .slice(0, 12)

    setMonthlySeries(series)
  }

  useEffect(() => {
    loadReport(month)
  }, [month])

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Monthly Reports</h1>
          <p className="text-gray-500 text-sm font-mono mt-1">View salary + receipts + all expenses in one report.</p>
        </div>
        <div>
          <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">Report Month</label>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="factory-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Receipts" value={receiptsTotal} color="text-orange-400" />
        <StatCard title="Salaries" value={salaryTotal} color="text-emerald-400" />
        <StatCard title="Other Expenses" value={expenseTotal} color="text-rose-400" />
        <StatCard title="Total Spending" value={grandTotal} color="text-white" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">12-Month Spending Trend</h2>
        {monthlySeries.length === 0 ? (
          <p className="text-gray-500 text-sm font-mono">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {monthlySeries.map(row => (
              <div key={row.month} className="border border-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">{new Date(`${row.month}-01`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
<<<<<<< HEAD
                  <p className="text-orange-300 font-semibold">{Math.round(row.total).toLocaleString('en-IQ')} IQD</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <span className="text-orange-400">Receipts: {Math.round(row.receipts).toLocaleString('en-IQ')} IQD</span>
                  <span className="text-emerald-400">Salaries: {Math.round(row.salaries).toLocaleString('en-IQ')} IQD</span>
                  <span className="text-rose-400">Expenses: {Math.round(row.expenses).toLocaleString('en-IQ')} IQD</span>
=======
                  <p className="text-orange-300 font-semibold">${row.total.toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <span className="text-orange-400">Receipts: ${row.receipts.toFixed(2)}</span>
                  <span className="text-emerald-400">Salaries: ${row.salaries.toFixed(2)}</span>
                  <span className="text-rose-400">Expenses: ${row.expenses.toFixed(2)}</span>
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-gray-500 text-xs uppercase tracking-wide font-mono">{title}</p>
<<<<<<< HEAD
      <p className={`text-2xl font-semibold mt-2 ${color}`}>{Math.round(value).toLocaleString('en-IQ')} IQD</p>
=======
      <p className={`text-2xl font-semibold mt-2 ${color}`}>${value.toFixed(2)}</p>
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
    </div>
  )
}
