'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt, ReceiptStatus } from '@/types'
import ReceiptCard from '@/components/ReceiptCard'
import ReceiptModal from '@/components/ReceiptModal'

export default function AdminHistoryPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [filter, setFilter] = useState<ReceiptStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Receipt | null>(null)

  const fetchReceipts = async () => {
    let query = supabase.from('receipts').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    if (data) setReceipts(data as Receipt[])
    setLoading(false)
  }

  useEffect(() => {
    fetchReceipts()

    const channel = supabase
      .channel('receipts-admin-history')
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
  }, [filter])

  const filters: { label: string; value: ReceiptStatus | 'all'; color: string }[] = [
    { label: 'All', value: 'all', color: 'text-white' },
    { label: 'Pending', value: 'pending', color: 'text-amber-400' },
    { label: 'Approved', value: 'approved', color: 'text-emerald-400' },
    { label: 'Rejected', value: 'rejected', color: 'text-red-400' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-sans">My Receipts</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">Track all your submitted receipts</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
              filter === f.value
                ? 'bg-gray-700 ' + f.color
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : receipts.length === 0 ? (
        <div className="text-center py-20 text-gray-600 font-mono">
          <div className="text-4xl mb-3">📭</div>
          No receipts found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {receipts.map(r => (
            <ReceiptCard key={r.id} receipt={r} onView={setSelected} />
          ))}
        </div>
      )}

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
