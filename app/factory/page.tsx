'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'

interface Worker {
  id: string
  name: string
}

export default function FactoryPage() {
  const { t } = useLanguage()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: cols, error: wErr } = await supabase
          .from('workers')
          .select('id, name')
          .eq('track_attendance', true)
          .order('name')
        
        if (wErr) throw new Error('Worker fetch error: ' + wErr.message)

        if (cols) {
          setWorkers(cols)
        }

        const { data: attData, error: attErr } = await supabase
          .from('attendance')
          .select('worker_id, status')
          .eq('date', today)

        if (attErr) throw new Error('Attendance fetch error: ' + attErr.message)

        if (attData) {
          const loaded: Record<string, 'present' | 'absent'> = {}
          attData.forEach(r => { loaded[r.worker_id] = r.status as 'present' | 'absent' })
          setAttendance(loaded)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [today])

  const toggleStatus = (workerId: string, status: 'present' | 'absent') => {
    setAttendance(prev => ({ ...prev, [workerId]: status }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const records = Object.entries(attendance).map(([workerId, status]) => ({
        worker_id: workerId,
        date: today,
        status,
        recorded_by: user.id
      }))

      if (records.length === 0) return

      const { error: upsertError } = await supabase
        .from('attendance')
        .upsert(records, { onConflict: 'worker_id, date' })

      if (upsertError) throw upsertError

      setSuccess('Attendance saved successfully for today!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-sans">{t('factory.title')}</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">{t('factory.subtitle')} • {today}</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800/50 text-red-400 px-4 py-3 rounded-lg font-mono text-xs mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 px-4 py-3 rounded-lg font-mono text-xs mb-6">
          {success}
        </div>
      )}

      {workers.length === 0 ? (
        <p className="text-gray-600 text-sm font-mono">{t('factory.noWorkers')}</p>
      ) : (
        <div className="space-y-3">
          {workers.map(w => {
            const currentStatus = attendance[w.id]
            return (
              <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
                <span className="text-gray-200 font-mono text-sm font-medium">{w.name}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleStatus(w.id, 'present')}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-colors ${
                      currentStatus === 'present'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : 'bg-gray-800 text-gray-500 border border-transparent hover:bg-gray-700'
                    }`}
                  >
                    {t('factory.present')}
                  </button>
                  <button
                    onClick={() => toggleStatus(w.id, 'absent')}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-colors ${
                      currentStatus === 'absent'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                        : 'bg-gray-800 text-gray-500 border border-transparent hover:bg-gray-700'
                    }`}
                  >
                    {t('factory.absent')}
                  </button>
                </div>
              </div>
            )
          })}

          <div className="pt-6">
            <button
              onClick={handleSave}
              disabled={saving || Object.keys(attendance).length === 0}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl font-mono text-sm transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : t('factory.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
