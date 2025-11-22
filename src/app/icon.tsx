import { ImageResponse } from 'next/og'

/**
 * Génération d'icône dynamique pour JARVIS
 * Next.js génère automatiquement favicon.ico, apple-icon, etc.
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 */

export const runtime = 'edge'

export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 256,
          background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
        }}
      >
        J
      </div>
    ),
    {
      ...size,
    }
  )
}


