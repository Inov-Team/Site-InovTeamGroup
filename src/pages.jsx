import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POLES } from './poles.js';
import { OFFRES, LIEN_OFFRES } from './offres.js';

export const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ease = [0.2, 0.7, 0.2, 1];
const up = (k = 0) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: k * 0.06, ease } });

export const ENTITES = [
  { k: 'inov-team', logo: 'logo-inovteam', t: 'Inov Team', em: '', d: 'Conseil & ingénierie IT',
    intro: 'Filiale IT & Digital du groupe, Inov Team accompagne les entreprises dans la conception, le développement et l’exploitation de leurs solutions numériques.',
    pts: [['Chez nos clients ou sur nos plateaux', 'Nos équipes interviennent sur site ou depuis des plateaux externalisés, en build comme en run.'], ['Applications critiques', 'Nous prenons en charge des applications à fort enjeu pour les grands comptes du territoire.'], ['Agilité, proximité, innovation', 'Un fonctionnement à taille humaine et des interlocuteurs qui connaissent vos enjeux.']] },
  { k: 'inov-team-labs', logo: 'logo-labs', t: 'Inov Team', em: ' Labs', d: 'R&D & Innovation',
    intro: 'Laboratoire d’innovation et de R&D du groupe, Inov Team Labs développe et expérimente des solutions pour nos clients et pour nos projets internes.',
    pts: [['Des idées aux applications', 'Notre mission : transformer les idées en applications concrètes.'], ['Crédit d’Impôt Recherche', 'Inov Team Labs est accrédité au CIR.'], ['Jeune Entreprise Innovante', 'Le groupe est labellisé JEI pour ses activités de recherche.']] },
  { k: 'digiteam', logo: 'logo-digiteam', t: 'DigiTeam', em: '', d: 'Delivery & Services',
    intro: 'Filiale dédiée au marché monégasque, DigiTeam est ancrée à Monaco et propose des solutions sur mesure.',
    pts: [['Conseil et expertise', 'Un accompagnement de proximité pour les acteurs de la Principauté.'], ['Développement et infrastructures', 'Développement applicatif et gestion d’infrastructures.'], ['Projets stratégiques', 'Pilotage de projets à fort enjeu, de bout en bout.']] }
];

const MODES = [['Assistance technique', 'Un consultant intégré à vos équipes, suivi par un manager technique.'], ['Forfait', 'Un projet livré depuis nos plateaux Inov Team Labs, avec engagement de résultat.'], ['Squad dédiée', 'Une équipe constituée autour d’un lead, du cadrage à la mise en production.']];

const Hero = ({ crumb, title, em, lead, children, logo }) => (
  <section className="phero">
    <div className="wrap">
      <motion.nav className="crumb" aria-label="Fil d’Ariane" {...up(0)}><a href="#top">Accueil</a><span>/</span>{crumb}</motion.nav>
      {logo && <motion.img className="plogo" src={`assets/${logo}.webp`} alt="" {...up(1)} />}
      <motion.h1 {...up(1)}>{title}{em && <> <span className="g">{em}</span></>}</motion.h1>
      {lead && <motion.p className="plead" {...up(2)}>{lead}</motion.p>}
      {children && <motion.div className="pacts" {...up(3)}>{children}</motion.div>}
    </div>
  </section>
);

