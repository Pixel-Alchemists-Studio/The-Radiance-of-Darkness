import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageTransition } from '@/components/PageTransition';
import { useCharacters } from '@/hooks/use-manga';
import { Shield, Skull, Sun } from 'lucide-react';

export default function Universe() {
  const { t } = useLanguage();
  const { data: characters, isLoading } = useCharacters();

  const storyParagraphs = [
    t.universe.historyText1,
    t.universe.historyText2,
    t.universe.historyText3,
    t.universe.historyText4,
  ].filter((p): p is string => Boolean(p && p.trim().length > 0));

  return (
    <PageTransition className="pt-32 pb-24 min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-secondary/10 to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 text-glow">{t.universe.title}</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.universe.intro}
          </p>
        </div>

        {/* History / Story Section — full plot from Storia.docx */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-primary"></div>
            <h2 className="text-3xl font-display text-foreground">{t.universe.history}</h2>
          </div>
          <div className="bg-card/50 border border-border/50 p-8 md:p-12 rounded-2xl glass-panel">
            {storyParagraphs.map((para, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="my-8 flex items-center gap-4 opacity-40">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                    <span className="text-primary/60 font-display text-xs tracking-widest">✦</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                  </div>
                )}
                <p className="text-lg text-muted-foreground leading-loose">
                  {para}
                </p>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Factions Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12 justify-end text-right">
            <h2 className="text-3xl font-display text-foreground">{t.universe.factions}</h2>
            <div className="w-12 h-[2px] bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border/50 p-8 rounded-2xl hover:border-primary/50 transition-colors text-center group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Sun className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display text-white mb-4">{t.universe.factionOrder}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t.universe.factionOrderDesc}</p>
            </div>

            <div className="bg-card border border-border/50 p-8 rounded-2xl hover:border-secondary/50 transition-colors text-center group">
              <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/40 transition-colors">
                <Skull className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-display text-white mb-4">{t.universe.factionVoid}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t.universe.factionVoidDesc}</p>
            </div>

            <div className="bg-card border border-border/50 p-8 rounded-2xl hover:border-accent/50 transition-colors text-center group">
              <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/40 transition-colors">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-display text-white mb-4">{t.universe.factionLost}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t.universe.factionLostDesc}</p>
            </div>
          </div>
        </section>

        {/* Characters Section */}
        <section>
          <div className="flex items-center gap-4 mb-12 text-center justify-center">
            <div className="w-8 h-[2px] bg-primary"></div>
            <h2 className="text-3xl font-display text-foreground">{t.universe.characters}</h2>
            <div className="w-8 h-[2px] bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isLoading ? (
              <div className="col-span-2 text-center text-muted-foreground animate-pulse py-12">{t.universe.loading}</div>
            ) : (
              characters?.map(char => (
                <div key={char.id} className="flex flex-col sm:flex-row gap-6 bg-card border border-border/30 rounded-2xl overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="w-full sm:w-2/5 aspect-[3/4] sm:aspect-auto shrink-0 overflow-hidden">
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2">{char.role}</span>
                    <h3 className="text-3xl font-display text-white mb-4">{char.name}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{char.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
