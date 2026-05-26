/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from './types';

import project2thumb from './assets/projects/chickenlogo/SLIDE 1.jpg';

import project2image1 from './assets/projects/chickenlogo/SLIDE 2.jpg';
import project2image2 from './assets/projects/chickenlogo/SLIDE 3.jpg';
import project2image3 from './assets/projects/chickenlogo/SLIDE 4.jpg';
import project2image4 from './assets/projects/chickenlogo/SLIDE 5.jpg';
import project2image5 from './assets/projects/chickenlogo/SLIDE 6.jpg';


import thumb from './assets/projects/wukongtshirt/1-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';

import image1 from './assets/projects/wukongtshirt/1-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image2 from './assets/projects/wukongtshirt/9-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image3 from './assets/projects/wukongtshirt/17-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image4 from './assets/projects/wukongtshirt/25-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image5 from './assets/projects/wukongtshirt/33-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image6 from './assets/projects/wukongtshirt/41-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image7 from './assets/projects/wukongtshirt/49-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';





export const PROJECTS_DATA: Project[] = [

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
        id: 'p-1',
        type: 'image',
        url: project2image1,
        caption: ''
      },
      {
        id: 'p-2',
        type: 'image',
        url: project2image2,
        caption: ''
      },
      {
        id: 'p-3',
        type: 'image',
        url: project2image3,
        caption: ''
      },
      {
        id: 'p-4',
        type: 'image',
        url: project2image4,
        caption: ''
      },
      {
        id: 'p-5',
        type: 'image',
        url: project2image5,
        caption: ''
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
        caption: ''
      },
      {
        id: 'p-2',
        type: 'image',
        url: image2,
        caption: ''
      },
      {
        id: 'p-3',
        type: 'image',
        url: image3,
        caption: ''
      },
      {
        id: 'p-4',
        type: 'image',
        url: image4,
        caption: ''
      },
      {
        id: 'p-5',
        type: 'image',
        url: image5,
        caption: ''
      },
      {
        id: 'p-6',
        type: 'image',
        url: image6,
        caption: ''
      },
      {
        id: 'p-7',
        type: 'image',
        url: image7,
        caption: ''
      }
    ]
  }
];