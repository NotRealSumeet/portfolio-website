/* =========================================================
   Imports
========================================================= */

import { Project } from './types';
import dimensions from './assets/dimensions.json';
import thumbProjectThumb from './assets/projects/thumbnailproject/THUMB (1).jpg';

/* =========================================================
   Helper Functions
========================================================= */

const getBaseFilename = (url: string) => {
  const decoded = decodeURIComponent(url);
  const filename = decoded.split('/').pop() || '';
  // Support Vite hashes with underscores/hyphens (e.g., -D31_TP0I.jpg) and ignore casing
  return filename.replace(/-[a-zA-Z0-9_-]{7,}\.([a-zA-Z0-9]+)$/, '.$1').toLowerCase();
};

const lookupDimensions = (folder: keyof typeof dimensions, url: string) => {
  const filename = getBaseFilename(url);
  const projectDims = dimensions[folder] as Record<string, { width: number; height: number; aspectRatio: number }>;
  const dim = projectDims?.[filename];
  if (dim) {
    return {
      width: dim.width,
      height: dim.height,
      aspectRatioNumber: dim.aspectRatio,
    };
  }
  // Webm video fallback (not computed by node get_dimensions script)
  if (filename === 'animation.webm') {
    return {
      width: 1920,
      height: 1080,
      aspectRatioNumber: 1.77777778,
    };
  }
  return {};
};

const parseYear = (yearStr: string) => {
  const matches = yearStr.match(/\d+/g);
  if (!matches || matches.length === 0) return { min: 0, max: 0 };
  const nums = matches.map(Number);
  return {
    min: Math.min(...nums),
    max: Math.max(...nums)
  };
};

/* =========================================================
   Constants & Media Resolvers
========================================================= */

