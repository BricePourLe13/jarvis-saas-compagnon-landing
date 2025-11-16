import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ChakraProviders } from '@/components/ChakraProviders'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { SentryProvider } from '@/components/providers/SentryProvider'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// ========================================
// 🎯 METADATA SEO OPTIMISÉS
// ========================================
export const metadata: Metadata = {
  // Titre optimisé (55-60 caractères recommandés)
  title: 'JARVIS - IA Conversationnelle pour Salles de Sport | Réduire le Churn de 30%',
  
  // Description optimisée (150-160 caractères recommandés)
  description: 'JARVIS est une IA vocale révolutionnaire qui réduit le churn de 30%, automatise 70% des tâches et génère des insights actionnables pour salles de sport. Testez gratuitement notre programme pilote.',
  
  // Mots-clés (optionnel mais utile)
  keywords: [
    'IA salle de sport',
    'intelligence artificielle fitness',
    'réduire churn fitness',
    'automatisation salle de sport',
    'assistant vocal gym',
    'analytics IA fitness',
    'gestion salle de sport',
    'logiciel fitness',
    'chatbot gym',
    'JARVIS'
  ],
  
  // Auteur
  authors: [{ name: 'JARVIS Group', url: 'https://jarvis-group.net' }],
  
  // Creator
  creator: 'Brice PRADET',
  
  // Publisher
  publisher: 'JARVIS Group',
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://jarvis-group.net',
    siteName: 'JARVIS',
    title: 'JARVIS - IA Conversationnelle pour Salles de Sport',
    description: 'Réduisez le churn de 30% avec JARVIS, l\'IA vocale révolutionnaire pour salles de sport. Automatisation, insights IA, ROI mesurable.',
    images: [
      {
        url: 'https://jarvis-group.net/og-image.png', // À créer
        width: 1200,
        height: 630,
        alt: 'JARVIS - IA pour Salles de Sport',
      },
    ],
  },
  
  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    site: '@jarvisgroup', // Si tu as un compte Twitter
    creator: '@bricepradet', // Si tu as un compte Twitter
    title: 'JARVIS - IA Conversationnelle pour Salles de Sport',
    description: 'Réduisez le churn de 30% avec JARVIS, l\'IA vocale révolutionnaire pour salles de sport.',
    images: ['https://jarvis-group.net/twitter-image.png'], // À créer
  },
  
  // Verification (à ajouter après création Google Search Console)
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // À remplacer
    // yandex: 'YOUR_YANDEX_CODE',
    // bing: 'YOUR_BING_CODE',
  },
  
  // Autres metadata
  category: 'Technology',
  alternates: {
    canonical: 'https://jarvis-group.net',
  },
  
  // Manifest PWA
  manifest: '/manifest.json',
  
  // Icônes
  icons: {
    icon: [
      { url: '/Gemini_Generated_Image_bhy0snbhy0snbhy0.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* ✅ PHASE 4: Meta tags permissions microphone */}
        <meta httpEquiv="Permissions-Policy" content="microphone=(self), camera=(), geolocation=()" />
        <meta httpEquiv="Feature-Policy" content="microphone 'self'; camera 'none'; geolocation 'none'" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppression des avertissements d'hydratation pour les extensions
              if (typeof window !== 'undefined') {
                const originalConsoleError = console.error;
                console.error = function(...args) {
                  const message = args[0];
                  if (typeof message === 'string' && (
                    message.includes('bis_skin_checked') ||
                    message.includes('__processed_') ||
                    message.includes('bis_register') ||
                    message.includes('A tree hydrated but some attributes')
                  )) {
                    return; // Ignore ces erreurs spécifiques
                  }
                  originalConsoleError.apply(console, args);
                };
              }
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Google Analytics (chargé après interaction pour perfs) */}
        <GoogleAnalytics />
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ChakraProviders>
            <SentryProvider>
              <SupabaseProvider>
                {children}
              </SupabaseProvider>
            </SentryProvider>
          </ChakraProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
// Force redeploy rollback Thu, Jul 31, 2025 11:53:12 AM
