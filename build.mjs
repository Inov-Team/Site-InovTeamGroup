// Construit le site en un seul fichier dist/index.html (+ dist/assets)
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { ACCUEIL, SITE } from './src/routes.js';

const r = await build({
  entryPoints: ['src/site.jsx'], bundle: true, minify: true, format: 'iife', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' }, write: false
});
const js = r.outputFiles[0].text.replace(/<\/script/g, '<\\/script');
const css = readFileSync('src/fonts.css', 'utf8') + readFileSync('src/site.css', 'utf8');

// Fiche d'identité pour les moteurs et les assistants de recherche.
const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.nom,
  alternateName: 'Inov Team',
  url: SITE.url,
  logo: SITE.url + 'assets/logo-group.webp',
  image: SITE.url + 'assets/og.png',
  email: SITE.mail,
  slogan: SITE.baseline,
  description: ACCUEIL.d,
  foundingDate: '2018',
  sameAs: [SITE.linkedin],
  address: [
    { '@type': 'PostalAddress', addressLocality: 'Sophia-Antipolis', addressRegion: 'Alpes-Maritimes', addressCountry: 'FR' },
    { '@type': 'PostalAddress', addressLocality: 'Aix-en-Provence', addressRegion: 'Bouches-du-Rhône', addressCountry: 'FR' },
    { '@type': 'PostalAddress', addressLocality: 'Monaco', addressCountry: 'MC' }
  ],
  subOrganization: [
    { '@type': 'Organization', name: 'Inov Team', description: 'Conseil & ingénierie IT' },
    { '@type': 'Organization', name: 'Inov Team Labs', description: 'R&D & Innovation' },
    { '@type': 'Organization', name: 'DigiTeam', description: 'Delivery & Services' }
  ],
  knowsAbout: ['Ingénierie logicielle', 'DevOps & Cloud', 'Cybersécurité', 'Data & Analytics', 'Tests & Validation', 'Accessibilité numérique', 'Consulting & Innovation', 'Delivery & Opérations']
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

mkdirSync('dist', { recursive: true });
cpSync('assets', 'dist/assets', { recursive: true });
writeFileSync('dist/index.html', `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(ACCUEIL.t)}</title>
<meta name="description" content="${esc(ACCUEIL.d)}">
<link rel="canonical" href="${SITE.url}">
<meta name="theme-color" content="#7b3fe4">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.nom)}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${esc(ACCUEIL.t)}">
<meta property="og:description" content="${esc(ACCUEIL.d)}">
<meta property="og:url" content="${SITE.url}">
<meta property="og:image" content="${SITE.url}assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(SITE.nom + ' — ' + SITE.baseline)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/hand-cut.webp" as="image" fetchpriority="high">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<style>
${css}
</style>
</head>
<body>
<div id="root"></div>
<script>
${js}
</script>
</body>
</html>`);
// Copie à la racine pour GitHub Pages (branche main, dossier racine)
writeFileSync('index.html', readFileSync('dist/index.html'));
console.log('dist/index.html et index.html générés');
