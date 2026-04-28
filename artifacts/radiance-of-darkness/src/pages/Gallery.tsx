import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageTransition } from '@/components/PageTransition';
import { useGallery } from '@/hooks/use-manga';
import { X, ChevronLeft, ChevronRight, Pencil, ImageIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const FILTER_TYPES = ['filterAll', 'filterConcept', 'filterCharacter', 'filterIllustration'] as const;
const TYPE_MAP: Record<string, string> = {
  filterConcept: 'Concept Art',
  filterCharacter: 'Character',
  filterIllustration: 'Illustration',
  filterEnvironment: 'Environment',
};

// Hand-curated team sketches: 79 numbered drafts under public/images/sketches/
const SKETCH_COUNT = 79;
const TEAM_SKETCHES = Array.from({ length: SKETCH_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id: `sketch-${n}`,
    url: `${import.meta.env.BASE_URL}images/sketches/sketch-${n}.webp`,
    number: i + 1,
  };
});

export default function Gallery() {
  const { t } = useLanguage();
  const { data: images, isLoading } = useGallery();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sketchIndex, setSketchIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<typeof FILTER_TYPES[number]>('filterAll');

  // AI / concept gallery: existing AI-generated artwork (excludes sketches).
  const aiImages = images?.filter(img => img.type !== 'Sketch') ?? [];

  const filteredImages = aiImages.filter(img => {
    if (activeFilter === 'filterAll') return true;
    const target = TYPE_MAP[activeFilter];
    return img.type === target || (activeFilter === 'filterConcept' && img.type === 'Environment');
  });

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex(i => (i !== null && i > 0 ? i - 1 : (filteredImages.length - 1)));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex(i => (i !== null && i < filteredImages.length - 1 ? i + 1 : 0));
  };

  const handleSketchPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSketchIndex(i => (i !== null && i > 0 ? i - 1 : TEAM_SKETCHES.length - 1));
  };
  const handleSketchNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSketchIndex(i => (i !== null && i < TEAM_SKETCHES.length - 1 ? i + 1 : 0));
  };

  return (
    <PageTransition className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-background relative">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 text-glow">{t.gallery.title}</h1>
          <div className="w-24 h-[1px] bg-primary mx-auto"></div>
        </div>

        {/* ──────────── BOZZE / SKETCHES SECTION ──────────── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display text-foreground">
              {t.gallery.sketchTitle ?? 'Bozze di Creazione'}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-3xl mb-6 leading-relaxed">
            {t.gallery.sketchDesc ?? 'Schizzi e bozze del team Pixel Alchemists.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {TEAM_SKETCHES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSketchIndex(idx)}
                className="relative group rounded-lg overflow-hidden aspect-square border border-border/50 hover:border-primary/60 transition-colors bg-card/40"
              >
                <img
                  src={s.url}
                  alt={`Bozza ${s.number}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-2 left-2 text-primary font-display text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  #{String(s.number).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Ornamental divider between the two sections */}
        <div className="ornamental-divider mb-16"></div>

        {/* ──────────── AI / CONCEPT GALLERY SECTION ──────────── */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display text-foreground">
              {t.gallery.aiTitle ?? 'Galleria Artistica'}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-3xl mb-8 leading-relaxed">
            {t.gallery.aiDesc ?? 'Concept art e illustrazioni del Mondo Dipinto.'}
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {FILTER_TYPES.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  activeFilter === f
                    ? 'bg-primary text-black border-primary'
                    : 'border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary'
                }`}
              >
                {t.gallery[f]}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              [...Array(12)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-xl w-full h-56"></div>
              ))
            ) : (
              filteredImages.map((img, index) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative group rounded-xl overflow-hidden cursor-pointer h-56"
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-primary text-[10px] font-bold uppercase tracking-wider mb-1">{img.type}</span>
                    <h3 className="text-white font-display text-sm leading-tight">{img.title}</h3>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {filteredImages.length === 0 && !isLoading && (
            <div className="text-center py-16 text-muted-foreground">{t.reader.loading}</div>
          )}
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-10"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={filteredImages[selectedIndex].url}
              alt={filteredImages[selectedIndex].title}
              className="max-h-[85vh] max-w-[80vw] object-contain shadow-2xl rounded-lg"
              onClick={e => e.stopPropagation()}
            />

            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-10"
              onClick={handleNext}
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div className="absolute bottom-8 text-center" onClick={e => e.stopPropagation()}>
              <h3 className="text-white font-display text-xl">{filteredImages[selectedIndex].title}</h3>
              <p className="text-primary text-sm mt-1 uppercase tracking-widest">{filteredImages[selectedIndex].type}</p>
              <p className="text-muted-foreground/50 text-xs mt-2">{selectedIndex + 1} / {filteredImages.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sketch Lightbox */}
      <AnimatePresence>
        {sketchIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setSketchIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
              onClick={() => setSketchIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-10"
              onClick={handleSketchPrev}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <motion.img
              key={sketchIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={TEAM_SKETCHES[sketchIndex].url}
              alt={`Bozza ${TEAM_SKETCHES[sketchIndex].number}`}
              className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl rounded-lg"
              onClick={e => e.stopPropagation()}
            />

            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-10"
              onClick={handleSketchNext}
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div className="absolute bottom-8 text-center" onClick={e => e.stopPropagation()}>
              <p className="text-primary text-sm uppercase tracking-widest">
                {t.gallery.sketchTitle ?? 'Bozza'} #{String(TEAM_SKETCHES[sketchIndex].number).padStart(2, '0')}
              </p>
              <p className="text-muted-foreground/50 text-xs mt-2">
                {sketchIndex + 1} / {TEAM_SKETCHES.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
