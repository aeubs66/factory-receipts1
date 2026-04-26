'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'

interface AddExpenseRequestModalProps {
  initialData?: Receipt | null
  onClose: () => void
  onSuccess: () => void
}

export default function AddExpenseRequestModal({ initialData, onClose, onSuccess }: AddExpenseRequestModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { t } = useLanguage()

  const [form, setForm] = useState({
    name: initialData?.item_description || '',
    amount: initialData?.amount ? initialData.amount.toLocaleString('en-US') : '',
    currency: initialData?.currency || 'IQD',
    note: initialData?.manager_note || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const payload = {
        worker_name: 'Expense Request',
        worker_id: 'expense_request',
        item_description: form.name,
        amount: parseFloat(form.amount.replace(/,/g, '')),
        purchase_date: initialData ? initialData.purchase_date : new Date().toISOString().split('T')[0],
        status: 'pending',
        submitted_by: user.id,
        add_as_expense: true,
        expense_category: 'operations',
        currency: form.currency,
        manager_note: form.note,
      }

      let reqError
      if (initialData) {
        const { error } = await supabase.from('receipts').update(payload).eq('id', initialData.id)
        reqError = error
      } else {
        const { error } = await supabase.from('receipts').insert(payload)
        reqError = error
      }

      if (reqError) throw reqError

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl shadow-black/50 animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10">
          <div>
            <h2 className="text-xl font-bold text-white font-sans">
              {initialData ? 'Edit Expense' : t('manager.expense.title')}
            </h2>
            <p className="text-gray-500 text-xs font-mono mt-1">
              {initialData ? 'Update your expense request' : t('manager.expense.subtitle')}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-900/30 border border-red-800/50 text-red-400 px-5 py-4 rounded-xl font-mono text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                {t('manager.expense.name')}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="factory-input"
                placeholder={t('manager.expense.namePlaceholder')}
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                  {t('manager.expense.amount')}
                </label>
                <input
                  type="text"
                  value={form.amount}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '')
                    setForm(p => ({ ...p, amount: val ? Number(val).toLocaleString('en-US') : '' }))
                  }}
                  className="factory-input"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                  {t('manager.expense.currency')}
                </label>
                <select
                  value={form.currency}
                  onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
                  className="factory-input"
                >
                  <option value="IQD">IQD</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                {t('manager.expense.note')}
              </label>
              <textarea
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                className="factory-input h-24 resize-none"
                placeholder={t('manager.expense.notePlaceholder')}
              />
            </div>

            <div className="flex gap-3 sticky bottom-0 pt-4 pb-2 bg-gray-900">
              <button type="button" onClick={onClose} className="factory-btn-secondary py-3 px-6">
                {t('manager.expense.cancel')}
              </button>
              <button type="submit" disabled={loading} className="factory-btn-primary flex-1 py-3 px-6 flex items-center justify-center">
                {loading ? t('manager.expense.submitting') : (initialData ? 'Save Changes' : t('manager.expense.submit'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
