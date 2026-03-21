import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export async function POST(req: NextRequest) {
  try {
    const { username, password, full_name, role } = await req.json()

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required' },
        { status: 400 }
      )
    }

    const email = `${username}@factory.local`

    if (!['admin', 'manager'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be admin or manager' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || 'Failed to create user' },
        { status: 400 }
      )
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: data.user.id,
      full_name: full_name || username,
      role,
    })

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Unexpected error' },
      { status: 500 }
    )
  }
}

