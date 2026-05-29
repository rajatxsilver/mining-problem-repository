import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { id, approved, status } = await request.json()

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const updates = {}
  if (approved !== undefined) updates.approved = approved
  if (status   !== undefined) updates.status   = status

  const { error } = await supabaseAdmin
    .from('problems')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
