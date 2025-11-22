"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowRight, Check, Dumbbell, Hotel, ShoppingBag, Terminal, XCircle, Shield, Lock, ChevronDown, Activity } from "lucide-react";

// 🎯 DYNAMIC IMPORTS
const VoiceVitrineInterface = dynamic(
  () => import("@/components/vitrine/VoiceVitrineInterface"),
  { ssr: false }
);

const Avatar3D = dynamic(
  () => import("@/components/kiosk/Avatar3D"),
  { ssr: false }
);

const ContactForm = dynamic(
  () => import("@/components/vitrine/ContactForm"),
  { ssr: false }
);

// 💫 BACKGROUND IMPORTS
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

// 🎯 HOOKS
import { useVoiceVitrineChat } from "@/hooks/useVoiceVitrineChat";

declare global {
  interface Window {
    voiceTimer?: ReturnType<typeof setInterval> | null
  }
}

// --- COMPONENTS UTILITAIRES ---

const CodeBlock = () => {
  const [activeLine, setActiveLine] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine(prev => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const codeLines = [
    { text: '"tools": [', color: 'text-purple-400' },
    { text: '  { "name": "book_class",', color: 'text-blue-400' },
    { text: '    "description": "Réserve un cours",', color: 'text-green-400' },
    { text: '    "parameters": { "type": "object" }', color: 'text-neutral-400' },
    { text: '  },', color: 'text-neutral-400' },
    { text: ']', color: 'text-purple-400' },
  ];

  return (
    <div className="font-mono text-sm space-y-2">
      {codeLines.map((line, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: activeLine === i ? 1 : 0.5, x: activeLine === i ? 10 : 0 }}
          className={`transition-all duration-300 ${line.color} flex items-center gap-2`}
        >
          {activeLine === i && <motion.div layoutId="cursor" className="w-1 h-4 bg-blue-500" />}
          {line.text}
        </motion.div>
      ))}
    </div>
  );
};

// --- USE CASE DATA ---
const useCaseContent = [
  {
    title: "Fitness & Wellness",
    description:
      "Notre verticale historique. Détection de churn, coaching assisté par IA, et gestion autonome des réservations. Production Ready et déployé dans les plus grandes franchises.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white p-8">
        <Dumbbell className="w-20 h-20 mb-4 opacity-80" />
        <div className="text-center">
          <div className="text-2xl font-bold">-30% Churn</div>
          <div className="text-sm opacity-75">Sur 6 mois</div>
        </div>
      </div>
    ),
  },
  {
    title: "Retail & Luxury",
    description:
      "Assistant de vente augmenté. Recommandation produit basée sur l'historique et l'analyse sentimentale en temps réel. Créez une expérience client inoubliable et personnalisée.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white p-8">
        <ShoppingBag className="w-20 h-20 mb-4 opacity-80" />
        <div className="text-center">
          <div className="text-2xl font-bold">+15% Panier Moyen</div>
          <div className="text-sm opacity-75">Cross-sell IA</div>
        </div>
      </div>
    ),
  },
  {
    title: "Hospitality",
    description:
      "Conciergerie 2.0. Check-in/out autonome, réservation de services et recommandations locales personnalisées. Disponible 24/7 dans toutes les langues.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--pink-500),var(--indigo-500))] flex items-center justify-center text-white p-8">
        <Hotel className="w-20 h-20 mb-4 opacity-80" />
        <div className="text-center">
          <div className="text-2xl font-bold">24/7 Support</div>
          <div className="text-sm opacity-75">Multilingue</div>
        </div>
      </div>
    ),
  },
];

