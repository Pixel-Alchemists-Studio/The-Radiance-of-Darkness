import { useQuery } from "@tanstack/react-query";

export interface Chapter {
  id: number;
  number: number;
  title: string;
  description: string;
  pages: number;
  coverUrl: string;
}

export interface ArtImage {
  id: number;
  url: string;
  title: string;
  type: string;
}

export interface Character {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

const BASE = import.meta.env.BASE_URL;

// Chapter 1: 32 spread pages (each image is a 2-page spread) + wrap-around cover (front + back)
const CHAPTER_1_PAGE_COUNT = 32;
const CHAPTER_1_PAGES = Array.from({ length: CHAPTER_1_PAGE_COUNT }, (_, i) =>
  `${BASE}manga/chapter-1/page-${String(i).padStart(2, '0')}.webp`
);
const CHAPTER_1_COVER_FRONT = `${BASE}manga/chapter-1/cover-front.webp`;
const CHAPTER_1_COVER_BACK = `${BASE}manga/chapter-1/cover-back.webp`;
const CHAPTER_1_COVER_SPINE = `${BASE}manga/chapter-1/cover-spine.webp`;

const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 1, number: 1,
    title: "",
    description: "Il Senzanome risorge tra le rovine del Mondo Dipinto. Una scintilla fragile, un accordo oscuro, e una missione che nessun uomo sano di mente accetterebbe.",
    pages: CHAPTER_1_PAGE_COUNT, coverUrl: CHAPTER_1_COVER_FRONT
  },
];

const MOCK_GALLERY: ArtImage[] = [
  { id: 1,  url: `${BASE}images/concept-1.png`,  title: "La Cattedrale delle Vette",     type: "Concept Art"   },
  { id: 2,  url: `${BASE}images/concept-2.png`,  title: "Il Campo della Dissoluzione",   type: "Environment"   },
  { id: 3,  url: `${BASE}images/char-1.png`,     title: "Il Senzanome",                  type: "Character"     },
  { id: 4,  url: `${BASE}images/char-2.png`,     title: "La Pittrice",                   type: "Character"     },
  { id: 5,  url: CHAPTER_1_COVER_FRONT,           title: "Capitolo 1 — Cover",            type: "Illustration"  },
  { id: 6,  url: `${BASE}images/hero-bg.png`,    title: "Il Mondo Dipinto",              type: "Concept Art"   },
  { id: 7,  url: `${BASE}images/concept-1.png`,  title: "Le Zone Corrotte",              type: "Environment"   },
  { id: 8,  url: `${BASE}images/concept-2.png`,  title: "I Margini della Tela",          type: "Concept Art"   },
];

const MOCK_CHARACTERS: Character[] = [
  {
    id: 1, name: "Il Senzanome", role: "Protagonista",
    description: "Un giovane guerriero privo di identità che porta con sé una fragile scintilla di luce. Ha accettato l'accordo con la Pittrice senza comprendere il peso di ciò che lo aspetta. La sua forza cresce con la disperazione — ma la sua anima è il prezzo finale.",
    imageUrl: `${BASE}images/character-senzanome.webp`
  },
  {
    id: 2, name: "La Pittrice", role: "Personaggio Fondamentale · Antagonista in Parte",
    description: "La ragazza che attende nella cattedrale innevata. Custode della visione del Mondo Dipinto e del segreto per restaurarlo, è il fulcro dell'intera vicenda. Il suo scopo nobile — offrire una nuova casa ai sopravvissuti — si scontra con la fredda determinazione dei mezzi che sceglie. Non è un'antagonista nel senso classico, ma il suo sguardo glaciale rivela che il prezzo della Radianza potrebbe essere il Senzanome stesso.",
    imageUrl: `${BASE}images/character-pittrice.webp`
  },
];

