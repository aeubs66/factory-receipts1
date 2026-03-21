import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/LanguageProvider'

const adminLinks = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: '/admin/new',
    label: 'New Receipt',
    icon: (
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    href: '/admin/history',
    label: 'My Receipts',
    icon: (
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/users',
    label: 'User Accounts',
    icon: (
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 14a4 4 0 10-8 0m8 0v1a4 4 0 11-8 0v-1m8 0H8" />
      </svg>
    ),
  },
  {
    href: '/admin/workers',
    label: 'Workers',
    icon: (
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm8 0c-.512 0-1.003.097-1.457.273A4.978 4.978 0 0118 17v1h4v-1c0-2.21-1.79-4-4-4z" />
      </svg>
    ),
  },
]

const managerLinks = [
  {
    href: '/manager',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: '/manager/pending',
    label: 'Pending',
    icon: (
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/manager/all',
    label: 'All Receipts',
    icon: (
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
]

export default function MobileNav({ role }: { role: 'admin' | 'manager' }) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const links = role === 'admin' ? adminLinks : managerLinks

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

  // Also include Account setting link on mobile!
  const accountLink = {
    href: role === 'admin' ? '/admin/account' : '/manager/account',
    label: t('sidebar.account'),
    icon: (
      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }

  // we only show max 5 items in bottom nav usually. 
  // Let's replace workers with account on mobile, or just display up to 5 items tightly.
  // Actually, let's keep all 5 or 6 items if possible, but 5 is standard for bottom nav.
  const displayLinks = role === 'admin' 
    ? [...translatedLinks.slice(0, 4), accountLink] // Skip workers on mobile nav explicitly for space, let them access account
    : [...translatedLinks, accountLink] // 4 items for manager

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex justify-around items-center h-16">
        {displayLinks.map(link => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          // Strict exact match for root paths
          const isExactAction = (link.href === '/admin' && pathname !== '/admin') || (link.href === '/manager' && pathname !== '/manager')
          const isTrulyActive = isActive && !isExactAction

          return (
             <a 
               key={link.href} 
               href={link.href} 
               className={`flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform ${isTrulyActive ? (role === 'manager' ? 'text-emerald-400' : 'text-orange-400') : 'text-gray-500 hover:text-gray-300'}`}
             >
                {link.icon}
                <span className="text-[10px] sm:text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis px-1 max-w-[70px]">{link.label}</span>
             </a>
          )
        })}
      </div>
    </nav>
  )
}
