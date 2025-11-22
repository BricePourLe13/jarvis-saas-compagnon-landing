'use client'

import Script from 'next/script'

/**
 * Google Analytics 4 (GA4) Component
 * 
 * INSTALLATION :
 * 1. Créer compte Google Analytics : https://analytics.google.com
 * 2. Créer propriété GA4
 * 3. Récupérer ID mesure (format: G-XXXXXXXXXX)
 * 4. Ajouter dans .env.local : NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 5. Importer ce composant dans layout.tsx
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  // Ne pas charger GA en dev ou si ID manquant
  if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      
      {/* GA Initialization */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
              anonymize_ip: true, // RGPD compliant
            });
          `,
        }}
      />
    </>
  )
}

/**
 * Helper functions pour tracking custom events
 * 
 * Usage:
 * import { trackEvent } from '@/components/analytics/GoogleAnalytics'
 * trackEvent('cta_click', { button_name: 'Rejoindre Programme Pilote' })
 */

export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as Window & typeof globalThis & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as Window & typeof globalThis & { gtag: (...args: unknown[]) => void }).gtag('event', eventName, eventParams)
  }
}

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as Window & typeof globalThis & { gtag?: (...args: unknown[]) => void }).gtag && GA_MEASUREMENT_ID) {
    (window as Window & typeof globalThis & { gtag: (...args: unknown[]) => void }).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}


