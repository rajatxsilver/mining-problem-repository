'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── constants ────────────────────────────────────────────────
const CATEGORY_ICONS = {
  'Blasting':        '💥',
  'Ventilation':     '🌀',
  'Geomechanics':    '⛰️',
  'Drainage':        '💧',
  'Safety':          '🦺',
  'Environment':     '🌿',
  'Machinery':       '⚙️',
  'Transportation':  '🚛',
  'Surveying':       '📐',
  'Explosives':      '🧨',
  'Rock Mechanics':  '🪨',
  'Slope Stability': '🏔️',
  'Other':           '⛏️',
  'default':         '⛏️',
}

const EXAMPLE_PROBLEMS = [
  {
    icon: '💥',
    tag: 'Blasting',
    title: 'Blast Vibration Impact',
    desc: 'High blast vibration affecting dump slope stability and nearby infrastructure in open-pit coal mines.',
  },
  {
    icon: '🌀',
    tag: 'Mine Ventilation',
    title: 'Underground Ventilation Issue',
    desc: 'Maintaining adequate airflow in deep underground metal mines with increasing temperature and gas emissions.',
  },
  {
    icon: '⛰️',
    tag: 'Geomechanics',
    title: 'Slope Instability',
    desc: 'Frequent slope failures in open pit iron ore mines due to weak rock mass and monsoon rainfall.',
  },
]

// ── helpers ──────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function StatusBadge({ status }) {
  const map = {
    'Solved':           ['status-solved',      '✅ Solved'],
    'Partially Solved': ['status-partial',     '🔄 Partially Solved'],
    'Unresolved':       ['status-unresolved',  '🔴 Unresolved'],
  }
  const [cls, label] = map[status] || map['Unresolved']
  return <span className={`status-badge ${cls}`}>{label}</span>
}