// --- FAQ DATA ---
const faqData = [
  {
    question: "Est-ce que JARVIS remplace mes coachs ?",
    answer: "Non, JARVIS est conçu pour être un intendant et un assistant. Il gère les tâches répétitives (réservations, informations horaires, FAQ basique) pour libérer vos coachs afin qu'ils se concentrent sur l'humain et le coaching sportif."
  },
  {
    question: "Comment sont gérées les données vocales ?",
    answer: "La confidentialité est notre priorité. Les données vocales sont traitées en temps réel et ne sont pas stockées de manière persistante sauf si nécessaire pour le service (avec consentement). Tout est chiffré de bout en bout."
  },
  {
    question: "Est-ce compatible avec mon logiciel de gestion ?",
    answer: "Oui, JARVIS utilise le protocole MCP pour se connecter à n'importe quelle API (Resamania, Heitz, Mindbody, etc.). Nous développons des connecteurs sur mesure si besoin."
  },
  {
    question: "Que se passe-t-il s'il y a du bruit dans la salle ?",
    answer: "Notre système de reconnaissance vocale utilise des modèles avancés (Whisper) avec suppression de bruit active, testés spécifiquement dans des environnements bruyants comme les salles de sport."
  },
  {
    question: "Quel est le modèle de pricing ?",
    answer: "Nous fonctionnons sur un modèle hybride : un coût d'installation initial (matériel + setup) et un abonnement mensuel par salle qui couvre les licences logicielles, la maintenance et les coûts d'API IA."
  }
];

