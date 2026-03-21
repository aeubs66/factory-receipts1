'use client'

import { useLanguage } from '@/components/LanguageProvider'

export default function ManagerSettingsPage() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans text-white">Settings</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">
          Configure how the app behaves for your account.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 max-w-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase mb-1">
              Language
            </div>
            <div className="text-sm font-mono text-gray-300">
              Choose between English and Kurdish for the interface.
            </div>
          </div>
          <div className="inline-flex items-center bg-gray-950/60 border border-gray-800 rounded-full p-1">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-mono rounded-full transition-colors ${
                language === 'en'
                  ? 'bg-emerald-500 text-black'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ku')}
              className={`px-3 py-1 text-xs font-mono rounded-full transition-colors ${
                language === 'ku'
                  ? 'bg-emerald-500 text-black'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Kurdish
            </button>
          </div>
        </div>
        <p className="text-[11px] font-mono text-gray-500">
          Your choice is saved in this browser and will be used the next time you open the app.
        </p>
      </div>
    </div>
  )
}

