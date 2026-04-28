import React, { useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageTransition } from '@/components/PageTransition';
import { Play, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import trailerSrc from '@assets/Upscaler-4K_-_Ultimate-Pixel_Alchemists_Studio_(1)_1777302330196.mp4';

export default function Trailer() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const handlePlay = () => {
    setStarted(true);
    setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 50);
  };

  return (
    <PageTransition className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-background relative">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 text-primary text-xs uppercase tracking-[0.3em]">
            <Film className="w-4 h-4" />
            <span>{t.trailer?.eyebrow ?? 'Capitolo 01'}</span>
            <Film className="w-4 h-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 text-glow">
            {t.trailer?.title ?? 'Trailer Ufficiale'}
          </h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.trailer?.desc ?? 'Guarda il trailer ufficiale del primo capitolo di The Radiance of Darkness.'}
          </p>
        </div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/10 bg-black aspect-video"
        >
          {!started ? (
            <button
              type="button"
              onClick={handlePlay}
              className="absolute inset-0 w-full h-full flex items-center justify-center group bg-gradient-to-br from-black via-zinc-900 to-black"
              aria-label={t.trailer?.playLabel ?? 'Riproduci trailer'}
            >
              {/* Decorative backdrop */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(207,164,84,0.25),transparent_60%)]"></div>
              </div>

              {/* Play button */}
              <div className="relative flex flex-col items-center gap-4 z-10">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30 shadow-lg shadow-primary/30">
                  <Play className="w-10 h-10 md:w-12 md:h-12 text-primary fill-primary ml-1.5" />
                </div>
                <span className="text-primary font-display text-lg md:text-xl tracking-widest uppercase">
                  {t.trailer?.watchNow ?? 'Guarda Ora'}
                </span>
              </div>
            </button>
          ) : (
            <video
              ref={videoRef}
              src={trailerSrc}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black"
            />
          )}
        </motion.div>

        {/* Footer caption */}
        <p className="text-center text-muted-foreground/60 text-xs mt-6 italic">
          {t.trailer?.caption ?? 'The Radiance of Darkness — Trailer Ufficiale del Capitolo 01 · Pixel Alchemists Studio'}
        </p>
      </div>
    </PageTransition>
  );
}