export function ExpertisePage({ k, I, icons }) {
  const i = POLES.findIndex((p) => slug(p.t) === k);
  const p = POLES[i];
  const others = POLES.filter((_, j) => j !== i);
  return (
    <>
      <Hero crumb={<><a href="#expertises-toutes">Nos expertises</a><span>/</span>{p.t}</>} title={p.t} lead={p.s}>
        <a className="btn" href="#contact">Parler de votre projet</a>
        <a className="btn out" href="#carrieres">Rejoindre ce pôle</a>
      </Hero>
      <section className="psec"><div className="wrap pgrid">
        <div><h2>Ce que nous prenons en charge</h2></div>
        <ul className="plist">{p.a.map((x, j) => <motion.li key={x} {...up(j)}><I n="check" s={22} />{x}</motion.li>)}</ul>
      </div></section>
      {p.p.length > 0 && <section className="psec soft"><div className="wrap pgrid">
        <div><h2>Profils mobilisés</h2><p>Des consultants confirmés, recrutés avec exigence et accompagnés par un manager technique dédié.</p></div>
        <div className="chips">{p.p.map((x) => <span key={x}>{x}</span>)}</div>
      </div></section>}
      <section className="psec"><div className="wrap">
        <h2>Comment nous intervenons</h2>
        <div className="tri">{MODES.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>
      </div></section>
      <section className="psec soft"><div className="wrap">
        <h2>Nos autres expertises</h2>
        <div className="olist">{others.map((o) => <a key={o.t} href={'#expertise-' + slug(o.t)}><I n={icons[o.t]} s={26} />{o.t}<I n="arrow" s={18} c="arr" w={2} /></a>)}</div>
      </div></section>
    </>
  );
}

export function AllExpertises({ I, icons }) {
  return (
    <>
      <Hero crumb="Nos expertises" title="Nos 9 pôles" em="d’expertise." lead="Choisissez un pôle pour découvrir ce que nous prenons en charge, les profils que nous mobilisons et nos modes d’intervention." />
      <section className="psec"><div className="wrap">
        <div className="cards">{POLES.map((p, k) => (
          <motion.a key={p.t} className="card" href={'#expertise-' + slug(p.t)} {...up(k)}>
            <I n={icons[p.t]} s={42} /><div><h3>{p.t}</h3><p>{p.s}</p></div>
          </motion.a>
        ))}</div>
      </div></section>
    </>
  );
}

export function EntitePage({ k }) {
  const e = ENTITES.find((x) => x.k === k);
  const others = ENTITES.filter((x) => x.k !== k);
  return (
    <>
      <Hero crumb={<><a href="#entites">Nos entités</a><span>/</span>{e.t + e.em}</>} title={e.t} em={e.em.trim() || null} lead={e.intro} logo={e.logo}>
        <a className="btn" href="#contact">Contacter {e.t + e.em}</a>
      </Hero>
      <section className="psec"><div className="wrap">
        <div className="tri">{e.pts.map(([t, d], j) => <motion.div key={t} {...up(j)}><h3>{t}</h3><p>{d}</p></motion.div>)}</div>
      </div></section>
      <section className="psec soft"><div className="wrap">
        <h2>Les autres entités du groupe</h2>
        <div className="olist">{others.map((o) => <a key={o.k} className="elogo" href={'#entite-' + o.k}><img src={`assets/${o.logo}.webp`} alt={o.t + o.em} /><small>{o.d}</small></a>)}</div>
      </div></section>
    </>
  );
}

export function ApprochePage() {
  const R = [
    ['Curiosity Break', 'Un collaborateur présente un sujet technique qui le passionne à une audience curieuse, dans une ambiance détendue, autour de pizzas.'],
    ['Inov Night', 'Sorties hors du bureau : soirées jeux, restaurants et activités sportives comme le canyoning, le ski ou la randonnée.'],
    ['Ambassadeurs', 'Des représentants d’Inov Team dans les écoles, les universités et auprès des clients, qui animent la vie du groupe toute l’année.'],
    ['Mentorat des managers', 'Nos managers sont des experts techniques qui pratiquent eux-mêmes les technologies qu’ils encadrent.'],
    ['Projets internes R&D', 'Un véritable laboratoire d’idées pour monter en compétence sur les technologies récentes.']
  ];
  return (
    <>
      <Hero crumb="Notre approche" title="Une ESN à taille humaine," em="exigeante et proche." lead="Expertise senior, management de proximité et partenariats directs avec les grands comptes du territoire : notre façon de travailler tient en quelques engagements simples." />
      <section className="psec"><div className="wrap">
        <div className="tri">
          <div><h3>Un recrutement sélectif</h3><p>Des consultants confirmés, souvent cooptés, choisis pour leur expertise et leur état d’esprit.</p></div>
          <div><h3>Un manager technique dédié</h3><p>Chaque consultant est suivi tout au long de sa mission par un manager qui connaît son métier.</p></div>
          <div><h3>Des communautés d’experts</h3><p>Veille, partage et montée en compétence entre consultants d’un même métier.</p></div>
        </div>
      </div></section>
      <section className="psec soft"><div className="wrap">
        <h2>Nos rituels</h2>
        <div className="rits">{R.map(([t, d], j) => <motion.div key={t} {...up(j)}><h3>{t}</h3><p>{d}</p></motion.div>)}</div>
      </div></section>
    </>
  );
}

export function ActualitesPage() {
  return (
    <>
      <Hero crumb="Actualités" title="Nos" em="actualités." lead="Recrutements, événements, nouveaux projets : nous partageons la vie d’Inov Team au quotidien sur LinkedIn.">
        <a className="btn" href="https://www.linkedin.com/company/inov-team">Suivre Inov Team sur LinkedIn</a>
      </Hero>
      <section className="psec"><div className="wrap">
        <div className="empty"><h3>Les articles arrivent bientôt ici.</h3><p>En attendant, retrouvez nos dernières nouvelles sur notre page LinkedIn.</p></div>
      </div></section>
    </>
  );
}

const Field = ({ id, label, err, children }) => (
  <label className="fld2" data-err={!!err}>{label}{children}{err && <span className="err2">{err}</span>}</label>
);

function useForm(init, check) {
  const [v, setV] = useState(init); const [e, setE] = useState({}); const [ok, setOk] = useState(false);
  const set = (k) => (ev) => setV({ ...v, [k]: ev.target.value });
  const submit = (ev) => { ev.preventDefault(); const x = check(v); setE(x); setOk(!Object.keys(x).length); };
  return { v, e, ok, set, submit };
}

export function ContactPage() {
  const f = useForm({ nom: '', soc: '', mail: '', sujet: 'Un projet', msg: '' }, (v) => {
    const x = {};
    if (!v.nom.trim()) x.nom = 'Indiquez votre nom.';
    if (!/^\S+@\S+\.\S+$/.test(v.mail)) x.mail = 'Indiquez une adresse e-mail valide.';
    if (v.msg.trim().length < 10) x.msg = 'Décrivez votre besoin en quelques mots.';
    return x;
  });
  return (
    <>
      <Hero crumb="Contact" title="Échangeons sur" em="vos projets." lead="Un besoin de renfort, un projet au forfait ou une candidature : une personne de l’équipe vous répond." />
      <section className="psec"><div className="wrap cgrid">
        <div className="sites2">
          <div><b>Sophia-Antipolis</b><span>Siège</span></div>
          <div><b>Aix-en-Provence</b><span>Agence</span></div>
          <div><b>Monaco</b><span>DigiTeam</span></div>
          <div><b>E-mail</b><span>contact@inov-team.fr</span></div>
        </div>
        <form className="form2" noValidate onSubmit={f.submit}>
          <Field label="Nom" err={f.e.nom}><input value={f.v.nom} onChange={f.set('nom')} autoComplete="name" /></Field>
          <Field label="Société"><input value={f.v.soc} onChange={f.set('soc')} autoComplete="organization" /></Field>
          <Field label="E-mail" err={f.e.mail}><input type="email" value={f.v.mail} onChange={f.set('mail')} autoComplete="email" /></Field>
          <Field label="Objet"><select value={f.v.sujet} onChange={f.set('sujet')}><option>Un projet</option><option>Une candidature</option><option>Un partenariat</option><option>Autre</option></select></Field>
          <Field label="Votre message" err={f.e.msg}><textarea rows="5" value={f.v.msg} onChange={f.set('msg')} /></Field>
          <AnimatePresence mode="wait">{f.ok
            ? <motion.div key="ok" className="sent2" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><b>Message prêt.</b> Ce formulaire n’est pas encore relié à une boîte de réception : il n’a pas été transmis. Écrivez-nous à contact@inov-team.fr.</motion.div>
            : <motion.button key="b" className="btn" type="submit" exit={{ opacity: 0 }}>Envoyer le message</motion.button>}</AnimatePresence>
        </form>
      </div></section>
    </>
  );
}

export function CarrieresPage() {
  const f = useForm({ moi: '', nom: '', metier: '' }, (v) => {
    const x = {};
    if (!v.moi.trim()) x.moi = 'Indiquez votre nom.';
    if (!v.nom.trim()) x.nom = 'Indiquez le nom de la personne recommandée.';
    if (!v.metier) x.metier = 'Choisissez un métier.';
    return x;
  });
  return (
    <>
      <Hero crumb="Carrières" title="Rejoignez une équipe" em="engagée." lead="Développez votre expertise dans un environnement stimulant, bienveillant et en constante évolution.">
        <a className="btn" href="#nos-offres">Voir nos offres</a>
        <a className="btn out" href="#approche">Découvrir notre culture</a>
      </Hero>
      <section className="psec" id="nos-offres"><div className="wrap">
        <div className="off-hd">
          <div><h2>Nos offres</h2><p style={{ marginTop: 10 }}>Sophia-Antipolis, Aix-en-Provence et Monaco.</p></div>
          <span className="off-n">{OFFRES.length} postes ouverts</span>
        </div>
        <div className="offres">
          {OFFRES.map(([t, pole, lieu, c], j) => (
            <motion.a key={t} href={LIEN_OFFRES} {...up(j)}>
              <span><b>{t}</b><s>{pole}</s></span>
              <span className="off-m"><em>{lieu}</em><em>{c}</em></span>
              <svg className="off-a" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            </motion.a>
          ))}
        </div>
      </div></section>
      <section className="psec soft"><div className="wrap">
        <h2>Notre processus de recrutement</h2>
        <ol className="steps2">
          {[['Premier échange', 'Un appel pour faire connaissance et comprendre votre projet.'], ['Entretien RH', 'Votre parcours, vos envies, vos attentes.'], ['Entretien technique', 'Avec un manager expert de votre métier.'], ['Proposition et intégration', 'Un accompagnement jusqu’à votre arrivée en mission.']].map(([t, d], j) => <motion.li key={t} {...up(j)}><span>{j + 1}</span><div><h3>{t}</h3><p>{d}</p></div></motion.li>)}
        </ol>
      </div></section>
      <section className="psec soft"><div className="wrap cgrid">
        <div><h2>Cooptation</h2><p style={{ marginTop: 12 }}>Vous connaissez un profil qui aurait sa place chez nous ? Présentez-le nous.</p></div>
        <form className="form2" noValidate onSubmit={f.submit}>
          <Field label="Votre nom" err={f.e.moi}><input value={f.v.moi} onChange={f.set('moi')} /></Field>
          <Field label="Nom de la personne" err={f.e.nom}><input value={f.v.nom} onChange={f.set('nom')} /></Field>
          <Field label="Son métier" err={f.e.metier}><select value={f.v.metier} onChange={f.set('metier')}><option value="">Choisir un pôle</option>{POLES.map((p) => <option key={p.t}>{p.t}</option>)}</select></Field>
          <AnimatePresence mode="wait">{f.ok
            ? <motion.div key="ok" className="sent2" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><b>Recommandation prête.</b> Ce formulaire n’est pas encore relié à l’équipe recrutement : elle n’a pas été transmise.</motion.div>
            : <motion.button key="b" className="btn" type="submit" exit={{ opacity: 0 }}>Recommander</motion.button>}</AnimatePresence>
        </form>
      </div></section>
    </>
  );
}

// ============================================================
// Ceux qui font Inov Team
// ============================================================

// Les tuiles du bandeau : photos réelles et emplacements de portraits à fournir.
const BANDE_A = [
  { f: 'photo-soiree-groupe', pos: '50% 45%', alt: 'La soirée annuelle du groupe, toutes entités réunies' },
  { f: 'photo-forum-monaco', pos: '50% 35%', alt: 'Le stand Inov Team au forum Monaco pour l’Emploi' },
  { f: 'photo-petanque', pos: '50% 40%', alt: 'Le tournoi de pétanque du groupe' },
  { f: 'photo-stand-digiteam-2', pos: '50% 45%', alt: 'Le stand DigiTeam au forum du recrutement' },
  { f: 'photo-dejeuner-equipe', pos: '50% 50%', alt: 'Un déjeuner d’équipe en terrasse' },
  { f: 'photo-mur-inovteam', pos: '50% 40%', alt: 'Trois collaborateurs devant le mur lumineux Inov Team' },
  { f: 'photo-basket-trophee', pos: '50% 40%', alt: 'L’équipe de basket et son trophée' }
];
const BANDE_B = [
  { f: 'photo-hache-groupe', pos: '50% 35%', alt: '' },
  { f: 'photo-salon-emploi', pos: '50% 55%', alt: '' },
  { f: 'photo-afterwork-terrasse', pos: '50% 45%', alt: '' },
  { f: 'photo-stand-ecole', pos: '50% 45%', alt: '' },
  { f: 'photo-basket-match', pos: '50% 40%', alt: '' },
  { f: 'photo-salon-isen', pos: '50% 50%', alt: '' },
  { f: 'photo-stand-digiteam-1', pos: '50% 35%', alt: '' },
  { f: 'photo-hache-solo', pos: '50% 40%', alt: '' }
];

// La mosaïque : chaque fiche porte sa largeur et sa hauteur en colonnes de grille.
const MOSAIQUE = [
  { c: 4, r: 3, img: 'photo-soiree-groupe', pos: '50% 45%', cat: 'Toute l’équipe', nom: 'Le groupe au complet', role: 'La soirée annuelle, les trois entités réunies' },
  { c: 3, r: 2, cat: 'Direction', role: 'Président, vision et développement du groupe' },
  { c: 5, r: 2, img: 'photo-petanque', pos: '50% 40%', cat: 'Esprit d’équipe', nom: 'Le tournoi de pétanque', role: 'Un après-midi hors du bureau, t-shirts obligatoires' },
  { c: 3, r: 2, img: 'photo-forum-monaco', pos: '50% 30%', cat: 'Ambassadeurs', nom: 'Monaco pour l’Emploi', role: 'Le forum du recrutement en Principauté' },
  { c: 2, r: 2, cat: 'Management', role: 'Business Manager, aéronautique' },
  { c: 3, r: 2, img: 'photo-basket-trophee', pos: '50% 40%', nom: 'Le tournoi de basket', role: 'Troisième place, et le trophée en vitrine' },
  { c: 4, r: 2, img: 'photo-stand-digiteam-2', pos: '50% 45%', cat: 'DigiTeam', nom: 'Le stand DigiTeam', role: 'Notre filiale monégasque au forum du recrutement' },
  { c: 3, r: 2, img: 'photo-hache-groupe', pos: '50% 35%', nom: 'Inov Night', role: 'Lancer de hache, et personne n’a été blessé' },
  { c: 2, r: 2, img: 'photo-salon-isen', pos: '50% 50%', cat: 'Écoles', nom: 'Salon ISEN', role: 'À la rencontre des futurs ingénieurs' },
  { c: 3, r: 2, img: 'photo-dejeuner-equipe', pos: '50% 50%', nom: 'Le déjeuner d’équipe', role: 'Entre deux missions, en terrasse' }
];

const EQUIPES = ['Tout le monde', 'Direction', 'Management', 'Ambassadeurs', 'Expertise & delivery'];

const Tuile = ({ t, h }) => (
  t
    ? <img src={`assets/${t.f}.webp`} alt={t.alt} style={{ objectPosition: t.pos }} width="300" height={h} />
    : <span className="tuile-vide">Portrait à venir</span>
);

// L'éclat du logo, repris comme fond des fiches sans portrait.
const Eclat = () => (
  <svg width="46" height="46" viewBox="0 0 40 40" aria-hidden="true">
    <defs><linearGradient id="eq-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#2b4bff" /><stop offset="1" stopColor="#c935a6" /></linearGradient></defs>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, k) => (
      <line key={a} x1="20" y1={k % 2 ? 6 : 4} x2="20" y2={k % 2 ? 10 : 11} stroke="url(#eq-g)" strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} 20 20)`} opacity={k % 3 ? 1 : 0.55} />
    ))}
  </svg>
);

// Les deux bandeaux, repris tels quels sur l'accueil.
export const BandeauPortraits = () => (
  <section className="defile-sec" aria-label="Les visages du groupe">
    <div className="defile">
      <div className="piste piste-g">
        {[0, 1].map((n) => (
          <div className="jeu" key={n} aria-hidden={n === 1 ? 'true' : undefined}>
            {BANDE_A.map((t, i) => <span className="tuile grande" key={i}><Tuile t={t} h={196} /></span>)}
          </div>
        ))}
      </div>
    </div>
    <div className="defile">
      <div className="piste piste-d">
        {[0, 1].map((n) => (
          <div className="jeu" key={n} aria-hidden={n === 1 ? 'true' : undefined}>
            {BANDE_B.map((t, i) => <span className="tuile petite" key={i}><Tuile t={t} h={148} /></span>)}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export function EquipePage({ I }) {
  const [filtre, setFiltre] = useState(0);
  return (
    <>
      <Hero crumb="L’équipe" title="Ceux qui font" em="Inov Team."
        lead="Cent personnes réparties sur trois sites. Des managers qui pratiquent encore leur métier, des recruteurs qui le connaissent, et des consultants qui restent." />

      <BandeauPortraits />

      <section className="psec eq-sec">
        <div className="wrap">
          <div className="eq-barre">
            <div className="eq-filtres" role="group" aria-label="Filtrer par équipe">
              {EQUIPES.map((e, i) => (
                <button type="button" key={e} className={'eq-f' + (filtre === i ? ' on' : '')}
                  aria-pressed={filtre === i} onClick={() => setFiltre(i)}>
                  {e}{i === 0 && <span className="eq-n">100</span>}
                </button>
              ))}
            </div>
            <p className="eq-aide">Survolez une fiche pour lire son métier</p>
          </div>

          <div className="mosa">
            {MOSAIQUE.map((m, i) => (
              <article className={'fiche' + (m.sombre ? ' sombre' : '')} key={i}
                style={{ gridColumn: `span ${m.c}`, gridRow: `span ${m.r}` }} tabIndex={0}>
                {m.img
                  ? <img src={`assets/${m.img}.webp`} alt={m.nom} style={{ objectPosition: m.pos }} width="600" height={m.r * 150} loading="lazy" />
                  : <span className="fond"><Eclat /></span>}
                {m.cat && <span className="fiche-cat">{m.cat}</span>}
                <span className="voile">
                  <b>{m.nom || 'Portrait à venir'}</b>
                  <span>{m.role}</span>
                </span>
              </article>
            ))}
          </div>
          <p className="eq-note">Dix fiches sur cent. La grille s’étend sans changer de rythme dès que les portraits et les noms sont fournis.</p>
        </div>
      </section>

      <section className="eq-vie">
        <div className="wrap">
          <div className="head">
            <h2>Ce qui se passe entre deux missions.</h2>
            <p>Quatre rendez-vous qui reviennent dans l’année, et qui font que les consultants se connaissent vraiment.</p>
          </div>
          <div className="eq-photos">
            <figure><img src="assets/photo-afterwork-terrasse.webp" alt="Un afterwork en terrasse au coucher du soleil" width="600" height="260" loading="lazy" style={{ objectPosition: '50% 45%' }} /></figure>
            <figure><img src="assets/photo-salon-emploi.webp" alt="Inov Team sur un salon de l’emploi" width="480" height="260" loading="lazy" style={{ objectPosition: '50% 55%' }} /></figure>
            <figure><img src="assets/photo-basket-match.webp" alt="Un match du tournoi de basket" width="360" height="260" loading="lazy" style={{ objectPosition: '50% 40%' }} /></figure>
          </div>
          <div className="eq-rituels">
            {[['Curiosity Break', 'Un collaborateur présente un sujet technique qui le passionne, autour de pizzas.'],
              ['Inov Night', 'Soirées jeux, restaurants, canyoning, ski ou randonnée. Hors des bureaux.'],
              ['Ambassadeurs', 'Des représentants dans les écoles, les universités et chez les clients.'],
              ['Projets internes R&D', 'Un laboratoire d’idées pour monter en compétence sur les technologies récentes.']
            ].map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="psec">
        <div className="wrap eq-rejoindre">
          <div>
            <h2>Rejoindre l’aventure.</h2>
            <p>Plus de quarante recrutements par an. La plupart de nos consultants sont arrivés par cooptation : si quelqu’un vous vient en tête, présentez-le nous.</p>
          </div>
          <div className="pacts">
            <a className="btn" href="#carrieres">Voir nos offres <I n="arrow" s={18} c="" w={2} /></a>
            <a className="btn out" href="#carrieres">Coopter un profil</a>
          </div>
        </div>
      </section>
    </>
  );
}
