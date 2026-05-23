/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from './types';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'neodada-systems',
    title: 'NEODADA SYSTEM',
    subtitle: 'TYPOGRAPHIC SYSTEMS & GENERATIVE DISRUPTION',
    category: 'Visual Identity',
    year: '2025',
    client: 'Volatile Art Collective',
    role: 'Lead Visual Designer',
    services: ['Brand Identity', 'Typographic Systems', 'Creative Code'],
    summary: 'A radical reinterpretation of early Dada artwork utilizing procedural code, extreme grid boundaries, and high-contrast editorial structures.',
    about: 'Neodada System combines high-contrast Swiss typography with automated layout code. Built as a visual manifesto against standard clean web templates, it celebrates high density, extreme font offsets, and pure monochrome scale. The prints were produced on a Risograph using carbon black ink, while the digital archive simulates ink bleeds via HTML shaders.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-square', // 1:1, great for grid variety
    media: [
      {
        id: 'nd-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
        caption: 'Design system poster layout displaying standard typesetting paired with radical overlaps.'
      },
      {
        id: 'nd-2',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32115-large.mp4',
        caption: 'Documentation of real-time typographic interpolation on digital canvas.'
      },
      {
        id: 'nd-3',
        type: 'gif',
        url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2F3bXgwd2o1dWp2MXk3NmxsaW5ldmdmMDQxMzVjcmE1bTFsMmpsMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjei1IQ/giphy.gif',
        caption: 'Animated structural system test examining typographic offset under strict limits.'
      },
      {
        id: 'nd-4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005198143-e5283464303b?auto=format&fit=crop&w=1200&q=80',
        caption: 'High-contrast rendering of ink-bleed physics simulated digitally.'
      }
    ]
  },
  {
    id: 'kinetic-posters',
    title: 'KINETIC ARCHIVE',
    subtitle: 'ALGORITHMIC POSTER DESIGN & PHYSICS',
    category: 'Creative Technology',
    year: '2025',
    client: 'Zürich School of Design',
    role: 'Creative Technologist',
    services: ['Frontend Development', 'Physical Simulation', 'Editorial Design'],
    summary: 'An interactive algorithmic installation looking at Helvetica letterforms moving under physics variables, simulated in canvas and vector grids.',
    about: 'Designed as a physical-to-digital installation for the Zürich School of Design, the Kinetic Archive tracks real-time motion and gravity to dismantle traditional poster layouts. Viewers can interact with a digital screen where typography is subjected to simulated wind pressures, gravity shifts, and mouse repulsion, producing unique visual alignments that can be exported as physical vector prints.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-[3/4]', // Elegant vertical format
    media: [
      {
        id: 'kp-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Concrete structure detail inspiring the raw alignment constraints of the layout.'
      },
      {
        id: 'kp-2',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-binary-code-41584-large.mp4',
        caption: 'Simulated type displacement algorithm testing interactive mouse-repulsion physics.'
      },
      {
        id: 'kp-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
        caption: 'Abstract waveform analysis showcasing typographical displacement maps.'
      }
    ]
  },
  {
    id: 'chronos',
    title: 'CHRONOS VOLUME',
    subtitle: 'MINIMAL AUDIO CHRONOLOGY PORTAL',
    category: 'Editorial Microsite',
    year: '2024',
    client: 'Chronos Sound Labs',
    role: 'Editorial Designer / UX Lead',
    services: ['UI/UX Design', 'Editorial Grid System', 'Information Architecture'],
    summary: 'A meticulous digital gallery cataloging vintage mechanical audio equipment and radical concrete audio archives in high contrast.',
    about: 'Chronos Sound Labs produces boutique audiophile systems. This portal serves as a complete chronology of sound mechanics, presenting high-fidelity specifications through a bold, brutalist Swiss column system. It limits the page strictly to black, white, and customized gray borders, creating a striking visual reference that mirrors the uncompromising build quality of their audio hardware.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-video', // 16:9 widescreen rhythm
    media: [
      {
        id: 'cr-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Atmospheric light study on structural concrete blocks, defining the site tactile feeling.'
      },
      {
        id: 'cr-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        caption: 'Brutalist macro close-up of dynamic microcomponents integrated within the archival models.'
      },
      {
        id: 'cr-3',
        type: 'gif',
        url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3VmdmZjcjdjNzc4bnU0a2c5a2Y2bXN2c20zM3lzdjNoMWFkODQzdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0O9zkXnJ6g8T561O/giphy.gif',
        caption: 'Interface rendering of real-time audio oscilloscopes animating in vector-thin outlines.'
      }
    ]
  },
  {
    id: 'deconstructed-grid',
    title: 'DECONSTRUCTED GRID',
    subtitle: 'PRINT CATALOG & SPECIMEN STUDY',
    category: 'Print Design',
    year: '2024',
    client: 'Self-Initiated Study',
    role: 'Graphic Designer',
    services: ['Typesetting', 'Swiss Editorial', 'Risograph Printing'],
    summary: 'An offline and online visual essay focused on breaking structural guidelines of standard Jan Tschichold book layouts.',
    about: 'Ambitious graphic design projects require testing the absolute boundary of order. Deconstructed Grid is a personal speculative project consisting of a 144-page book that systematically violates the typographic norms laid down in Swiss typography manuals. Margins are inverted, type scales grow aggressively larger, and page markers overlap body text, creating a gorgeous tension between noise and absolute systemization.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-[2/3]', // Tall book spec
    media: [
      {
        id: 'dg-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        caption: 'Monochrome fluid form representing continuous typographic balance inside broken constraints.'
      },
      {
        id: 'dg-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80',
        caption: 'Deconstructed graphic study detailing dynamic alignment tests.'
      }
    ]
  },
  {
    id: 'stark-volumes',
    title: 'STARK VOLUMES',
    subtitle: 'PROCEDURAL 3D SPACE EXPLORATION',
    category: '3D Art & Motion',
    year: '2023',
    client: 'Spectrum Digital Lab',
    role: '3D Director',
    services: ['Procedural Art', 'Spatial Layout', 'Lighting Composition'],
    summary: 'A series of high-contrast textured render blocks studying light propagation through brutalist architecture blocks and spatial gaps.',
    about: 'Stark Volumes explores light as a solid physical mass. Working with raw digital concrete, metallic structures, and infinite pitch-black shadows, we designed procedural environments that shift according to sound frequencies. The series was exhibited as immersive projections in Zürich and Munich, filling large-scale physical arches with giant typographic streams and raw monochrome volume shapes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-square',
    media: [
      {
        id: 'sv-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Deep abstract spatial rendering framing structural contrast and light voids.'
      },
      {
        id: 'sv-2',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-scifi-glowing-tunnel-interface-animation-31974-large.mp4',
        caption: 'Generative geometric tunnel sequence animating based on low-frequency sound.'
      }
    ]
  }
];