const generatePlaceholderPages = (numPages: number) =>
  Array.from({ length: numPages }).map((_, i) => {
    const svg = `
      <svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0a0a0f"/>
        <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#c9a85c" stroke-width="2" stroke-dasharray="10 5"/>
        <text x="50%" y="540" font-family="Cinzel Decorative, serif" font-size="44" fill="#c9a85c" text-anchor="middle">CAPITOLO 1</text>
        <text x="50%" y="610" font-family="Cinzel, serif" font-size="22" fill="#888" text-anchor="middle">Materiale in arrivo</text>
        <text x="50%" y="670" font-family="EB Garamond, serif" font-style="italic" font-size="18" fill="#65615a" text-anchor="middle">Le tavole originali del manga saranno presto inserite qui.</text>
        <text x="50%" y="1100" font-family="Cinzel, serif" font-size="14" fill="#444" text-anchor="middle">Pixel Alchemists — The Radiance of Darkness</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  });

export function useChapters() {
  return useQuery({
    queryKey: ['chapters'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 400));
      return MOCK_CHAPTERS;
    }
  });
}

export interface ChapterPreview {
  id: number;
  number: number;
  numLabel: string;
  titleIT: string;
  titleEN: string;
  /** Optional series/volume name shown ABOVE the chapter title (e.g. "The Radiance of Darkness"). */
  seriesTitle?: string;
  descIT: string;
  descEN: string;
  available: boolean;
  gradient: string;
  /** Optional real cover image. When present, the card shows it instead of the placeholder gradient/kanji. */
  coverUrl?: string;
}

export const CHAPTER_PREVIEWS: ChapterPreview[] = [
  {
    id: 1, number: 1, numLabel: "01",
    titleIT: "L'Evocazione del Vuoto",
    titleEN: "The Summoning of the Void",
    seriesTitle: "The Radiance of Darkness",
    descIT: "Il Senzanome risorge tra le rovine del Mondo Dipinto. Una scintilla fragile, un accordo oscuro, e una missione che nessun uomo sano di mente accetterebbe.",
    descEN: "The Nameless rises among the ruins of the Painted World. A fragile spark, a dark pact, and a mission no sane person would accept.",
    available: true,
    gradient: "linear-gradient(160deg, #1a0a3a, #050810)",
    coverUrl: CHAPTER_1_COVER_FRONT
  },
  {
    id: 2, number: 2, numLabel: "02",
    titleIT: "Le Ombre Parlano",
    titleEN: "The Shadows Speak",
    descIT: "Il Senzanome trova finalmente lo Zio — ma ciò che trova è ben più terribile di ciò che si aspettava. Sangue sui campi. Occhi trasfigurati. E la follia di chi ha già varcato il limite.",
    descEN: "The Nameless finally finds the Uncle — but what he finds is far more terrible than what he expected. Blood on the fields. Transfigured eyes. The madness of one who has already crossed the threshold.",
    available: false,
    gradient: "linear-gradient(160deg, #0a0f2e, #150508)"
  },
  {
    id: 3, number: 3, numLabel: "03",
    titleIT: "Il Patto dell'Alba",
    titleEN: "The Dawn Pact",
    descIT: "La verità viene svelata nella cattedrale silenziosa. La Pittrice abbassa il pennello. E il Senzanome comprende che il vero Vaso è sempre stato lui.",
    descEN: "The truth is revealed in the silent cathedral. The Painter lowers her brush. And the Nameless understands that the true Vessel has always been him.",
    available: false,
    gradient: "linear-gradient(160deg, #1a1200, #050810)"
  },
];

export function useChapter(id: number) {
  return useQuery({
    queryKey: ['chapter', id],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 400));
      const chapter = MOCK_CHAPTERS.find(c => c.id === id);
      if (!chapter) throw new Error("Chapter not found");
      // Chapter 1 has real spread pages + wrap-around cover (front + back)
      if (chapter.id === 1) {
        return {
          ...chapter,
          pageUrls: CHAPTER_1_PAGES,
          coverFrontUrl: CHAPTER_1_COVER_FRONT,
          coverBackUrl: CHAPTER_1_COVER_BACK,
          coverSpineUrl: CHAPTER_1_COVER_SPINE,
        };
      }
      return { ...chapter, pageUrls: generatePlaceholderPages(chapter.pages) };
    }
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 400));
      return MOCK_GALLERY;
    }
  });
}

export function useCharacters() {
  return useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 400));
      return MOCK_CHARACTERS;
    }
  });
}
