import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGallery, CHAPTER_PREVIEWS } from '@/hooks/use-manga';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t, language } = useLanguage();
  const isIT = language === 'IT';
  const { data: gallery } = useGallery();

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-border">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent"></div>
        </div>

        <ParticleBackground />

        {/* Title — pure CSS text with gothic font */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <h1
              className="leading-tight select-none hero-gradient-title"
              style={{
                fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
                fontWeight: 900,
                fontSize: 'clamp(2.8rem, 8vw, 7rem)',
                color: 'transparent',
                backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #e8dcc8 40%, #c9a85c 75%, #8a6c2e 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 18px rgba(201,168,92,0.45)) drop-shadow(0 0 40px rgba(201,168,92,0.2)) drop-shadow(0 4px 12px rgba(0,0,0,0.9))',
                letterSpacing: '0.04em',
                lineHeight: 1.08,
              }}
            >
              The Radiance<br />of Darkness
            </h1>
            <p
              className="mt-4 tracking-[0.35em] uppercase"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 400,
                fontSize: 'clamp(0.65rem, 1.4vw, 0.9rem)',
                color: '#c9a85c',
                opacity: 0.85,
                letterSpacing: '0.38em',
              }}
            >
              By Pixel Alchemists
            </p>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-lg md:text-xl font-serif italic text-muted-foreground mt-2"
          >
            "{t.home.subtitle}"
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-6"
          >
            <Link href="/manga">
              <Button size="lg" className="hero-cta-btn h-14 px-8 text-lg font-display tracking-widest uppercase bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-black shadow-[0_0_20px_rgba(201,168,92,0.3)] hover:shadow-[0_0_30px_rgba(201,168,92,0.6)] transition-all duration-300">
                {t.home.cta}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground z-10"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent mx-auto mb-2"></div>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-4 bg-background relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-8">{t.home.introTitle}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.home.introText}
          </p>
        </div>
        <div className="ornamental-divider max-w-xl mx-auto"></div>
      </section>

      {/* ═══ INIZIA A LEGGERE — ch-card grid (HTML style) ═══ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative" style={{ background: 'hsl(240 25% 5%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-display text-[0.65rem] tracking-[0.5em] text-primary uppercase mb-3">
              {t.home.latestChapters}
            </div>
            <h2
              className="font-display text-foreground"
              style={{ fontSize: 'clamp(1.7rem, 3.5vw, 3rem)', lineHeight: 1.1 }}
            >
              {t.home.startReading ?? (isIT ? 'Inizia a Leggere' : 'Start Reading')}
            </h2>
            <div className="w-[50px] h-px bg-primary opacity-70 mx-auto my-5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHAPTER_PREVIEWS.map((ch, i) => {
              const title = isIT ? ch.titleIT : ch.titleEN;
              const desc = isIT ? ch.descIT : ch.descEN;
              const hasCover = !!ch.coverUrl;

              const Card = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className={
                    'group relative bg-card border border-border overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 ' +
                    (ch.available ? 'cursor-pointer' : 'opacity-75')
                  }
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-10" />

                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
                    {hasCover ? (
                      <>
                        <img
                          src={ch.coverUrl}
                          alt={title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          draggable={false}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/70 to-transparent pointer-events-none" />
                      </>
                    ) : (
                      <>
                        <div
                          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                          style={{ background: ch.gradient }}
                        />
                        <div
                          className="absolute font-display font-black leading-none z-10 select-none"
                          style={{
                            fontSize: '4.5rem',
                            color: 'rgba(200,168,75,0.1)',
                            bottom: '0.5rem',
                            right: '0.75rem',
                          }}
                        >
                          {ch.numLabel}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span
                            style={{
                              fontFamily: "'Noto Serif JP', serif",
                              fontSize: '5rem',
                              color: 'rgba(200,168,75,0.08)',
                            }}
                          >
                            {ch.number === 1 ? '零' : ch.number === 2 ? '影' : '盟'}
                          </span>
                        </div>
                      </>
                    )}
                    {!ch.available && (
                      <div className="absolute top-3 left-3 z-20">
                        <span className="font-display text-[0.55rem] tracking-[0.2em] text-primary/80 uppercase border border-primary/50 bg-background/80 px-2.5 py-1">
                          {t.manga.comingSoon}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="font-display text-[0.58rem] tracking-[0.3em] text-primary uppercase mb-1.5">
                      {t.manga.chapter} {ch.number}
                    </div>
                    {ch.seriesTitle ? (
                      <div className="mb-2">
                        <div className="font-display text-foreground text-lg sm:text-xl leading-tight">
                          {ch.seriesTitle}
                        </div>
                        <div className="font-display text-primary/85 text-sm leading-snug mt-1 italic">
                          : {title}
                        </div>
                      </div>
                    ) : (
                      <div className="font-display text-foreground text-base leading-tight mb-2 min-h-[1.5em]">
                        {title}
                      </div>
                    )}
                    <p className="text-muted-foreground text-[0.85rem] leading-[1.6] mb-4">
                      {desc}
                    </p>
                    {ch.available ? (
                      <span className="inline-block bg-primary text-black font-display text-[0.6rem] tracking-[0.2em] uppercase px-5 py-2 group-hover:bg-primary/90 transition-colors">
                        {isIT ? 'Leggi ora' : 'Read now'}
                      </span>
                    ) : (
                      <span className="inline-block border border-border text-muted-foreground/60 font-display text-[0.6rem] tracking-[0.2em] uppercase px-5 py-2">
                        {t.manga.comingSoon}
                      </span>
                    )}
                  </div>
                </motion.div>
              );

              return ch.available ? (
                <Link key={ch.id} href={`/reader/${ch.id}`} className="block">
                  {Card}
                </Link>
              ) : (
                <div key={ch.id}>{Card}</div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/manga">
              <Button className="bg-primary text-black hover:bg-primary/90 font-display tracking-[0.2em] uppercase text-xs h-11 px-7">
                {t.home.allChapters ?? (isIT ? 'Tutti i Capitoli' : 'All Chapters')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Art Gallery Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">{t.nav.gallery}</h2>
            <div className="w-24 h-[1px] bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery?.slice(0, 4).map((img, i) => (
              <div 
                key={img.id} 
                className={`relative rounded-xl overflow-hidden group ${i === 0 || i === 3 ? 'md:col-span-2 md:row-span-2 aspect-square' : 'aspect-[4/3]'}`}
              >
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-display tracking-widest">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/gallery">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                {t.home.galleryBtn}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
