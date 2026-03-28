'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types'
import ReceiptCard from '@/components/ReceiptCard'
import ReceiptModal from '@/components/ReceiptModal'

export default function ManagerPendingPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Receipt | null>(null)

  const fetchReceipts = async () => {
    const { data } = await supabase
      .from('receipts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }) // oldest first

    if (data) setReceipts(data as Receipt[])
    setLoading(false)
  }

  useEffect(() => {
    fetchReceipts()

    const channel = supabase
      .channel('receipts-manager-pending')
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
    await supabase.from('receipts').update({ status: 'approved' }).eq('id', id)
    fetchReceipts()
  }

  const handleReject = async (id: string) => {
    await supabase.from('receipts').update({ status: 'rejected' }).eq('id', id)
    fetchReceipts()
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Pending Receipts</h1>
          <p className="text-gray-500 text-sm font-mono mt-1">Receipts waiting for your approval</p>
        </div>
        {receipts.length > 0 && (
          <span className="bg-amber-900/40 text-amber-400 border border-amber-800/50 font-mono text-sm px-3 py-1.5 rounded-full">
            {receipts.length} pending
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : receipts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-emerald-400 font-mono text-sm">All caught up! No pending receipts.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {receipts.map(r => (
            <ReceiptCard
              key={r.id}
              receipt={r}
              showActions
              onApprove={handleApprove}
              onReject={handleReject}
              onView={setSelected}
            />
          ))}
        </div>
      )}

      {selected && (
        <ReceiptModal
          receipt={selected}
          isManager={true}
          onClose={() => setSelected(null)}
          onUpdate={fetchReceipts}
        />
      )}
    </div>
  )
}
