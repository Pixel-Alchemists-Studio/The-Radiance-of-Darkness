import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageTransition } from '@/components/PageTransition';
import { motion } from 'framer-motion';

const TEAM = [
  {
    name: "Federico Francesco Arcuri",
    initials: "FA",
    rolesIT: ["Referente", "Sceneggiatore", "Web Dev", "Marketing", "Editor"],
    rolesEN: ["Lead", "Writer", "Web Dev", "Marketing", "Editor"],
    bioIT: "Coordina il gruppo e gestisce la visione d'insieme del progetto. Scrive la storia, i dialoghi e la struttura delle tavole. Sviluppa il sito web promozionale e supervisiona le strategie di comunicazione digitale. Gestisce l'utilizzo dell'IA in tutte le fasi di produzione.",
    bioEN: "Coordinates the group and manages the overall project vision. Writes the story, dialogues and panel structure. Develops the promotional website and oversees digital communication strategies. Manages AI use across all production phases.",
  },
  {
    name: "Alessio Francesco Lanza",
    initials: "AL",
    rolesIT: ["Character Design", "Disegno", "Musica", "Community", "Social"],
    rolesEN: ["Character Design", "Drawing", "Music", "Community", "Social"],
    bioIT: "Progetta l'aspetto dei personaggi — fisico, abiti, espressioni, pose. Realizza le tavole a matita curando la regia visiva e la composizione delle vignette. Compone musiche e si occupa della gestione della community online del progetto.",
    bioEN: "Designs how the characters look — physique, clothing, expressions, poses. Pencils the panels, curating visual direction and composition. Composes music and manages the project's online community.",
  },
  {
    name: "Andrea Ianni",
    initials: "AI",
    rolesIT: ["Character Design", "Disegno", "Musica", "Sound Design"],
    rolesEN: ["Character Design", "Drawing", "Music", "Sound Design"],
    bioIT: "Lavora affianco al character design e alla realizzazione delle tavole. Compone musica e crea i sound design dell'esperienza uditiva del progetto. Contribuisce alla produzione musicale e al coordinamento della post-produzione audio.",
    bioEN: "Works alongside character design and panel production. Composes music and creates the project's sound design. Contributes to musical production and audio post-production coordination.",
  },
  {
    name: "Tommaso Mannarino",
    initials: "TM",
    rolesIT: ["Inchiostratore", "Letterista", "Traduttore", "Produttore"],
    rolesEN: ["Inker", "Letterer", "Translator", "Producer"],
    bioIT: "Ripassa le matite definendo linee, ombre e dettagli con la china. Inserisce testi, balloon, onomatopee e cura l'impaginazione grafica dei dialoghi. Gestisce il coordinamento della produzione e post-produzione musicale.",
    bioEN: "Inks the pencils, defining lines, shadows and details. Adds text, balloons, sound effects and curates the graphic layout of dialogues. Manages production and musical post-production coordination.",
  },
];

const TOOLS = [
  { name: "HTML5 / CSS3", catIT: "Web", catEN: "Web" },
  { name: "JavaScript", catIT: "Web", catEN: "Web" },
  { name: "GameMaker", catIT: "Game Dev", catEN: "Game Dev" },
  { name: "LMMS", catIT: "Musica", catEN: "Music" },
  { name: "Google Meet", catIT: "Comunicazione", catEN: "Communication" },
  { name: "Discord", catIT: "Comunicazione", catEN: "Communication" },
  { name: "WhatsApp", catIT: "Coordinamento", catEN: "Coordination" },
  { name: "Gmail", catIT: "Scambio file", catEN: "File sharing" },
  { name: "Google Classroom", catIT: "Organizzazione", catEN: "Organization" },
  { name: "Claude AI", catIT: "IA Creativa", catEN: "Creative AI" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-display text-[0.65rem] tracking-[0.5em] text-primary uppercase mb-3">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight mb-5">
      {children}
    </h2>
  );
}

function GoldHr() {
  return <div className="w-[50px] h-px bg-primary opacity-70 my-5" />;
}