export default function LandingClientResendStyle() {
  // 🎤 VOICE STATE
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error'>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceTimeRemaining, setVoiceTimeRemaining] = useState(300);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // FAQ STATE
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 🎢 SCROLL PARALLAX SETUP
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // 🎤 VOICE CHAT HOOK
  const {
    connect: connectVoice,
    disconnect: disconnectVoice,
  } = useVoiceVitrineChat({
    onStatusChange: setVoiceStatus,
    onTranscriptUpdate: setVoiceTranscript,
    maxDuration: 300
  });

  const handleStartVoice = async () => {
    try {
      setErrorMessage(null);
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
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Une erreur inattendue est survenue.");
      }
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

  // Animations sections
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <main ref={targetRef} className="min-h-screen bg-[#000000] text-white selection:bg-white/20 selection:text-white font-sans antialiased overflow-x-hidden relative">
      
      {/* 💫 DYNAMIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarsBackground 
          starDensity={0.0002} 
          allStarsTwinkle={true} 
          twinkleProbability={0.8} 
          minTwinkleSpeed={0.8} 
          maxTwinkleSpeed={2}
          className="opacity-60"
        />
        <ShootingStars 
          starColor="#4F46E5" 
          trailColor="#2563EB" 
          minSpeed={15} 
          maxSpeed={35} 
          minDelay={2000} 
          maxDelay={5000}
          className="opacity-40" 
        />
      </div>

      {/* 🎯 HEADER - CENTERED LAYOUT */}
      <header className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-full px-6 h-14 grid grid-cols-3 items-center shadow-2xl max-w-5xl w-full"
        >
          {/* Left: Logo */}
          <div className="flex items-center justify-start gap-2">
             <Image 
               src="/logo_jarvis.png" 
               alt="JARVIS Logo" 
               width={24} 
               height={24} 
               className="w-6 h-6"
             />
             <span className="font-bold text-lg tracking-tight hidden sm:block">JARVIS</span>
          </div>

          {/* Center: Nav Links */}
          <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#about" className="hover:text-white transition-colors hover:scale-105 transform">Solution</a>
            <a href="#showcase" className="hover:text-white transition-colors hover:scale-105 transform">Use Cases</a>
            <a href="#infrastructure" className="hover:text-white transition-colors hover:scale-105 transform">Developers</a>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-4">
             <a 
               href="https://app.jarvis-group.net" 
               className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block"
             >
               Log in
             </a>
             <a 
               href="#contact"
               className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95"
             >
               Get Started
             </a>
          </div>
        </motion.div>
      </header>

      {/* ERROR TOAST */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[60] bg-red-900/90 backdrop-blur-md border border-red-500/50 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md w-full"
          >
            <XCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-bold mb-1">Action impossible</p>
              <p className="text-red-200">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-white/50 hover:text-white p-1"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎯 HERO SECTION - WITH PARALLAX & TEXT REVEAL */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden min-h-screen flex items-center">
        {/* Glow Effect */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" 
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left: Text Content */}
          <motion.div 
            style={{ y: textY }}
            className="space-y-10 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mx-auto lg:mx-0 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v2.0 Infra is Live
            </motion.div>

            {/* Headline - Animated Stagger */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              {["L'Infrastructure", "IA", "Vocale"].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-neutral-500"
              >
                pour vos Espaces Physiques.
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed mx-auto lg:mx-0"
            >
              Transformez vos lieux en expériences intelligentes. 
              Détection d'intention, actions autonomes et analytics en temps réel.
              <br />
              <span className="text-white font-medium mt-2 block">Éprouvé et validé dans l'industrie du Fitness.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <button 
                onClick={handleStartVoice}
                className="h-12 px-8 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95"
              >
                Tester la démo vocale
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#about"
                className="h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-md"
              >
                Découvrir Jarvis
              </a>
            </motion.div>
          </motion.div>

          {/* Right: 3D SPHERE - Parallaxed */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ y: heroY }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div 
              className="relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] cursor-pointer group"
              onClick={!isVoiceActive ? handleStartVoice : undefined}
            >
              <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />
              
              <div className="relative w-full h-full flex items-center justify-center">
                <Avatar3D 
                  size={400}
                  status={voiceStatus === 'speaking' ? 'speaking' : 
                         voiceStatus === 'listening' ? 'listening' : 
                         voiceStatus === 'connecting' ? 'connecting' : 'idle'}
                  eyeScale={1}
                />
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 shadow-xl hover:scale-105 transition-transform">
                <div className={`w-2 h-2 rounded-full ${isVoiceActive ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-xs font-mono text-neutral-300 uppercase tracking-wider">
                  {isVoiceActive ? 'VOICE ACTIVE' : 'SYSTEM ONLINE'}
                </span>
                {!isVoiceActive && <span className="text-xs text-neutral-500 border-l border-white/10 pl-3">Click to interact</span>}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Voice State Indicator */}
        {isVoiceActive && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 shadow-2xl flex items-center gap-6"
           >
             <div className="flex gap-1 h-6 items-center">
                {[1,2,3,4,5].map(i => (
                  <motion.div 
                    key={i}
                    className="w-1.5 bg-blue-500 rounded-full"
                    animate={{ height: [6, 24, 6] }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                  />
                ))}
             </div>
             <div>
               <div className="text-sm font-medium text-white">JARVIS vous écoute...</div>
               <div className="text-xs text-neutral-500 font-mono">SESSION: {voiceTimeRemaining}s</div>
               {voiceTranscript && <div className="sr-only">{voiceTranscript}</div>}
             </div>
             <button 
               onClick={handleEndVoice}
               className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
             >
               <div className="w-3 h-3 bg-current rounded-sm" />
             </button>
           </motion.div>
        )}
      </section>

      {/* 🎯 LOGOS / TRUST */}
      <section className="py-10 border-y border-white/5 bg-black/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-neutral-500 font-medium mb-8 tracking-wider">DEPLOYED IN PREMIER FITNESS LOCATIONS</p>
          <div className="flex flex-wrap justify-center gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['FORGE FITNESS', 'AREA SPORT CLUB'].map((brand) => (
               <span key={brand} className="text-xl md:text-2xl font-bold font-mono text-white/80">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 WHAT IS JARVIS - REFINED LAYOUT */}
      <section id="about" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            {...fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                Plus qu'un assistant.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Une présence intelligente.</span>
              </h2>
              <div className="space-y-6 text-lg text-neutral-400 leading-relaxed">
                <p>
                  JARVIS s'incarne dans un miroir digital premium, offrant une interface naturelle et non-intrusive. Pas d'écran tactile complexe, pas de clavier : juste la voix.
                </p>
                <p>
                  Il scanne les badges, reconnaît les membres, et engage la conversation pro-activement pour collecter du feedback, gérer les réservations ou simplement accueillir.
                </p>
                <ul className="space-y-3 mt-8">
                  {[
                    'Speech-to-Speech en <500ms',
                    'Contexte persistant par membre',
                    'Actions réelles via APIs',
                    'Hardware premium inclus'
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-white/90"
                    >
                       <Check className="w-5 h-5 text-blue-500" />
                       {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1 }}
              className="relative perspective-1000"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <Image 
                  src="/images/jarvis-mirror.png" 
                  alt="Miroir Jarvis en situation" 
                  width={600} 
                  height={800}
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                />
                {/* UI Overlay Mockup */}
                <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-mono text-white/70">LIVE ANALYSIS</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs text-blue-400">
                    <div>{`> Intent: "Booking"`}</div>
                    <div>{`> Confidence: 98.5%`}</div>
                    <div>{`> Action: trigger_webhook`}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🎯 USE CASES - STICKY SCROLL REVEAL (NEW DESIGN) */}
      <section id="showcase" className="py-32 relative z-10 border-t border-white/5 bg-neutral-950/50 backdrop-blur-lg">
         <div className="max-w-7xl mx-auto px-6">
           <motion.div 
             {...fadeInUp}
             className="mb-20 text-center"
           >
             <h2 className="text-3xl md:text-5xl font-bold mb-6">Une infrastructure, <br/><span className="text-neutral-500">plusieurs réalités.</span></h2>
             <p className="text-neutral-400 max-w-2xl text-lg mx-auto">
               JARVIS n'est pas juste une application, c'est une couche d'intelligence modulaire. 
               Découvrez comment nous transformons différentes industries.
             </p>
           </motion.div>

           {/* Sticky Scroll Component */}
           <StickyScroll content={useCaseContent} />
         </div>
      </section>

      {/* 🎯 INTEGRATIONS (MARQUEE) */}
      <section className="py-20 border-t border-white/10 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h3 className="text-lg font-bold text-neutral-400 tracking-wider mb-2">INTÉGRATIONS NATIVES</h3>
          <p className="text-neutral-500">Connectez JARVIS à votre écosystème existant.</p>
        </div>
        
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
            {/* First Loop */}
            {['RESAMANIA', 'HEITZ', 'MINDBODY', 'XPLOR', 'GOOGLE CALENDAR', 'NOTION', 'HUBSPOT', 'ZAPIER'].map((logo, i) => (
              <span key={i} className="text-2xl font-mono font-bold text-white/30 mx-4">{logo}</span>
            ))}
            {/* Second Loop for seamless scroll */}
            {['RESAMANIA', 'HEITZ', 'MINDBODY', 'XPLOR', 'GOOGLE CALENDAR', 'NOTION', 'HUBSPOT', 'ZAPIER'].map((logo, i) => (
              <span key={`dup-${i}`} className="text-2xl font-mono font-bold text-white/30 mx-4">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 DEVELOPER / INFRASTRUCTURE SECTION */}
      <section id="infrastructure" className="py-32 bg-black border-t border-white/10 relative overflow-hidden z-10">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
         
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
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
            </motion.div>

            {/* CODE BLOCK VISUAL */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 blur transition duration-1000 group-hover:opacity-40"></div>
               <div className="relative bg-[#0A0A0A] rounded-xl border border-white/10 p-6 overflow-hidden shadow-2xl min-h-[300px]">
                  <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                     <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                     <span className="ml-auto text-xs text-neutral-600">gym-tools.config.json</span>
                  </div>
                  
                  <CodeBlock />
                  
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
            </motion.div>
         </div>
      </section>

      {/* 🎯 SECURITY SECTION */}
      <section className="py-24 bg-neutral-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <Shield className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">GDPR Compliant</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Conformité totale avec les régulations européennes. Gestion fine des consentements et droit à l'oubli intégré nativement.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <Lock className="w-10 h-10 text-purple-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">End-to-End Encryption</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Toutes les données transitent via TLS 1.3. Les clés API sont stockées dans des coffres-forts sécurisés (Vault).
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <Activity className="w-10 h-10 text-green-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">99.9% Uptime</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Infrastructure redondante sur Vercel Edge Network. Monitoring pro-actif 24/7 pour garantir la disponibilité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 FAQ SECTION */}
      <section className="py-32 relative z-10 bg-black">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Questions Fréquentes</h2>
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="border border-white/10 rounded-xl overflow-hidden bg-neutral-900/30">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-lg">{item.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-neutral-400 leading-relaxed border-t border-white/5">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 CTA SECTION */}
      <section id="contact" className="py-32 relative overflow-hidden z-10">
         <div className="absolute inset-0 bg-blue-600/5" />
         <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              {...fadeInUp}
            >
              <h2 className="text-4xl font-bold mb-6">Prêt à moderniser vos espaces ?</h2>
              <p className="text-neutral-400 mb-10 text-lg">
                 Nous acceptons actuellement de nouveaux partenaires pour notre programme Fitness Enterprise. 
                 Pour les autres verticales, rejoignez la liste d'attente.
              </p>
              
              <div className="bg-black border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                 <ContactForm leadType="enterprise" />
              </div>
            </motion.div>
         </div>
      </section>

      {/* 🎯 FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-black text-neutral-500 text-sm relative z-10">
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
