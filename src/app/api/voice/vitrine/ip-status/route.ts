import { NextRequest, NextResponse } from 'next/server'
import { vitrineIPLimiter } from '@/lib/vitrine-ip-limiter'

export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    const stats = await vitrineIPLimiter.getSessionStats(clientIP)

    return NextResponse.json({
      success: true,
      ip: clientIP.substring(0, 8) + '...', // Masquer l'IP
      stats: stats || {
        dailyDuration: 0,
        totalDuration: 0,
        blocked: false,
        isActive: false
      }
    })

  } catch (error) {
    console.error('❌ Erreur IP status:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