// CHICKEN LOGO (glob pattern — consistent with other projects)
const chickenLogoMediaFiles = (Object.values(
  import.meta.glob('./assets/projects/chickenlogo/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
) as string[]).sort((a, b) => {
  const matchA = a.match(/SLIDE\s*(\d+)/i);
  const matchB = b.match(/SLIDE\s*(\d+)/i);
  const numA = matchA ? parseInt(matchA[1], 10) : 0;
  const numB = matchB ? parseInt(matchB[1], 10) : 0;
  return numA - numB;
});

const project2thumb = chickenLogoMediaFiles[0] || '';

// WUKONG (glob pattern — consistent with other projects)
const wukongMediaFiles = (Object.values(
  import.meta.glob('./assets/projects/wukongtshirt/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
) as string[]).sort((a, b) => {
  // Sort by the leading number prefix (1-, 9-, 17-, 25-, 33-, 41-, 49-)
  const matchA = a.match(/(\d+)-indian/i);
  const matchB = b.match(/(\d+)-indian/i);
  const numA = matchA ? parseInt(matchA[1], 10) : 0;
  const numB = matchB ? parseInt(matchB[1], 10) : 0;
  return numA - numB;
});

const wukongThumb = wukongMediaFiles[0] || '';

const thumbnailProjectImages = (Object.values(
  import.meta.glob('./assets/projects/thumbnailproject/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
) as string[]).sort((a, b) => {
  const matchA = a.match(/\((\d+)\)/);
  const matchB = b.match(/\((\d+)\)/);
  const numA = matchA ? parseInt(matchA[1], 10) : 0;
  const numB = matchB ? parseInt(matchB[1], 10) : 0;
  return numA - numB;
});

// POSTER PROJECT
const posterProjectMediaFiles = (Object.values(
  import.meta.glob('./assets/projects/posterproject/*.{jpg,jpeg,png,webp,webm}', {
    eager: true,
    import: 'default',
  })
) as string[]);

const posterProjectThumb = posterProjectMediaFiles.find(
  (file) => getBaseFilename(file) === 'poster (1).jpg'
) || '';

const posterProjectWebm = posterProjectMediaFiles.find(
  (file) => getBaseFilename(file) === 'animation.webm'
) || '';

const posterProjectRemaining = posterProjectMediaFiles
  .filter((file) => {
    const filename = getBaseFilename(file);
    return filename !== 'poster (1).jpg' && filename !== 'animation.webm';
  })
  .sort((a, b) => {
    const matchA = a.match(/\((\d+)\)/);
    const matchB = b.match(/\((\d+)\)/);
    const numA = matchA ? parseInt(matchA[1], 10) : 0;
    const numB = matchB ? parseInt(matchB[1], 10) : 0;
    return numA - numB;
  });

// MUSIC COVER ART
const rajAlbumArtMediaFiles = (Object.values(
  import.meta.glob('./assets/projects/raj_albumart/*.{jpg,jpeg,png,webp,webm}', {
    eager: true,
    import: 'default',
  })
) as string[]);

const rajAlbumArtThumb = rajAlbumArtMediaFiles.find(
  (file) => getBaseFilename(file) === 'thumb.jpg'
) || '';

const rajAlbumArtRemaining = rajAlbumArtMediaFiles
  .filter((file) => getBaseFilename(file) !== 'thumb.jpg')
  .sort((a, b) => {
    const matchA = a.match(/\((\d+)\)/);
    const matchB = b.match(/\((\d+)\)/);
    const numA = matchA ? parseInt(matchA[1], 10) : 0;
    const numB = matchB ? parseInt(matchB[1], 10) : 0;
    return numA - numB;
  });

// 2TONE EP COVER ART (Nemo Album Art)
const nemoAlbumArtMediaFiles = (Object.values(
  import.meta.glob('./assets/projects/nemo_albumart/*.{jpg,jpeg,png,webp,webm}', {
    eager: true,
    import: 'default',
  })
) as string[]);

const nemoAlbumArtThumb = nemoAlbumArtMediaFiles.find(
  (file) => getBaseFilename(file) === 'nemo thumb.png'
) || '';

const nemoAlbumArtRemaining = nemoAlbumArtMediaFiles
  .filter((file) => getBaseFilename(file) !== 'nemo thumb.png')
  .sort((a, b) => {
    const matchA = a.match(/\((\d+)\)/);
    const matchB = b.match(/\((\d+)\)/);
    const numA = matchA ? parseInt(matchA[1], 10) : 0;
    const numB = matchB ? parseInt(matchB[1], 10) : 0;
    return numA - numB;
  });

// ED CRYPTO CAROUSELS
const carouselProjectMediaFiles = (Object.values(
  import.meta.glob('./assets/projects/carouselproject/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
) as string[]);

const sortByIndex = (files: string[]) => {
  return files.sort((a, b) => {
    const matchA = getBaseFilename(a).match(/\((\d+)\)/);
    const matchB = getBaseFilename(b).match(/\((\d+)\)/);
    const numA = matchA ? parseInt(matchA[1], 10) : 0;
    const numB = matchB ? parseInt(matchB[1], 10) : 0;
    return numA - numB;
  });
};

const cara1Files = sortByIndex(carouselProjectMediaFiles.filter((f) => getBaseFilename(f).startsWith('cara1')));
const cara2Files = sortByIndex(carouselProjectMediaFiles.filter((f) => getBaseFilename(f).startsWith('cara2')));
const cara3Files = sortByIndex(carouselProjectMediaFiles.filter((f) => getBaseFilename(f).startsWith('cara3')));
const cara4Files = sortByIndex(carouselProjectMediaFiles.filter((f) => getBaseFilename(f).startsWith('cara4') && getBaseFilename(f) !== 'cara4 (1).jpg'));
const cara5Files = sortByIndex(carouselProjectMediaFiles.filter((f) => getBaseFilename(f).startsWith('cara5')));

const carouselGroupFiles = [
  { title: 'CAROUSEL 01', files: cara1Files },
  { title: 'CAROUSEL 02', files: cara2Files },
  { title: 'CAROUSEL 03', files: cara3Files },
  ...(cara4Files.length > 0 ? [{ title: 'CAROUSEL 04', files: cara4Files }] : []),
  ...(cara5Files.length > 0 ? [{ title: 'CAROUSEL 05', files: cara5Files }] : []),
].filter((group) => group.files.length > 0);

const cryptoCarouselsGroups = carouselGroupFiles.map((group, groupIdx) => ({
  id: `carousel-group-${groupIdx + 1}`,
  title: group.title,
  slides: group.files.map((file, fileIdx) => ({
    id: `crypto-carousel-${groupIdx + 1}-${fileIdx + 1}`,
    type: 'image' as const,
    url: file,
    caption: '',
    ...lookupDimensions('carouselproject' as any, file),
  })),
}));

const cryptoCarouselsAllMedia = cryptoCarouselsGroups.flatMap((g) => g.slides);
const cryptoCarouselsThumb = cara1Files[0] || cryptoCarouselsAllMedia[0]?.url || '';

const RAW_PROJECTS_DATA: Project[] = [
  // ED CRYPTO CAROUSELS
  {
    id: 'crypto-carousels',
    title: 'ED CRYPTO CAROUSELS',
    subtitle: 'SAAS EDUCATION & SOCIAL DESIGN',
    category: 'CAROUSEL DESIGN',
    year: '2026',
    client: 'KoinX',
    role: 'Graphic Designer',
    services: [
      'Carousel Design',
      'Social Media Design',
      'Visual Storytelling',
      'Information Design'
    ],
    summary:
      'A series of modern SaaS carousels simplifying complex crypto and tax concepts through clean layouts, strong visual hierarchy, and educational storytelling.',
    about:
      'Designed for KoinX, this project focused on creating educational carousel content covering cryptocurrency, taxation, regulations, and product features. Each carousel was crafted to transform complex financial topics into clear, engaging, and visually accessible content using modern SaaS aesthetics, structured layouts, and data-driven visual communication.',
    thumbnailUrl: cryptoCarouselsThumb,
    aspectRatio: 'aspect-square',
    media: cryptoCarouselsAllMedia,
    carousels: cryptoCarouselsGroups,
  },

  // 2TONE EP COVER ART
  {
    id: '2tone-ep',
    title: '2TONE - COVER ART',
    subtitle: 'EP COVER ART & VISUAL DIRECTION',
    category: 'COVER ART DESIGN',
    year: '2026',
    client: 'Nemo Arpit',
    role: 'Graphic Designer',
    services: [
      'Cover Art Design',
      'Art Direction',
      'Photo Manipulation',
      'Music Visual Design'
    ],
    summary:
      'Cover artwork created for Nemo Arpit’s EP "2TONE", combining cinematic photography, dual-character storytelling, and contemporary music visuals.',
    about:
      'Designed for artist Nemo Arpit, 2TONE explores the contrast between two identities through fashion-driven imagery and cinematic visual storytelling. The artwork blends editorial photography, dramatic styling, luxury-inspired elements, and atmospheric color grading to create a distinct visual identity that reflects the EP’s themes of duality, emotion, and self-expression.',
    thumbnailUrl: nemoAlbumArtThumb,
    aspectRatio: 'aspect-square',
    media: nemoAlbumArtRemaining.map((img, index) => {
      const isVideo = getBaseFilename(img).endsWith('.webm');
      return {
        id: `nemo-albumart-${index}`,
        type: isVideo ? 'video' : 'image',
        url: img,
        caption: '',
        ...lookupDimensions('nemo_albumart', img),
      };
    }),
  },

  // MUSIC COVER ART
  {
    id: 'music-cover-art',
    title: 'JHUTH - COVER ART',
    subtitle: 'MUSIC DIGITAL ART',
    category: 'Cover Art Design',
    year: '2026',
    client: 'Raj Ranjan',
    role: 'Graphic Designer',
    services: [
      'Cover Art Design',
      'Photo Manipulation',
      'Visual Direction'
    ],
    summary:
      'A dark cinematic cover artwork designed for Raj Ranjan’s single “JHUTH”, blending emotional tension with surreal visual storytelling.',
    about:
      'Created for artist Raj Ranjan, the artwork for “JHUTH” explores themes of deception, emotional conflict, and fractured identity through minimalist staging and atmospheric lighting. The visual direction combines surreal character styling, cinematic composition, and moody color grading to create a striking music cover inspired by modern alternative and experimental album aesthetics.',
    thumbnailUrl: rajAlbumArtThumb,
    aspectRatio: 'aspect-square',
    media: rajAlbumArtRemaining.map((img, index) => {
      const isVideo = getBaseFilename(img).endsWith('.webm');
      return {
        id: `raj-albumart-${index}`,
        type: isVideo ? 'video' : 'image',
        url: img,
        caption: '',
        ...lookupDimensions('raj_albumart', img),
      };
    }),
  },

  // POSTER PROJECT
  {
    id: 'experimental-poster-design',
    title: 'VISUAL EXPERIMENTS',
    subtitle: 'POSTER DESIGN ARCHIVE',
    category: 'Poster Design',
    year: '2025',
    client: 'Self Initiated',
    role: 'Graphic Designer',
    services: [
      'Poster Design',
      'Art Direction',
      'Visual Experimentation'
    ],
    summary:
      'A collection of grunge, collage work, and visual design experiments exploring different moods, aesthetics, and storytelling styles.',
    about:
      'An ongoing archive of experimental poster designs created across music, film, gaming, internet culture, and conceptual themes. The project explores typography, color treatment, mixed media collage, cinematic compositions, and alternative visual storytelling through a wide range of graphic styles and digital art directions.',
    thumbnailUrl: posterProjectThumb,
    aspectRatio: 'aspect-square',
    media: [
      {
        id: 'poster-video',
        type: 'video' as const,
        url: posterProjectWebm,
        caption: '',
        ...lookupDimensions('posterproject', posterProjectWebm),
      },
      {
        id: 'poster-1',
        type: 'image' as const,
        url: posterProjectThumb,
        caption: '',
        ...lookupDimensions('posterproject', posterProjectThumb),
      },
      ...posterProjectRemaining.map((img, index) => ({
        id: `poster-${index + 2}`,
        type: 'image' as const,
        url: img,
        caption: '',
        ...lookupDimensions('posterproject', img),
      })),
    ],
  },

  // THUMBNAIL PROJECT
  {
    id: 'thumbnail-project',
    title: 'THUMBNAIL ARCHIVE',
    subtitle: 'YOUTUBE THUMBNAIL COLLECTION',
    category: 'Thumbnail Design',
    year: '2025-2026',
    client: 'Various',
    role: 'Graphic Designer',
    services: [
      'Thumbnail Design',
      'YouTube Packaging'
    ],
    summary: 'Collection of cinematic and high-retention thumbnail designs.',
    about: 'A collection of high-impact thumbnail designs created across multiple content niches including crypto, education, gaming, entertainment, and informational media. The project focused on building attention-grabbing visuals optimized for click-through performance through strong composition, bold typography, expressive imagery, and platform-driven visual storytelling.',
    thumbnailUrl: thumbProjectThumb,
    aspectRatio: 'aspect-square',
    media: [
      {
        id: 'thumb-hero',
        type: 'image' as const,
        url: thumbProjectThumb,
        caption: '',
        ...lookupDimensions('thumbnailproject', thumbProjectThumb),
      },
      ...thumbnailProjectImages
        .filter((img) => getBaseFilename(img) !== getBaseFilename(thumbProjectThumb))
        .map((img, index) => ({
          id: `thumb-${index}`,
          type: 'image' as const,
          url: img,
          caption: '',
          ...lookupDimensions('thumbnailproject', img),
        })),
    ],
  },

  // Unc's Fried chicken project
  {
    id: 'Unc-chicken',
    title: "Logo Design - Unc'S fried Chicken",
    subtitle: 'FAST FOOD BRAND LOGO DESIGN',
    category: 'Logo Design',
    year: '2026',
    client: "UNC'S Fried Chicken",
    role: 'Graphic Designer',
    services: [
      'Logo Design',
      'Brand Identity',
      'Mascot Design',
    ],
    summary: 'A playful fast-food brand identity built around a bold mascot, retro visuals, and oversized comfort-food culture.',
    about: "UNC'S Fried Chicken is a fast-food branding project inspired by viral fried chicken culture and modern snack branding aesthetics. The identity combines a humorous illustrated mascot with bold typography, warm retro-inspired colors, and expressive visual elements designed for packaging, social media, and promotional applications.",
    thumbnailUrl: project2thumb,
    aspectRatio: 'aspect-square',
    media: [
      {
        id: 'p-hero',
        type: 'image' as const,
        url: project2thumb,
        caption: '',
        ...lookupDimensions('chickenlogo', project2thumb)
      },
      ...chickenLogoMediaFiles.slice(1).map((img, index) => ({
        id: `p-${index + 1}`,
        type: 'image' as const,
        url: img,
        caption: '',
        ...lookupDimensions('chickenlogo', img)
      }))
    ]
  },

  // WUKONG T SHIRT 
  {
    id: 'wukong-tshirt',
    title: 'WUKONG T SHIRT',
    subtitle: 'INDIAN STREETWEAR CAMPAIGN',
    category: 'Fashion Design',
    year: '2025',
    client: 'Nosfera',
    role: 'Graphic Designer',
    services: [
      'Streetwear Design',
      'Branding',
      'Visual Direction'
    ],
    summary: 'A Wukong-inspired streetwear project combining apparel graphics, campaign visuals, packaging, and editorial fashion direction.',
    about: 'Designed for Nosfera, this project explored mythological storytelling through gothic streetwear aesthetics. The project included apparel design, posters, packaging, fashion edits, and social-ready campaign visuals built around a dark editorial identity.',
    thumbnailUrl: wukongThumb,
    aspectRatio: 'aspect-square',
    media: wukongMediaFiles.map((img, index) => ({
      id: `p-${index + 1}`,
      type: 'image' as const,
      url: img,
      caption: '',
      ...lookupDimensions('wukongtshirt', img)
    }))
  }
];

/* =========================================================
   Export
========================================================= */

export const PROJECTS_DATA: Project[] = [...RAW_PROJECTS_DATA].sort((a, b) => {
  const yearA = parseYear(a.year);
  const yearB = parseYear(b.year);

  if (yearB.max !== yearA.max) {
    return yearB.max - yearA.max;
  }
  return yearB.min - yearA.min;
});