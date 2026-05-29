'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'iitbhu2024'
const STATUSES = ['Unresolved', 'Partially Solved', 'Solved']

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('pending')
  const [actionId, setActionId] = useState(null)
  const [msg, setMsg] = useState(null) // {text, ok}

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false) }
    else setPwError(true)
  }

  const fetchProblems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/problems?filter=${filter}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setProblems(data)
    } catch (e) {
      setMsg({ text: e.message, ok: false })
    }
    setLoading(false)
  }, [filter])

  useEffect(() => { if (authed) fetchProblems() }, [authed, fetchProblems])

  const approve = async (id) => {
    setActionId(id)
    const res = await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: true }),
    })
    const data = await res.json()
    setMsg(data.error ? { text: data.error, ok: false } : { text: 'Approved ✅', ok: true })
    setActionId(null)
    fetchProblems()
  }

  const changeStatus = async (id, status) => {
    setActionId(id)
    await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setActionId(null)
    fetchProblems()
  }

  const deleteProblem = async (id, title) => {
    if (!confirm(`Delete "${title}"?\nThis cannot be undone.`)) return
    setActionId(id)
    const res = await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    setMsg(data.error ? { text: data.error, ok: false } : { text: 'Deleted 🗑️', ok: true })
    setActionId(null)
    fetchProblems()
  }

  // ── login ──────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--chalk)', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '3rem 2.5rem', boxShadow: '0 4px 32px rgba(15,39,64,0.12)', textAlign: 'center', width: '100%', maxWidth: 380 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.6rem', color: 'var(--coal)', marginBottom: '0.4rem' }}>Admin Panel</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1.8rem' }}>IIT (BHU) Mining Portal</p>
        <input
          type="password" value={pw}
          onChange={e => { setPw(e.target.value); setPwError(false) }}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Enter admin password"
          style={{ display: 'block', width: '100%', padding: '0.8rem 1rem', border: `1.5px solid ${pwError ? '#dc2626' : 'var(--stone)'}`, borderRadius: 8, fontSize: '0.95rem', fontFamily: 'DM Sans,sans-serif', marginBottom: '0.6rem', outline: 'none' }}
        />
        {pwError && <p style={{ color: '#dc2626', fontSize: '0.82rem', marginBottom: '0.8rem' }}>Incorrect password.</p>}
        <button onClick={login} style={{ width: '100%', background: 'linear-gradient(135deg,var(--ore),var(--steel))', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
          Login →
        </button>
        <Link href="/problems" style={{ display: 'block', marginTop: '1.2rem', fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none' }}>← Back to portal</Link>
      </div>
    </div>
  )

  // ── panel ──────────────────────────────────────────────────
  const pending = problems.filter(p => !p.approved).length
  const approved = problems.filter(p => p.approved).length

  return (
    <>
      <header>
        <div className="header-inner">
          <div className="header-logo">Admin <span>Panel</span></div>
          <Link href="/problems" className="back-link">← View Portal</Link>
        </div>
      </header>

      <div style={{ background: 'var(--ore)', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Playfair Display,serif', color: '#fff', fontSize: '1.8rem', marginBottom: '0.4rem' }}>Problem Management</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Review, approve, and update submitted mining problems</p>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem' }}>

        {/* toast */}
        {msg && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 8, background: msg.ok ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)', border: `1px solid ${msg.ok ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.2)'}`, color: msg.ok ? '#15803d' : '#b91c1c', fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {msg.text}
            <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}>✕</button>
          </div>
        )}

        {/* summary */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ background: '#fff', border: '1px solid var(--stone)', borderRadius: 8, padding: '0.5rem 1.2rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
            📬 <b style={{ color: '#b91c1c' }}>{pending}</b> pending review
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--stone)', borderRadius: 8, padding: '0.5rem 1.2rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
            ✅ <b style={{ color: '#15803d' }}>{approved}</b> approved
          </div>
          <button onClick={fetchProblems} style={{ marginLeft: 'auto', background: '#fff', border: '1.5px solid var(--stone)', borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif' }}>
            🔄 Refresh
          </button>
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[
            { key: 'pending', label: '📬 Pending Review' },
            { key: 'approved', label: '✅ Approved' },
            { key: 'all', label: '📋 All' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{ padding: '0.5rem 1.2rem', borderRadius: 100, border: '1.5px solid var(--stone)', background: filter === key ? 'var(--ore)' : '#fff', color: filter === key ? '#fff' : 'var(--muted)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* list */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <div className="spinner" />Loading…
          </div>
        )}

        {!loading && problems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>📭</div>
            <p>No problems in this view.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {problems.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${!p.approved ? 'rgba(220,38,38,0.15)' : 'rgba(0,0,0,0.05)'}`, opacity: actionId === p.id ? 0.5 : 1, transition: 'opacity 0.2s' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                <div>
                  <strong style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.05rem', color: 'var(--coal)' }}>{p.title}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                    🗂 {p.category} &nbsp;|&nbsp; 👤 {p.submitter_name}
                    {p.location && <> &nbsp;|&nbsp; 📍 {p.location}</>}
                    {p.contact_email && <> &nbsp;|&nbsp; ✉️ {p.contact_email}</>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 100, background: p.approved ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)', color: p.approved ? '#15803d' : '#b91c1c', border: `1px solid ${p.approved ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.2)'}` }}>
                    {p.approved ? '✅ Approved' : '⏳ Pending'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>📅 {formatDate(p.created_at)}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.87rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.2rem', maxHeight: '5.1em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {p.description}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {!p.approved && (
                  <button onClick={() => approve(p.id)} disabled={actionId === p.id}
                    style={{ background: '#15803d', color: '#fff', border: 'none', padding: '0.45rem 1.1rem', borderRadius: 6, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
                    ✅ Approve
                  </button>
                )}

                <div style={{ position: 'relative' }}>
                  <select value={p.status} onChange={e => changeStatus(p.id, e.target.value)} disabled={actionId === p.id}
                    style={{ padding: '0.45rem 2rem 0.45rem 0.8rem', borderRadius: 6, border: '1.5px solid var(--stone)', fontSize: '0.82rem', fontFamily: 'DM Sans,sans-serif', cursor: 'pointer', appearance: 'none', background: '#fff' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.7rem', color: 'var(--muted)' }}>▾</span>
                </div>

                <button onClick={() => deleteProblem(p.id, p.title)} disabled={actionId === p.id}
                  style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c', border: '1px solid rgba(220,38,38,0.2)', padding: '0.45rem 1.1rem', borderRadius: 6, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', marginLeft: 'auto' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer>
        <div className="footer-inner">
          <div className="footer-logo">IIT <span>(BHU)</span> Varanasi</div>
          <div className="footer-divider" />
          <p>Admin Panel · Department of Mining Engineering</p>
        </div>
      </footer>
    </>
  )
}
