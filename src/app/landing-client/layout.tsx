import { Metadata } from 'next'

// ========================================
// 🎯 SCHEMA MARKUP ENRICHI (SEO)
// ========================================

// Organization Schema (Entreprise)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JARVIS Group',
  url: 'https://jarvis-group.net',
  logo: 'https://jarvis-group.net/logo.png',
  description: 'Créateur de JARVIS, l\'IA conversationnelle révolutionnaire pour salles de sport.',
  foundingDate: '2024-10',
  founder: {
    '@type': 'Person',
    name: 'Brice PRADET',
    jobTitle: 'Ingénieur IA',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+33-X-XX-XX-XX-XX', // À compléter
    contactType: 'Customer Service',
    email: 'contact@jarvis-group.net',
    areaServed: 'FR',
    availableLanguage: ['French'],
  },
  sameAs: [
    // 'https://www.linkedin.com/company/jarvis-group', // Si tu as
    // 'https://twitter.com/jarvisgroup', // Si tu as
  ],
}

// SoftwareApplication Schema (Produit)
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JARVIS',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  softwareVersion: '1.0',
  description: 'IA conversationnelle pour salles de sport. Réduit le churn de 30%, automatise 70% des tâches, génère des insights actionnables.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    description: 'Programme pilote gratuit - 5 places exclusives',
    validFrom: '2024-11-01',
    priceValidUntil: '2025-12-31',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '12',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'IA vocale conversationnelle (speech-to-speech)',
    'Détection churn avancée (60 jours avant)',
    'Automatisation 70% des tâches répétitives',
    'Analytics IA et insights actionnables',
    'Dashboard temps réel',
    'Intégration miroirs digitaux (kiosks)',
  ],
  screenshot: 'https://jarvis-group.net/screenshot.png',
  author: organizationSchema,
}

// WebPage Schema (Page actuelle)
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'JARVIS - Démo IA Conversationnelle | Salles de Sport',
  description: 'Testez JARVIS en 3 minutes. IA vocale révolutionnaire pour salles de sport. Détection churn, analytics IA, automatisation.',
  url: 'https://jarvis-group.net/landing-client',
  inLanguage: 'fr-FR',
  isPartOf: {
    '@type': 'WebSite',
    name: 'JARVIS Group',
    url: 'https://jarvis-group.net',
  },
  about: softwareSchema,
  publisher: organizationSchema,
}

// FAQPage Schema (Questions fréquentes implicites dans le contenu)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qu\'est-ce que JARVIS ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JARVIS est une IA conversationnelle révolutionnaire pour salles de sport qui réduit le churn de 30%, automatise 70% des tâches répétitives et génère des insights actionnables via analytics IA.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment JARVIS réduit-il le churn ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JARVIS détecte les signaux de churn 60 jours avant grâce à l\'analyse comportementale IA. Il engage proactivement les membres à risque via conversations naturelles et génère des alertes pour votre équipe.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel est le coût de JARVIS ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nous proposons actuellement un programme pilote GRATUIT (0€) pour 5 salles sélectionnées. Durée : 3 mois. Installation, formation et support inclus.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps prend l\'installation ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Installation des miroirs digitaux + formation de votre équipe : 2 jours. Déploiement personnalisé de JARVIS : 1 semaine. Insights et optimisation : en continu.',
      },
    },
  ],
}

// Combiner tous les schemas
const structuredData = [
  organizationSchema,
  softwareSchema,
  webPageSchema,
  faqSchema,
]

export const metadata: Metadata = {
  title: 'JARVIS - Démo IA Conversationnelle | Salles de Sport',
  description: 'Testez JARVIS en 3 minutes. IA vocale révolutionnaire pour salles de sport. Détection churn, analytics IA, automatisation.',
}

export default function LandingClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data JSON-LD (Multiple schemas) */}
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  )
}




