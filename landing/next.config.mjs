/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export statique pour Docker/Nginx
  output: 'export',
  
  // Ajouter un slash à la fin des URLs
  trailingSlash: true,
  
  // Désactiver l'optimisation d'images (pour export statique)
  images: {
    unoptimized: true
  },
  
  // Configuration pour la production
  compress: true,
  
  // Optimisations pour le SEO
  generateEtags: false,
  
  // Configuration des assets
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Optimisations de performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons'],
  },

  // Headers de sécurité (complément de Nginx)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Powered-By',
            value: 'LoanGuard Security'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}

export default nextConfig