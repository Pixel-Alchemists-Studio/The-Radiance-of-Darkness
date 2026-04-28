import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRoute } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChapter, useChapters } from '@/hooks/use-manga';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Maximize, LayoutList, BookOpen } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import { BookModel3D } from '@/components/BookModel3D';

type ReadMode = 'scroll' | 'book';
type LeafKind = 'cover-front' | 'cover-back' | 'left' | 'right';

interface BookLeaf {
  src: string;
  kind: LeafKind;
  label?: string;
}

interface BookPageProps {
  leaf: BookLeaf;
  pageNumber?: number;
}

/**
 * BookPage — one leaf of the flipbook.
 * - 'cover-front' / 'cover-back' : show the cover image full inside the page rectangle
 * - 'left' / 'right' : show only that half of the underlying spread image
 *   (we use object-fit/object-position so the source spread is never re-encoded).
 */
const BookPage = React.forwardRef<HTMLDivElement, BookPageProps>(({ leaf, pageNumber }, ref) => {
  const isCover = leaf.kind === 'cover-front' || leaf.kind === 'cover-back';

  return (
    <div
      ref={ref}
      className={`book-leaf ${isCover ? 'book-leaf--cover' : 'book-leaf--inner'}`}
      style={{
        background: isCover ? '#000' : '#0a0a0f',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)',
      }}
    >
      {isCover ? (
        <img
          src={leaf.src}
          alt={leaf.label ?? 'Cover'}
          draggable={false}
          className="w-full h-full object-contain select-none pointer-events-none"
        />
      ) : (
        // Show only the left or right half of the spread image
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={leaf.src}
            alt={leaf.label ?? `Page ${pageNumber}`}
            draggable={false}
            className="absolute top-0 h-full max-w-none select-none pointer-events-none"
            style={{
              // The image is ~1.55:1 (a 2-page spread). The page rectangle is ~0.77:1.
              // So image height = page height; image width = page width × 2.
              width: '200%',
              left: leaf.kind === 'left' ? '0' : '-100%',
            }}
          />
          {/* Subtle gutter shadow towards the spine */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-12"
            style={{
              [leaf.kind === 'left' ? 'right' : 'left']: 0,
              background:
                leaf.kind === 'left'
                  ? 'linear-gradient(to right, transparent, rgba(0,0,0,0.45))'
                  : 'linear-gradient(to left, transparent, rgba(0,0,0,0.45))',
            }}
          />
          {pageNumber !== undefined && (
            <span
              className="absolute bottom-2 text-[10px] font-display tracking-widest text-white/40 pointer-events-none"
              style={leaf.kind === 'left' ? { left: 12 } : { right: 12 }}
            >
              {pageNumber}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
BookPage.displayName = 'BookPage';

export default function Reader() {
  const [, params] = useRoute('/reader/:id');
  const chapterId = params?.id ? parseInt(params.id) : 1;
  const { t } = useLanguage();

  const { data: chapter, isLoading } = useChapter(chapterId);
  const { data: allChapters } = useChapters();

  const [mode, setMode] = useState<ReadMode>('book');
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);

  useEffect(() => { setCurrentPage(0); }, [chapterId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Keyboard navigation in book mode
  useEffect(() => {
    if (mode !== 'book') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') bookRef.current?.pageFlip()?.flipNext();
      if (e.key === 'ArrowLeft') bookRef.current?.pageFlip()?.flipPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode]);

  const hasBook = !!(chapter as any)?.coverFrontUrl && !!(chapter as any)?.coverBackUrl;
  const coverFront = (chapter as any)?.coverFrontUrl as string | undefined;
  const coverBack = (chapter as any)?.coverBackUrl as string | undefined;
  const coverSpine = (chapter as any)?.coverSpineUrl as string | undefined;

  // Build leaves: front cover → for each spread [left half, right half] → back cover
  const bookLeaves: BookLeaf[] = useMemo(() => {
    if (!hasBook || !chapter) return [];
    const leaves: BookLeaf[] = [{ src: coverFront!, kind: 'cover-front', label: 'Copertina' }];
    chapter.pageUrls.forEach((url, idx) => {
      const spreadNum = idx + 1;
      leaves.push({ src: url, kind: 'left', label: `Pagina ${spreadNum * 2 - 1}` });
      leaves.push({ src: url, kind: 'right', label: `Pagina ${spreadNum * 2}` });
    });
    leaves.push({ src: coverBack!, kind: 'cover-back', label: 'Retro' });
    return leaves;
  }, [hasBook, chapter, coverFront, coverBack]);

  if (isLoading || !chapter) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-primary">{t.reader.loading}</div>;
  }

  const totalLeaves = bookLeaves.length;
  const isOnFrontCover = currentPage === 0;
  const isOnBackCover = currentPage >= totalLeaves - 1;

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 flex flex-col pt-20">

      {/* Reader Toolbar */}
      <div className={`fixed top-20 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-y border-border/50 p-2 flex flex-wrap items-center justify-between gap-4 transition-transform duration-300 ${isFullscreen ? '-translate-y-full' : 'translate-y-0'}`}>

        <div className="flex items-center gap-2">
          <Select
            value={chapterId.toString()}
            onValueChange={(val) => window.location.href = `/reader/${val}`}
          >
            <SelectTrigger className="w-[200px] bg-background border-border">
              <SelectValue placeholder="Seleziona Capitolo" />
            </SelectTrigger>
            <SelectContent>
              {allChapters?.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.title ? `Capitolo ${c.number}: ${c.title}` : `Capitolo ${c.number}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 bg-background rounded-lg p-1 border border-border">
          <Button
            variant={mode === 'book' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setMode('book')}
            className="text-xs"
            disabled={!hasBook}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {t.reader.pageMode}
          </Button>
          <Button
            variant={mode === 'scroll' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setMode('scroll')}
            className="text-xs"
          >
            <LayoutList className="w-4 h-4 mr-2" />
            {t.reader.scrollMode}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Floating 3D book mockup — top right */}
      {hasBook && coverSpine && !isFullscreen && (
        <div
          className="hidden md:block fixed z-30"
          style={{ top: '9rem', right: '1.25rem' }}
          title="Anteprima 3D del volume — fronte, dorso, retro"
        >
          <div className="flex flex-col items-center gap-1 bg-card/70 backdrop-blur-md border border-border/40 rounded-lg px-4 pt-5 pb-3 shadow-xl">
            <BookModel3D
              frontSrc={coverFront!}
              backSrc={coverBack!}
              spineSrc={coverSpine}
              width={130}
              height={180}
              depth={32}
            />
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70 mt-3">
              Volume 1
            </span>
          </div>
        </div>
      )}

      {/* Reader Content */}
      <div className={`flex-1 mt-14 ${mode === 'book' ? 'overflow-hidden' : 'overflow-auto pb-20'}`}>
        {mode === 'scroll' || !hasBook ? (
          // SCROLL MODE — vertical, all spreads end-to-end
          <div className="flex flex-col items-center gap-4 py-8 max-w-[100vw] overflow-hidden">
            {hasBook && (
              <img src={coverFront} alt="Front Cover" className="w-[60%] max-w-[700px] shadow-2xl rounded-sm border border-border/30" loading="lazy" />
            )}
            {chapter.pageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Page ${idx + 1}`}
                className="w-[95%] max-w-[1400px] shadow-2xl bg-background"
                loading="lazy"
              />
            ))}
            {hasBook && (
              <img src={coverBack} alt="Back Cover" className="w-[60%] max-w-[700px] shadow-2xl rounded-sm border border-border/30" loading="lazy" />
            )}
          </div>
        ) : (
          // BOOK / FLIPBOOK MODE — real digital book with page-turn animation
          <div
            className="flex flex-col items-center justify-center px-2 sm:px-6 py-6 select-none"
            style={{ minHeight: 'calc(100vh - 9rem)' }}
          >
            <div className="relative w-full flex justify-center">
              <HTMLFlipBook
                ref={bookRef}
                width={420}
                height={580}
                size="fixed"
                minWidth={300}
                maxWidth={500}
                minHeight={400}
                maxHeight={680}
                maxShadowOpacity={0.7}
                showCover={true}
                usePortrait={false}
                flippingTime={750}
                drawShadow={true}
                mobileScrollSupport={true}
                startPage={0}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                className="manga-book"
                style={{ margin: '0 auto' }}
                onFlip={(e: any) => setCurrentPage(e.data)}
              >
                {bookLeaves.map((leaf, i) => (
                  <BookPage
                    key={i}
                    leaf={leaf}
                    pageNumber={
                      leaf.kind === 'left' || leaf.kind === 'right' ? i : undefined
                    }
                  />
                ))}
              </HTMLFlipBook>
            </div>

            {/* Hint */}
            <p className="text-muted-foreground/50 text-xs mt-6 italic tracking-wide text-center">
              {isOnFrontCover
                ? '← Clicca sull\'angolo o trascina per aprire il libro →'
                : isOnBackCover
                  ? 'Fine del Capitolo · Pixel Alchemists'
                  : 'Clicca sui bordi o trascina gli angoli per girare pagina · ← →'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation (Book Mode Only) */}
      {mode === 'book' && hasBook && !isFullscreen && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border p-3 flex items-center justify-center gap-6 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
            disabled={isOnFrontCover}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t.reader.prev}
          </Button>
          <span className="font-display text-sm sm:text-base">
            {isOnFrontCover ? (
              <span className="text-primary uppercase tracking-widest text-xs">Copertina</span>
            ) : isOnBackCover ? (
              <span className="text-primary uppercase tracking-widest text-xs">Retro</span>
            ) : (
              <>
                <span className="text-primary">{currentPage}</span>
                <span className="text-muted-foreground"> / {totalLeaves - 2}</span>
              </>
            )}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => bookRef.current?.pageFlip()?.flipNext()}
            disabled={isOnBackCover}
          >
            {t.reader.next}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
