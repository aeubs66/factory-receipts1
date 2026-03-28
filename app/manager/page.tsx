'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types'
import ReceiptCard from '@/components/ReceiptCard'
import ReceiptModal from '@/components/ReceiptModal'
import { useLanguage } from '@/components/LanguageProvider'

export default function ManagerDashboard() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Receipt | null>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, totalPaid: 0 })
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const { t } = useLanguage()

  const fetchReceipts = async () => {
    const { data } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setReceipts(data as Receipt[])
      setStats({
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        approved: data.filter(r => r.status === 'approved').length,
        totalPaid: data.filter(r => r.status === 'approved').reduce((s, r) => s + Number(r.amount), 0),
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReceipts()

    const channel = supabase
      .channel('receipts-manager-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'receipts' },
        () => {
          fetchReceipts()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleApprove = async (id: string) => {
    setActionLoadingId(id)
    const { error } = await supabase
      .from('receipts')
      .update({ status: 'approved' })
      .eq('id', id)

    if (error) {
      alert(`Could not approve receipt: ${error.message}`)
    } else {
      await fetchReceipts()
    }
    setActionLoadingId(null)
  }

  const handleReject = async (id: string) => {
    setRejectingId(id)
    setRejectReason('')
  }

  const handleConfirmReject = async () => {
    if (!rejectingId) return
    const trimmed = rejectReason.trim()
    if (!trimmed) {
      alert('A rejection reason is required.')
      return
    }

    setActionLoadingId(rejectingId)
    const { error } = await supabase
      .from('receipts')
      .update({ status: 'rejected', manager_note: trimmed })
      .eq('id', rejectingId)

    if (error) {
      alert(`Could not reject receipt: ${error.message}`)
    } else {
      await fetchReceipts()
    }
    setActionLoadingId(null)
    setRejectingId(null)
    setRejectReason('')
  }

  const handleCancelReject = () => {
    setRejectingId(null)
    setRejectReason('')
  }

  const pendingReceipts = receipts.filter(r => r.status === 'pending')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white font-sans">{t('manager.dashboard.title')}</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">{t('manager.dashboard.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('manager.dashboard.totalReceipts'), value: stats.total, color: 'text-white' },
          { label: t('manager.dashboard.awaitingReview'), value: stats.pending, color: 'text-amber-400', highlight: stats.pending > 0 },
          { label: t('manager.dashboard.approved'), value: stats.approved, color: 'text-emerald-400' },
          { label: t('manager.dashboard.totalPaidOut'), value: `${Math.round(stats.totalPaid).toLocaleString('en-IQ')} IQD`, color: 'text-orange-400' },
        ].map(stat => (
          <div
            key={stat.label}
            className={`bg-gray-900 border rounded-xl p-5 ${stat.highlight ? 'border-amber-800/60 bg-amber-950/20' : 'border-gray-800'}`}
          >
            <div className="text-gray-500 text-xs font-mono mb-2 uppercase tracking-wider">{stat.label}</div>
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
            {stat.highlight && (
              <div className="text-amber-500/70 text-xs font-mono mt-1">{t('manager.dashboard.needsAttention')}</div>
            )}
          </div>
        ))}
      </div>

      {/* Pending section */}
      {pendingReceipts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-white font-sans">{t('manager.dashboard.pendingApproval')}</h2>
            <span className="bg-amber-900/40 text-amber-400 border border-amber-800/50 text-xs font-mono px-2 py-0.5 rounded-full">
              {pendingReceipts.length} waiting
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pendingReceipts.map(r => (
              <ReceiptCard
                key={r.id}
                receipt={r}
                showActions
                onApprove={handleApprove}
                onReject={handleReject}
                onView={setSelected}
                disabled={actionLoadingId === r.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* All receipts */}
      <div className="pb-8">
        <h2 className="text-lg font-semibold text-white font-sans mb-4">Pending & Rejected Receipts</h2>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : receipts.length === 0 ? (
          <div className="text-center py-20 text-gray-600 font-mono">
            <div className="text-4xl mb-3">📬</div>
            {t('manager.dashboard.noReceipts')}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {receipts.filter(r => r.status !== 'approved').map(r => (
              <ReceiptCard
                key={r.id}
                receipt={r}
                showActions
                onApprove={handleApprove}
                onReject={handleReject}
                onView={setSelected}
                disabled={actionLoadingId === r.id}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ReceiptModal
          receipt={selected}
          isManager={true}
          onClose={() => setSelected(null)}
          onUpdate={fetchReceipts}
        />
      )}

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleCancelReject}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl shadow-black/50"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white font-sans">
                {t('manager.rejectModal.title')}
              </h2>
              <button
                type="button"
                onClick={handleCancelReject}
                className="text-gray-500 hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">
                {t('manager.rejectModal.label')}
              </label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="factory-input h-24 resize-none"
                placeholder={t('manager.rejectModal.placeholder')}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelReject}
                className="flex-1 factory-btn-secondary text-xs"
              >
                {t('manager.rejectModal.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={actionLoadingId === rejectingId}
                className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-mono text-xs rounded-lg py-2.5 px-4"
              >
                {t('manager.rejectModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
