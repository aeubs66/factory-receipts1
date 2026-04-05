'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'

interface Worker {
  id: string
  name: string
}

interface AddReceiptModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddReceiptModal({ onClose, onSuccess }: AddReceiptModalProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [addAsExpense, setAddAsExpense] = useState(false)
  const [expenseCategory, setExpenseCategory] = useState('operations')
  const [customExpenseCategory, setCustomExpenseCategory] = useState('')
  const { t } = useLanguage()

  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedWorkerId, setSelectedWorkerId] = useState('')

  const [form, setForm] = useState({
    worker_name: '',
    worker_id: '',
    item_description: '',
    amount: '',
    purchase_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const loadWorkers = async () => {
      const { data } = await supabase
        .from('workers')
        .select('id, name')
        .order('name', { ascending: true })

      if (data && data.length > 0) {
        setWorkers(data as Worker[])
        setSelectedWorkerId(data[0].id as string)
        setForm(p => ({ ...p, worker_id: data[0].id as string, worker_name: (data[0] as any).name }))
      }
    }
    loadWorkers()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let image_url: string | null = null

      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, imageFile, { upsert: false })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName)

        image_url = publicUrl
      }

      const selectedWorker = workers.find(w => w.id === selectedWorkerId)

      const finalCategory = addAsExpense 
        ? (expenseCategory === 'other' && customExpenseCategory.trim() ? customExpenseCategory.trim() : expenseCategory) 
        : 'operations'

      const { error: insertError } = await supabase.from('receipts').insert({
        worker_name: selectedWorker ? selectedWorker.name : form.worker_name,
        worker_id: selectedWorker ? selectedWorker.id : form.worker_id,
        item_description: form.item_description,
        amount: parseFloat(form.amount.replace(/,/g, '')),
        purchase_date: form.purchase_date,
        image_url,
        status: 'pending',
        submitted_by: user.id,
        add_as_expense: addAsExpense,
        expense_category: finalCategory,
      })

      if (insertError) throw insertError

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl shadow-black/50 animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10">
          <div>
            <h2 className="text-xl font-bold text-white font-sans">{t('admin.new.title')}</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">{t('admin.new.subtitle')}</p>
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
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-4">
              <h2 className="text-white font-semibold font-sans text-sm uppercase tracking-wide text-gray-400">
                {t('admin.new.workerInfo')}
              </h2>
              <div>
                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                  {t('admin.new.worker')}
                </label>
                <select
                  value={selectedWorkerId}
                  onChange={e => {
                    const id = e.target.value
                    setSelectedWorkerId(id)
                    const worker = workers.find(w => w.id === id)
                    if (worker) {
                      setForm(p => ({ ...p, worker_id: worker.id, worker_name: worker.name }))
                    }
                  }}
                  className="factory-input"
                  required
                >
                  <option value="">{t('admin.new.selectWorker')}</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-4">
              <h2 className="text-white font-semibold font-sans text-sm uppercase tracking-wide text-gray-400">
                {t('admin.new.purchaseDetails')}
              </h2>
              <div>
                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                  {t('admin.new.itemDesc')}
                </label>
                <input
                  type="text"
                  value={form.item_description}
                  onChange={e => setForm(p => ({ ...p, item_description: e.target.value }))}
                  className="factory-input"
                  placeholder="What was purchased?"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                    {t('admin.new.amount')}
                  </label>
                  <input
                    type="text"
                    value={form.amount}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      setForm(p => ({ ...p, amount: val ? Number(val).toLocaleString('en-US') : '' }))
                    }}
                    className="factory-input"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                    {t('admin.new.date')}
                  </label>
                  <input
                    type="date"
                    value={form.purchase_date}
                    onChange={e => setForm(p => ({ ...p, purchase_date: e.target.value }))}
                    className="factory-input"
                    required
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="add-as-expense"
                    checked={addAsExpense}
                    onChange={e => setAddAsExpense(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="add-as-expense" className="text-gray-300 text-sm font-mono cursor-pointer">
                    Add as Expense automatically upon approval
                  </label>
                </div>
                {addAsExpense && (
                  <div className="ml-7 animate-slide-in">
                    <label className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2 block">
                      Expense Category
                    </label>
                    <select 
                      value={expenseCategory} 
                      onChange={e => setExpenseCategory(e.target.value)} 
                      className="factory-input w-full md:w-1/2"
                    >
                      <option value="operations">Operations</option>
                      <option value="equipment">Equipment</option>
                      <option value="utilities">Utilities</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="transport">Transport</option>
                      <option value="other">Other</option>
                    </select>
                    {expenseCategory === 'other' && (
                      <input
                        type="text"
                        value={customExpenseCategory}
                        onChange={e => setCustomExpenseCategory(e.target.value)}
                        placeholder="Please specify category"
                        className="factory-input w-full md:w-1/2 mt-2"
                        required={expenseCategory === 'other'}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-white font-semibold font-sans text-sm uppercase tracking-wide text-gray-400 mb-4">
                {t('admin.new.image')}
              </h2>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-700">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain bg-gray-950" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setImageFile(null) }}
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-900/70 transition-colors"
                  >✕</button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-700 hover:border-orange-500/50 rounded-xl p-10 text-center cursor-pointer transition-colors group"
                >
                  <div className="w-12 h-12 bg-gray-800 group-hover:bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                    <svg className="w-6 h-6 text-gray-500 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm font-mono">{t('admin.new.drop')} <span className="text-orange-400">{t('admin.new.browse')}</span></p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            <div className="flex gap-3 sticky bottom-0 pt-4 pb-2 bg-gray-900">
              <button type="button" onClick={onClose} className="factory-btn-secondary py-3 px-6">
                {t('admin.new.cancel')}
              </button>
              <button type="submit" disabled={loading} className="factory-btn-primary flex-1 py-3 px-6 flex items-center justify-center">
                {loading ? 'Submitting...' : t('admin.new.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
