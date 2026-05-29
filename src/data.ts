/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// LOGO UNC

import { Project } from './types';
import dimensions from './assets/dimensions.json';

import project2thumb from './assets/projects/chickenlogo/SLIDE 1.jpg';

import project2image1 from './assets/projects/chickenlogo/SLIDE 2.jpg';
import project2image2 from './assets/projects/chickenlogo/SLIDE 3.jpg';
import project2image3 from './assets/projects/chickenlogo/SLIDE 4.jpg';
import project2image4 from './assets/projects/chickenlogo/SLIDE 5.jpg';
import project2image5 from './assets/projects/chickenlogo/SLIDE 6.jpg';

// WUKONG 
import thumb from './assets/projects/wukongtshirt/1-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';

import image1 from './assets/projects/wukongtshirt/1-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image2 from './assets/projects/wukongtshirt/9-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image3 from './assets/projects/wukongtshirt/17-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image4 from './assets/projects/wukongtshirt/25-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image5 from './assets/projects/wukongtshirt/33-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image6 from './assets/projects/wukongtshirt/41-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image7 from './assets/projects/wukongtshirt/49-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';

// THUMBNAIL

import thumbProjectThumb from './assets/projects/thumbnailproject/THUMB (1).jpg';

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

export const PROJECTS_DATA: Project[] = [

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
      {
        id: 'p-1',
        type: 'image',
        url: project2image1,
        caption: '',
        ...lookupDimensions('chickenlogo', project2image1)
      },
      {
        id: 'p-2',
        type: 'image',
        url: project2image2,
        caption: '',
        ...lookupDimensions('chickenlogo', project2image2)
      },
      {
        id: 'p-3',
        type: 'image',
        url: project2image3,
        caption: '',
        ...lookupDimensions('chickenlogo', project2image3)
      },
      {
        id: 'p-4',
        type: 'image',
        url: project2image4,
        caption: '',
        ...lookupDimensions('chickenlogo', project2image4)
      },
      {
        id: 'p-5',
        type: 'image',
        url: project2image5,
        caption: '',
        ...lookupDimensions('chickenlogo', project2image5)
      }
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

    thumbnailUrl: thumb,

    aspectRatio: 'aspect-square',

    media: [
      {
        id: 'p-1',
        type: 'image',
        url: image1,
        caption: '',
        ...lookupDimensions('wukongtshirt', image1)
      },
      {
        id: 'p-2',
        type: 'image',
        url: image2,
        caption: '',
        ...lookupDimensions('wukongtshirt', image2)
      },
      {
        id: 'p-3',
        type: 'image',
        url: image3,
        caption: '',
        ...lookupDimensions('wukongtshirt', image3)
      },
      {
        id: 'p-4',
        type: 'image',
        url: image4,
        caption: '',
        ...lookupDimensions('wukongtshirt', image4)
      },
      {
        id: 'p-5',
        type: 'image',
        url: image5,
        caption: '',
        ...lookupDimensions('wukongtshirt', image5)
      },
      {
        id: 'p-6',
        type: 'image',
        url: image6,
        caption: '',
        ...lookupDimensions('wukongtshirt', image6)
      },
      {
        id: 'p-7',
        type: 'image',
        url: image7,
        caption: '',
        ...lookupDimensions('wukongtshirt', image7)
      }
    ]
  }
];