import { Project } from '../types';

export const loadedImagesCache = new Set<string>();
export const loadedVideosCache = new Set<string>();
export const preloadedUrls = new Set<string>();

export function preloadImage(url: string) {
  if (!url || preloadedUrls.has(url)) return;
  preloadedUrls.add(url);

  const img = new Image();
  img.onload = () => {
    loadedImagesCache.add(url);
  };
  img.onerror = () => {
    // Add anyway to avoid stuck loading animations
    loadedImagesCache.add(url);
  };
  img.src = url;
}

export function preloadProjectMedia(project: Project) {
  if (!project || !project.media) return;

  // Preload the thumbnail
  if (project.thumbnailUrl) {
    preloadImage(project.thumbnailUrl);
  }

  // Preload first 3 image/gif media items
  let count = 0;
  for (const item of project.media) {
    if (item.type === 'image' || item.type === 'gif') {
      preloadImage(item.url);
      count++;
      if (count >= 3) break;
    }
  }
}