export default function Studio() {
  const { t, language } = useLanguage();
  const isIT = language === 'IT';

  return (
    <PageTransition className="min-h-screen bg-background">

      {/* ═══ STUDIO BANNER ═══ */}
      <div className="relative border-b border-border/60 mb-16 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, hsl(240 25% 5%) 0%, hsl(240 15% 4%) 100%)' }}
      >
        {/* Watermark "Pixel Alchemists" */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="font-display font-black whitespace-nowrap"
            style={{
              fontSize: 'clamp(5rem, 14vw, 10rem)',
              color: 'rgba(200,168,75,0.025)',
              letterSpacing: '0.02em',
            }}
          >
            Pixel Alchemists
          </span>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-16 text-center">
          {/* Logo small on top */}
          <div className="w-28 h-28 mx-auto mb-6 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/15 blur-3xl"></div>
            <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-primary/60 shadow-xl shadow-primary/30"
              style={{ background: '#ffffff' }}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/pixel-dragon-logo.png`}
                alt="Pixel Alchemists"
                className="w-full h-full object-cover"
                style={{
                  imageRendering: 'pixelated',
                  transform: 'scale(1.35)',
                  transformOrigin: '52% 50%',
                }}
              />
            </div>
          </div>
          <h1
            className="font-display text-primary relative"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.1 }}
          >
            Pixel Alchemists
          </h1>
          <p className="font-display text-[0.7rem] tracking-[0.4em] text-muted-foreground uppercase mt-3">
            {t.studio.tagline ?? t.studio.subtitle}
          </p>
          <p className="text-xs text-muted-foreground/70 tracking-widest mt-4">{t.studio.founded}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* ═══ CHI SIAMO ═══ */}
        <section className="py-8">
          <Eyebrow>{t.studio.whoEyebrow ?? (isIT ? "Chi Siamo" : "About Us")}</Eyebrow>
          <SectionTitle>{t.studio.whoTitle ?? (isIT ? "Il Gruppo" : "The Group")}</SectionTitle>
          <GoldHr />
          <div className="max-w-3xl space-y-5 mt-6">
            <p className="text-foreground/80 text-base md:text-lg leading-[1.9]">
              {t.studio.intro}
            </p>
            {t.studio.intro2 && (
              <p className="text-foreground/80 text-base md:text-lg leading-[1.9]">
                {t.studio.intro2}
              </p>
            )}
          </div>
        </section>

        {/* ═══ TEAM ═══ */}
        <section className="py-12">
          <Eyebrow>{t.studio.teamEyebrow ?? (isIT ? "Il Team" : "The Team")}</Eyebrow>
          <SectionTitle>{t.studio.teamTitle ?? (isIT ? "I Pixel Alchemists" : "The Pixel Alchemists")}</SectionTitle>
          <GoldHr />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative bg-card border border-border p-6 hover:border-primary/40 transition-colors overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />

                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-full border border-border/60 flex items-center justify-center mb-4 font-display text-xl text-primary"
                  style={{ background: 'linear-gradient(135deg, #2a1858, #0d2a4a)' }}
                >
                  {member.initials}
                </div>

                <div className="font-display text-foreground text-base mb-1">{member.name}</div>

                <div className="flex flex-wrap gap-1.5 my-3">
                  {(isIT ? member.rolesIT : member.rolesEN).map((r) => (
                    <span
                      key={r}
                      className="font-display text-[0.55rem] tracking-[0.15em] text-primary/80 border border-primary/40 px-2 py-[2px] uppercase"
                    >
                      {r}
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground text-sm leading-[1.65]">
                  {isIT ? member.bioIT : member.bioEN}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ FILOSOFIA ═══ */}
        <section className="py-12">
          <Eyebrow>{t.studio.philEyebrow ?? (isIT ? "Filosofia" : "Philosophy")}</Eyebrow>
          <SectionTitle>{t.studio.philTitle ?? (isIT ? "Come Lavoriamo" : "How We Work")}</SectionTitle>
          <GoldHr />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: '創', title: t.studio.noCompromise, text: t.studio.noCompromiseText },
              { icon: '錬', title: t.studio.aiTool ?? (isIT ? "IA come Strumento" : "AI as a Tool"), text: t.studio.aiToolText ?? (isIT ? "L'intelligenza artificiale è integrata in tutte le fasi come acceleratore creativo. Ma ogni input viene valutato e filtrato. La direzione artistica e le scelte finali rimangono sempre nelle mani del gruppo." : "Artificial intelligence is integrated in every phase as a creative accelerator. But every input is evaluated and filtered. Artistic direction and final choices always remain in the group's hands.") },
              { icon: '心', title: t.studio.deepStory, text: t.studio.deepStoryText },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card border border-border p-8 text-center"
              >
                <div
                  className="text-[2.5rem] text-primary/60 mb-3 leading-none"
                  style={{ fontFamily: "'Noto Serif JP', serif" }}
                >
                  {card.icon}
                </div>
                <div className="font-display text-[0.78rem] tracking-[0.2em] text-primary uppercase mb-3">
                  {card.title}
                </div>
                <p className="text-muted-foreground text-sm leading-[1.75]">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ STRUMENTI ═══ */}
        <section className="py-12">
          <Eyebrow>{t.studio.toolsEyebrow ?? (isIT ? "Strumenti" : "Tools")}</Eyebrow>
          <SectionTitle>{t.studio.toolsTitle ?? (isIT ? "Tecnologie Usate" : "Technologies Used")}</SectionTitle>
          <GoldHr />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="border border-border bg-card/60 p-4 text-center hover:border-primary/40 transition-colors"
              >
                <div className="font-display text-[0.78rem] text-foreground mb-1">{tool.name}</div>
                <div className="text-xs text-muted-foreground">{isIT ? tool.catIT : tool.catEN}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
