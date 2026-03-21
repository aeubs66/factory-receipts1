'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types'
import ReceiptCard from '@/components/ReceiptCard'
import ReceiptModal from '@/components/ReceiptModal'
import { useLanguage } from '@/components/LanguageProvider'

export default function AdminDashboard() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Receipt | null>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, totalAmount: 0 })
  const { t } = useLanguage()

  const fetchReceipts = async () => {
    const { data } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) {
      setReceipts(data as Receipt[])
      setStats({
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        approved: data.filter(r => r.status === 'approved').length,
        rejected: data.filter(r => r.status === 'rejected').length,
        totalAmount: data.filter(r => r.status === 'approved').reduce((s, r) => s + Number(r.amount), 0),
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReceipts()

    const channel = supabase
      .channel('receipts-admin-dashboard')
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

  const statCards = [
    { label: t('admin.dashboard.totalReceipts'), value: stats.total, color: 'text-white' },
    { label: t('admin.dashboard.pending'), value: stats.pending, color: 'text-amber-400' },
    { label: t('admin.dashboard.approved'), value: stats.approved, color: 'text-emerald-400' },
    { label: t('admin.dashboard.totalReimbursed'), value: `${Math.round(stats.totalAmount).toLocaleString('en-IQ')} IQD`, color: 'text-orange-400' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">{t('admin.dashboard.title')}</h1>
          <p className="text-gray-500 text-sm font-mono mt-1">{t('admin.dashboard.subtitle')}</p>
        </div>
        <a href="/admin/new" className="factory-btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('admin.dashboard.newReceipt')}
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-gray-500 text-xs font-mono mb-2 uppercase tracking-wider">{stat.label}</div>
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Receipts */}
      <div className="pb-8">
        <h2 className="text-lg font-semibold text-white font-sans mb-4">{t('admin.dashboard.recentReceipts')}</h2>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : receipts.length === 0 ? (
          <div className="text-center py-20 text-gray-600 font-mono">
            <div className="text-4xl mb-3">📋</div>
            {t('admin.dashboard.noReceipts')}{' '}
            <a href="/admin/new" className="text-orange-400 hover:underline">
              {t('admin.dashboard.submitOne')}
            </a>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {receipts.map(r => (
              <ReceiptCard key={r.id} receipt={r} onView={setSelected} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ReceiptModal
          receipt={selected}
          isManager={false}
          onClose={() => setSelected(null)}
          onUpdate={fetchReceipts}
        />
      )}
    </div>
  )
}
