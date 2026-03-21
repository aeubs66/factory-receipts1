import { supabase } from '@/lib/supabase'

export default async function ManagerAccountPage() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const profile = session
    ? await supabase
        .from('profiles')
        .select('full_name, role, email')
        .eq('id', session.user.id)
        .single()
    : null

  const data = profile?.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans text-white">Account</h1>
        <p className="text-gray-500 text-sm font-mono mt-1">View your personal details and role.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 max-w-xl">
        <div>
          <div className="text-xs font-mono text-gray-500 uppercase mb-1">Name</div>
          <div className="text-sm font-mono text-white">
            {data?.full_name ?? 'Unknown'}
          </div>
        </div>
        <div>
          <div className="text-xs font-mono text-gray-500 uppercase mb-1">Email</div>
          <div className="text-sm font-mono text-white">
            {data?.email ?? session?.user.email ?? 'Not available'}
          </div>
        </div>
        <div>
          <div className="text-xs font-mono text-gray-500 uppercase mb-1">Role</div>
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/60 text-[11px] font-mono uppercase tracking-wide text-emerald-300">
            Manager
          </div>
        </div>
      </div>
    </div>
  )
}

