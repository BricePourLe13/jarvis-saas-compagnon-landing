"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowRight, Check, Code2, Dumbbell, Hotel, ShoppingBag, Mic, Play, Terminal, Cpu } from "lucide-react";

// 🎯 LAZY LOADED COMPONENTS
const VoiceVitrineInterface = dynamic(
  () => import("@/components/vitrine/VoiceVitrineInterface"),
  { ssr: false }
);

const ContactForm = dynamic(
  () => import("@/components/vitrine/ContactForm"),
  { ssr: false }
);

// 🎯 HOOKS
import { useVoiceVitrineChat } from "@/hooks/useVoiceVitrineChat";

declare global {
  interface Window {
    voiceTimer?: ReturnType<typeof setInterval> | null
  }
}

export default function LandingClientResendStyle() {
  // 🎤 VOICE STATE
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error'>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceTimeRemaining, setVoiceTimeRemaining] = useState(300);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // 🎤 VOICE CHAT HOOK
  const {
    connect: connectVoice,
    disconnect: disconnectVoice,
    error: voiceError
  } = useVoiceVitrineChat({
    onStatusChange: setVoiceStatus,
    onTranscriptUpdate: setVoiceTranscript,
    maxDuration: 300
  });

  const handleStartVoice = async () => {
    try {
      setIsVoiceActive(true);
      setVoiceStatus('connecting');
      await connectVoice();
      setVoiceStatus('connected');
      const timer = setInterval(() => {
        setVoiceTimeRemaining(prev => {
          if (prev <= 1) {
            handleEndVoice();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      window.voiceTimer = timer;
    } catch (error: unknown) {
      console.error('Erreur connexion vocale:', error);
      setVoiceStatus('error');
      setIsVoiceActive(false);
    }
  };

  const handleEndVoice = async () => {
    try {
      await disconnectVoice();
      if (window.voiceTimer) {
        clearInterval(window.voiceTimer);
        window.voiceTimer = null;
      }
      setIsVoiceActive(false);
      setVoiceStatus('idle');
      setVoiceTranscript('');
      setVoiceTimeRemaining(300);
    } catch (error: unknown) {
      console.error('Erreur déconnexion vocale:', error);
    }
  };

  return (
    <main className="min-h-screen bg-[#000000] text-white selection:bg-white/20 selection:text-white font-sans antialiased">
      
      {/* 🎯 HEADER RESEND STYLE */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               {/* Logo Minimaliste */}
               <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                 <div className="w-2 h-2 bg-black rounded-full" />
               </div>
               <span className="font-bold text-lg tracking-tight">JARVIS</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
              <a href="#infrastructure" className="hover:text-white transition-colors">Infrastructure</a>
              <a href="#showcase" className="hover:text-white transition-colors">Use Cases</a>
              <a href="#developers" className="hover:text-white transition-colors">Developers</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
             <a 
               href="https://app.jarvis-group.net" 
               className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block"
             >
               Log in
             </a>
             <a 
               href="#contact"
               className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors"
             >
               Get Started
             </a>
          </div>
        </div>
      </header>

      {/* 🎯 HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Glow Effect Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v2.0 Infra is Live
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              L'Infrastructure IA Vocale<br />
              <span className="text-neutral-500">pour vos Espaces Physiques.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
            >
              Transformez vos lieux physiques en expériences intelligentes. 
              Détection d'intention, actions autonomes et analytics en temps réel.
              <br />
              <span className="text-white font-medium">Éprouvé et validé dans l'industrie du Fitness.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={handleStartVoice}
                className="h-12 px-8 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all flex items-center gap-2 group"
              >
                {isVoiceActive ? 'Stop Demo' : 'Tester la démo vocale'}
                <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
              <a 
                href="#infrastructure"
                className="h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2"
              >
                Voir l'architecture <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Active Voice State Indicator (Floating) */}
            {isVoiceActive && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-4"
               >
                 <div className="flex gap-1 h-4 items-center">
                    {[1,2,3,4,5].map(i => (
                      <motion.div 
                        key={i}
                        className="w-1 bg-blue-500 rounded-full"
                        animate={{ height: [4, 16, 4] }}
                        transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                      />
                    ))}
                 </div>
                 <span className="text-sm font-medium text-white">JARVIS vous écoute...</span>
                 <span className="text-xs text-neutral-500">{voiceTimeRemaining}s</span>
               </motion.div>
            )}
          </div>
        </div>

        {/* 🎯 PRODUCT VISUAL - MIRROR */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 max-w-6xl mx-auto px-6 relative z-10"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900/50 aspect-[16/9] group">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
             <Image 
               src="/images/jarvis-mirror.png" 
               alt="JARVIS Mirror Interface" 
               fill
               className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
             />
             
             {/* UI Overlay Mockup */}
             <div className="absolute bottom-0 left-0 right-0 p-8 z-30 flex items-end justify-between">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-blue-400 text-sm font-mono mb-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      LIVE ANALYSIS
                   </div>
                   <h3 className="text-2xl font-bold">Session Adhérent #4829</h3>
                   <p className="text-neutral-400">Detection: <span className="text-white">Back Pain Signal</span> • Action: <span className="text-white">Coach Alerted</span></p>
                </div>
                <div className="flex gap-2">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono">
                    CONFIDENCE: 98.2%
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono">
                    LATENCY: 24ms
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* 🎯 LOGOS / TRUST */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-neutral-500 font-medium mb-8">DEPLOYED IN PREMIER FITNESS LOCATIONS</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {/* Placeholder Logos - Replace with real ones later */}
            {['FITNESS PARK', 'BASIC-FIT', 'ON AIR', 'ORANGE THEORY', 'EQUINOX'].map((brand) => (
               <span key={brand} className="text-xl font-bold font-mono">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 BENTO GRID USE CASES */}
      <section id="showcase" className="py-32 max-w-7xl mx-auto px-6">
         <div className="mb-20">
           <h2 className="text-3xl md:text-4xl font-bold mb-6">Une infrastructure, <br/><span className="text-neutral-500">plusieurs réalités.</span></h2>
           <p className="text-neutral-400 max-w-2xl text-lg">JARVIS n'est pas juste une application, c'est une couche d'intelligence modulaire. Commencez avec notre module Fitness éprouvé, ou construisez votre propre verticale.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: FITNESS (Active) */}
            <div className="md:col-span-2 bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
               <div className="absolute top-0 right-0 p-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                    <Check className="w-3 h-3" /> Production Ready
                  </span>
               </div>
               <div className="h-full flex flex-col justify-between relative z-10">
                  <div className="mb-12">
                     <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                        <Dumbbell className="w-6 h-6" />
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Fitness & Wellness</h3>
                     <p className="text-neutral-400 max-w-md">
                        Notre verticale historique. Détection de churn, coaching assisté par IA, et gestion autonome des réservations.
                     </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                     <div>
                        <div className="text-2xl font-bold text-white">-30%</div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Churn Rate</div>
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-white">24/7</div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Disponibilité</div>
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-white">ROI</div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Month 1</div>
                     </div>
                  </div>
               </div>
               {/* Background Pattern */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Card 2: RETAIL (Coming Soon) */}
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
               <div className="absolute top-0 right-0 p-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium border border-neutral-700">
                    Coming Soon
                  </span>
               </div>
               <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400">
                  <ShoppingBag className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold mb-2">Retail & Luxury</h3>
               <p className="text-neutral-400 text-sm mb-8">
                  Assistant de vente augmenté. Recommandation produit basée sur l'historique et l'analyse sentimentale en temps réel.
               </p>
               <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Card 3: HOSPITALITY (Coming Soon) */}
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
               <div className="absolute top-0 right-0 p-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium border border-neutral-700">
                    Coming Soon
                  </span>
               </div>
               <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 text-orange-400">
                  <Hotel className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold mb-2">Hospitality</h3>
               <p className="text-neutral-400 text-sm mb-8">
                  Conciergerie 2.0. Check-in/out autonome, réservation de services et recommandations locales personnalisées.
               </p>
               <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
         </div>
      </section>

      {/* 🎯 DEVELOPER / INFRASTRUCTURE SECTION */}
      <section id="infrastructure" className="py-32 bg-neutral-950 border-t border-white/10">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <div className="inline-flex items-center gap-2 text-blue-400 font-mono text-sm mb-4">
                  <Terminal className="w-4 h-4" />
                  MCP ARCHITECTURE
               </div>
               <h2 className="text-4xl font-bold leading-tight">
                  Connectez n'importe quel outil.<br />
                  <span className="text-neutral-500">Sans réinventer la roue.</span>
               </h2>
               <p className="text-neutral-400 text-lg leading-relaxed">
                  JARVIS utilise le standard MCP (Model Context Protocol) pour s'interfacer avec vos outils existants (CRM, ERP, Booking). Définissez simplement vos outils en JSON, JARVIS s'occupe de l'orchestration.
               </p>
               
               <ul className="space-y-4">
                  {[
                    'Webhooks sécurisés pour actions réelles',
                    'Context injection via Vector DB',
                    'Low-latency Voice Streaming (<500ms)',
                    'Privacy-first processing'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                       {item}
                    </li>
                  ))}
               </ul>

               <a href="#" className="inline-flex items-center gap-2 text-white font-medium border-b border-white/20 pb-0.5 hover:border-white transition-colors">
                  Lire la documentation technique <ArrowRight className="w-4 h-4" />
               </a>
            </div>

            {/* CODE BLOCK VISUAL */}
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 blur transition duration-1000 group-hover:opacity-40"></div>
               <div className="relative bg-[#0A0A0A] rounded-xl border border-white/10 p-6 font-mono text-sm overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                     <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                     <span className="ml-auto text-xs text-neutral-600">gym-tools.config.json</span>
                  </div>
                  
                  <div className="space-y-1 text-neutral-400">
                     <p><span className="text-purple-400">"tools"</span>: [</p>
                     <p className="pl-4">{`{`}</p>
                     <p className="pl-8"><span className="text-blue-400">"name"</span>: <span className="text-green-400">"book_yoga_class"</span>,</p>
                     <p className="pl-8"><span className="text-blue-400">"description"</span>: <span className="text-green-400">"Réserve un créneau pour l'adhérent"</span>,</p>
                     <p className="pl-8"><span className="text-blue-400">"parameters"</span>: {`{`}</p>
                     <p className="pl-12"><span className="text-blue-400">"type"</span>: <span className="text-green-400">"object"</span>,</p>
                     <p className="pl-12"><span className="text-blue-400">"properties"</span>: {`{`}</p>
                     <p className="pl-16"><span className="text-blue-400">"class_id"</span>: {`{ "type": "string" }`},</p>
                     <p className="pl-16"><span className="text-blue-400">"user_id"</span>: {`{ "type": "string" }`}</p>
                     <p className="pl-12">{`}`}</p>
                     <p className="pl-8">{`}`}</p>
                     <p className="pl-4">{`},`}</p>
                     <p className="pl-4"><span className="text-neutral-600">// ... other tools</span></p>
                     <p>]</p>
                  </div>
                  
                  {/* Execution Overlay Animation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-6 right-6 bg-green-900/90 text-green-400 px-4 py-2 rounded-md border border-green-500/30 text-xs flex items-center gap-2 backdrop-blur-md"
                  >
                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                     Tool Executed Successfully
                  </motion.div>
               </div>
            </div>
         </div>
      </section>

      {/* 🎯 CTA SECTION */}
      <section id="contact" className="py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600/5" />
         <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-6">Prêt à moderniser vos espaces ?</h2>
            <p className="text-neutral-400 mb-10 text-lg">
               Nous acceptons actuellement de nouveaux partenaires pour notre programme Fitness Enterprise. 
               Pour les autres verticales, rejoignez la liste d'attente.
            </p>
            
            <div className="bg-black border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
               <ContactForm leadType="enterprise" />
            </div>
         </div>
      </section>

      {/* 🎯 FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-black text-neutral-500 text-sm">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 bg-neutral-800 rounded-full" />
               <span className="font-semibold text-neutral-300">JARVIS GROUP</span>
            </div>
            <div className="flex gap-8">
               <a href="#" className="hover:text-white transition-colors">Documentation</a>
               <a href="#" className="hover:text-white transition-colors">Security</a>
               <a href="#" className="hover:text-white transition-colors">Legal</a>
               <a href="mailto:contact@jarvis-group.net" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div>
               © 2025 JARVIS Group. All rights reserved.
            </div>
         </div>
      </footer>

      {/* Voice Interface Modal (Hidden by default) */}
      <VoiceVitrineInterface
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </main>
  );
}
