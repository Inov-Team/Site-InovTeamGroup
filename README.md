# Site Inov Team Group

Site vitrine d'Inov Team Group (Be brilliant together), en React et Framer Motion.

## Contenu

- **Accueil** : visuel de marque, chiffres clés, roue interactive des 8 pôles d'expertise, entités, clients, valeurs, vie d'équipe, carrières.
- **Pages internes** (navigation par ancre `#...`) :
  - `#expertises-toutes` et une page par pôle (`#expertise-cybersecurite`, `#expertise-devops-cloud`…)
  - `#entite-inov-team`, `#entite-inov-team-labs`, `#entite-digiteam`
  - `#approche`, `#carrieres`, `#actualites`, `#contact`

## Structure

```
src/site.jsx    Accueil, en-tête, pied de page, navigation
src/pages.jsx   Pages internes (expertises, entités, approche, carrières, contact…)
src/poles.js    Contenu des 8 pôles d'expertise
src/site.css    Styles (charte Inov Team)
assets/         Logos, photos et visuels
dist/           Site prêt à mettre en ligne (index.html + assets)
```

## Construire le site

```bash
npm install
npm run build      # génère dist/index.html
npm run preview    # build puis aperçu local
```

Le dossier `dist/` est autonome : il suffit de déposer son contenu chez l'hébergeur.

Le build copie aussi `index.html` à la racine du dépôt pour GitHub Pages (Settings › Pages › branche `main`, dossier `/ (root)`).

## À brancher avant la mise en ligne

- Les formulaires de contact et de cooptation ne sont reliés à aucune boîte de réception (ils l'indiquent à l'envoi).
- Les adresses des trois implantations sont à compléter.
- Les liens « Voir nos offres » pointent vers https://inov-team.fr/offres.
