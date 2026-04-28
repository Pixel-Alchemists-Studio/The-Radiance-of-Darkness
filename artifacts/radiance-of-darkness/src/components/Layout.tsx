import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/i18n';
import { Menu, X, ChevronDown, Globe, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const LANG_LABELS: Record<Language, string> = {
  IT: 'Italiano', EN: 'English', FR: 'Français', DE: 'Deutsch', ES: 'Español',
  JA: '日本語', KO: '한국어', PT: 'Português', ZH: '中文',
  RU: 'Русский', AR: 'العربية', NL: 'Nederlands', PL: 'Polski'
};
const ALL_LANGUAGES: Language[] = ['IT', 'EN', 'FR', 'DE', 'ES', 'PT', 'NL', 'PL', 'RU', 'JA', 'KO', 'ZH', 'AR'];

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();

  // ──────── Pixel Mode ────────
  const [pixelMode, setPixelMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('rod-pixel-mode') === '1';
  });
  // Toast displayed briefly when pixelMode toggles
  const [pixelToast, setPixelToast] = useState<{ on: boolean; key: number } | null>(null);
  const pixelFirstMount = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    if (pixelMode) {
      root.classList.add('pixel-mode');
      window.localStorage.setItem('rod-pixel-mode', '1');
    } else {
      root.classList.remove('pixel-mode');
      window.localStorage.setItem('rod-pixel-mode', '0');
    }
    // Skip the very first run (mount) so we don't flash the toast on page load
    if (pixelFirstMount.current) {
      pixelFirstMount.current = false;
      return;
    }
    const key = Date.now();
    setPixelToast({ on: pixelMode, key });
    const timer = setTimeout(() => {
      setPixelToast(curr => (curr && curr.key === key ? null : curr));
    }, 1600);
    return () => clearTimeout(timer);
  }, [pixelMode]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/trailer', label: t.nav.trailer ?? 'Trailer' },
    { href: '/manga', label: t.nav.manga },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/universe', label: t.nav.universe },
    { href: '/studio', label: t.nav.studio },
    { href: '/contact', label: t.nav.contact },
  ];

  const LogoImage = ({ size }: { size: number }) => (
    <div
      className="flex-shrink-0 rounded-full overflow-hidden border-2 border-primary/50 shadow-lg shadow-primary/20"
      style={{ width: size, height: size, background: '#ffffff' }}
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
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-lg shadow-black/50 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <LogoImage size={40} />
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors tracking-wide">
                  The Radiance of Darkness
                </span>
                <span className="text-[10px] text-primary/70 tracking-widest uppercase font-medium">
                  By Pixel Alchemists
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? 'text-primary text-glow' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-semibold">{language}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border min-w-[140px]">
                  {ALL_LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`cursor-pointer flex items-center gap-2 ${language === lang ? 'text-primary bg-primary/10' : ''}`}
                    >
                      <span className="text-xs font-bold text-muted-foreground/60 w-6">{lang}</span>
                      <span>{LANG_LABELS[lang]}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Pixel Mode toggle (top-right) */}
              <button
                onClick={() => setPixelMode(p => !p)}
                title={pixelMode ? (t.ui?.pixelOff ?? 'Pixel Mode OFF') : (t.ui?.pixelOn ?? 'Pixel Mode ON')}
                aria-label={pixelMode ? 'Disattiva modalità pixel' : 'Attiva modalità pixel'}
                className={`pixel-toggle-btn px-3 py-1.5 text-[10px] font-bold uppercase flex items-center gap-1.5 rounded ${pixelMode ? 'active' : ''}`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>PIXEL</span>
              </button>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile pixel toggle */}
              <button
                onClick={() => setPixelMode(p => !p)}
                title={pixelMode ? 'Pixel Mode OFF' : 'Pixel Mode ON'}
                className={`pixel-toggle-btn px-2 py-1 text-[10px] font-bold uppercase flex items-center gap-1 rounded ${pixelMode ? 'active' : ''}`}
              >
                <Gamepad2 className="w-3 h-3" />
              </button>
              <button
                className="text-foreground p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-display font-medium text-foreground border-b border-border/50 pb-4"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-wrap gap-2 mt-4">
              {ALL_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    language === lang ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pixel-mode toggle toast */}
      <AnimatePresence>
        {pixelToast && (
          <motion.div
            key={pixelToast.key}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pixel-toast fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-4"
          >
            <div className={`pixel-toast-card ${pixelToast.on ? 'on' : 'off'}`}>
              <span className="pixel-toast-icon" aria-hidden>{pixelToast.on ? '▶' : '■'}</span>
              <span className="pixel-toast-text">
                {pixelToast.on ? (t.ui?.pixelOn ?? 'PIXEL MODE ON') : (t.ui?.pixelOff ?? 'PIXEL MODE OFF')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col relative z-10">{children}</main>

      <footer className="border-t border-border bg-card relative z-10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <LogoImage size={48} />
                <div className="flex flex-col leading-tight">
                  <span className="font-display font-bold text-lg">The Radiance of Darkness</span>
                  <span className="text-[10px] text-primary/60 tracking-widest uppercase">By Pixel Alchemists</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm max-w-sm italic">"{t.home.subtitle}"</p>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs text-muted-foreground uppercase tracking-widest">{t.footer.followUs}:</span>
                {['X', 'IG', 'TT'].map((s) => (
                  <div key={s} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer text-[10px] font-bold">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display font-semibold mb-4 text-foreground">{t.footer.explore}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/manga" className="hover:text-primary transition-colors">{t.nav.manga}</Link></li>
                <li><Link href="/universe" className="hover:text-primary transition-colors">{t.nav.universe}</Link></li>
                <li><Link href="/gallery" className="hover:text-primary transition-colors">{t.nav.gallery}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold mb-4 text-foreground">Pixel Alchemists</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/studio" className="hover:text-primary transition-colors">{t.nav.studio}</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">{t.nav.contact}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Pixel Alchemists — ITIS E. Fermi, Fuscaldo (CS) · 4°B — Arcuri F.F. · Lanza A.F. · Ianni A. · Mannarino T. · {t.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
