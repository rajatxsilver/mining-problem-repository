'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  WORKSHOP_QUESTIONS, WORKSHOP_META, THEMES, PRESENTERS, TOPICS,
} from '@/lib/workshop-questions'

const PAGE_SIZE = 25
const THEME_KEYS = Object.keys(THEMES)
const TOPIC_BY_ID = Object.fromEntries(TOPICS.map(t => [t.id, t]))
const RECURRING = TOPICS.filter(t => t.presenterCount >= 3)

// strongest recurring topic for a question (>= 3 presenters), else null
function bestRecurring(q) {
  let best = null
  q.topics.forEach(id => {
    const t = TOPIC_BY_ID[id]
    if (t.presenterCount >= 3 && (!best || t.presenterCount > best.presenterCount)) best = t
  })
  return best
}

export default function WorkshopQuestions() {
  const [search, setSearch]       = useState('')
  const [theme, setTheme]         = useState('all')
  const [presenter, setPresenter] = useState('all')
  const [topic, setTopic]         = useState('all')
  const [expanded, setExpanded]   = useState(null)
  const [visible, setVisible]     = useState(PAGE_SIZE)

  useEffect(() => {
    setVisible(PAGE_SIZE)
    setExpanded(null)
  }, [search, theme, presenter, topic])

  const themeCounts = useMemo(() => {
    const c = {}
    WORKSHOP_QUESTIONS.forEach(q => { c[q.theme] = (c[q.theme] || 0) + 1 })
    return c
  }, [])

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return WORKSHOP_QUESTIONS.filter(q => {
      if (theme !== 'all' && q.theme !== theme) return false
      if (presenter !== 'all' && q.presenterId !== presenter) return false
      if (topic !== 'all' && !q.topics.includes(topic)) return false
      if (s) {
        const hay = `q${q.n} ${q.question} ${q.solution} ${q.presenter} ${q.org || ''} ${THEMES[q.theme].label}`.toLowerCase()
        if (!hay.includes(s)) return false
      }
      return true
    })
  }, [search, theme, presenter, topic])

  const shown = filtered.slice(0, visible)
  const hasFilters = search || theme !== 'all' || presenter !== 'all' || topic !== 'all'

  const clearAll = () => {
    setSearch(''); setTheme('all'); setPresenter('all'); setTopic('all')
  }

  const activeTopic = topic !== 'all' ? TOPIC_BY_ID[topic] : null

  return (
    <>
      {/* ── INTRO BANNER ── */}
      <div className="wq-banner">
        <div className="wq-banner-text">
          <div className="wq-eyebrow">National Workshop · {WORKSHOP_META.date}</div>
          <h3>Industry Problem Statements</h3>
          <p>
            Research questions raised by industry experts, each with a proposed solution approach.
            Compiled for discussion and research prioritisation — explore by theme, presenter,
            or the problems that came up again and again.
          </p>
          <div className="wq-banner-actions">
            <a href={WORKSHOP_META.pdf} download className="wq-btn wq-btn-gold">⬇ Download PDF</a>
            <Link href="/submit" className="wq-btn wq-btn-ghost">Submit your own problem →</Link>
          </div>
        </div>
        <div className="wq-banner-stats">
          <div><b>{WORKSHOP_QUESTIONS.length}</b><span>Questions</span></div>
          <div><b>{PRESENTERS.length}</b><span>Presenters</span></div>
          <div><b>{THEME_KEYS.length}</b><span>Themes</span></div>
        </div>
      </div>

      {/* ── RECURRING PROBLEMS ── */}
      <div className="wq-recur-box">
        <div className="wq-recur-title">
          🔁 Recurring problems <span>— raised independently by 3 or more presenters. Click to filter.</span>
        </div>
        <div className="wq-chip-row">
          {RECURRING.map(t => (
            <button key={t.id}
              className={`wq-recur-chip ${topic === t.id ? 'on' : ''}`}
              onClick={() => setTopic(topic === t.id ? 'all' : t.id)}>
              {t.label}
              <em>{t.presenterCount} presenters</em>
            </button>
          ))}
        </div>
      </div>

      {/* ── SEARCH + PRESENTER ── */}
      <div className="wq-controls">
        <div className="wq-search">
          <span>🔍</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search questions, solutions, presenters, or Q number…"
          />
          {search && <button onClick={() => setSearch('')} aria-label="Clear search">✕</button>}
        </div>
        <div className="wq-select">
          <select value={presenter} onChange={e => setPresenter(e.target.value)}>
            <option value="all">All presenters ({PRESENTERS.length})</option>
            {PRESENTERS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}{p.org ? ` — ${p.org}` : ''} ({p.count})
              </option>
            ))}
          </select>
          <span>▾</span>
        </div>
      </div>

      {/* ── THEME FILTER ── */}
      <div className="filter-row" style={{ marginBottom: '1.4rem' }}>
        <button className={`filter-btn ${theme === 'all' ? 'active' : ''}`} onClick={() => setTheme('all')}>
          All Themes
        </button>
        {THEME_KEYS.map(k => (
          <button key={k} className={`filter-btn ${theme === k ? 'active' : ''}`} onClick={() => setTheme(k)}>
            {THEMES[k].icon} {THEMES[k].label} ({themeCounts[k] || 0})
          </button>
        ))}
      </div>

      {/* ── COUNT + ACTIVE FILTERS ── */}
      <div className="wq-count">
        <span>
          Showing <strong>{shown.length}</strong> of {filtered.length} question{filtered.length !== 1 ? 's' : ''}
          {activeTopic && <> · topic: <em>{activeTopic.label}</em></>}
        </span>
        {hasFilters && <button onClick={clearAll}>Clear all filters</button>}
      </div>

      {/* ── LIST ── */}
      {filtered.length === 0 ? (
        <div className="state-box">
          <div className="state-icon">🔍</div>
          <h5>No questions match your filters</h5>
          <p>Try different keywords or clear the filters.</p>
        </div>
      ) : (
        <div className="wq-list">
          <div className="wq-head">
            <div>No.</div>
            <div>Research Question</div>
            <div className="wq-c-theme">Theme</div>
            <div className="wq-c-pres">Presenter</div>
            <div />
          </div>

          {shown.map(q => {
            const open = expanded === q.n
            const rec = bestRecurring(q)
            const th = THEMES[q.theme]
            return (
              <div key={q.n} className={`wq-item ${open ? 'open' : ''}`}>
                <button className="wq-row" onClick={() => setExpanded(open ? null : q.n)} aria-expanded={open}>
                  <div className="wq-c-num">
                    <span className="wq-num">Q{q.n}</span>
                    {rec && <span className="wq-rec" title={`${rec.label} — raised by ${rec.presenterCount} presenters`}>🔁 {rec.presenterCount}</span>}
                  </div>
                  <div className="wq-q">{q.question}</div>
                  <div className="wq-c-theme"><span className="card-tag">{th.icon} {th.label}</span></div>
                  <div className="wq-c-pres">👤 {q.presenter}</div>
                  <div className="wq-chev">{open ? '▾' : '▸'}</div>
                </button>

                {open && (
                  <div className="wq-detail">
                    <div className="wq-meta">
                      <span className="card-tag">{th.icon} {th.label}</span>
                      <span>👤 {q.presenter}{q.org ? ` (${q.org})` : ''}</span>
                    </div>

                    <div className="wq-label">Research Question</div>
                    <p className="wq-full-q">{q.question}</p>

                    <div className="wq-label">Proposed Approach</div>
                    <p className="wq-body">{q.solution}</p>

                    {q.topics.length > 0 && (
                      <div className="wq-related">
                        {q.topics.map(id => {
                          const t = TOPIC_BY_ID[id]
                          const others = t.questionNumbers.filter(n => n !== q.n)
                          return (
                            <div key={id} className="wq-related-row">
                              <button className="wq-recur-chip" onClick={() => setTopic(id)}>
                                🔁 {t.label}
                              </button>
                              <span>
                                raised by {t.presenterCount} presenters · also see {others.map(n => `Q${n}`).join(', ')}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {filtered.length > visible && (
        <div style={{ textAlign: 'center', marginTop: '1.6rem' }}>
          <button className="filter-btn" style={{ padding: '0.7rem 1.8rem' }}
            onClick={() => setVisible(v => v + PAGE_SIZE)}>
            Show more ({filtered.length - visible} remaining)
          </button>
        </div>
      )}

      <style>{`
        .wq-banner {
          display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center;
          background: linear-gradient(135deg, var(--ore), var(--steel));
          border-radius: 14px; padding: 2rem 2.2rem; margin-bottom: 1.6rem;
          box-shadow: 0 8px 28px rgba(15,39,64,0.18); color: #fff;
        }
        .wq-eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.6rem; }
        .wq-banner h3 { font-family: var(--font-playfair), 'Playfair Display', serif; font-size: 1.6rem; margin-bottom: 0.6rem; }
        .wq-banner p { font-size: 0.9rem; line-height: 1.75; color: rgba(255,255,255,0.72); max-width: 560px; }
        .wq-banner-actions { display: flex; gap: 0.7rem; flex-wrap: wrap; margin-top: 1.2rem; }
        .wq-btn { display: inline-block; text-decoration: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }
        .wq-btn-gold { background: var(--gold); color: var(--ore); }
        .wq-btn-ghost { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.22); }
        .wq-banner-stats { display: flex; gap: 0; background: rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; }
        .wq-banner-stats > div { padding: 1.1rem 1.4rem; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); }
        .wq-banner-stats > div:last-child { border-right: none; }
        .wq-banner-stats b { display: block; font-family: var(--font-playfair), 'Playfair Display', serif; font-size: 1.9rem; color: var(--gold); line-height: 1; }
        .wq-banner-stats span { display: block; margin-top: 0.35rem; font-size: 0.66rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.55); }

        .wq-recur-box { background: #fff; border: 1px solid #e8e4dc; border-radius: 12px; padding: 1.2rem 1.4rem; margin-bottom: 1.6rem; }
        .wq-recur-title { font-size: 0.82rem; font-weight: 700; color: var(--ore); margin-bottom: 0.8rem; }
        .wq-recur-title span { font-weight: 400; color: var(--muted); }
        .wq-chip-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .wq-recur-chip {
          font-family: inherit; cursor: pointer; font-size: 0.78rem; font-weight: 600; color: var(--ore);
          background: rgba(200,137,58,0.08); border: 1px solid rgba(200,137,58,0.3);
          padding: 0.38rem 0.8rem; border-radius: 100px; transition: all 0.15s;
        }
        .wq-recur-chip em { font-style: normal; font-weight: 500; color: var(--amber); margin-left: 0.4rem; font-size: 0.72rem; }
        .wq-recur-chip:hover { background: rgba(200,137,58,0.18); }
        .wq-recur-chip.on { background: var(--ore); border-color: var(--ore); color: #fff; }
        .wq-recur-chip.on em { color: var(--gold); }

        .wq-controls { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1.1rem; }
        .wq-search { position: relative; flex: 1 1 320px; }
        .wq-search span { position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%); opacity: 0.4; }
        .wq-search input {
          width: 100%; padding: 0.7rem 2.2rem 0.7rem 2.5rem; border: 1.5px solid var(--stone); border-radius: 8px;
          font-size: 0.9rem; font-family: inherit; background: #fff; outline: none;
        }
        .wq-search input:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(200,137,58,0.12); }
        .wq-search button { position: absolute; right: 0.8rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--muted); }
        .wq-select { position: relative; flex: 0 1 300px; }
        .wq-select select {
          width: 100%; appearance: none; padding: 0.7rem 2rem 0.7rem 0.9rem; border: 1.5px solid var(--stone); border-radius: 8px;
          font-size: 0.88rem; font-family: inherit; background: #fff; cursor: pointer; outline: none;
        }
        .wq-select span { position: absolute; right: 0.9rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--muted); font-size: 0.75rem; }

        .wq-count { display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--muted); margin-bottom: 0.75rem; }
        .wq-count strong { color: var(--ore); }
        .wq-count em { font-style: normal; font-weight: 600; color: var(--amber); }
        .wq-count button { background: none; border: none; cursor: pointer; color: var(--amber); font-weight: 600; font-size: 0.78rem; font-family: inherit; }

        .wq-list { background: #fff; border: 1px solid #e8e4dc; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.05); }
        .wq-head, .wq-row { display: grid; grid-template-columns: 96px 1fr 210px 160px 24px; gap: 1rem; align-items: center; padding: 0.85rem 1.2rem; }
        .wq-head { background: linear-gradient(135deg, var(--ore), var(--steel)); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.6); }
        .wq-item { border-top: 1px solid #f0ece6; }
        .wq-item:first-of-type { border-top: none; }
        .wq-item.open { background: #fdf8f2; }
        .wq-row { width: 100%; background: transparent; border: none; text-align: left; cursor: pointer; font-family: inherit; color: inherit; transition: background 0.15s; }
        .wq-row:hover { background: #fdf8f2; }
        .wq-c-num { display: flex; align-items: center; gap: 0.4rem; }
        .wq-num { font-size: 0.75rem; font-weight: 700; color: var(--amber); background: rgba(200,137,58,0.1); padding: 0.2rem 0.5rem; border-radius: 5px; }
        .wq-rec { font-size: 0.68rem; font-weight: 700; color: var(--ore); opacity: 0.7; white-space: nowrap; }
        .wq-q { font-size: 0.9rem; font-weight: 600; color: var(--ore); line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .wq-c-theme .card-tag { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
        .wq-c-pres { font-size: 0.8rem; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .wq-chev { color: var(--amber); font-size: 0.8rem; text-align: right; }

        .wq-detail { padding: 0.4rem 1.2rem 1.4rem; border-top: 1px dashed #ede0cc; animation: fadeUp 0.3s ease both; }
        .wq-meta { display: flex; flex-wrap: wrap; gap: 0.6rem 1.2rem; align-items: center; font-size: 0.8rem; color: var(--muted); margin: 0.9rem 0 1rem; }
        .wq-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--amber); margin-bottom: 0.35rem; }
        .wq-full-q { font-size: 0.95rem; font-weight: 600; color: var(--ore); line-height: 1.7; margin-bottom: 1rem; }
        .wq-body { font-size: 0.92rem; line-height: 1.85; color: var(--body); margin-bottom: 1.1rem; }
        .wq-related { border-top: 1px solid #f0e6d6; padding-top: 0.9rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .wq-related-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; font-size: 0.78rem; color: var(--muted); }

        @media (max-width: 760px) {
          .wq-banner { grid-template-columns: 1fr; padding: 1.5rem; }
          .wq-banner-stats { justify-content: space-around; }
          .wq-head { display: none; }
          .wq-row { grid-template-columns: 1fr 20px; gap: 0.4rem 0.8rem; }
          .wq-row > .wq-c-num { grid-column: 1; grid-row: 1; }
          .wq-row > .wq-q { grid-column: 1; grid-row: 2; -webkit-line-clamp: 3; }
          .wq-row > .wq-chev { grid-column: 2; grid-row: 1 / span 2; }
          .wq-c-theme, .wq-c-pres { display: none; }
        }
      `}</style>
    </>
  )
}
