import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageTransition } from '@/components/PageTransition';
import { CHAPTER_PREVIEWS } from '@/hooks/use-manga';

export default function MangaList() {
  const { t, language } = useLanguage();
  const isIT = language === 'IT';

  return (
    <PageTransition className="min-h-screen bg-background">

      {/* ═══ PAGE HEADER ═══ */}
      <div className="pt-32 pb-12 border-b border-border/40 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="font-display text-[0.65rem] tracking-[0.5em] text-primary uppercase mb-3">
            {t.manga.allEyebrow ?? (isIT ? "Archivio Manga" : "Manga Archive")}
          </div>
          <h1
            className="font-display text-foreground"
            style={{ fontSize: 'clamp(1.7rem, 3.5vw, 3rem)', lineHeight: 1.1 }}
          >
            {t.manga.title}
          </h1>
          <div className="w-[50px] h-px bg-primary opacity-70 mx-auto my-5" />
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2 text-base leading-[1.8]">
            {t.manga.archiveDesc}
          </p>
        </div>
      </div>

      {/* ═══ CH-CARD GRID ═══ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTER_PREVIEWS.map((ch) => {
            const title = isIT ? ch.titleIT : ch.titleEN;
            const desc = isIT ? ch.descIT : ch.descEN;
            const hasCover = !!ch.coverUrl;

            const Card = (
              <div
                className={
                  'group relative bg-card border border-border overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 ' +
                  (ch.available ? 'cursor-pointer' : 'opacity-75')
                }
              >
                {/* Top gold line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-10" />

                {/* Cover */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
                  {hasCover ? (
                    <>
                      {/* Real cover image */}
                      <img
                        src={ch.coverUrl}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        draggable={false}
                      />
                      {/* Subtle bottom-fade for text legibility on edge */}
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/70 to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                        style={{ background: ch.gradient }}
                      />
                      {/* Number overlay */}
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
                      {/* Faint kanji center */}
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
                  {/* "Prossimamente" badge if not available */}
                  {!ch.available && (
                    <div className="absolute top-3 left-3 z-20">
                      <span className="font-display text-[0.55rem] tracking-[0.2em] text-primary/80 uppercase border border-primary/50 bg-background/80 px-2.5 py-1">
                        {t.manga.comingSoon}
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
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
                    <button className="inline-block bg-primary text-black font-display text-[0.6rem] tracking-[0.2em] uppercase px-5 py-2 hover:bg-primary/90 transition-colors">
                      {isIT ? 'Leggi ora' : 'Read now'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="inline-block border border-border text-muted-foreground/60 font-display text-[0.6rem] tracking-[0.2em] uppercase px-5 py-2 cursor-not-allowed"
                    >
                      {t.manga.comingSoon}
                    </button>
                  )}
                </div>
              </div>
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

        {/* Footer note */}
        <p className="text-center text-muted-foreground/60 text-sm italic mt-12">
          {t.manga.comingDesc}
        </p>
      </div>
    </PageTransition>
  );
}
