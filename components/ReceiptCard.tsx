'use client'

import { Receipt } from '@/types'
import { useLanguage } from '@/components/LanguageProvider'

interface ReceiptCardProps {
  receipt: Receipt
  showActions?: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onView?: (receipt: Receipt) => void
  disabled?: boolean
}

const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

export default function ReceiptCard({
  receipt,
  showActions = false,
  onApprove,
  onReject,
  onView,
  disabled = false,
}: ReceiptCardProps) {
  const { t } = useLanguage()

  const localizedStatusLabels: Record<ReceiptStatus, string> = {
    pending: t('receipt.status.pending'),
    approved: t('receipt.status.approved'),
    rejected: t('receipt.status.rejected'),
    deleted: 'Deleted',
  }

  return (
    <div className="receipt-card rounded-xl p-5 animate-slide-in">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono status-${receipt.status}`}>
              {localizedStatusLabels[receipt.status]}
            </span>
            <span className="text-gray-600 text-xs font-mono">#{receipt.id.slice(0, 8)}</span>
          </div>
          <h3 className="text-white font-semibold text-sm truncate font-sans">{receipt.item_description}</h3>
          <p className="text-gray-500 text-xs font-mono mt-0.5">
            {t('receipt.worker')}: {receipt.worker_name} · {t('receipt.id')}: {receipt.worker_id}
          </p>
        </div>
        <div className="text-right">
          <div className="text-orange-400 font-bold text-lg font-mono">
            {Math.round(Number(receipt.amount)).toLocaleString('en-IQ')} IQD
          </div>
          <div className="text-gray-600 text-xs font-mono">
            {new Date(receipt.purchase_date).toLocaleDateString()}
          </div>
        </div>
      </div>

      {receipt.image_url && (
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-800">
          <img
            src={receipt.image_url}
            alt="Receipt"
            className="w-full h-32 object-cover"
          />
        </div>
      )}

      {receipt.manager_note && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 mb-4">
          <span className="text-gray-500 text-xs font-mono">{t('receipt.managerNotePrefix')} </span>
          <span className="text-gray-300 text-xs font-mono">{receipt.manager_note}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-3">
        {onView && (
          <button
            type="button"
            onClick={() => onView(receipt)}
            className="factory-btn-secondary text-[11px] py-2 px-3 sm:w-auto"
          >
            {t('receipt.viewDetails')}
          </button>
        )}
        {showActions && receipt.status === 'pending' && (
          <>
            <button
              type="button"
              onClick={() => !disabled && onApprove && onApprove(receipt.id)}
              disabled={disabled}
              className="flex-1 bg-emerald-900/30 hover:bg-emerald-900/50 disabled:opacity-60 disabled:cursor-not-allowed text-emerald-400 border border-emerald-800/50 font-mono text-[11px] py-2 px-3 rounded-lg transition-colors"
            >
              {t('receipt.approve')}
            </button>
            <button
              type="button"
              onClick={() => !disabled && onReject && onReject(receipt.id)}
              disabled={disabled}
              className="flex-1 bg-red-900/30 hover:bg-red-900/50 disabled:opacity-60 disabled:cursor-not-allowed text-red-400 border border-red-800/50 font-mono text-[11px] py-2 px-3 rounded-lg transition-colors"
            >
              {t('receipt.reject')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
