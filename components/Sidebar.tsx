'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageProvider'

interface SidebarProps {
  role: 'admin' | 'manager'
  userName: string
}

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: <GridIcon /> },
  { href: '/admin/new', label: 'New Receipt', icon: <PlusIcon /> },
  { href: '/admin/history', label: 'My Receipts', icon: <DocumentIcon /> },
  { href: '/admin/users', label: 'User Accounts', icon: <UsersIcon /> },
  { href: '/admin/workers', label: 'Workers', icon: <WorkersIcon /> },
  { href: '/admin/salaries', label: 'Salaries', icon: <SalaryIcon /> },
  { href: '/admin/expenses', label: 'Expenses', icon: <ExpenseIcon /> },
  { href: '/admin/reports', label: 'Reports', icon: <ReportIcon /> },
]

const managerLinks = [
  { href: '/manager', label: 'Dashboard', icon: <GridIcon /> },
  { href: '/manager/pending', label: 'Pending', icon: <ClockIcon /> },
  { href: '/manager/all', label: 'All Receipts', icon: <ListIcon /> },
]

export default function Sidebar({ role, userName }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const links = role === 'admin' ? adminLinks : managerLinks
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const userSectionRef = useRef<HTMLDivElement | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userSectionRef.current) return
      if (event.target instanceof Node && !userSectionRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const translatedLinks = links.map(link => {
    if (role === 'admin') {
      if (link.href === '/admin') return { ...link, label: t('sidebar.dashboard') }
      if (link.href === '/admin/new') return { ...link, label: t('sidebar.newReceipt') }
      if (link.href === '/admin/history') return { ...link, label: t('sidebar.myReceipts') }
      if (link.href === '/admin/users') return { ...link, label: t('sidebar.userAccounts') }
      if (link.href === '/admin/workers') return { ...link, label: t('sidebar.workers') }
    } else {
      if (link.href === '/manager') return { ...link, label: t('sidebar.dashboard') }
      if (link.href === '/manager/pending') return { ...link, label: t('sidebar.pending') }
      if (link.href === '/manager/all') return { ...link, label: t('sidebar.allReceipts') }
    }
    return link
  })

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 z-30 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ms-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-white font-bold text-sm font-sans">FactoryPay</div>
        </div>
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${role === 'admin' ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'}`}>
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed md:sticky top-0 bottom-0 start-0 z-50 w-64 h-screen bg-gray-900 border-e border-gray-800 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'} md:translate-x-0 rtl:md:translate-x-0`}>
        <div className="p-6 border-b border-gray-800 hidden md:block">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${role === 'admin' ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm font-sans">FactoryPay</div>
              <div className="text-gray-500 text-xs font-mono">{role === 'admin' ? '👷 Admin' : '👔 Manager'}</div>
            </div>
          </div>
        </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {translatedLinks.map(link => (
          <a key={link.href} href={link.href} className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}>
            {link.icon}
            {link.label}
          </a>
        ))}
      </nav>

      <div ref={userSectionRef} className="p-4 border-t border-gray-800 bg-gray-900/80 relative">
        <div className="flex items-center justify-between gap-3 mb-3">
          <button type="button" onClick={() => setIsAccountMenuOpen(prev => !prev)} className="flex items-center gap-3 min-w-0 group">
            <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 text-xs font-bold group-hover:bg-orange-500/30 transition-colors">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-white text-xs font-mono truncate">{userName}</div>
              <div className={`text-[11px] uppercase tracking-wide font-mono ${role === 'manager' ? 'text-emerald-400' : 'text-orange-400'}`}>{role}</div>
            </div>
          </button>
          <button onClick={handleLogout} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors font-mono">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t('sidebar.signOut')}
          </button>
        </div>

        {isAccountMenuOpen && (
          <div className="absolute bottom-16 left-4 right-4 rounded-lg border border-gray-800 bg-gray-900 shadow-lg shadow-black/40 text-xs font-mono overflow-hidden z-50">
            <button
              type="button"
              onClick={() => {
                setIsAccountMenuOpen(false)
                setIsMobileMenuOpen(false)
                router.push(role === 'admin' ? '/admin/account' : '/manager/account')
              }}
              className="w-full px-3 py-2 text-left text-gray-200 hover:bg-gray-800/80"
            >
              {t('sidebar.account')}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAccountMenuOpen(false)
                setIsMobileMenuOpen(false)
                router.push(role === 'admin' ? '/admin/settings' : '/manager/settings')
              }}
              className="w-full px-3 py-2 text-left text-gray-200 hover:bg-gray-800/80 border-t border-gray-800"
            >
              {t('sidebar.settings')}
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  )
}

function GridIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2" /></svg> }
function PlusIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg> }
function DocumentIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
function UsersIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 14a4 4 0 10-8 0m8 0v1a4 4 0 11-8 0v-1m8 0H8" /></svg> }
function WorkersIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm8 0c-.512 0-1.003.097-1.457.273A4.978 4.978 0 0118 17v1h4v-1c0-2.21-1.79-4-4-4z" /></svg> }
function SalaryIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-3.314 0-6 1.12-6 2.5S8.686 13 12 13s6-1.12 6-2.5S15.314 8 12 8zm-6 5c0 1.38 2.686 2.5 6 2.5s6-1.12 6-2.5m-12 2.5c0 1.38 2.686 2.5 6 2.5s6-1.12 6-2.5" /></svg> }
function ExpenseIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l2 2 4-4m5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
function ReportIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18M7 14l3-3 3 2 4-5" /></svg> }
function ClockIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
function ListIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> }
