'use client'

import { useLanguage } from '@/components/LanguageProvider'
import { useRouter } from 'next/navigation'

export default function FactorySettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6 relative">
        <button 
          onClick={() => router.push('/factory')}
          className="p-2 -ms-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors rtl:rotate-180"
          title="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold font-sans text-white">{t('factory.settings.title')}</h1>
          <p className="text-gray-500 text-sm font-mono mt-1">
            {t('factory.settings.subtitle')}
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase mb-1 drop-shadow-sm">
              {t('factory.settings.language')}
            </div>
            <div className="text-sm font-mono text-gray-300">
              {t('factory.settings.languageDesc')}
            </div>
          </div>
          <div className="inline-flex items-center bg-gray-950/60 border border-gray-800 rounded-full p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-4 py-1.5 text-xs font-mono font-bold uppercase rounded-full transition-colors ${
                language === 'en'
                  ? 'bg-orange-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ku')}
              className={`px-4 py-1.5 text-xs font-mono font-bold uppercase rounded-full transition-colors ${
                language === 'ku'
                  ? 'bg-orange-500 text-black shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Kurdish
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-800/60 pt-4 mt-2">
          <p className="text-[11px] font-mono text-gray-500">
            {t('factory.settings.saved')}
          </p>
        </div>
      </div>
    </div>
  )
}
