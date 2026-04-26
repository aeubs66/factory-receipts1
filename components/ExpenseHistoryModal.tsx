'use client'

import { Receipt } from '@/types'

interface ExpenseHistoryModalProps {
  expenses: Receipt[]
  onClose: () => void
}

export default function ExpenseHistoryModal({ expenses, onClose }: ExpenseHistoryModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl shadow-black/50 animate-slide-in flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-sans">Expense History</h2>
              <p className="text-gray-500 text-xs font-mono mt-1">Past expense requests (approved, rejected, deleted)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {expenses.length === 0 ? (
            <div className="text-center py-16 text-gray-600 font-mono">
              <div className="text-4xl mb-3">🕒</div>
              No history found
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map(expense => (
                <div key={expense.id} className={`border rounded-xl p-4 flex flex-col gap-3 ${
                  expense.status === 'approved' ? 'bg-emerald-950/20 border-emerald-900/30' :
                  expense.status === 'rejected' ? 'bg-red-950/20 border-red-900/30' :
                  'bg-gray-800/30 border-gray-700/50 opacity-75'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold text-sm font-sans">{expense.item_description}</h3>
                      <div className="text-gray-500 text-xs font-mono mt-1">
                        {new Date(expense.purchase_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-300 font-bold text-sm font-mono">
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
                    <div className="bg-gray-900/50 rounded-lg px-3 py-2">
                      <span className="text-gray-500 text-[10px] font-mono block mb-1">Note:</span>
                      <p className="text-gray-400 text-xs font-mono break-words">{expense.manager_note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
