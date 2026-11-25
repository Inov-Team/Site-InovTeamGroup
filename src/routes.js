// Métadonnées par vue : titre et description, pour l'onglet, les moteurs et les partages.
import { POLES } from './poles.js';

export const SITE = {
  nom: 'Inov Team Group',
  baseline: 'Be brilliant together',
  mail: 'contact@inov-team.fr',
  linkedin: 'https://www.linkedin.com/company/inov-team',
  url: 'https://alexandretorre2511.github.io/Site-InovTeamGroup/',
  villes: ['Sophia-Antipolis', 'Aix-en-Provence', 'Monaco']
};

const sl = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const ACCUEIL = {
  t: 'Inov Team Group',
  d: 'ESN agile à taille humaine : ingénierie logicielle, DevOps & Cloud, cybersécurité, data et accessibilité numérique. 90 collaborateurs, 3 entités, 9 pôles d’expertise.'
};

const FIXES = {
  'expertises-toutes': { t: 'Nos 9 pôles d’expertise', d: 'Ingénierie logicielle, DevOps & Cloud, cybersécurité, data, tests, accessibilité numérique, consulting et delivery : les 9 pôles d’Inov Team Group.' },
  approche: { t: 'Notre approche : une ESN à taille humaine', d: 'Recrutement sélectif, manager technique dédié, communautés d’experts et rituels d’équipe : la façon de travailler d’Inov Team Group.' },
  carrieres: { t: 'Carrières, rejoindre Inov Team Group', d: 'Plus de 40 recrutements par an en ingénierie, cloud, cybersécurité et data. Processus en 4 étapes et programme de cooptation.' },
  'equipe-page': { t: 'Ceux qui font Inov Team', d: 'Direction, management, ambassadeurs, expertise et delivery : les cent personnes qui font vivre Inov Team Group sur ses trois sites.' },
  actualites: { t: 'Actualités du groupe', d: 'Recrutements, événements et nouveaux projets : la vie d’Inov Team Group au quotidien.' },
  contact: { t: 'Contact, parlons de vos projets', d: 'Un besoin de renfort, un projet au forfait ou une candidature : écrivez-nous, une personne de l’équipe vous répond.' }
};

const ENT = {
  'inov-team': { t: 'Inov Team, conseil et ingénierie IT', d: 'Filiale IT & Digital du groupe : conception, développement et exploitation de solutions numériques pour les grands comptes du territoire.' },
  'inov-team-labs': { t: 'Inov Team Labs, R&D et innovation', d: 'Laboratoire d’innovation et de R&D du groupe, accrédité Crédit d’Impôt Recherche et labellisé Jeune Entreprise Innovante.' },
  digiteam: { t: 'DigiTeam, delivery et services à Monaco', d: 'Filiale dédiée au marché monégasque : conseil, développement applicatif, infrastructures et pilotage de projets stratégiques.' }
};

// Renvoie { t, d } pour une route de l'application.
export function meta(route) {
  if (!route || route === 'home') return ACCUEIL;
  if (FIXES[route]) return FIXES[route];
  if (route.startsWith('expertise-')) {
    const p = POLES.find((x) => sl(x.t) === route.slice(10));
    if (p) return { t: p.t + ' | ' + SITE.nom, d: p.s + ' Consultants confirmés et manager technique dédié.' };
  }
  if (route.startsWith('entite-') && ENT[route.slice(7)]) return ENT[route.slice(7)];
  return ACCUEIL;
}
