/**
 * API Route : Capturer les emails de prospects intéressés par JARVIS
 * 
 * POST /api/voice/vitrine/email
 * 
 * ⚠️ NOTE: Cette route log simplement les emails côté serveur.
 * Pour sauvegarder réellement, configurez :
 * - Option 1: Webhook Zapier/Make (WEBHOOK_URL dans .env.local)
 * - Option 2: Service email (Resend, SendGrid)
 * - Option 3: Base de données (Airtable, Google Sheets)
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const timestamp = new Date().toISOString()
    const cleanEmail = email.toLowerCase().trim()

    // 1. Log côté serveur (TOUJOURS fait)
    console.log('📧 [VITRINE EMAIL] Nouveau prospect:', {
      email: cleanEmail,
      ip: clientIP,
      timestamp,
      userAgent: request.headers.get('user-agent')?.substring(0, 50)
    })

    // 2. Envoyer vers webhook si configuré (optionnel)
    const webhookUrl = process.env.WEBHOOK_URL || process.env.ZAPIER_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            ip: clientIP,
            timestamp,
            source: 'landing-voice-demo',
            userAgent: request.headers.get('user-agent')
          })
        })
        console.log('✅ [VITRINE EMAIL] Envoyé vers webhook')
      } catch (webhookError) {
        console.error('❌ [VITRINE EMAIL] Erreur webhook:', webhookError)
        // Ne pas bloquer si webhook échoue
      }
    } else {
      console.warn('⚠️ [VITRINE EMAIL] Webhook non configuré - email seulement loggé')
      console.warn('⚠️ [VITRINE EMAIL] Configurez WEBHOOK_URL dans .env.local pour sauvegarder les emails')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email enregistré avec succès' 
    })

  } catch (error) {
    console.error('❌ Erreur sauvegarde email:', error)
    // Ne pas bloquer la démo pour une erreur d'email
    return NextResponse.json({ 
      success: true,
      message: 'Démo autorisée' 
    })
  }
}

