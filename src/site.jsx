import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { POLES } from './poles.js';
import { ExpertisePage, AllExpertises, EntitePage, ApprochePage, ActualitesPage, ContactPage, CarrieresPage, EquipePage, BandeauPortraits, slug, ENTITES } from './pages.jsx';
import { meta, SITE } from './routes.js';
import { motion, AnimatePresence, MotionConfig, useInView, animate, useScroll, useMotionValueEvent, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

const spring = { type: 'spring', stiffness: 260, damping: 28 };
const ease = [0.23, 1, 0.32, 1];        // ease-out fort, pour les entrées
const easeIO = [0.77, 0, 0.175, 1];     // ease-in-out fort, pour les déplacements
const fine = () => typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches;

// Jeu de pictogrammes : chacun est une vraie figure, composée de plusieurs
// éléments plutôt que d'un seul tracé. Tout tient entre 2 et 22 sur la grille
// de 24, donc rien ne touche le bord, quelle que soit l'épaisseur du trait.
const P = {
  users: [['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }], ['circle', { cx: 9, cy: 7, r: 4 }], ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }], ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }]],
  pin: [['path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }], ['circle', { cx: 12, cy: 10, r: 3 }]],
  layers: [['path', { d: 'M12.83 2.18a2 2 0 0 0-1.66 0L3.6 5.73a1 1 0 0 0 0 1.83l7.57 3.45a2 2 0 0 0 1.66 0l7.57-3.45a1 1 0 0 0 0-1.83Z' }], ['path', { d: 'M21.3 16.1 13 19.88a2 2 0 0 1-1.66 0L3 16.1' }], ['path', { d: 'M21.3 11.6 13 15.38a2 2 0 0 1-1.66 0L3 11.6' }]],
  cube: [['path', { d: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' }], ['path', { d: 'm3.3 7 8.7 5 8.7-5' }], ['path', { d: 'M12 22V12' }]],
  trend: [['path', { d: 'M22 7 13.5 15.5 8.5 10.5 2 17' }], ['path', { d: 'M16 7h6v6' }]],
  code: [['path', { d: 'm16 18 6-6-6-6' }], ['path', { d: 'm8 6-6 6 6 6' }], ['path', { d: 'm14.5 4-5 16' }]],
  cloud: [['path', { d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' }]],
  infini: [['path', { d: 'M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Z' }], ['path', { d: 'M12 12c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z' }]],
  cadenas: [['path', { d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z' }], ['path', { d: 'm9 12 2 2 4-4' }]],
  barres: [['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16' }], ['path', { d: 'M7 16v-4' }], ['path', { d: 'M12 16V8' }], ['path', { d: 'M17 16v-7' }]],
  recette: [['rect', { x: 8, y: 2, width: 8, height: 4, rx: 1 }], ['path', { d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' }], ['path', { d: 'm9 14 2 2 4-4' }]],
  a11y: [['circle', { cx: 16, cy: 4, r: 1 }], ['path', { d: 'm18 19 1-7-5.87.94' }], ['path', { d: 'm5 8 3-3 5.5 3-2.21 3.1' }], ['path', { d: 'M4.24 14.5a5 5 0 0 0 6.88 6' }], ['path', { d: 'M13.76 17.5a5 5 0 0 0-6.88-6' }]],
  pouls: [['path', { d: 'M22 12h-3.5a1 1 0 0 0-.95.68l-2.4 7.2a.5.5 0 0 1-.95 0L9.3 3.62a.5.5 0 0 0-.95 0l-2.4 7.2A1 1 0 0 1 5 11.5H2' }]],
  boussole: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'm16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z' }]],
  rocket: [['path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0Z' }], ['path', { d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z' }], ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0' }], ['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' }]],
  hands: [['path', { d: 'm11 17 2 2a1 1 0 1 0 3-3' }], ['path', { d: 'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4' }], ['path', { d: 'm21 3 1 11h-2' }], ['path', { d: 'M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3' }], ['path', { d: 'M3 4h8' }]],
  bulb: [['path', { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' }], ['path', { d: 'M9 18h6' }], ['path', { d: 'M10 22h4' }]],
  team: [['path', { d: 'M18 21a8 8 0 0 0-16 0' }], ['circle', { cx: 10, cy: 8, r: 5 }], ['path', { d: 'M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3' }]],
  leaf: [['path', { d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z' }], ['path', { d: 'M2 21c0-3 1.85-5.36 2.99-6.5' }]],
  arrow: [['path', { d: 'M5 12h14' }], ['path', { d: 'm12 5 7 7-7 7' }]],
  cal: [['path', { d: 'M8 2v4' }], ['path', { d: 'M16 2v4' }], ['rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }], ['path', { d: 'M3 10h18' }]],
  mail: [['rect', { x: 2, y: 4, width: 20, height: 16, rx: 2 }], ['path', { d: 'm22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7' }]],
  chev: [['path', { d: 'm6 9 6 6 6-6' }]],
  pause: [['rect', { x: 6, y: 4, width: 4, height: 16, rx: 1 }], ['rect', { x: 14, y: 4, width: 4, height: 16, rx: 1 }]],
  play: [['path', { d: 'M6 3.5 20 12 6 20.5Z', fill: 'currentColor' }]],
  check: [['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'm8.5 12.5 2.5 2.5 4.5-5' }]]
};
const Icone = ({ n, s = 24, c = 'ico', w = 1.6 }) => (
  <svg className={c} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {P[n].map(([T, a], i) => React.createElement(T, { key: i, ...a }))}
  </svg>
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
  ['infini', 'DevOps & Cloud', 'Industrialisation, automatisation et plateformes cloud.'],
  ['cadenas', 'Cybersécurité', 'Sécurisation des systèmes, des données et des applications.'],
  ['barres', 'Data & Analytics', 'Valorisation de la donnée et aide à la décision.'],
  ['recette', 'Tests & Validation', 'Qualité logicielle, automatisation et performance.'],
  ['a11y', 'Accessibilité Numérique', 'Des solutions inclusives et conformes.'],
  ['boussole', 'Consulting & Innovation', 'Conseil, R&D et accélération de vos projets.'],
  ['pouls', 'Delivery & Opérations', 'TMA, support et continuité de service.']
];
const ICONS = {
  'Ingénierie Logicielle': 'code',        // les chevrons du code
  'DevOps & Cloud': 'infini',             // la boucle, symbole du DevOps
  'Cybersécurité': 'cadenas',             // bouclier avec cadenas
  'Data & Analytics': 'barres',           // histogramme sur deux axes
  'Tests & Validation': 'recette',        // procès-verbal de recette coché
  'Accessibilité Numérique': 'a11y',      // le pictogramme universel
  'Consulting & Innovation': 'boussole',  // donner le cap
  'Delivery & Opérations': 'pouls'        // la supervision du run
};
const ENT = [['Inov Team', '', 'Conseil & ingénierie IT'], ['Inov Team', ' Labs', 'R&D & Innovation'], ['DigiTeam', '', 'Delivery & Services']];
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
        <a className="brand" href="#top" aria-label="Inov Team Group, accueil"><img src="assets/logo-group.webp" alt="Inov Team Group" width="120" height="74" fetchPriority="high" /></a>
        <nav className="nav" aria-label="Navigation principale">
          <a href="#qui">Qui sommes-nous ?</a>
          <Drop id="exp" label="Nos expertises" />
          <a href="#equipe-page">L’équipe</a>
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
              {[['#qui', 'Qui sommes-nous ?'], ['#expertises-toutes', 'Nos expertises'], ['#equipe-page', 'L’équipe'], ['#carrieres', 'Carrières'], ['#actualites', 'Actualités']].map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
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
            <svg x={C - 26} y={C - 26} width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="url(#wg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{P[ic].map(([T, a], i) => React.createElement(T, { key: i, ...a, fill: a.fill ? 'url(#wg)' : 'none' }))}</svg>
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

function ExpertiseExplorer({ sel, setSel }) {
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { margin: '-20% 0px -20% 0px' });
  const joue = auto && seen && !reduce;
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
      <div className="wheel-wrap">
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

// Le visuel de marque en six poses, enchaînées en fondu. Seule l'opacité
// bouge : le GPU compose, rien n'est recalculé ni repeint.
const POSES = [
  'La main de la marque Inov Team, des fils de lumière passant entre les doigts',
  '', '', '', '', '', ''
];
function HandVisual() {
  return (
    <motion.div className="hand-wrap" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ opacity: { duration: 0.6, ease }, scale: { duration: 0.7, ease } }}>
      {POSES.map((alt, i) => (
        <img key={i} className={'hand hand-' + (i + 1)} src={`assets/hand-${i + 1}.webp`}
          width="900" height="585" alt={alt} aria-hidden={i ? 'true' : undefined}
          fetchPriority={i ? "low" : "high"} decoding="async" />
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
  const PAGES = ['contact', 'carrieres', 'actualites', 'approche', 'expertises-toutes', 'equipe-page'];
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
  const page = route === 'contact' ? <ContactPage /> : route === 'carrieres' ? <CarrieresPage /> : route === 'equipe-page' ? <EquipePage I={Icone} /> : route === 'actualites' ? <ActualitesPage /> : route === 'approche' ? <ApprochePage />
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
                <motion.div className="eyebrow line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                  Be brilliant together
                  <svg className="traits" width="52" height="10" viewBox="0 0 52 10" fill="none" aria-hidden="true">
                    <path d="M3 5h8M19 5h12M39 5h10" stroke="url(#tg)" strokeWidth="5" strokeLinecap="round" />
                    <defs><linearGradient id="tg" x1="0" y1="0" x2="52" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#2b4bff" /><stop offset=".55" stopColor="#7b3fe4" /><stop offset="1" stopColor="#c935a6" /></linearGradient></defs>
                  </svg>
                </motion.div>
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
            <dl className="stats" id="qui">
              {[
                ['users', 100, '', 'collaborateurs', 'sur trois sites'],
                ['layers', 3, '', 'entités', 'Inov Team · Labs · DigiTeam'],
                ['cube', 8, '', 'pôles d’expertise', 'du conseil au run'],
                ['trend', 40, '+', 'recrutements / an', 'et nous continuons']
              ].map(([ico, n, pre, label, sous]) => (
                <div className="stat" key={label}>
                  <span className="stat-i"><Icone n={ico} s={22} /></span>
                  <div>
                    <dt className="stat-n"><Count to={n} prefix={pre} /></dt>
                    <dd><span>{label}</span><small>{sous}</small></dd>
                  </div>
                </div>
              ))}
            </dl>
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
          <div className="ent-in">
            <div>
              <div className="eyebrow">Nos entités</div>
              <h2>3 entités,<br /><span className="g" style={{ backgroundImage: 'linear-gradient(95deg,#d96bff,#ff7ad0)' }}>1 ancrage local.</span></h2>
              <p className="ent-p">Conseil, recherche et delivery tiennent dans les Alpes-Maritimes, de Sophia-Antipolis à Monaco. Vos interlocuteurs sont sur le même territoire que vos équipes.</p>
              <svg className="rule" width="64" height="12" viewBox="0 0 64 12" fill="none" aria-hidden="true">
                <path d="M3 6h10M23 6h15M48 6h13" stroke="url(#rg)" strokeWidth="6" strokeLinecap="round" />
                <defs><linearGradient id="rg" x1="0" y1="0" x2="64" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#8b6bff" /><stop offset="1" stopColor="#ff7ae0" /></linearGradient></defs>
              </svg>
            </div>
            <div className="carte">
              <svg className="carte-fond" viewBox="0 0 760 440" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <linearGradient id="cg" x1="0" y1="440" x2="0" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ff7ae0" /><stop offset="1" stopColor="#8b6bff" />
                  </linearGradient>
                </defs>

                {/* Contour réel des Alpes-Maritimes, projeté depuis les données
                    départementales de l'IGN, simplifié puis mis à l'échelle. */}
                <path className="dep" d="M282.4 14.0 L288.7 15.4 L294.3 18.8 L293.7 21.4 L295.8 27.4 L304.6 33.8 L307.0 37.5 L306.0 44.8 L310.3 45.2 L310.9 50.2 L314.1 48.7 L318.9 52.0 L319.2 65.0 L323.2 72.8 L330.6 74.6 L331.5 77.4 L333.4 78.2 L339.1 75.6 L341.1 76.8 L344.0 73.9 L346.2 74.3 L349.5 75.6 L351.5 79.8 L354.1 79.3 L358.7 81.0 L368.7 89.3 L375.2 85.6 L380.2 90.6 L383.0 88.7 L385.6 95.3 L387.9 95.4 L389.3 99.1 L394.2 104.1 L397.3 104.2 L399.7 100.8 L401.5 101.8 L405.1 109.9 L406.8 110.2 L408.9 113.6 L411.9 113.8 L415.1 117.0 L417.3 114.9 L424.1 115.4 L425.0 113.9 L428.5 116.1 L435.5 114.6 L440.9 128.6 L444.3 128.4 L452.7 124.4 L457.3 127.7 L460.0 127.4 L463.4 130.5 L465.1 122.2 L475.5 124.0 L479.4 120.7 L483.0 120.5 L486.5 117.2 L491.1 115.3 L495.6 118.5 L500.4 113.6 L503.3 115.0 L507.2 114.4 L510.8 112.1 L510.6 110.3 L513.2 112.0 L521.8 111.5 L529.2 112.9 L534.8 100.0 L548.7 100.2 L551.0 101.5 L550.7 102.6 L546.3 111.3 L549.2 114.0 L544.9 121.5 L547.4 127.5 L562.5 144.3 L560.5 148.0 L561.0 154.2 L557.9 157.3 L556.3 163.8 L553.0 164.1 L547.9 169.1 L544.6 168.1 L543.4 169.7 L543.3 174.5 L546.2 183.7 L544.0 186.4 L543.9 189.0 L541.2 189.8 L540.1 195.1 L537.1 195.0 L526.1 204.3 L521.9 202.8 L518.3 203.9 L516.2 207.1 L512.1 207.4 L511.2 209.4 L513.6 212.9 L512.7 216.0 L511.7 218.8 L508.3 221.4 L509.6 229.7 L505.7 232.5 L501.8 232.8 L497.8 236.0 L495.5 236.1 L494.5 237.9 L492.6 236.7 L492.3 239.2 L488.1 242.9 L487.6 253.1 L491.4 257.1 L495.1 275.2 L498.9 282.0 L498.6 283.9 L492.3 285.3 L490.9 288.9 L485.5 291.7 L482.7 296.5 L484.6 298.6 L484.3 300.2 L480.2 299.2 L476.0 295.0 L474.6 295.3 L470.2 299.8 L468.0 299.1 L465.5 300.4 L463.3 304.0 L459.2 307.1 L458.2 309.3 L460.4 311.0 L457.0 314.1 L451.3 314.0 L451.4 312.4 L445.9 314.8 L443.1 312.9 L440.2 313.5 L438.5 316.2 L434.1 317.7 L432.9 321.8 L431.4 322.0 L432.8 328.0 L435.3 329.6 L438.2 329.2 L435.4 331.3 L433.3 329.5 L433.3 333.3 L431.9 335.1 L429.5 333.9 L428.1 327.7 L429.7 326.4 L429.9 323.1 L426.4 320.1 L423.7 324.0 L424.4 326.6 L422.8 330.2 L419.2 329.4 L416.1 324.2 L416.3 326.5 L408.7 325.8 L401.4 328.9 L398.0 333.2 L397.9 339.3 L392.2 345.2 L391.6 347.8 L388.0 348.8 L388.7 345.9 L385.9 342.8 L379.5 343.9 L376.8 343.1 L373.2 344.9 L367.6 353.5 L366.6 352.9 L367.3 354.3 L362.9 367.4 L362.7 372.4 L364.2 374.5 L361.4 376.0 L364.0 377.7 L362.5 382.2 L364.7 384.4 L367.7 384.4 L365.7 390.7 L369.2 392.5 L366.3 395.8 L361.9 395.2 L361.8 396.7 L360.4 396.6 L359.7 394.3 L361.3 392.4 L361.4 388.9 L358.4 385.3 L352.8 383.5 L348.7 384.2 L343.7 387.2 L338.8 394.6 L334.1 397.0 L333.1 400.4 L331.3 395.2 L328.3 393.6 L326.0 394.0 L325.9 392.9 L324.4 394.6 L318.2 393.8 L310.9 395.4 L305.2 399.3 L299.6 409.0 L299.4 412.3 L304.3 413.8 L305.9 416.3 L305.6 418.1 L303.4 419.2 L303.1 423.5 L302.1 424.6 L297.7 424.0 L298.0 426.0 L291.3 424.7 L290.9 419.6 L281.3 415.5 L285.1 408.0 L285.4 404.0 L279.5 403.0 L282.5 392.0 L285.9 389.8 L287.0 386.8 L289.4 386.8 L289.3 382.7 L286.1 378.5 L290.7 370.7 L284.7 364.5 L281.7 366.8 L277.3 366.4 L275.4 368.5 L272.3 364.9 L270.4 367.9 L268.0 363.9 L266.0 363.5 L266.0 361.8 L258.6 356.0 L252.5 356.7 L250.3 354.0 L250.9 351.5 L247.3 344.8 L245.0 341.9 L241.5 341.7 L239.8 338.8 L239.8 332.2 L241.0 328.7 L244.3 326.2 L244.3 321.4 L241.8 318.2 L241.7 312.8 L238.2 310.4 L238.6 307.4 L237.0 303.9 L234.9 305.9 L224.3 305.1 L224.0 301.6 L219.8 297.9 L213.5 296.1 L204.9 300.4 L203.1 292.5 L199.1 291.1 L201.1 288.0 L197.5 283.1 L199.6 278.5 L216.4 274.4 L221.3 272.4 L223.3 269.4 L220.2 265.0 L208.5 262.1 L212.0 252.1 L220.2 250.2 L218.7 248.7 L218.0 241.1 L211.8 239.4 L210.1 237.5 L210.3 235.2 L235.6 242.9 L246.8 237.3 L253.1 226.9 L252.5 225.1 L263.8 221.0 L264.2 222.4 L270.9 222.8 L271.2 226.3 L274.7 226.4 L281.5 234.7 L297.8 232.1 L301.5 229.8 L299.8 226.7 L296.6 225.1 L291.1 216.6 L286.1 217.1 L281.4 213.2 L278.5 208.5 L278.4 204.9 L269.0 204.2 L268.4 193.0 L264.7 190.7 L266.0 187.7 L252.3 180.4 L249.2 171.9 L245.0 171.7 L235.2 163.7 L235.3 152.5 L238.3 145.6 L225.5 127.0 L221.8 124.6 L220.7 119.3 L221.7 115.3 L218.6 113.0 L219.3 109.6 L214.7 103.7 L219.9 99.5 L220.2 96.6 L218.6 94.1 L221.4 88.6 L225.2 85.5 L224.0 80.8 L227.7 77.0 L226.6 73.2 L228.0 69.5 L227.4 66.0 L232.2 64.5 L233.5 61.8 L239.2 60.3 L238.9 54.5 L240.7 52.1 L249.7 55.5 L248.4 47.5 L251.7 43.3 L251.7 35.0 L255.4 32.5 L256.0 28.3 L260.5 27.3 L266.5 20.8 L273.1 21.9 L282.4 14.0 Z" />

                {/* les deux sites du groupe */}
                <g className="mats">
                  <motion.path d="M337 359 V 338 C 337 324, 156 324, 156 312"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease }} />
                  <motion.path d="M337 359 C 337 300, 369 292, 369 233"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.12, ease }} />
                  <motion.path d="M462 308 C 462 240, 597 230, 597 154"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.24, ease }} />
                </g>
                <g className="site">
                  <circle cx="337" cy="359" r="11" /><circle cx="337" cy="359" r="3.6" className="plein" />
                  <circle cx="462" cy="308" r="11" /><circle cx="462" cy="308" r="3.6" className="plein" />
                  <text x="325" y="363" textAnchor="end">Sophia-Antipolis</text>
                  <text x="476" y="312">Monaco</text>
                </g>

                {/* repères de lecture */}
                <g className="lieux">
                  {[[326, 392, 'Cannes', 'end', -7], [362, 379, 'Antibes', 'start', 7],
                    [410, 323, 'Nice', 'start', 7], [490, 288, 'Menton', 'start', 7]].map(([x, y, nom, a, dx]) => (
                    <g key={nom}>
                      <circle cx={x} cy={y} r="2" />
                      <text x={x + dx} y={y + 4} textAnchor={a}>{nom}</text>
                    </g>
                  ))}
                </g>

                {/* Aix-en-Provence, hors cadre à l'ouest */}
                <g className="ouest">
                  <path d="M96 403 H30" /><path d="M38 397 L28 403 L38 409" />
                </g>

                <text className="credit" x="20" y="430">Contour départemental : IGN</text>
              </svg>

              <span className="ville v-aix">Aix-en-Provence</span>

              {ENTITES.map((e, k) => (
                <Reveal key={e.k} k={k} className={'noeud n-' + e.k}>
                  <a href={'#entite-' + e.k}>
                    <img src={`assets/${e.logo}.webp`} alt={(e.t + e.em).trim()} />
                    <span><b>{(e.t + e.em).trim()}</b><span>{e.d}</span></span>
                  </a>
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
              <div><div className="eyebrow">La vie d’Inov Team</div><h2>Ceux qui font <span className="g">Inov Team.</span></h2></div>
              <p style={{ maxWidth: 420 }}>Commerciaux, recruteurs, équipes support et consultants : voici ceux qui font Inov Team au quotidien, dans nos bureaux et sur le terrain.</p>
            </div>
          </div>
          <BandeauPortraits />
          <div className="wrap">
            <a className="btn out-v eq-lien" href="#equipe-page">Découvrir l’équipe <Icone n="arrow" s={18} c="" w={2} /></a>
            <h3 className="vie-t">Curiosity Break, Inov Night,<br />et bien d’autres choses.</h3>
            <div className="vie">
              {[['bulb', 'Curiosity Break', 'Un collaborateur présente un sujet technique qui le passionne, autour de pizzas. Une fois par mois, sans slides obligatoires.'],
                ['team', 'Inov Night', 'Soirées jeux, restaurants, canyoning, ski ou randonnée. Hors des bureaux, et sans obligation de parler boutique.'],
                ['hands', 'Ambassadeurs', 'Des représentants dans les écoles, les universités et chez nos clients, qui animent la vie du groupe toute l’année.'],
                ['rocket', 'Projets internes R&D', 'Un laboratoire d’idées où passer du temps sur les technologies récentes, et porter les vôtres jusqu’au prototype.']
              ].map(([ic, t, d], k) => (
                <Reveal key={t} k={k} className="vie-c">
                  <Icone n={ic} s={30} />
                  <h3>{t}</h3>
                  <p>{d}</p>
                </Reveal>
              ))}
            </div>
          </div>
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
            <div><h4>Le Groupe</h4><ul><li><a href="#qui">Qui sommes-nous ?</a></li><li><a href="#entites">Nos entités</a></li><li><a href="#valeurs">Nos valeurs</a></li><li><a href="#equipe-page">L’équipe</a></li></ul></div>
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
