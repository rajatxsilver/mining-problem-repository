'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CONFERENCES } from '@/lib/conferences'

// ── Stats fetched from your own DB ───────────────────────────
function useStats() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    fetch('/api/problems')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return
        setStats({
          total:    data.length,
          solved:   data.filter(p => p.status === 'Solved').length,
          cats:     new Set(data.map(p => p.category)).size,
        })
      })
      .catch(() => {})
  }, [])
  return stats
}

// ── Sub-components ───────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/',         label: 'Home' },
    { href: '/problems', label: 'Problems' },
    { href: '#events',   label: 'Events' },
    { href: '#about',    label: 'About' },
    { href: '#contact',  label: 'Contact' },
  ]
  return (
    <nav style={{ position:'sticky', top:0, zIndex:100, background:'#fff', borderBottom:'1px solid #e8e8e8', boxShadow:'0 1px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth:1180, margin:'0 auto', padding:'0 2rem', height:66, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <div style={{ width:36, height:36, background:'linear-gradient(135deg,#0f2740,#1e3a5a)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>⛏️</div>
          <div>
            <div style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'0.95rem', color:'#0f2740', lineHeight:1.1 }}>Mining Society</div>
            <div style={{ fontSize:'0.65rem', color:'#7a7068', letterSpacing:'0.08em', textTransform:'uppercase' }}>IIT (BHU) Varanasi</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display:'flex', gap:'0.25rem', alignItems:'center' }} className="nav-desktop">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ padding:'0.45rem 0.9rem', borderRadius:6, fontSize:'0.88rem', fontWeight:500, color:'#3d3530', textDecoration:'none', transition:'all 0.15s' }}
              onMouseEnter={e => { e.target.style.background='#f5efe6'; e.target.style.color='#0f2740' }}
              onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='#3d3530' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/submit" style={{ marginLeft:'0.5rem', background:'linear-gradient(135deg,#0f2740,#1e3a5a)', color:'#fff', textDecoration:'none', padding:'0.5rem 1.2rem', borderRadius:7, fontSize:'0.85rem', fontWeight:600 }}>
            Submit Problem
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(o => !o)} style={{ display:'none', background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:'#0f2740' }} className="nav-mobile-btn">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background:'#fff', borderTop:'1px solid #e8e8e8', padding:'1rem 2rem 1.5rem' }} className="nav-mobile-menu">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display:'block', padding:'0.6rem 0', fontSize:'0.95rem', color:'#0f2740', textDecoration:'none', borderBottom:'1px solid #f5efe6' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/submit" onClick={() => setOpen(false)}
            style={{ display:'block', marginTop:'1rem', background:'linear-gradient(135deg,#0f2740,#1e3a5a)', color:'#fff', textDecoration:'none', padding:'0.75rem 1.2rem', borderRadius:7, fontSize:'0.9rem', fontWeight:600, textAlign:'center' }}>
            Submit Problem
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

