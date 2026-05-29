import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'

  let query = supabaseAdmin
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false })

  if (filter === 'pending')  query = query.eq('approved', false)
  if (filter === 'approved') query = query.eq('approved', true)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
