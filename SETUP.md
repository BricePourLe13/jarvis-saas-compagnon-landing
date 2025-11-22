# 🚀 JARVIS Landing Page - Setup Guide

Ce repo contient **uniquement** la landing page de JARVIS, 100% autonome du repo SaaS principal.

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Compte OpenAI (pour Realtime API)
- Compte Supabase (pour rate limiting & audit)

---

## 🔧 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer `.env.local`

Créer un fichier `.env.local` à la racine avec :

```bash
# ============================================
# REQUIS
# ============================================
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# SUPABASE (Rate Limiting & Audit)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# OPTIONNEL (Capture emails prospects)
# ============================================
WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx
```

---

## 🔑 Obtenir les clés API

### OpenAI API Key (REQUIS)

1. Aller sur https://platform.openai.com/api-keys
2. Créer une nouvelle clé
3. Ajouter des crédits (minimum 10$)
4. Copier la clé dans `OPENAI_API_KEY`

### Supabase (REQUIS pour Rate Limiting)

**Pourquoi ?** Le rate limiting utilise la table `vitrine_demo_sessions` pour comptabiliser l'usage par IP et bloquer les abus.

**Option 1 : Utiliser le Supabase du repo principal (RECOMMANDÉ)**
1. Utiliser les **mêmes credentials** que `jarvis-saas-compagnon`
2. La table `vitrine_demo_sessions` est déjà créée
3. Copier les 3 variables d'env depuis le repo principal

**Option 2 : Nouveau Supabase (si vraiment séparation totale)**
1. Créer un compte gratuit sur https://supabase.com
2. Créer un nouveau projet
3. Copier les credentials (Settings > API)
4. Exécuter la migration SQL pour créer `vitrine_demo_sessions` (voir ci-dessous)

**Limites gratuites Supabase :** 500 MB + 2 GB bande passante (largement suffisant)

### Webhook pour emails (OPTIONNEL)

Pour recevoir les emails des prospects qui testent la démo :

**Option 1 : Zapier (Recommandé)**
1. Créer un compte Zapier (gratuit)
2. Créer un nouveau Zap avec trigger "Webhooks by Zapier"
3. Choisir "Catch Hook"
4. Copier l'URL du webhook
5. Connecter à Google Sheets / Notion / Email
6. Ajouter dans `.env.local` : `WEBHOOK_URL=...`

**Option 2 : Make.com**
Similaire à Zapier, mais interface différente.

**Option 3 : Rien (Fallback)**
Les emails seront juste loggés côté serveur dans les logs Vercel.

---

## 🚀 Lancer en développement

```bash
npm run dev
```

Ouvrir http://localhost:3000

---

## 📊 Architecture Vocale

```
Landing Page (ce repo)
├── /api/voice/vitrine/session      → Créer session OpenAI
├── /api/voice/vitrine/end-session  → Terminer session + comptabiliser
├── /api/voice/vitrine/email        → Capturer email prospect
└── /api/voice/vitrine/ip-status    → Vérifier rate limit IP

Rate Limiting (Upstash Redis)
├── 5 minutes de démo gratuite/jour/IP
├── 15 minutes lifetime max/IP
└── Blocage automatique si dépassement
```

---

## 🔒 Sécurité & Rate Limiting

### Avec Supabase (PRO & SÉCURISÉ)
- ✅ 5 minutes/jour/IP
- ✅ 15 minutes lifetime/IP
- ✅ Blocage automatique
- ✅ Gestion sessions orphelines
- ✅ Comptabilisation précise
- ✅ **Audit trail complet** (qui, quand, combien)
- ✅ **Données persistantes** (pas volatiles)
- ✅ **RLS policies** (sécurité niveau base)

### Migration SQL (si nouveau Supabase uniquement)

Si vous créez un **nouveau** projet Supabase, exécutez cette migration dans SQL Editor :

```sql
-- Table pour rate limiting landing page
CREATE TABLE vitrine_demo_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  session_count INT DEFAULT 0,
  daily_session_count INT DEFAULT 0,
  daily_reset_date DATE NOT NULL,
  total_duration_seconds INT DEFAULT 0,
  daily_duration_seconds INT DEFAULT 0,
  user_agent TEXT,
  first_session_at TIMESTAMPTZ,
  last_session_at TIMESTAMPTZ,
  is_session_active BOOLEAN DEFAULT FALSE,
  blocked BOOLEAN DEFAULT FALSE,
  blocked_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_vitrine_sessions_ip ON vitrine_demo_sessions(ip_address);
CREATE INDEX idx_vitrine_sessions_daily_reset ON vitrine_demo_sessions(daily_reset_date);

-- RLS (sécurité)
ALTER TABLE vitrine_demo_sessions ENABLE ROW LEVEL SECURITY;

-- Policy : lecture/écriture uniquement avec service_role
CREATE POLICY "Service role only" ON vitrine_demo_sessions
  FOR ALL
  USING (auth.role() = 'service_role');
```

---

## 🚀 Déploiement sur Vercel

### 1. Créer un nouveau projet Vercel

```bash
# Option A : Via CLI
vercel

# Option B : Via dashboard
https://vercel.com/new
```

### 2. Configurer le domaine

**Dashboard Vercel → Settings → Domains**
- Ajouter `jarvis-group.net`
- Suivre les instructions DNS (records A/CNAME)

### 3. Ajouter les variables d'environnement

**Dashboard Vercel → Settings → Environment Variables**

Ajouter TOUTES les variables de `.env.local` :
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_APP_URL=https://jarvis-group.net`
- *(Optionnel)* `WEBHOOK_URL`

### 4. Redéployer

```bash
vercel --prod
```

---

## 📝 Différences avec le repo SaaS principal

| Feature | Landing (ce repo) | SaaS (jarvis-saas-compagnon) |
|---------|-------------------|------------------------------|
| Fonctionnalité vocale | ✅ Démo commerciale (5 min) | ✅ Coach full (illimité) |
| Auth requise | ❌ Non | ✅ Oui (badge RFID) |
| Tools/Actions | ❌ Aucun | ✅ 25+ tools |
| Base de données | ✅ Supabase (`vitrine_demo_sessions`) | ✅ Supabase (tables complètes) |
| Rate limiting | ✅ Par IP (Supabase) | ✅ Par membre |
| Dashboard | ❌ Non | ✅ Oui (admin/manager) |
| Contexte membre | ❌ Non | ✅ Oui (profil, historique) |

---

## 🐛 Troubleshooting

### Erreur : "OPENAI_API_KEY is required"
➡️ Ajouter `OPENAI_API_KEY` dans `.env.local`

### Erreur : "Module not found: @supabase/supabase-js"
➡️ Installer : `npm install @supabase/supabase-js`

### Erreur : "Supabase vitrine limiter: PGRST116"
➡️ La table `vitrine_demo_sessions` n'existe pas. Exécuter la migration SQL ci-dessus.

### Erreur : "Rate limit exceeded" (OpenAI)
➡️ Vérifier les crédits sur https://platform.openai.com/usage

### Sessions orphelines (ne se ferment pas)
➡️ Le système nettoie automatiquement après 30 secondes

---

## 📚 Ressources

- [OpenAI Realtime API Docs](https://platform.openai.com/docs/guides/realtime)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)

---

## 🆘 Support

- **Email :** brice@jarvis-group.net
- **Repo principal :** https://github.com/jarvis-group/jarvis-saas-compagnon

---

**🚀 Let's build!**