// ── component ────────────────────────────────────────────────
export default function HomePage() {
  const [problems, setProblems]     = useState([])
  const [filtered, setFiltered]     = useState([])
  const [activeCat, setActiveCat]   = useState('all')
  const [activeSt, setActiveSt]     = useState('all')
  const [loading, setLoading]       = useState(true)
  const [fetchError, setFetchError] = useState(null)

  // fetch on mount
  useEffect(() => {
    fetch('/api/problems')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setProblems(data)
        setFiltered(data)
      })
      .catch(e => setFetchError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // re-filter whenever active filters or data change
  useEffect(() => {
    let result = problems
    if (activeCat !== 'all') result = result.filter(p => p.category === activeCat)
    if (activeSt  !== 'all') result = result.filter(p => p.status   === activeSt)
    setFiltered(result)
  }, [activeCat, activeSt, problems])

  const categories = [...new Set(problems.map(p => p.category))].sort()

  const statusActiveClass = (s) => {
    if (activeSt !== s) return ''
    if (s === 'Solved')           return 'active-solved'
    if (s === 'Partially Solved') return 'active-partial'
    if (s === 'Unresolved')       return 'active-unresolved'
    return 'active'
  }

  return (
    <>
      {/* ── HEADER ── */}
      <header>
        <div className="header-inner">
          <div className="header-logo">
            Mining Problem Submission <span>Portal</span>
          </div>
          <a href="https://iitbhu.ac.in" className="back-link" target="_blank" rel="noopener noreferrer">
            ← IIT (BHU)
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-label">IIT (BHU) Varanasi · Department of Mining Engineering</div>
          <h2>Submit Real <em>Mining Challenges</em></h2>
          <p>
            Mining professionals, researchers, and students are invited to submit real-world
            mining problems. Selected challenges may be analysed and discussed by faculty members
            and students of IIT (BHU) Varanasi during academic discussions and workshops.
          </p>
          <div className="hero-divider" />
        </div>
      </section>

      {/* ── SUBMIT CTA ── */}
      <section className="form-section">
        <div className="form-wrapper">
          <div className="section-header">
            <div className="section-eyebrow">Open Submission</div>
            <h3>Problem Submission Form</h3>
          </div>

          <div className="form-card">
            <div className="form-card-top">
              <div className="dot" /><div className="dot" /><div className="dot" />
            </div>
            <div className="form-cta-body">
              <div className="form-cta-icon">📋</div>
              <h4>Please Submit Your Problem</h4>
              <p>
                Fill out the submission form to share your real-world mining problem.
                Your submission will be reviewed and published once approved.
              </p>
              <Link href="/submit" className="form-open-btn">
                <span>Open Submission Form</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBMITTED PROBLEMS ── */}
      <section className="submitted-section">
        <div className="submitted-inner">
          <div className="section-header">
            <div className="section-eyebrow">Community Submissions</div>
            <h3>Submitted Mining Problems</h3>
          </div>

          {/* stats */}
          {problems.length > 0 && (
            <div className="stats-bar">
              <div className="stat-item">
                <div className="stat-number">{problems.length}</div>
                <div className="stat-label">Total Problems</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" style={{ color: '#15803d' }}>
                  {problems.filter(p => p.status === 'Solved').length}
                </div>
                <div className="stat-label">Solved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" style={{ color: '#b45309' }}>
                  {problems.filter(p => p.status === 'Partially Solved').length}
                </div>
                <div className="stat-label">Partially Solved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" style={{ color: '#b91c1c' }}>
                  {problems.filter(p => p.status === 'Unresolved').length}
                </div>
                <div className="stat-label">Unresolved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{categories.length}</div>
                <div className="stat-label">Categories</div>
              </div>
            </div>
          )}

          {/* filters */}
          {problems.length > 0 && (
            <div className="filter-group">
              <div>
                <div className="filter-row-label">Filter by Category</div>
                <div className="filter-row">
                  <button
                    className={`filter-btn ${activeCat === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCat('all')}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button
                      key={c}
                      className={`filter-btn ${activeCat === c ? 'active' : ''}`}
                      onClick={() => setActiveCat(c)}
                    >
                      {CATEGORY_ICONS[c] || CATEGORY_ICONS.default} {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="filter-row-label">Filter by Status</div>
                <div className="filter-row">
                  <button
                    className={`filter-btn ${activeSt === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveSt('all')}
                  >
                    All Statuses
                  </button>
                  {['Solved', 'Partially Solved', 'Unresolved'].map(s => (
                    <button
                      key={s}
                      className={`filter-btn ${activeSt === s ? statusActiveClass(s) : ''}`}
                      onClick={() => setActiveSt(s)}
                    >
                      {s === 'Solved' ? '✅' : s === 'Partially Solved' ? '🔄' : '🔴'} {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* grid */}
          <div className="submitted-grid">
            {loading && (
              <div className="state-box">
                <div className="spinner" />
                <h5>Loading Submissions…</h5>
                <p>Fetching approved problems from the database.</p>
              </div>
            )}

            {!loading && fetchError && (
              <div className="state-box">
                <div className="state-icon">⚠️</div>
                <h5>Could Not Load Submissions</h5>
                <p>{fetchError}</p>
              </div>
            )}

            {!loading && !fetchError && filtered.length === 0 && problems.length === 0 && (
              <div className="state-box">
                <div className="state-icon">📭</div>
                <h5>No Approved Submissions Yet</h5>
                <p>
                  Problems will appear here once reviewed and approved.{' '}
                  <Link href="/submit" style={{ color: 'var(--amber)' }}>
                    Be the first to submit!
                  </Link>
                </p>
              </div>
            )}

            {!loading && !fetchError && filtered.length === 0 && problems.length > 0 && (
              <div className="state-box">
                <div className="state-icon">🔍</div>
                <h5>No problems match this filter</h5>
                <p>Try a different category or status above.</p>
              </div>
            )}

            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="submitted-card"
                style={{ animationDelay: `${(i % 9) * 0.07}s` }}
              >
                <div className="card-header">
                  <span className="card-tag">
                    {CATEGORY_ICONS[p.category] || CATEGORY_ICONS.default} {p.category}
                  </span>
                  <span className="card-number">#{String(i + 1).padStart(3, '0')}</span>
                </div>

                <h4>{p.title}</h4>
                <p>{p.description}</p>

                <div style={{ marginTop: 'auto' }}>
                  <StatusBadge status={p.status} />
                </div>

                <div className="card-footer">
                  <span className="card-submitter">👤 {p.submitter_name}</span>
                  {p.location && <span className="card-location">📍 {p.location}</span>}
                  {p.created_at && (
                    <span className="card-date">📅 {formatDate(p.created_at)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAMPLE PROBLEMS ── */}
      <section className="problems-section">
        <div className="problems-inner">
          <div className="section-header">
            <div className="section-eyebrow">For Reference</div>
            <h3>Example Mining Challenges</h3>
          </div>
          <div className="problems-grid">
            {EXAMPLE_PROBLEMS.map((ex, i) => (
              <div key={i} className="problem-card">
                <div className="problem-icon">{ex.icon}</div>
                <div className="problem-tag">{ex.tag}</div>
                <h4>{ex.title}</h4>
                <p>{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">IIT <span>(BHU)</span> Varanasi</div>
          <div className="footer-divider" />
          <p>
            Department of Mining Engineering<br />
            Indian Institute of Technology (BHU), Varanasi
          </p>
          <p className="footer-sub">Mining Problem Submission Initiative</p>
        </div>
      </footer>
    </>
  )
}
