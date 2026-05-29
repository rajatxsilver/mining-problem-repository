import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    // Check which key is actually being used
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const serviceKeyPreview = process.env.SUPABASE_SERVICE_ROLE_KEY
        ? process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 20) + '...'
        : 'NOT SET'

    // Try fetching ALL rows ignoring approved filter
    const { data, error, count } = await supabaseAdmin
        .from('problems')
        .select('id, title, approved, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })

    return NextResponse.json({
        hasServiceKey,
        serviceKeyPreview,
        error: error?.message || null,
        totalRows: count,
        rows: data,
    })
}