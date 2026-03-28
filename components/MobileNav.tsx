import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/LanguageProvider'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: <GridIcon /> },
  { href: '/admin/new', label: 'New Receipt', icon: <PlusIcon /> },
  { href: '/admin/history', label: 'My Receipts', icon: <DocumentIcon /> },
  { href: '/admin/reports', label: 'Reports', icon: <ReportIcon /> },
]

const managerLinks = [
  { href: '/manager', label: 'Dashboard', icon: <GridIcon /> },
  { href: '/manager/pending', label: 'Pending', icon: <ClockIcon /> },
  { href: '/manager/all', label: 'All Receipts', icon: <ListIcon /> },
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
    } else {
      if (link.href === '/manager') return { ...link, label: t('sidebar.dashboard') }
      if (link.href === '/manager/pending') return { ...link, label: t('sidebar.pending') }
      if (link.href === '/manager/all') return { ...link, label: t('sidebar.allReceipts') }
    }
    return link
  })

  const settingsLink = {
    href: role === 'admin' ? '/admin/settings' : '/manager/settings',
    label: t('sidebar.settings'),
    icon: <SettingsIcon />,
  }

  const displayLinks = [...translatedLinks, settingsLink]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex justify-around items-center h-16">
        {displayLinks.map(link => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
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

function GridIcon() { return <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2" /></svg> }
function PlusIcon() { return <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg> }
function DocumentIcon() { return <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
function ReportIcon() { return <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18M7 14l3-3 3 2 4-5" /></svg> }
function ClockIcon() { return <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
function ListIcon() { return <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> }
function SettingsIcon() { return <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
