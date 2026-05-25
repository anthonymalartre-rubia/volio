// Next.js metadata route : génère automatiquement /manifest.webmanifest
// pour les PWA. Améliore Best Practices Lighthouse + permet "Add to Home Screen".

export default function manifest() {
  return {
    name: 'Volia — Prospection B2B France',
    short_name: 'Volia',
    description: 'Trouvez les emails B2B de toutes les entreprises françaises. 150+ catégories, 101 départements, à partir de 19 €/mois.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08080c',
    theme_color: '#7c3aed',
    orientation: 'portrait-primary',
    lang: 'fr-FR',
    categories: ['business', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
