'use client'

import { useState } from 'react'
import { Receipt } from '@/types'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'

interface ReceiptModalProps {
  receipt: Receipt
  isManager: boolean
  onClose: () => void
  onUpdate: () => void
}

export default function ReceiptModal({ receipt, isManager, onClose, onUpdate }: ReceiptModalProps) {
  const [note, setNote] = useState(receipt.manager_note || '')
  const [loading, setLoading] = useState(false)
<<<<<<< HEAD
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    worker_name: receipt.worker_name,
    worker_id: receipt.worker_id,
    item_description: receipt.item_description,
    amount: receipt.amount ? receipt.amount.toLocaleString('en-US') : '',
    purchase_date: receipt.purchase_date.split('T')[0]
  })
=======
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
  const { t } = useLanguage()

  const handleAction = async (action: 'approved' | 'rejected') => {
    setLoading(true)
    const { error } = await supabase
      .from('receipts')
      .update({ status: action, manager_note: note })
      .eq('id', receipt.id)

    if (!error) {
      onUpdate()
      onClose()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this receipt? This action cannot be undone.')) return
    setLoading(true)
    const { error } = await supabase.from('receipts').delete().eq('id', receipt.id)
    if (!error) {
      onUpdate()
      onClose()
    } else {
      alert(`Could not delete receipt: ${error.message}`)
    }
    setLoading(false)
  }

<<<<<<< HEAD
  const handleSaveEdit = async () => {
    setLoading(true)
    const { error } = await supabase.from('receipts').update({
      worker_name: editForm.worker_name,
      worker_id: editForm.worker_id,
      item_description: editForm.item_description,
      amount: Number(editForm.amount.replace(/,/g, '')),
      purchase_date: editForm.purchase_date,
    }).eq('id', receipt.id)
    
    if (!error) {
      onUpdate()
      setIsEditing(false)
    } else {
      alert(`Could not update receipt: ${error.message}`)
    }
    setLoading(false)
  }

=======
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-white font-bold text-lg font-sans">{t('modal.title')}</h2>
            <p className="text-gray-500 text-xs font-mono">#{receipt.id.slice(0, 16)}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
<<<<<<< HEAD
              onClick={() => setIsEditing(!isEditing)} 
              disabled={loading}
              className="text-blue-500 hover:text-blue-400 transition-colors disabled:opacity-50"
              title="Edit Receipt"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
=======
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef
              onClick={handleDelete} 
              disabled={loading}
              className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
              title="Delete Receipt"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button onClick={onClose} disabled={loading} className="text-gray-500 hover:text-white transition-colors disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status badge */}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono status-${receipt.status}`}>
            {receipt.status.toUpperCase()}
          </span>

          {/* Image */}
          {receipt.image_url && (
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <img src={receipt.image_url} alt="Receipt" className="w-full max-h-64 object-contain bg-gray-950" />
            </div>
          )}

<<<<<<< HEAD
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-xs font-mono mb-1 block">{t('modal.workerName')}</label>
                  <input className="factory-input" value={editForm.worker_name} onChange={e => setEditForm({...editForm, worker_name: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-mono mb-1 block">{t('modal.workerId')}</label>
                  <input className="factory-input" value={editForm.worker_id} onChange={e => setEditForm({...editForm, worker_id: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-mono mb-1 block">{t('modal.amount')}</label>
                  <input className="factory-input" type="text" value={editForm.amount} onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '')
                    setEditForm({...editForm, amount: val ? Number(val).toLocaleString('en-US') : ''})
                  }} />
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-mono mb-1 block">{t('modal.purchaseDate')}</label>
                  <input className="factory-input" type="date" value={editForm.purchase_date} onChange={e => setEditForm({...editForm, purchase_date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs font-mono mb-1 block">{t('modal.itemDescription')}</label>
                <input className="factory-input w-full" value={editForm.item_description} onChange={e => setEditForm({...editForm, item_description: e.target.value})} />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button onClick={() => setIsEditing(false)} disabled={loading} className="factory-btn-secondary text-sm py-2 px-4">Cancel</button>
                <button onClick={handleSaveEdit} disabled={loading} className="factory-btn-primary text-sm py-2 px-4">Save Changes</button>
              </div>
            </div>
          ) : (
            <>
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t('modal.workerName'), value: receipt.worker_name },
                  { label: t('modal.workerId'), value: receipt.worker_id },
                  { label: t('modal.amount'), value: `${Math.round(Number(receipt.amount)).toLocaleString('en-IQ')} IQD` },
                  { label: t('modal.purchaseDate'), value: new Date(receipt.purchase_date).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs font-mono mb-1">{label}</div>
                    <div className="text-white text-sm font-mono">{value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-500 text-xs font-mono mb-1">{t('modal.itemDescription')}</div>
                <div className="text-white text-sm font-mono">{receipt.item_description}</div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-500 text-xs font-mono mb-1">{t('modal.submitted')}</div>
                <div className="text-white text-sm font-mono">
                  {new Date(receipt.created_at).toLocaleString()}
                </div>
              </div>
            </>
          )}
=======
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: t('modal.workerName'), value: receipt.worker_name },
              { label: t('modal.workerId'), value: receipt.worker_id },
              { label: t('modal.amount'), value: `${Math.round(Number(receipt.amount)).toLocaleString('en-IQ')} IQD` },
              { label: t('modal.purchaseDate'), value: new Date(receipt.purchase_date).toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-gray-500 text-xs font-mono mb-1">{label}</div>
                <div className="text-white text-sm font-mono">{value}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-500 text-xs font-mono mb-1">{t('modal.itemDescription')}</div>
            <div className="text-white text-sm font-mono">{receipt.item_description}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-500 text-xs font-mono mb-1">{t('modal.submitted')}</div>
            <div className="text-white text-sm font-mono">
              {new Date(receipt.created_at).toLocaleString()}
            </div>
          </div>
>>>>>>> b315db18d22f91f406527f4e20b3deb5012af5ef

          {/* Manager actions */}
          {isManager && receipt.status === 'pending' && (
            <div className="border-t border-gray-800 pt-5 space-y-3">
              <label className="text-gray-400 text-xs font-mono uppercase tracking-wider block">
                {t('modal.managerNoteLabel')}
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                className="factory-input resize-none h-20"
                placeholder={t('modal.managerNotePlaceholder')}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction('approved')}
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors font-mono text-sm disabled:opacity-50"
                >
                  {t('modal.approveAndPay')}
                </button>
                <button
                  onClick={() => handleAction('rejected')}
                  disabled={loading}
                  className="flex-1 bg-red-900/50 hover:bg-red-900/70 text-red-400 border border-red-800/50 font-bold py-3 px-4 rounded-lg transition-colors font-mono text-sm disabled:opacity-50"
                >
                  {t('modal.reject')}
                </button>
              </div>
            </div>
          )}

          {/* Show existing manager note if resolved */}
          {receipt.manager_note && receipt.status !== 'pending' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
              <div className="text-gray-500 text-xs font-mono mb-1">{t('modal.managerNote')}</div>
              <div className="text-gray-300 text-sm font-mono">{receipt.manager_note}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
