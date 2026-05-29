import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { title, category, description, submitter_name, location, contact_email } = body

  if (!title?.trim())          return NextResponse.json({ error: 'Problem title is required.' }, { status: 400 })
  if (!category?.trim())       return NextResponse.json({ error: 'Category is required.' }, { status: 400 })
  if (!description?.trim())    return NextResponse.json({ error: 'Description is required.' }, { status: 400 })
  if (!submitter_name?.trim()) return NextResponse.json({ error: 'Your name is required.' }, { status: 400 })

  if (title.length > 200)        return NextResponse.json({ error: 'Title is too long (max 200 chars).' }, { status: 400 })
  if (description.length > 5000) return NextResponse.json({ error: 'Description is too long (max 5000 chars).' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('problems')
    .insert([{
      title:          title.trim(),
      category:       category.trim(),
      description:    description.trim(),
      submitter_name: submitter_name.trim(),
      location:       location?.trim() || null,
      contact_email:  contact_email?.trim() || null,
      status:         'Unresolved',
      approved:       false,
    }])
    .select('id')

  if (error) {
    console.error('Supabase insert error:', JSON.stringify(error))
    return NextResponse.json({
      error: `Database error: ${error.message}`,
      code:  error.code    || null,
      hint:  error.hint    || null,
      details: error.details || null,
    }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data[0].id }, { status: 201 })
}
