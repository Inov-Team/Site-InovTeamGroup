// Construit le site en un seul fichier dist/index.html (+ dist/assets)
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';

const r = await build({
  entryPoints: ['src/site.jsx'], bundle: true, minify: true, format: 'iife', jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' }, write: false
});
const js = r.outputFiles[0].text.replace(/<\/script/g, '<\\/script');
const css = readFileSync('src/site.css', 'utf8');
mkdirSync('dist', { recursive: true });
cpSync('assets', 'dist/assets', { recursive: true });
writeFileSync('dist/index.html', `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Inov Team Group</title>
<meta name="description" content="Inov Team Group, ESN agile à taille humaine : ingénierie, R&D et services numériques à Sophia-Antipolis, Aix-en-Provence et Monaco.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
