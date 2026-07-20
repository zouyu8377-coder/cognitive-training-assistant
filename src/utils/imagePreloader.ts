import type { TrainingSession } from '../types';

const preloadCache = new Set<string>();

function canPreloadImage(url: string | undefined): url is string {
  return typeof url === 'string' && /\.(jpe?g|png|webp|gif|svg)(\?.*)?$/i.test(url);
}

function preloadImage(url: string): Promise<void> {
  if (preloadCache.has(url)) return Promise.resolve();
  preloadCache.add(url);

  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve();
    image.onerror = () => {
      preloadCache.delete(url);
      resolve();
    };
    image.src = url;
  });
}

export function collectTrainingImageUrls(session: TrainingSession): string[] {
  const urls = [
    ...(session.objectNamingQuestions ?? []).map((question) => question.icon),
    ...(session.oddOneOutQuestions ?? []).flatMap((question) =>
      question.contentType === 'image' ? question.grid : [],
    ),
    session.shapeCopyTask?.referenceImageUrl,
  ];

  return [...new Set(urls.filter(canPreloadImage))];
}

export function preloadTrainingImages(session: TrainingSession): void {
  if (typeof Image === 'undefined') return;

  const urls = collectTrainingImageUrls(session);
  void Promise.all(urls.map(preloadImage));
}
