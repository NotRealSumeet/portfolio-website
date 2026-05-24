/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from './types';

import thumb from './assets/projects/SumitPortfolio/1-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';

import image1 from './assets/projects/SumitPortfolio/1-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image2 from './assets/projects/SumitPortfolio/9-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image3 from './assets/projects/SumitPortfolio/17-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image4 from './assets/projects/SumitPortfolio/25-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image5 from './assets/projects/SumitPortfolio/33-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image6 from './assets/projects/SumitPortfolio/41-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';
import image7 from './assets/projects/SumitPortfolio/49-indian-streetwear-branding-nosfera-wukong-drop-1920.jpg';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'wukong-tshirt',

    title: 'WUKONG T SHIRT',

    subtitle: 'INDIAN STREETWEAR BRANDING',

    category: 'Fashion Design',

    year: '2025',

    client: 'Nosfera',

    role: 'Graphic Designer',

    services: [
      'Streetwear Design',
      'Branding',
      'Visual Direction'
    ],

    summary: 'A gothic streetwear brand blending Indian heritage, mythology, and modern rebellion through bold visual storytelling.',

    about: 'Nosfera is a Pune-based streetwear label inspired by dark mythology and Indian culture. This project explored the brand’s Wukong-themed drop through packaging, posters, fashion edits, and branding visuals designed with a cinematic gothic aesthetic.',

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