'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

const CATEGORY_ICONS = {
  'Blasting': '💥', 'Ventilation': '🌀', 'Geomechanics': '⛰️',
  'Drainage': '💧', 'Safety': '🦺', 'Environment': '🌿',
  'Machinery': '⚙️', 'Transportation': '🚛', 'Surveying': '📐',
  'Explosives': '🧨', 'Rock Mechanics': '🪨', 'Slope Stability': '🏔️',
  'Other': '⛏️', 'default': '⛏️',
}

const PAGE_SIZE = 20

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function StatusBadge({ status }) {
  const map = {
    'Solved': ['status-solved', '✅ Solved'],
    'Partially Solved': ['status-partial', '🔄 Partial'],
    'Unresolved': ['status-unresolved', '🔴 Unresolved'],
  }
  const [cls, label] = map[status] || map['Unresolved']
  return <span className={`status-badge ${cls}`}>{label}</span>
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [activeCat, setActiveCat] = useState('all')
  const [activeSt, setActiveSt] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [visible, setVisible] = useState(PAGE_SIZE)

  useEffect(() => {
    fetch('/api/problems')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setProblems(data)
      })
      .catch(e => setFetchError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // reset pagination + collapse whenever filters change
  useEffect(() => {
    setVisible(PAGE_SIZE)
    setExpandedId(null)
  }, [activeCat, activeSt, search])

  const categories = useMemo(
    () => [...new Set(problems.map(p => p.category))].sort(),
    [problems]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return problems.filter(p => {
      if (activeCat !== 'all' && p.category !== activeCat) return false
      if (activeSt !== 'all' && p.status !== activeSt) return false
      if (q) {
        const hay = `${p.title} ${p.description} ${p.submitter_name} ${p.location || ''} ${p.category}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [problems, activeCat, activeSt, search])

  const shown = filtered.slice(0, visible)

  const statusActiveClass = (s) => {
    if (activeSt !== s) return ''
    if (s === 'Solved') return 'active-solved'
    if (s === 'Partially Solved') return 'active-partial'
    return 'active-unresolved'
  }

  return (
    <>
      {/* HEADER */}
      <header>
        <div className="header-inner">
          <div className="header-logo">Mining Problem <span>Portal</span></div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <Link href="/submit" className="back-link">Submit Problem</Link>
            <Link href="/" className="back-link">← Home</Link>
          </div>
        </div>
      </header>

      {/* TITLE STRIP */}
      <section className="hero" style={{ padding: '56px 2rem 50px' }}>
        <div className="hero-inner">
          <div className="hero-label">Community Submissions</div>
          <h2>Submitted <em>Mining Problems</em></h2>
          <p>
            Real-world challenges shared by mining professionals, researchers, and students.
            Click any problem to read the full details.
          </p>
          <div className="hero-divider" />
        </div>
      </section>

      <section className="submitted-section" style={{ paddingTop: 50 }}>
        <div className="submitted-inner">

          {/* STATS */}
          {problems.length > 0 && (
            <div className="stats-bar" style={{ marginTop: 0 }}>
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

          {/* SEARCH + FILTERS */}
          {problems.length > 0 && (
            <>
              <div style={{ maxWidth: 520, margin: '0 auto 1.8rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by title, description, author, location…"
                  className="field-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.2rem' }}
                />
                {search && (
                  <button onClick={() => setSearch('')} aria-label="Clear search"
                    style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                    ✕
                  </button>
                )}
              </div>

              <div className="filter-group" style={{ marginBottom: '1.8rem' }}>
                <div>
                  <div className="filter-row-label">Filter by Category</div>
                  <div className="filter-row">
                    <button className={`filter-btn ${activeCat === 'all' ? 'active' : ''}`} onClick={() => setActiveCat('all')}>
                      All Categories
                    </button>
                    {categories.map(c => (
                      <button key={c} className={`filter-btn ${activeCat === c ? 'active' : ''}`} onClick={() => setActiveCat(c)}>
                        {CATEGORY_ICONS[c] || CATEGORY_ICONS.default} {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="filter-row-label">Filter by Status</div>
                  <div className="filter-row">
                    <button className={`filter-btn ${activeSt === 'all' ? 'active' : ''}`} onClick={() => setActiveSt('all')}>
                      All Statuses
                    </button>
                    {['Solved', 'Partially Solved', 'Unresolved'].map(s => (
                      <button key={s} className={`filter-btn ${statusActiveClass(s)}`} onClick={() => setActiveSt(s)}>
                        {s === 'Solved' ? '✅' : s === 'Partially Solved' ? '🔄' : '🔴'} {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
                Showing <strong style={{ color: 'var(--ore)' }}>{shown.length}</strong> of {filtered.length} problem{filtered.length !== 1 ? 's' : ''}
              </div>
            </>
          )}

          {/* STATES */}
          {loading && (
            <div className="state-box">
              <div className="spinner" />
              <h5>Loading Submissions…</h5>
            </div>
          )}
          {!loading && fetchError && (
            <div className="state-box">
              <div className="state-icon">⚠️</div>
              <h5>Could Not Load Submissions</h5>
              <p>{fetchError}</p>
            </div>
          )}
          {!loading && !fetchError && problems.length === 0 && (
            <div className="state-box">
              <div className="state-icon">📭</div>
              <h5>No Approved Submissions Yet</h5>
              <p>
                Problems will appear here once reviewed and approved.{' '}
                <Link href="/submit">Be the first to submit!</Link>
              </p>
            </div>
          )}
          {!loading && !fetchError && problems.length > 0 && filtered.length === 0 && (
            <div className="state-box">
              <div className="state-icon">🔍</div>
              <h5>No problems match your search or filters</h5>
              <p>Try different keywords or reset the filters.</p>
            </div>
          )}

          {/* COMPACT LIST */}
          {shown.length > 0 && (
            <div className="plist">
              <div className="plist-head">
                <div>Status</div>
                <div>Problem</div>
                <div className="col-cat">Category</div>
                <div className="col-author">Submitted by</div>
                <div className="col-date">Date</div>
                <div />
              </div>

              {shown.map(p => {
                const open = expandedId === p.id
                return (
                  <div key={p.id} className={`plist-item ${open ? 'open' : ''}`}>
                    <button
                      className="plist-row"
                      onClick={() => setExpandedId(open ? null : p.id)}
                      aria-expanded={open}
                    >
                      <div><StatusBadge status={p.status} /></div>
                      <div className="col-title">{p.title}</div>
                      <div className="col-cat">
                        <span className="card-tag">{CATEGORY_ICONS[p.category] || CATEGORY_ICONS.default} {p.category}</span>
                      </div>
                      <div className="col-author">👤 {p.submitter_name}</div>
                      <div className="col-date">{formatDate(p.created_at)}</div>
                      <div className="chev">{open ? '▾' : '▸'}</div>
                    </button>

                    {open && (
                      <div className="plist-detail">
                        <div className="detail-meta">
                          <span className="card-tag">{CATEGORY_ICONS[p.category] || CATEGORY_ICONS.default} {p.category}</span>
                          <span>👤 {p.submitter_name}</span>
                          {p.location && <span>📍 {p.location}</span>}
                          {p.created_at && <span>📅 {formatDate(p.created_at)}</span>}
                        </div>
                        <div className="detail-label">Problem Description</div>
                        <p className="detail-body">{p.description}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* LOAD MORE */}
          {filtered.length > visible && (
            <div style={{ textAlign: 'center', marginTop: '1.6rem' }}>
              <button className="filter-btn" style={{ padding: '0.7rem 1.8rem' }}
                onClick={() => setVisible(v => v + PAGE_SIZE)}>
                Show more ({filtered.length - visible} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">IIT <span>(BHU)</span> Varanasi</div>
          <div className="footer-divider" />
          <p>
            Department of Mining Engineering<br />
            Indian Institute of Technology (BHU), Varanasi
          </p>
        </div>
      </footer>

      <style>{`
        .plist {
          background: #fff;
          border: 1px solid #e8e4dc;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }
        .plist-head, .plist-row {
          display: grid;
          grid-template-columns: 130px 1fr 150px 150px 100px 24px;
          gap: 1rem;
          align-items: center;
          padding: 0.85rem 1.2rem;
        }
        .plist-head {
          background: linear-gradient(135deg, var(--ore), var(--steel));
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }
        .plist-item { border-top: 1px solid #f0ece6; }
        .plist-item:first-of-type { border-top: none; }
        .plist-item.open { background: #fdf8f2; }
        .plist-row {
          width: 100%;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          color: inherit;
          transition: background 0.15s;
        }
        .plist-row:hover { background: #fdf8f2; }
        .col-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--ore);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .col-cat .card-tag { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
        .col-author, .col-date {
          font-size: 0.8rem;
          color: var(--muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .chev { color: var(--amber); font-size: 0.8rem; text-align: right; }
        .plist-detail {
          padding: 0.4rem 1.2rem 1.4rem;
          border-top: 1px dashed #ede0cc;
          animation: fadeUp 0.3s ease both;
        }
        .detail-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem 1.2rem;
          align-items: center;
          font-size: 0.8rem;
          color: var(--muted);
          margin: 0.9rem 0 1rem;
        }
        .detail-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 0.4rem;
        }
        .detail-body {
          font-size: 0.92rem;
          line-height: 1.85;
          color: var(--body);
          white-space: pre-wrap;
        }
        @media (max-width: 760px) {
          .plist-head { display: none; }
          .plist-row {
            grid-template-columns: 1fr 20px;
            gap: 0.4rem 0.8rem;
          }
          .plist-row > div:nth-child(1) { grid-column: 1; grid-row: 1; }
          .plist-row > div:nth-child(2) { grid-column: 1; grid-row: 2; }
          .plist-row .chev { grid-column: 2; grid-row: 1 / span 2; }
          .col-title { white-space: normal; }
          .col-cat, .col-author, .col-date { display: none; }
        }
      `}</style>
    </>
  )
}