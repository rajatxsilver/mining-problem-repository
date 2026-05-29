'use client'

import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  'Blasting',
  'Ventilation',
  'Geomechanics',
  'Drainage',
  'Safety',
  'Environment',
  'Machinery',
  'Transportation',
  'Surveying',
  'Explosives',
  'Rock Mechanics',
  'Slope Stability',
  'Other',
]

const CHAR_LIMITS = {
  title: 200,
  description: 5000,
  submitter_name: 100,
  location: 200,
}

export default function SubmitPage() {
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    submitter_name: '',
    location: '',
    contact_email: '',
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    const limit = CHAR_LIMITS[name]
    setForm(prev => ({ ...prev, [name]: limit ? value.slice(0, limit) : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed.')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  // ── success screen ──────────────────────────────────────────
  if (status === 'success') {
    return (
      <>
        <header>
          <div className="header-inner">
            <div className="header-logo">Mining Problem Submission <span>Portal</span></div>
            <Link href="/problems" className="back-link">← Back</Link>
          </div>
        </header>

        <div style={{
          minHeight: '80vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--chalk)', padding: '2rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 520 }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2rem', color: 'var(--coal)', marginBottom: '1rem',
            }}>
              Problem Submitted!
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Thank you for contributing to the community. Your problem has been received
              and will appear on the portal once reviewed and approved by our team.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/problems" style={{
                background: 'var(--ore)', color: '#fff',
                padding: '0.8rem 1.8rem', borderRadius: '8px',
                textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
              }}>
                ← Back to Portal
              </Link>
              <button
                onClick={() => { setForm({ title: '', category: '', description: '', submitter_name: '', location: '', contact_email: '' }); setStatus('idle') }}
                style={{
                  background: '#fff', color: 'var(--ore)',
                  border: '1.5px solid var(--stone)',
                  padding: '0.8rem 1.8rem', borderRadius: '8px',
                  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>

        <footer>
          <div className="footer-inner">
            <div className="footer-logo">IIT <span>(BHU)</span> Varanasi</div>
            <div className="footer-divider" />
            <p>Department of Mining Engineering</p>
          </div>
        </footer>
      </>
    )
  }

  // ── form ────────────────────────────────────────────────────
  return (
    <>
      <header>
        <div className="header-inner">
          <div className="header-logo">Mining Problem Submission <span>Portal</span></div>
          <Link href="/problems" className="back-link">← Back to Portal</Link>
        </div>
      </header>

      <section className="hero" style={{ padding: '60px 2rem 50px' }}>
        <div className="hero-inner">
          <div className="hero-label">Problem Submission</div>
          <h2>Share a <em>Mining Challenge</em></h2>
          <p>
            Describe your real-world mining problem. Once approved, it will be visible
            to faculty and students who may be able to help.
          </p>
          <div className="hero-divider" />
        </div>
      </section>

      <section style={{ padding: '60px 2rem 80px', background: 'var(--chalk)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* card shell */}
          <div className="form-card">
            <div className="form-card-top">
              <div className="dot" /><div className="dot" /><div className="dot" />
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>

              {/* Title */}
              <div className="field-group">
                <label className="field-label" htmlFor="title">
                  Problem Title <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <span className="field-hint">A concise summary of the issue (max 200 chars)</span>
                <input
                  id="title" name="title" className="field-input"
                  value={form.title} onChange={handleChange} required
                  placeholder="e.g. Slope instability at XYZ open-pit mine"
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'right' }}>
                  {form.title.length} / {CHAR_LIMITS.title}
                </span>
              </div>

              {/* Category */}
              <div className="field-group">
                <label className="field-label" htmlFor="category">
                  Area / Category <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="category" name="category" className="field-select"
                    value={form.category} onChange={handleChange} required
                  >
                    <option value="">Select a category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none', color: 'var(--muted)',
                  }}>▾</span>
                </div>
              </div>

              {/* Description */}
              <div className="field-group">
                <label className="field-label" htmlFor="description">
                  Problem Description <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <span className="field-hint">
                  What happens, when it occurs, what you've already tried, and any relevant data
                </span>
                <textarea
                  id="description" name="description" className="field-textarea"
                  value={form.description} onChange={handleChange} required
                  placeholder="Describe the problem in as much detail as possible…"
                  rows={7}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'right' }}>
                  {form.description.length} / {CHAR_LIMITS.description}
                </span>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--sand)', margin: '0.4rem 0' }} />

              {/* Name */}
              <div className="field-group">
                <label className="field-label" htmlFor="submitter_name">
                  Your Name <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <input
                  id="submitter_name" name="submitter_name" className="field-input"
                  value={form.submitter_name} onChange={handleChange} required
                  placeholder="Full name or designation"
                />
              </div>

              {/* Location */}
              <div className="field-group">
                <label className="field-label" htmlFor="location">Mine / Area Location</label>
                <span className="field-hint">Optional — helps provide context</span>
                <input
                  id="location" name="location" className="field-input"
                  value={form.location} onChange={handleChange}
                  placeholder="e.g. Jharia Coalfield, Dhanbad, Jharkhand"
                />
              </div>

              {/* Email */}
              <div className="field-group">
                <label className="field-label" htmlFor="contact_email">Contact Email</label>
                <span className="field-hint">Optional — only used if faculty need to follow up</span>
                <input
                  id="contact_email" name="contact_email" type="email" className="field-input"
                  value={form.contact_email} onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="error-msg">⚠️ {errorMsg}</div>
              )}

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <>
                    <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Submitting…
                  </>
                ) : (
                  <>Submit Problem →</>
                )}
              </button>

              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.7 }}>
                Your submission will be reviewed before it appears publicly.
                We never share your contact details.
              </p>
            </form>
          </div>

        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-logo">IIT <span>(BHU)</span> Varanasi</div>
          <div className="footer-divider" />
          <p>Department of Mining Engineering<br />Indian Institute of Technology (BHU), Varanasi</p>
        </div>
      </footer>
    </>
  )
}