function Hero() {
  const pillars = [
    { icon:'📚', label:'Academic Excellence' },
    { icon:'🏭', label:'Industry Interaction' },
    { icon:'🎯', label:'Professional Development' },
    { icon:'🤝', label:'Alumni Engagement' },
    { icon:'📰', label:'Technical Publications' },
    { icon:'🌱', label:'Holistic Growth' },
  ]
  return (
    <section style={{ background:'linear-gradient(160deg,#f8f9fc 0%,#fff 50%,#fdf8f2 100%)', padding:'80px 2rem 70px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-60, right:-60, width:280, height:280, background:'rgba(200,137,58,0.05)', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:320, height:320, background:'rgba(15,39,64,0.03)', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'2.5rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(200,137,58,0.08)', border:'1px solid rgba(200,137,58,0.25)', padding:'0.4rem 1.1rem', borderRadius:100, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#c8893a' }}>
            ⛏️ Official Student & Academic Body · IIT (BHU) Varanasi
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center', marginBottom:'3.5rem' }}>
          <div>
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:'#0f2740', lineHeight:1.18, marginBottom:'1.4rem' }}>
              Welcome to the<br />
              <span style={{ color:'#c8893a' }}>Mining Society</span>
            </h1>
            <p style={{ fontSize:'0.97rem', color:'#3d3530', lineHeight:1.9, marginBottom:'1rem' }}>
              The <strong>Mining Society</strong> is the official academic, professional, and student body
              of the Department of Mining Engineering, IIT (BHU) Varanasi — established to promote
              academic excellence, professional development, and holistic growth among students and faculty.
            </p>
            <p style={{ fontSize:'0.97rem', color:'#3d3530', lineHeight:1.9, marginBottom:'1rem' }}>
              We keep members updated with the latest developments in mining engineering,
              enhance communication and leadership skills, and foster social, cultural, and intellectual
              activities through lectures, seminars, workshops, and technical events.
            </p>
            <p style={{ fontSize:'0.97rem', color:'#3d3530', lineHeight:1.9, marginBottom:'2rem' }}>
              Membership is open to all faculty, students, and research scholars of the department.
              Governed by an Executive Committee headed by the Head of Department as Ex-Officio President,
              with elected student representatives managing day-to-day activities.
            </p>
            <div style={{ display:'flex', gap:'0.9rem', flexWrap:'wrap' }}>
              <Link href="/submit" style={{ background:'linear-gradient(135deg,#0f2740,#1e3a5a)', color:'#fff', textDecoration:'none', padding:'0.85rem 1.8rem', borderRadius:8, fontWeight:600, fontSize:'0.92rem', boxShadow:'0 4px 16px rgba(15,39,64,0.2)', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
                Submit a Problem →
              </Link>
              <Link href="/problems" style={{ background:'#fff', color:'#0f2740', textDecoration:'none', padding:'0.85rem 1.8rem', borderRadius:8, fontWeight:600, fontSize:'0.92rem', border:'1.5px solid #ddd', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
                Browse Problems
              </Link>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {[
              { icon:'👥', title:'Who We Are', body:'The official body representing students, faculty, and research scholars of Mining Engineering — united by a passion for advancing the field.' },
              { icon:'🏛️', title:'What We Do', body:'Technical lectures, industrial interactions, cultural activities, publication of magazines, and student development programs addressing academic and professional issues.' },
              { icon:'🌐', title:'Our Network', body:'A platform for interaction with scientists, engineers, industry experts, alumni, and policymakers — from CIL and Tata Steel to global mining leaders.' },
            ].map(card => (
              <div key={card.title} style={{ display:'flex', gap:'1rem', background:'#fff', borderRadius:12, padding:'1.2rem 1.4rem', border:'1px solid #eee', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize:'1.5rem', flexShrink:0 }}>{card.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#0f2740', marginBottom:'0.3rem' }}>{card.title}</div>
                  <p style={{ fontSize:'0.83rem', color:'#5a5248', lineHeight:1.75, margin:0 }}>{card.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid #ede8e0', paddingTop:'2.2rem' }}>
          <div style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#7a7068', textAlign:'center', marginBottom:'1.2rem' }}>Society Pillars</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.65rem', justifyContent:'center' }}>
            {pillars.map(p => (
              <div key={p.label} style={{ display:'flex', alignItems:'center', gap:'0.45rem', background:'linear-gradient(135deg,#0f2740,#1e3a5a)', color:'#fff', padding:'0.5rem 1rem', borderRadius:100, fontSize:'0.83rem', fontWeight:500 }}>
                <span>{p.icon}</span> {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.hero-inner-grid{grid-template-columns:1fr !important;gap:2.5rem !important;}}`}</style>
    </section>
  )
}


function About() {
  return (
    <section id="about" style={{ padding:'90px 2rem', background:'#fff' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}>
        {/* text */}
        <div>
          <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#c8893a', marginBottom:'0.8rem' }}>About Us</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:700, color:'#0f2740', lineHeight:1.22, marginBottom:'1.4rem' }}>
            A Century of Mining<br />Engineering Excellence
          </h2>
          <p style={{ fontSize:'0.95rem', color:'#5a5248', lineHeight:1.85, marginBottom:'1rem' }}>
            The Department of Mining Engineering at IIT (BHU) Varanasi was established in 1923 —
            the first of its kind in India. Conceived by Bharat Ratna Pandit Madan Mohan Malaviya,
            it has since been at the forefront of mining education, research, and industry collaboration.
          </p>
          <p style={{ fontSize:'0.95rem', color:'#5a5248', lineHeight:1.85, marginBottom:'1.8rem' }}>
            The department awarded India's first Ph.D. in Mining Engineering in 1964 and continues
            to produce engineers who lead the nation's mineral industry. With 19 fully equipped
            laboratories and an underground experimental model mine, it remains unparalleled
            in hands-on research infrastructure.
          </p>
          <a href="https://www.iitbhu.ac.in/dept/min" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', color:'#0f2740', fontWeight:600, fontSize:'0.9rem', textDecoration:'none', borderBottom:'2px solid #c8893a', paddingBottom:'2px' }}>
            Visit Department Website →
          </a>
        </div>

        {/* feature boxes */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          {[
            { icon:'🏆', title:"India's First", desc:'Mining department to award B.Tech, M.Tech and PhD degrees' },
            { icon:'🔬', title:'19 Laboratories', desc:'Conventional and modern research facilities including an underground model mine' },
            { icon:'🎓', title:'B.Tech · M.Tech · PhD', desc:'Comprehensive programmes from undergraduate to doctoral level' },
            { icon:'🤝', title:'Industry Network', desc:'Strong ties with CIL, Tata Steel, Vedanta, Hindustan Zinc, CIMFR and more' },
          ].map(f => (
            <div key={f.title} style={{ background:'#f8f9fc', borderRadius:12, padding:'1.4rem', border:'1px solid #eee' }}>
              <div style={{ fontSize:'1.5rem', marginBottom:'0.6rem' }}>{f.icon}</div>
              <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#0f2740', marginBottom:'0.35rem' }}>{f.title}</div>
              <div style={{ fontSize:'0.8rem', color:'#7a7068', lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:768px){#about > div{grid-template-columns:1fr !important;gap:2.5rem !important;}}`}</style>
    </section>
  )
}

function WhatWeDo() {
  const items = [
    { icon:'⛏️', title:'Industry Problem Solving', desc:'Real-world mining challenges submitted by professionals are analysed and addressed by our faculty and students, creating a bridge between field experience and academic rigour.' },
    { icon:'🎓', title:'Workshops & Seminars', desc:'Regular workshops like CPCMAI bring together industry experts, researchers, and students to discuss current constraints and innovations in the mining sector.' },
    { icon:'🔬', title:'Research & Innovation', desc:'Cutting-edge research in Rock Mechanics, Mine Safety, Ventilation, Geomechanics, and Mine Planning with state-of-the-art laboratory infrastructure.' },
    { icon:'🌐', title:'Alumni & Industry Network', desc:'A vast network of alumni holding key positions in CIL, NMDC, Tata Steel, Vedanta, HZL, and global mining companies, enabling strong industry-academia collaboration.' },
  ]
  return (
    <section style={{ padding:'90px 2rem', background:'#f8f9fc' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#c8893a', marginBottom:'0.8rem' }}>What We Do</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:700, color:'#0f2740' }}>
            Connecting Academia with Industry
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.5rem' }}>
          {items.map(item => (
            <div key={item.title} style={{ background:'#fff', borderRadius:14, padding:'2rem', border:'1px solid #eee', boxShadow:'0 2px 12px rgba(0,0,0,0.04)', transition:'transform 0.25s,box-shadow 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(15,39,64,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ width:48, height:48, background:'linear-gradient(135deg,#0f2740,#1e3a5a)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', marginBottom:'1.2rem' }}>
                {item.icon}
              </div>
              <h3 style={{ fontFamily:'Georgia,serif', fontSize:'1.05rem', fontWeight:700, color:'#0f2740', marginBottom:'0.6rem' }}>{item.title}</h3>
              <p style={{ fontSize:'0.87rem', color:'#7a7068', lineHeight:1.75 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProblemPortalTeaser({ stats }) {
  return (
    <section style={{ padding:'90px 2rem', background:'linear-gradient(135deg,#0f2740 0%,#1e3a5a 100%)', position:'relative', overflow:'hidden' }}>
      {/* decorative */}
      <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, background:'rgba(232,168,76,0.06)', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:300, height:300, background:'rgba(255,255,255,0.03)', borderRadius:'50%', pointerEvents:'none' }} />

      <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#e8a84c', marginBottom:'0.8rem' }}>Problem Portal</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:700, color:'#fff', marginBottom:'1rem' }}>
            Real Problems. Real Solutions.
          </h2>
          <p style={{ fontSize:'0.98rem', color:'rgba(255,255,255,0.65)', maxWidth:540, margin:'0 auto' }}>
            Mining professionals submit real challenges from the field. Our faculty and students
            analyse them and work towards practical solutions.
          </p>
        </div>

        {/* live stats */}
        {stats && (
          <div style={{ display:'flex', gap:'1px', justifyContent:'center', flexWrap:'wrap', marginBottom:'3rem', background:'rgba(255,255,255,0.08)', borderRadius:14, overflow:'hidden', maxWidth:600, margin:'0 auto 3rem' }}>
            {[
              { num: stats.total,  label:'Problems Submitted', color:'#fff' },
              { num: stats.solved, label:'Solved',             color:'#4ade80' },
              { num: stats.cats,   label:'Categories',         color:'#e8a84c' },
            ].map((s, i) => (
              <div key={s.label} style={{ flex:1, textAlign:'center', padding:'1.5rem 1rem', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ fontFamily:'Georgia,serif', fontSize:'2rem', fontWeight:700, color:s.color, lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginTop:'0.35rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* cards preview */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.2rem', marginBottom:'2.8rem' }}>
          {[
            { icon:'💥', cat:'Blasting',     title:'Blast Vibration Impact',         desc:'High blast vibration affecting slope stability and nearby infrastructure in open-pit coal mines.' },
            { icon:'🌀', cat:'Ventilation',  title:'Underground Ventilation Issue',   desc:'Maintaining adequate airflow in deep underground metal mines with increasing temperature.' },
            { icon:'⛰️', cat:'Geomechanics', title:'Slope Instability',              desc:'Frequent slope failures in open pit iron ore mines due to weak rock mass and monsoon rainfall.' },
          ].map(card => (
            <div key={card.title} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'1.5rem', backdropFilter:'blur(4px)' }}>
              <div style={{ fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#e8a84c', background:'rgba(232,168,76,0.12)', padding:'0.25rem 0.6rem', borderRadius:4, display:'inline-block', marginBottom:'0.8rem' }}>
                {card.icon} {card.cat}
              </div>
              <h4 style={{ fontFamily:'Georgia,serif', fontSize:'0.98rem', fontWeight:700, color:'#fff', marginBottom:'0.5rem' }}>{card.title}</h4>
              <p style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/problems" style={{ background:'#e8a84c', color:'#0f2740', textDecoration:'none', padding:'0.9rem 2.2rem', borderRadius:9, fontWeight:700, fontSize:'0.95rem', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
            View All Problems →
          </Link>
          <Link href="/submit" style={{ background:'rgba(255,255,255,0.1)', color:'#fff', textDecoration:'none', padding:'0.9rem 2.2rem', borderRadius:9, fontWeight:600, fontSize:'0.95rem', border:'1px solid rgba(255,255,255,0.2)', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
            Submit Your Problem
          </Link>
        </div>
      </div>
    </section>
  )
}

function Events() {
  const events = [
    {
      status: 'upcoming',
      date: '29–30 May 2026',
      tag: 'Workshop',
      title: 'Current Problems & Constraints in Mining Industries',
      short: 'CPCMAI',
      desc: 'A two-day workshop bringing together industry professionals and academics to discuss real-world mining challenges, constraints, and innovative solutions.',
      link: 'https://events.iitbhu.ac.in/workshop/CPCMAI/',
    },
    {
      status: 'past',
      date: 'Jan 27–29, 2024',
      tag: 'Conference',
      title: 'RTSMGEE 2023 — International Conference',
      short: 'RTSMGEE',
      desc: 'International conference on Recent Trends in Sustainable Mining, Geomechanics and Environmental Engineering, celebrating 100 years of the department.',
      link: 'https://conferences.iitbhu.ac.in/RTSMGEE2023/',
    },
  ]

  return (
    <section id="events" style={{ padding:'90px 2rem 60px', background:'#fff' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#c8893a', marginBottom:'0.8rem' }}>Events</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:700, color:'#0f2740' }}>
            Our Workshops & Conferences
          </h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'1.5rem' }}>
          {events.map(ev => (
            <div key={ev.title} style={{ borderRadius:14, overflow:'hidden', border:'1px solid #eee', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column' }}>
              <div style={{ background: ev.status === 'upcoming' ? 'linear-gradient(135deg,#0f2740,#1e3a5a)' : '#f8f9fc', padding:'1.2rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', background: ev.status === 'upcoming' ? 'rgba(232,168,76,0.2)' : 'rgba(15,39,64,0.08)', color: ev.status === 'upcoming' ? '#e8a84c' : '#0f2740', padding:'0.25rem 0.7rem', borderRadius:100 }}>
                  {ev.status === 'upcoming' ? '🟢 Upcoming' : '✅ Completed'}
                </span>
                <span style={{ fontSize:'0.78rem', fontWeight:600, color: ev.status === 'upcoming' ? 'rgba(255,255,255,0.7)' : '#7a7068' }}>{ev.date}</span>
              </div>
              <div style={{ padding:'1.5rem', flex:1, display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#c8893a' }}>{ev.tag} · {ev.short}</div>
                <h3 style={{ fontFamily:'Georgia,serif', fontSize:'1.05rem', fontWeight:700, color:'#0f2740', lineHeight:1.35 }}>{ev.title}</h3>
                <p style={{ fontSize:'0.87rem', color:'#7a7068', lineHeight:1.75, flex:1 }}>{ev.desc}</p>
                <a href={ev.link} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', color:'#0f2740', fontWeight:600, fontSize:'0.85rem', textDecoration:'none', marginTop:'0.5rem', borderBottom:'2px solid #c8893a', paddingBottom:'2px', alignSelf:'flex-start' }}>
                  Learn More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function formatConfDate(iso) {
  if (!iso) return 'TBA'
  const d = new Date(iso)
  if (isNaN(d)) return iso
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
}

function ConferenceDirectory() {
  const [activeTab, setActiveTab] = useState('international')
  const [search, setSearch] = useState('')

  const filtered = CONFERENCES
    .filter(c => c.type === activeTab)
    .filter(c => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        (c.location || '').toLowerCase().includes(q) ||
        (c.focus || '').toLowerCase().includes(q)
      )
    })

  const intlCount = CONFERENCES.filter(c => c.type === 'international').length
  const indiaCount = CONFERENCES.filter(c => c.type === 'india').length

  return (
    <section style={{ padding:'70px 2rem 90px', background:'#f8f9fc' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#c8893a', marginBottom:'0.8rem' }}>Conference Directory</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:700, color:'#0f2740', marginBottom:'0.8rem' }}>
            Upcoming Mining & Geotechnical Conferences
          </h2>
          <p style={{ fontSize:'0.9rem', color:'#7a7068', maxWidth:560, margin:'0 auto' }}>
            A curated list of national and international conferences, symposiums, and exhibitions
            relevant to mining engineering and geomechanics.
          </p>
        </div>

        {/* tabs */}
        <div style={{ display:'flex', justifyContent:'center', gap:'0.6rem', marginBottom:'1.5rem' }}>
          {[
            { key:'international', label:'🌍 International', count: intlCount },
            { key:'india',         label:'🇮🇳 National (India)', count: indiaCount },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{
                padding:'0.65rem 1.4rem', borderRadius:9, border:'1.5px solid', cursor:'pointer',
                borderColor: activeTab===t.key ? '#0f2740' : '#ddd',
                background: activeTab===t.key ? 'linear-gradient(135deg,#0f2740,#1e3a5a)' : '#fff',
                color: activeTab===t.key ? '#fff' : '#3d3530',
                fontWeight:600, fontSize:'0.88rem', fontFamily:'inherit',
                transition:'all 0.2s',
              }}>
              {t.label} <span style={{ opacity:0.75, fontWeight:500 }}>({t.count})</span>
            </button>
          ))}
        </div>

        {/* search */}
        <div style={{ maxWidth:480, margin:'0 auto 2.5rem', position:'relative' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, location, or focus area…"
            style={{
              width:'100%', padding:'0.8rem 1rem 0.8rem 2.6rem',
              border:'1.5px solid #ddd', borderRadius:9,
              fontSize:'0.9rem', fontFamily:'inherit',
              outline:'none', background:'#fff',
            }}
          />
          <span style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', fontSize:'1rem', opacity:0.4 }}>🔍</span>
          {search && (
            <button onClick={() => setSearch('')}
              style={{ position:'absolute', right:'0.7rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem', color:'#7a7068' }}>
              ✕
            </button>
          )}
        </div>

        {/* result count */}
        <div style={{ fontSize:'0.8rem', color:'#7a7068', textAlign:'center', marginBottom:'1.5rem' }}>
          Showing <strong>{filtered.length}</strong> of {activeTab === 'international' ? intlCount : indiaCount} conferences
        </div>

        {/* grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#7a7068' }}>
            <div style={{ fontSize:'2rem', marginBottom:'0.6rem' }}>🔍</div>
            <p>No conferences match your search.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:'1.2rem' }}>
            {filtered.map((c, i) => (
              <div key={i} style={{ background:'#fff', borderRadius:12, padding:'1.4rem', border:'1px solid #eee', boxShadow:'0 2px 10px rgba(0,0,0,0.04)', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.6rem' }}>
                  <span style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'#c8893a', background:'rgba(200,137,58,0.1)', padding:'0.2rem 0.6rem', borderRadius:5 }}>
                    📅 {formatConfDate(c.date)}
                  </span>
                </div>
                <h4 style={{ fontFamily:'Georgia,serif', fontSize:'0.98rem', fontWeight:700, color:'#0f2740', lineHeight:1.4 }}>
                  {c.name}
                </h4>
                {c.location && (
                  <div style={{ fontSize:'0.82rem', color:'#5a5248', display:'flex', alignItems:'center', gap:'0.35rem' }}>
                    📍 {c.location}
                  </div>
                )}
                {c.focus && (
                  <p style={{ fontSize:'0.8rem', color:'#7a7068', lineHeight:1.65, margin:0 }}>
                    {c.focus}
                  </p>
                )}
                {c.website && (
                  <a href={c.website} target="_blank" rel="noopener noreferrer"
                    style={{ marginTop:'0.3rem', fontSize:'0.82rem', fontWeight:600, color:'#0f2740', textDecoration:'none', borderBottom:'2px solid #c8893a', paddingBottom:'1px', alignSelf:'flex-start' }}>
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ResearchAreas() {
  const areas = [
    { icon:'🪨', label:'Rock Mechanics & Ground Control' },
    { icon:'🌬️', label:'Mine Ventilation & Environment' },
    { icon:'📐', label:'Mine Planning & Surveying' },
    { icon:'💥', label:'Blasting & Explosives' },
    { icon:'🦺', label:'Mine Safety & Legislation' },
    { icon:'⚙️', label:'Mining Machinery' },
    { icon:'🌿', label:'Mineral Beneficiation' },
    { icon:'🗺️', label:'GIS & Remote Sensing' },
  ]
  return (
    <section style={{ padding:'80px 2rem', background:'#f8f9fc' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#c8893a', marginBottom:'0.8rem' }}>Research</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:700, color:'#0f2740' }}>Areas of Expertise</h2>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem', justifyContent:'center' }}>
          {areas.map(a => (
            <div key={a.label} style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'#fff', border:'1.5px solid #e8e0d5', borderRadius:100, padding:'0.55rem 1.1rem', fontSize:'0.88rem', fontWeight:500, color:'#0f2740', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              <span>{a.icon}</span> {a.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" style={{ padding:'90px 2rem', background:'#fff' }}>
      <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
        <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#c8893a', marginBottom:'0.8rem' }}>Contact</div>
        <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:700, color:'#0f2740', marginBottom:'1rem' }}>Get in Touch</h2>
        <p style={{ fontSize:'0.95rem', color:'#7a7068', lineHeight:1.8, marginBottom:'2.5rem' }}>
          Have a mining problem to share, or want to collaborate with the department?
          Reach out to us or submit your problem directly through the portal.
        </p>

        <div style={{ background:'#f8f9fc', borderRadius:16, padding:'2rem', border:'1px solid #eee', marginBottom:'2rem', textAlign:'left' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
            {[
              { icon:'🏛️', label:'Address', value:'Department of Mining Engineering,\nIIT (BHU) Varanasi,\nVaranasi – 221005, UP, India' },
              { icon:'🌐', label:'Department Website', value:'iitbhu.ac.in/dept/min', href:'https://www.iitbhu.ac.in/dept/min' },
            ].map(c => (
              <div key={c.label}>
                <div style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#c8893a', marginBottom:'0.4rem' }}>{c.icon} {c.label}</div>
                {c.href
                  ? <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ fontSize:'0.88rem', color:'#0f2740', fontWeight:500, textDecoration:'none', borderBottom:'1px solid #c8893a' }}>{c.value}</a>
                  : <p style={{ fontSize:'0.88rem', color:'#5a5248', lineHeight:1.7, whiteSpace:'pre-line', margin:0 }}>{c.value}</p>
                }
              </div>
            ))}
          </div>
        </div>

        <Link href="/submit" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'linear-gradient(135deg,#0f2740,#1e3a5a)', color:'#fff', textDecoration:'none', padding:'0.9rem 2.2rem', borderRadius:9, fontWeight:600, fontSize:'0.95rem', boxShadow:'0 4px 18px rgba(15,39,64,0.2)' }}>
          Submit a Mining Problem →
        </Link>
      </div>
      <style>{`@media(max-width:600px){#contact .grid-2{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background:'#0f2740', color:'rgba(255,255,255,0.55)', padding:'3rem 2rem' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'3rem', marginBottom:'2.5rem' }}>

        {/* brand */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1rem' }}>
            <div style={{ width:32, height:32, background:'rgba(232,168,76,0.2)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>⛏️</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:'0.95rem', color:'#fff', fontWeight:700 }}>Mining Society<br /><span style={{ color:'#e8a84c', fontSize:'0.75rem', fontWeight:400 }}>IIT (BHU) Varanasi</span></div>
          </div>
          <p style={{ fontSize:'0.83rem', lineHeight:1.85, maxWidth:300 }}>
            Bridging industry challenges with academic excellence since 1923.
            India's oldest and most distinguished Mining Engineering department.
          </p>
        </div>

        {/* quick links */}
        <div>
          <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:'1rem' }}>Quick Links</div>
          {[
            { href:'/problems', label:'Browse Problems' },
            { href:'/submit',   label:'Submit a Problem' },
            { href:'#events',   label:'Events' },
            { href:'https://www.iitbhu.ac.in/dept/min', label:'Department Website', ext:true },
          ].map(l => (
            <div key={l.label} style={{ marginBottom:'0.6rem' }}>
              <Link href={l.href} target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}
                style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>
                {l.label}
              </Link>
            </div>
          ))}
        </div>

        {/* social */}
        <div>
          <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:'1rem' }}>Follow Us</div>
          {[
            { href:'https://www.instagram.com/miningsociety.iitbhu', label:'Instagram' },
            { href:'https://www.facebook.com/min.iitbhu/',           label:'Facebook' },
            { href:'https://www.linkedin.com/company/department-of-mining-engineering-iit-varanasi', label:'LinkedIn' },
          ].map(s => (
            <div key={s.label} style={{ marginBottom:'0.6rem' }}>
              <a href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>
                {s.label}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'1.5rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
        <p style={{ fontSize:'0.78rem' }}>© 2026 Department of Mining Engineering, IIT (BHU) Varanasi. All rights reserved.</p>
        <p style={{ fontSize:'0.78rem' }}>Est. 1923 · <a href="https://www.iitbhu.ac.in" target="_blank" rel="noopener noreferrer" style={{ color:'#e8a84c', textDecoration:'none' }}>iitbhu.ac.in</a></p>
      </div>

      <style>{`@media(max-width:768px){footer > div:first-child > div:first-child{grid-template-columns:1fr !important;}}`}</style>
    </footer>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function HomePage() {
  const stats = useStats()
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <WhatWeDo />
      <ProblemPortalTeaser stats={stats} />
      <Events />
      <ConferenceDirectory />
      <ResearchAreas />
      <Contact />
      <Footer />
    </>
  )
}
