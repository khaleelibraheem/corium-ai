export default function manifest() {
  return {
    name: 'Corium.ai - Clinical Intelligence for Your Skin',
    short_name: 'Corium',
    description: 'Generate hyper-personalized skincare protocols based on biometric analysis and dermatological conflict logic.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFCF8',
    theme_color: '#d4a373',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['health', 'lifestyle', 'medical'],
  }
}