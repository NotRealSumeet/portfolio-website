/* =========================================================
   Types
========================================================= */

export type MediaType = 'image' | 'video' | 'gif';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  caption: string;
  aspectRatio?: string; // Optional custom grid size overrides, e.g., '16:9', '1:1', '4:5'
  width?: number;
  height?: number;
  aspectRatioNumber?: number;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  client: string;
  role: string;
  services: string[];
  summary: string;
  about: string;
  thumbnailUrl: string;
  aspectRatio: string; // Tailwind aspect ratio string, e.g. 'aspect-video', 'aspect-square', 'aspect-[4/5]', 'aspect-[2/3]'
  media: MediaItem[];
}
