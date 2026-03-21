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
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: t('modal.workerName'), value: receipt.worker_name },
              { label: t('modal.workerId'), value: receipt.worker_id },
              { label: t('modal.amount'), value: `$${Number(receipt.amount).toFixed(2)}` },
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
