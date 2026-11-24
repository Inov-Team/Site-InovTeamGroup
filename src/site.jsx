import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { POLES } from './poles.js';
import { ExpertisePage, AllExpertises, EntitePage, ApprochePage, ActualitesPage, ContactPage, CarrieresPage, slug, ENTITES } from './pages.jsx';
import { meta, SITE } from './routes.js';
import { motion, AnimatePresence, MotionConfig, useInView, animate, useScroll, useMotionValueEvent, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

const spring = { type: 'spring', stiffness: 260, damping: 28 };
const ease = [0.23, 1, 0.32, 1];        // ease-out fort, pour les entrées
const easeIO = [0.77, 0, 0.175, 1];     // ease-in-out fort, pour les déplacements
const fine = () => typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches;

const P = {
  users: 'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 20v-1a4 4 0 0 0-3-3.9M16 5.1a3 3 0 0 1 0 5.8',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
  layers: 'M12 3 2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 17.5l10 5 10-5',
  cube: 'M12 2 3 7v10l9 5 9-5V7l-9-5zM3 7l9 5 9-5M12 12v10',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  cloud: 'M7 18h10a4.5 4.5 0 0 0 .6-9 6 6 0 0 0-11.4 1.6A3.8 3.8 0 0 0 7 18z',
  shield: 'M12 3l8 3v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6l8-3zM8.5 12l2.5 2.5 4.5-5',
  db: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  check: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12l3 3 5-6',
  a11y: 'M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4M4 8l8 2 8-2M12 10v5l-4 7M12 15l4 7',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',
  rocket: 'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c1.5-4 5-9 13-9 0 8-5 11.5-9 13zM15 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3',
  hands: 'M11 17l2 2a1.4 1.4 0 0 0 2-2M14 14l2.5 2.5a1.4 1.4 0 0 0 2-2l-3.5-3.5M8 9l3-3 2 1 3-2 5 5-3 3M3 10l5-5 3 2M3 10l7 7 1-1',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.5 1 .5 1.6V16h6v-.5c0-.6 0-1.2.5-1.6A6 6 0 0 0 12 3z',
  team: 'M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M6 12a2.4 2.4 0 1 0 0-4.8M18 12a2.4 2.4 0 1 0 0-4.8M7 20v-1.5A4.5 4.5 0 0 1 11.5 14h1A4.5 4.5 0 0 1 17 18.5V20M2 19v-1a3.5 3.5 0 0 1 3.5-3.5M22 19v-1a3.5 3.5 0 0 0-3.5-3.5',
  leaf: 'M5 19C5 10 10 5 20 4c-1 10-6 15-15 15zM5 19l8-8',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  chev: 'M6 9l6 6 6-6',
  pause: 'M9 5v14M15 5v14',
  play: 'M7 4l12 8-12 8z'
};
const Icone = ({ n, s = 24, c = 'ico', w = 1.6 }) => (
  <svg className={c} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
);
const Burst = () => (
  <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
    <defs><linearGradient id="bg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#2b4bff" /><stop offset="1" stopColor="#9a3fe0" /></linearGradient></defs>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, k) => (
      <line key={a} x1="20" y1={k % 2 ? 6 : 4} x2="20" y2={k % 2 ? 10 : 11} stroke="url(#bg1)" strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} 20 20)`} opacity={k % 3 ? 1 : 0.6} />
    ))}
  </svg>
);

const EXP = [
  ['code', 'Ingénierie Logicielle', 'Développement, architecture et modernisation.'],
  ['cloud', 'DevOps & Cloud', 'Industrialisation, automatisation et plateformes cloud.'],
  ['shield', 'Cybersécurité', 'Sécurisation des systèmes, des données et des applications.'],
  ['db', 'Data & Analytics', 'Valorisation de la donnée et aide à la décision.'],
  ['check', 'Tests & Validation', 'Qualité logicielle, automatisation et performance.'],
  ['a11y', 'Accessibilité Numérique', 'Des solutions inclusives et conformes.'],
  ['layers', 'Consulting & Innovation', 'Conseil, R&D et accélération de vos projets.'],
  ['sliders', 'Delivery & Opérations', 'TMA, support et continuité de service.']
];
const ICONS = { 'Ingénierie Logicielle': 'code', 'DevOps & Cloud': 'cloud', 'Cybersécurité': 'shield', 'Data & Analytics': 'db', 'Tests & Validation': 'check', 'Accessibilité Numérique': 'a11y', 'Consulting & Innovation': 'layers', 'Delivery & Opérations': 'sliders' };
const ENT = [['Inov Team', '', 'Conseil & ingénierie IT'], ['Inov Team', ' Labs', 'R&D & Innovation'], ['DigiTeam', '', 'Delivery & Services']];
const GAL = [
  ['equipe', 'g-team', 'Toute l’équipe : commerce, recrutement et support', '50% 62%'],
  ['equipe-commerciale', 'g-com', 'L’équipe commerciale', '50% 52%'],
  ['bureaux-3', 'g-a', 'Nos bureaux', '50% 50%'],
  ['bureaux-1', 'g-b', 'L’espace d’accueil', '30% 55%'],
  ['evenement', 'g-ev', 'Inov Team en événement', '50% 45%'],
  ['bureaux-2', 'g-c', 'Le salon Be brilliant together', '50% 50%']
];
const CLIENTS = [['orange', 'Orange', 'sq'], ['amadeus', 'Amadeus'], ['air-france', 'Air France'], ['docaposte', 'Docaposte'], ['pro-btp', 'PRO BTP Groupe'], ['kappa', 'Kappa Engineering', 'sq']];
const VALS = [['hands', 'Proximité', 'Des relations durables et de confiance.'], ['bulb', 'Innovation', 'Une culture R&D au cœur de notre ADN.'], ['team', 'Esprit d’équipe', 'Une aventure humaine et collective.'], ['leaf', 'Engagement', 'Des impacts concrets et responsables.']];

function Count({ to, prefix = '' }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => { if (!seen) return; const c = animate(0, to, { duration: 1.4, ease, onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [seen, to]);
  return <b ref={ref}>{prefix}{v}</b>;
}

const rise = { hidden: { opacity: 0, y: 22 }, show: (k = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: k * 0.07, ease } }) };
const Reveal = ({ children, k = 0, className, as = 'div' }) => {
  const M = motion[as];
  return <M className={className} variants={rise} custom={k} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -12% 0px' }}>{children}</M>;
};

function Header() {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(null);
  const [sc, setSc] = useState(false);
  const [hide, setHide] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSc(y > 10);
    setHide(y > 300 && y > prev + 4 && !open);
    if (y < prev - 4) setHide(false);
  });
  const menus = {
    exp: EXP.map(([, t]) => [t, '#expertise-' + slug(t)]),
    ent: ENTITES.map((e) => [e.t + e.em, '#entite-' + e.k, e.d])
  };
  const Drop = ({ id, label }) => (
    <div className="dd"
      onMouseEnter={() => fine() && setDd(id)}
      onMouseLeave={() => fine() && setDd(null)}
      onKeyDown={(e) => { if (e.key === 'Escape' && dd === id) { setDd(null); e.currentTarget.querySelector('button')?.focus(); } }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDd(null); }}>
      <button type="button" aria-expanded={dd === id} aria-controls={'dd-' + id} onClick={() => setDd(dd === id ? null : id)}>{label}<Icone n="chev" s={16} c="" w={2} /></button>
      <AnimatePresence>
        {dd === id && (
          <motion.div className="menu" id={'dd-' + id} initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.98 }} transition={{ duration: 0.18, ease }}>
            {menus[id].map(([t, h, d]) => <a key={t} href={h} onClick={() => setDd(null)}>{t}{d && <small>{d}</small>}</a>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  return (
    <motion.header className={'hd' + (sc ? ' sc' : '')} animate={{ y: hide ? '-100%' : '0%' }} transition={{ duration: 0.35, ease }}>
      <div className="wrap">
        <a className="brand" href="#top" aria-label="Inov Team Group, accueil"><img src="assets/logo-group.webp" alt="Inov Team Group" /></a>
        <nav className="nav" aria-label="Navigation principale">
          <a href="#qui">Qui sommes-nous ?</a>
          <Drop id="exp" label="Nos expertises" />
          <Drop id="ent" label="Nos entités" />
          <a href="#carrieres">Carrières</a>
          <a href="#actualites">Actualités</a>
        </nav>
        <a className="btn cta" href="#contact">Nous contacter <Icone n="arrow" s={18} c="" w={2} /></a>
        <button className="burger" aria-expanded={open} aria-controls="mnav" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen(!open)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <motion.path animate={{ d: open ? 'M4 4L16 16' : 'M3 7H17' }} transition={spring} />
            <motion.path animate={{ d: open ? 'M4 16L16 4' : 'M3 13H17' }} transition={spring} />
          </svg>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id="mnav" className="mnav" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={spring}>
            <nav aria-label="Menu mobile">
              {[['#qui', 'Qui sommes-nous ?'], ['#expertises-toutes', 'Nos expertises'], ['#entites', 'Nos entités'], ['#carrieres', 'Carrières'], ['#actualites', 'Actualités']].map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
              <a className="btn" href="#contact" onClick={() => setOpen(false)}>Nous contacter <Icone n="arrow" s={18} c="" w={2} /></a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="prog" style={{ scaleX: prog }} aria-hidden="true" />
    </motion.header>
  );
}

const Words = ({ text, delay = 0, cls }) => {
  const w = text.split(' ');
  return <span className={cls}>{w.map((x, i) => (
    <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '.1em' }}>
      <motion.span className={'word' + (cls ? ' ' + cls : '')} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ ...spring, delay: delay + i * 0.06 }}>{x + (i < w.length - 1 ? ' ' : '')}</motion.span>
    </span>
  ))}</span>;
};

function Wheel({ sel, pick }) {
  const N = EXP.length, C = 260;
  const [rot, setRot] = useState(90 - sel * 45);
  useEffect(() => {
    setRot((r) => { let t = 90 - sel * 45; while (t - r > 180) t -= 360; while (r - t > 180) t += 360; return t; });
  }, [sel]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [4, -4]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-5, 5]), { stiffness: 120, damping: 18 });
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1); };
  const pol = (ang, rad) => [C + rad * Math.cos(ang * Math.PI / 180), C + rad * Math.sin(ang * Math.PI / 180)];
  const [hov, setHov] = useState(-1);
  const [ic, t] = EXP[sel];
  return (
    <motion.div className="wheel" onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0); }} style={{ rotateX: rx, rotateY: ry }}>
      <svg viewBox="0 0 520 520" role="tablist" aria-label="Nos 8 pôles d’expertise">
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2b4bff" /><stop offset=".55" stopColor="#7b3fe4" /><stop offset="1" stopColor="#c935a6" /></linearGradient>
          <radialGradient id="wglow"><stop offset="0" stopColor="#9b6bff" stopOpacity=".35" /><stop offset="1" stopColor="#9b6bff" stopOpacity="0" /></radialGradient>
          <filter id="wsh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <circle cx={C} cy={C} r="250" fill="url(#wglow)" />
        <circle cx={C} cy={C} r="182" fill="none" stroke="#e4dcfa" strokeWidth="1" strokeDasharray="2 7" />
        <motion.g animate={{ rotate: rot }} transition={{ type: 'spring', stiffness: 70, damping: 16 }} style={{ originX: '50%', originY: '50%' }}>
          <circle cx={C} cy={C} r="259" fill="transparent" />
          {EXP.map(([i, tt], k) => {
            const ang = k * 45 - 90, on = k === sel, hl = k === hov && !on;
            const [x1, y1] = pol(ang, 96), [x2, y2] = pol(ang, 112), [x3, y3] = pol(ang, on ? 128 : 124), [x4, y4] = pol(ang, on ? 172 : 152);
            const [lx, ly] = pol(ang, 206);
            const w = tt.length * 7.4 + 28;
            return (
              <g key={tt} role="tab" aria-selected={on} aria-label={tt} tabIndex={on ? 0 : -1} className="wray" id={'wr-' + k}
                onClick={() => pick(k)} onMouseEnter={() => setHov(k)} onMouseLeave={() => setHov(-1)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(k))}>
                <line x1={C} y1={C} x2={lx} y2={ly} stroke="transparent" strokeWidth="46" />
                {on && <motion.line x1={x4 + 0} y1={y4} x2={pol(ang, 262)[0]} y2={pol(ang, 262)[1]} stroke="url(#wg)" strokeWidth="1.5" strokeDasharray="3 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />}
                <motion.line x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" animate={{ stroke: on ? '#7b3fe4' : '#c8bdf0', strokeWidth: on ? 13 : 10 }} transition={{ duration: 0.3 }} />
                {on && <line x1={x3} y1={y3} x2={x4} y2={y4} stroke="#9b6bff" strokeWidth="22" strokeLinecap="round" filter="url(#wsh)" opacity=".6" />}
                <motion.line strokeLinecap="round" stroke={on ? 'url(#wg)' : hl ? '#8c6cf0' : '#b3a7e2'} animate={{ x1: x3, y1: y3, x2: x4, y2: y4, strokeWidth: on ? 16 : hl ? 14 : 12 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} />
                <motion.g animate={{ rotate: -rot, opacity: on ? 0 : 1, scale: on ? 0.8 : 1 }} transition={{ type: 'spring', stiffness: 70, damping: 16 }} style={{ originX: `${lx}px`, originY: `${ly}px` }}>
                  <motion.rect x={lx - w / 2} y={ly - 17} width={w} height="34" rx="17" initial={false} animate={{ fill: on ? '#1b1446' : '#ffffff', stroke: on ? '#1b1446' : hl ? '#7b3fe4' : '#e4dcfa' }} transition={{ duration: 0.2 }} strokeWidth="1" />
                  <motion.text x={lx} y={ly + 5} textAnchor="middle" fontSize="13.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" initial={false} animate={{ fill: on ? '#ffffff' : hl ? '#7b3fe4' : '#4c4868' }} transition={{ duration: 0.2 }}>{tt}</motion.text>
                </motion.g>
              </g>
            );
          })}
        </motion.g>
        <circle cx={C} cy={C} r="80" fill="#fff" stroke="url(#wg)" strokeWidth="2" />
        <circle cx={C} cy={C} r="70" fill="#f6f1ff" />
        <AnimatePresence mode="wait">
          <motion.g key={sel} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.22 }} style={{ originX: '50%', originY: '50%' }}>
            <svg x={C - 22} y={C - 34} width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="url(#wg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={P[ic]} /></svg>
            <text x={C} y={C + 30} textAnchor="middle" fontSize="12" fontWeight="700" fill="#7b3fe4" fontFamily="Plus Jakarta Sans, sans-serif">{String(sel + 1).padStart(2, '0')} / 08</text>
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

function ExpertiseExplorer({ sel, setSel }) {
  const [auto, setAuto] = useState(true);
  const [hold, setHold] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { margin: '-20% 0px -20% 0px' });
  const joue = auto && seen && !hold && !reduce;
  useEffect(() => {
    if (!joue) return;
    const t = setInterval(() => setSel((s) => (s + 1) % EXP.length), 5000);
    return () => clearInterval(t);
  }, [joue]);
  const pick = (k) => { setAuto(false); setSel(k); };
  const pickHover = (k) => { setAuto(false); setSel(k); };
  const onKey = (e) => {
    const n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!n) return; e.preventDefault();
    const k = (sel + n + EXP.length) % EXP.length; pick(k);
    setTimeout(() => (document.getElementById('wr-' + k)?.getClientRects().length ? document.getElementById('wr-' + k) : document.getElementById('xt-' + k))?.focus(), 0);
  };
  const [ic, t] = EXP[sel];
  const p = POLES.find((x) => x.t === t);
  return (
    <div className="xp" ref={ref} onKeyDown={onKey}>
      <div className="wheel-wrap" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
        <Wheel sel={sel} pick={pick} />
        <div className="whint">
          <button type="button" className="wpause" onClick={() => setAuto((a) => !a)} aria-pressed={!auto}>
            {joue ? <><Icone n="pause" s={14} c="" w={2} />Mettre en pause</> : <><Icone n="play" s={14} c="" w={2} />Lancer le défilement</>}
          </button>
          <span>ou cliquez sur un pôle</span>
        </div>
      </div>
      <div className="xp-list" role="tablist" aria-label="Nos 8 pôles">
        {EXP.map(([i, tt], k) => (
          <button key={tt} id={'xt-' + k} role="tab" aria-selected={sel === k} aria-controls="xp-panel" tabIndex={sel === k ? 0 : -1} className="xp-tab" onClick={() => pick(k)}>
            {sel === k && <motion.span layoutId="xp-hl" className="xp-hl" transition={spring} />}
            <Icone n={i} s={22} /><span className="xp-t">{tt}</span>
          </button>
        ))}
      </div>
      <div className="xp-panel" id="xp-panel" role="tabpanel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={sel} className="xp-in" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease }}>
            <div className="xp-top"><div className="xp-ico"><Icone n={ic} s={34} w={1.5} /></div>{joue && <motion.span key={'b' + sel} className="xp-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5, ease: 'linear' }} />}</div>
            <h3>{t}</h3>
            <p className="xp-sum">{p.s}</p>
            <div className="xp-cols">
              <div><h4>Ce que nous prenons en charge</h4><ul>{p.a.map((x, n) => <motion.li key={x} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + n * 0.05 }}>{x}</motion.li>)}</ul></div>
              {p.p.length > 0 && <div><h4>Profils mobilisés</h4><div className="xp-chips">{p.p.map((x, n) => <motion.span key={x} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + n * 0.05 }}>{x}</motion.span>)}</div></div>}
            </div>
            <div className="xp-acts">
              <a className="btn" href={'#expertise-' + slug(t)}>Découvrir le pôle <Icone n="arrow" s={18} c="" w={2} /></a>
              <a className="btn out-v" href="#contact">Parler de votre projet</a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Le visuel de marque en trois poses : des fondus enchaînés sur l'opacité,
// la seule propriété qui ne coûte ni calcul de mise en page ni repeinte.
const POSES = [
  'La main de la marque Inov Team, les fils de lumière passant entre les doigts',
  'La même main, les doigts refermés sur les fils de lumière',
  'La même main, l’index tendu vers les fils de lumière'
];
function HandVisual() {
  return (
    <motion.div className="hand-wrap" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ opacity: { duration: 0.6, ease }, scale: { duration: 0.7, ease } }}>
      {POSES.map((alt, i) => (
        <img key={i} className={'hand hand-' + (i + 1)} src={`assets/hand-${i + 1}.webp`}
          width="900" height="585" alt={i ? '' : alt} aria-hidden={i ? 'true' : undefined}
          fetchPriority={i ? undefined : 'high'} decoding="async" />
      ))}
    </motion.div>
  );
}

const Tilt = ({ className, href, children }) => <a className={className} href={href}>{children}</a>;

function ToTop() {
  const { scrollY } = useScroll();
  const [on, setOn] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setOn(y > 900));
  return (
    <AnimatePresence>
      {on && (
        <motion.button className="totop" aria-label="Revenir en haut de la page" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, y: 16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.8 }}
          whileHover={{ y: -3 }} whileTap={{ scale: 0.92 }}>
          <Icone n="arrow" s={20} c="" w={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [sel, setSel] = useState(0);
  const PAGES = ['contact', 'carrieres', 'actualites', 'approche', 'expertises-toutes'];
  const parse = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (PAGES.includes(h) || h.startsWith('expertise-') || h.startsWith('entite-')) {
      if (h.startsWith('expertise-') && !EXP.some(([, t]) => 'expertise-' + slug(t) === h)) return 'home';
      if (h.startsWith('entite-') && !ENTITES.some((e) => 'entite-' + e.k === h)) return 'home';
      return h;
    }
    return 'home';
  };
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => {
      const r = parse(); setRoute(r);
      const h = location.hash.slice(1);
      if (r !== 'home' || !h || h === 'top') window.scrollTo({ top: 0 });
      else requestAnimationFrame(() => requestAnimationFrame(() => {
        const el = document.getElementById(h);
        if (el) el.scrollIntoView({ block: 'start', behavior: 'auto' });
      }));
    };
    window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on);
  }, []);
  const page = route === 'contact' ? <ContactPage /> : route === 'carrieres' ? <CarrieresPage /> : route === 'actualites' ? <ActualitesPage /> : route === 'approche' ? <ApprochePage />
    : route === 'expertises-toutes' ? <AllExpertises I={Icone} icons={ICONS} /> : route.startsWith('expertise-') ? <ExpertisePage k={route.slice(10)} I={Icone} icons={ICONS} /> : route.startsWith('entite-') ? <EntitePage k={route.slice(7)} /> : null;
  useEffect(() => {
    const m = meta(route);
    document.title = m.t;
    const set = (sel, attr, val) => { const el = document.head.querySelector(sel); if (el) el.setAttribute(attr, val); };
    set('meta[name="description"]', 'content', m.d);
    set('meta[property="og:title"]', 'content', m.t);
    set('meta[property="og:description"]', 'content', m.d);
    set('link[rel="canonical"]', 'href', SITE.url + (route === 'home' ? '' : '#' + route));
  }, [route]);

  const [zoom, setZoom] = useState(null);
  const lb = useRef(null), ouvreur = useRef(null);
  useEffect(() => {
    if (zoom === null) return;
    ouvreur.current = document.activeElement;
    lb.current?.querySelector('.lbx')?.focus();
    const k = (e) => {
      if (e.key === 'Escape') { setZoom(null); return; }
      if (e.key !== 'Tab') return;
      const f = lb.current?.querySelectorAll('button');
      if (!f || !f.length) return;
      const [a, z] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('keydown', k); ouvreur.current?.focus?.(); };
  }, [zoom]);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#contenu">Aller au contenu</a>
      <Header />
      <ToTop />
      <main id="contenu" tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
        {page ? (
        <motion.div key={route} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22, ease }}>{page}</motion.div>
        ) : (
        <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22, ease }}>
        <section className="hero screen" id="top">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <motion.div className="eyebrow line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>Be brilliant together</motion.div>
                <h1><Words text="Ensemble, changeons" delay={0.15} cls="nw" /><br /><Words text="de perspective." delay={0.3} cls="g" /></h1>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.55 }}>
                  <p className="lead">ESN agile à taille humaine, spécialisée en ingénierie, R&amp;D et services numériques, du conseil à la réalisation.</p>
                  <div className="acts">
                    <a className="btn" href="#expertises">Découvrir nos expertises <Icone n="arrow" s={18} c="" w={2} /></a>
                    <a className="btn out" href="#approche"><span className="play"><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z" fill="currentColor" /></svg></span>Notre approche</a>
                  </div>
                </motion.div>
              </div>
              <div className="visual">
                <HandVisual />
                <motion.div className="since" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7, ease }}>
                  <Icone n="rocket" s={40} />
                  <div><b>Depuis 2018</b><span>Innovation, expertise<br />et proximité</span></div>
                </motion.div>
              </div>
            </div>
            <div className="stats" id="qui">
              <div className="stat"><Icone n="users" /><div><Count to={90} prefix="+" /><span>collaborateurs</span></div></div>
              <div className="stat"><Icone n="pin" /><div><Count to={3} /><span>implantations</span><small>Sophia-Antipolis · Aix-en-Provence · Monaco</small></div></div>
              <div className="stat"><Icone n="layers" /><div><Count to={3} /><span>entités</span><small>Inov Team · Inov Team Labs · DigiTeam</small></div></div>
              <div className="stat"><Icone n="cube" /><div><Count to={8} /><span>pôles d’expertise</span></div></div>
              <div className="stat"><Icone n="trend" /><div><Count to={40} prefix="+" /><span>recrutements / an</span></div></div>
            </div>
          </div>
        </section>

        <section className="sec screen" id="expertises">
          <div className="wrap">
            <div className="head">
              <div><div className="eyebrow">Nos expertises</div><h2>Un haut niveau d’expertise<br />au service de <span className="g">vos projets.</span></h2><p className="hsub">8 pôles, une même exigence : des consultants seniors et un manager technique dédié à chaque mission.</p></div>
              <a className="btn out-v" href="#expertises-toutes">Voir toutes nos expertises <Icone n="arrow" s={18} c="" w={2} /></a>
            </div>
            <ExpertiseExplorer sel={sel} setSel={setSel} />
          </div>
        </section>

        <section className="screen ent-screen" id="entites"><div className="ent">
          <svg className="beams" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="bm" x1="0" x2="1"><stop offset="0" stopColor="#7b5cff" stopOpacity="0" /><stop offset=".5" stopColor="#b98cff" stopOpacity=".8" /><stop offset="1" stopColor="#ff7ae0" stopOpacity=".2" /></linearGradient></defs>
            {[0, 1, 2, 3, 4].map((k) => (
              <motion.path key={k} d={`M-20 ${200 + k * 12} C 300 ${120 + k * 14}, 700 ${300 - k * 10}, 1220 ${40 + k * 16}`} fill="none" stroke="url(#bm)" strokeWidth={k === 2 ? 1.6 : 0.8}
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: k * 0.15, ease }} />
            ))}
          </svg>
          <div className="ent-in">
            <div>
              <div className="eyebrow">Nos entités</div>
              <h2>Un groupe, des expertises<br /><span className="g" style={{ backgroundImage: 'linear-gradient(95deg,#d96bff,#ff7ad0)' }}>complémentaires.</span></h2>
              <span className="rule" />
            </div>
            <div className="ent-cards">
              {ENT.map(([a, b, d], k) => (
                <Reveal key={a + b} k={k}>
                  <Tilt className="ecard" href={'#entite-' + ENTITES[k].k}><img className="elg" src={`assets/${ENTITES[k].logo}.webp`} alt={a + b} /><span>{d}</span><span className="arr"><Icone n="arrow" s={18} c="" w={2} /></span></Tilt>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        </section>

        <div className="screen" id="confiance">
        <section className="clients" aria-label="Ils nous font confiance">
          <div className="wrap">
            <div className="eyebrow">Ils nous font confiance</div>
            <div className="marquee" aria-label="Logos clients">
              <div className="mq-track">
                {[0, 1].map((set) => (
                  <div className="mq-set" key={set} aria-hidden={set === 1}>
                    {CLIENTS.map(([f, nom, sq]) => <img key={f} className={sq || ''} src={`assets/${f}.webp`} alt={set === 1 ? '' : nom} />)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="sec" id="valeurs">
          <div className="wrap vals">
            <Reveal>
              <div className="eyebrow">Nos valeurs</div>
              <h2>Ce qui nous fait<br />avancer, <span className="g">ensemble.</span></h2>
              <p>Chez Inov Team, nous croyons à la force du collectif, à l’innovation utile et à des relations durables, au service de projets à fort impact.</p>
            </Reveal>
            <div className="vcards">
              {VALS.map(([ic, t, d], k) => <Reveal key={t} k={k} className="vcard"><Icone n={ic} s={44} /><h3>{t}</h3><p>{d}</p></Reveal>)}
            </div>
          </div>
        </section>
        </div>

        <section className="sec screen" id="equipe">
          <div className="wrap">
            <div className="head">
              <div><div className="eyebrow">La vie d’Inov Team</div><h2>Une équipe, un même<br />état d’esprit : <span className="g">brillants ensemble.</span></h2></div>
              <p style={{ maxWidth: 420 }}>Commerciaux, recruteurs, équipes support et consultants : voici ceux qui font Inov Team au quotidien, dans nos bureaux et sur le terrain.</p>
            </div>
            <div className="gal">
              {GAL.map(([f, c, cap, pos], k) => (
                <Reveal key={f} k={k} className={'gi ' + c}>
                  <button className="gbtn" onClick={() => setZoom(k)} aria-label={'Agrandir : ' + cap}>
                    <img src={`assets/${f}.webp`} alt={cap} style={{ objectPosition: pos }} loading="lazy" />
                    <span className="cap">{cap}</span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
          <AnimatePresence>
            {zoom !== null && (
              <motion.div className="lb" ref={lb} role="dialog" aria-modal="true" aria-label={GAL[zoom][2]} onClick={() => setZoom(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease }}>
                <motion.img src={`assets/${GAL[zoom][0]}.webp`} alt={GAL[zoom][2]} initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} transition={spring} />
                <p>{GAL[zoom][2]}</p>
                <button className="lbx" onClick={() => setZoom(null)} aria-label="Fermer">×</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="screen car-screen" id="rejoindre"><div className="wrap">
          <Reveal className="car">
            <div className="ph" role="img" aria-label="L’équipe Inov Team dans nos bureaux" />
            <div className="car-in">
              <div className="eyebrow">Carrières</div>
              <h2>Rejoignez une équipe engagée<br />et des projets à <span className="g">fort impact.</span></h2>
              <div className="row">
                <p>Développez votre expertise dans un environnement stimulant, bienveillant et en constante évolution.</p>
                <a className="btn" href="#carrieres">Voir nos offres <Icone n="arrow" s={18} c="" w={2} /></a>
              </div>
            </div>
          </Reveal>
        </div>
        </section>

        </motion.div>
        )}
        </AnimatePresence>
        <div className="screen end-screen">
        <section className="band" id="cta">
          <svg className="beams" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">{[0, 1, 2, 3].map((k) => <motion.path key={k} d={`M-20 ${150 - k * 8} C 300 ${100 + k * 10}, 800 ${170 - k * 12}, 1220 ${20 + k * 14}`} fill="none" stroke="#f1b5ff" strokeOpacity={0.35 - k * 0.06} strokeWidth="1.2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: k * 0.15 }} />)}</svg>
          <div className="wrap">
            <h2>Construisons ensemble<br />vos projets <span>de demain.</span></h2>
            <a className="btn white" href="#contact"><Icone n="cal" s={20} c="" w={1.8} />Échanger avec nos équipes</a>
          </div>
        </section>
      <footer className="ft">
        <div className="wrap">
          <div className="ft-grid">
            <div><img src="assets/logo-group-w.webp" alt="Inov Team Group" /><div className="tag">Be brilliant together</div></div>
            <div><h4>Le Groupe</h4><ul><li><a href="#qui">Qui sommes-nous ?</a></li><li><a href="#entites">Nos entités</a></li><li><a href="#valeurs">Nos valeurs</a></li></ul></div>
            <div><h4>Expertises</h4><ul>{EXP.slice(0, 4).map(([, t]) => <li key={t}><a href={'#expertise-' + slug(t)}>{t}</a></li>)}<li><a href="#expertises-toutes">Toutes nos expertises</a></li></ul></div>
            <div><h4>Carrières</h4><ul><li><a href="#carrieres">Nos offres</a></li><li><a href="#approche">Notre culture</a></li><li><a href="#carrieres">Processus de recrutement</a></li><li><a href="#actualites">Actualités</a></li></ul></div>
            <div><h4>Contact</h4><ul><li><Icone n="pin" s={16} c="" />Sophia-Antipolis · Aix-en-Provence · Monaco</li><li><Icone n="mail" s={16} c="" /><a href="mailto:contact@inov-team.fr">contact@inov-team.fr</a></li><li><a href="https://www.linkedin.com/company/inov-team" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 7v8h2.5v-8H7zm1.2-4a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8zM11 10v8h2.5v-4.2c0-1.1.6-1.8 1.5-1.8s1.3.6 1.3 1.8V18H19v-4.8c0-2.4-1.3-3.4-3-3.4-1.2 0-2 .6-2.4 1.2V10H11z" /></svg></a></li></ul></div>
          </div>
          <div className="bot"><span>© 2026 Inov Team Group</span><span style={{ display: 'flex', gap: 18 }}><a href="https://inov-team.fr/mentions">Mentions légales</a><a href="https://inov-team.fr/cgu">CGU</a></span></div>
        </div>
      </footer>
        </div>
      </main>
    </MotionConfig>
  );
}

createRoot(document.getElementById('root')).render(<App />);
