'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/types'
import { useLanguage } from '@/components/LanguageProvider'
import AddExpenseRequestModal from '@/components/AddExpenseRequestModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import ExpenseHistoryModal from '@/components/ExpenseHistoryModal'

export default function ManagerMyExpensesPage() {
  const [expenses, setExpenses] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Receipt | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<Receipt | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const { t } = useLanguage()

  const fetchExpenses = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setUserId(session.user.id)

    const { data } = await supabase
      .from('receipts')
      .select('*')
      .eq('worker_id', 'expense_request')
      .eq('submitted_by', session.user.id)
      .order('created_at', { ascending: false })

    if (data) setExpenses(data as Receipt[])
    setLoading(false)
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleDelete = async () => {
    if (!expenseToDelete) return
    setDeletingId(expenseToDelete.id)
    // Soft delete: change status to 'deleted'
    const { error } = await supabase.from('receipts').update({ status: 'deleted' }).eq('id', expenseToDelete.id)
    if (error) {
      alert(`Could not delete: ${error.message}`)
    } else {
      await fetchExpenses()
    }
    setDeletingId(null)
    setExpenseToDelete(null)
  }

  const pendingExpenses = expenses.filter(e => e.status === 'pending')
  const historyExpenses = expenses.filter(e => e.status !== 'pending')

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">{t('sidebar.myExpenses')}</h1>
          <p className="text-gray-500 text-sm font-mono mt-1">Manage your own submitted expense requests</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowHistoryModal(true)} 
            className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors relative"
            title="View History"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {historyExpenses.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-950"></span>
            )}
          </button>
          <button onClick={() => setShowAddModal(true)} className="factory-btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('manager.expense.title')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pendingExpenses.length === 0 ? (
        <div className="text-center py-20 text-gray-600 font-mono bg-gray-900 border border-gray-800 rounded-2xl">
          <div className="text-4xl mb-3">💸</div>
          No pending expenses right now
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pendingExpenses.map(expense => (
            <div key={expense.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 relative group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-semibold text-sm truncate font-sans pr-8">{expense.item_description}</h3>
                  <div className="text-gray-500 text-xs font-mono mt-1">
                    {new Date(expense.purchase_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-orange-400 font-bold text-lg font-mono">
                    {Math.round(Number(expense.amount)).toLocaleString('en-IQ')} {expense.currency || 'IQD'}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider status-${expense.status}`}>
                      {expense.status}
                    </span>
                  </div>
                </div>
              </div>

              {expense.manager_note && (
                <div className="bg-gray-800/50 rounded-lg px-3 py-2 mt-3">
                  <p className="text-gray-400 text-xs font-mono break-words">{expense.manager_note}</p>
                </div>
              )}

              {expense.status === 'pending' && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800/50">
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="flex-1 factory-btn-secondary text-xs py-2"
                    disabled={deletingId === expense.id}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setExpenseToDelete(expense)}
                    disabled={deletingId === expense.id}
                    className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50 font-mono text-xs py-2 rounded-lg transition-colors"
                  >
                    {deletingId === expense.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(showAddModal || editingExpense) && (
        <AddExpenseRequestModal
          initialData={editingExpense}
          onClose={() => {
            setShowAddModal(false)
            setEditingExpense(null)
          }}
          onSuccess={() => {
            setShowAddModal(false)
            setEditingExpense(null)
            fetchExpenses()
          }}
        />
      )}

      {expenseToDelete && (
        <ConfirmDeleteModal
          title="Delete Expense Request"
          message="Are you sure you want to delete this expense request? It will be moved to your history and cannot be recovered."
          isDeleting={deletingId !== null}
          onConfirm={handleDelete}
          onCancel={() => setExpenseToDelete(null)}
        />
      )}

      {showHistoryModal && (
        <ExpenseHistoryModal
          expenses={historyExpenses}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  )
}
