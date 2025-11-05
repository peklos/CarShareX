/**
 * Оптимизация URL изображений с Unsplash
 * Добавляет параметры для автоматического изменения размера и формата
 */

import { API_URL } from './constants';

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'webp' | 'jpg' | 'auto';
}

/**
 * Оптимизирует URL изображения, добавляя параметры для сжатия и изменения размера
 * @param url - Исходный URL изображения
 * @param options - Опции оптимизации
 * @returns Оптимизированный URL
 */
export function optimizeImageUrl(
  url: string,
  options: ImageOptimizationOptions = {}
): string {
  // Если URL пустой или не является строкой, возвращаем его как есть
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Если это локальный путь (начинается с /static), преобразуем в полный URL
  if (url.startsWith('/static')) {
    return `${API_URL}${url}`;
  }

  // Для Loremflickr и других сервисов возвращаем URL как есть
  if (url.indexOf('loremflickr.com') !== -1 || url.indexOf('flickr.com') !== -1) {
    return url;
  }

  // Проверяем, является ли URL изображением с Unsplash
  if (url.indexOf('unsplash.com') === -1) {
    return url;
  }

  const {
    width,
    height,
    quality = 80,
    format = 'auto'
  } = options;

  // Создаем URL объект
  const urlObj = new URL(url);

  // Добавляем параметры оптимизации
  if (width) {
    urlObj.searchParams.set('w', width.toString());
  }
  if (height) {
    urlObj.searchParams.set('h', height.toString());
  }

  // Добавляем качество (для Unsplash это параметр q)
  urlObj.searchParams.set('q', quality.toString());

  // Добавляем формат (для Unsplash это параметр fm)
  if (format !== 'auto') {
    urlObj.searchParams.set('fm', format);
  } else {
    // Auto означает WebP для браузеров, которые его поддерживают
    urlObj.searchParams.set('fm', 'webp');
  }

  // Включаем автоматическую оптимизацию Unsplash
  urlObj.searchParams.set('auto', 'format,compress');

  // Добавляем fit=crop для правильного кропа
  if (width || height) {
    urlObj.searchParams.set('fit', 'crop');
  }

  return urlObj.toString();
}

/**
 * Генерирует srcSet для responsive изображений
 * @param url - Исходный URL изображения
 * @param sizes - Массив размеров для генерации
 * @returns srcSet строка
 */
export function generateSrcSet(
  url: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string {
  if (!url || typeof url !== 'string' || url.indexOf('unsplash.com') === -1) {
    return '';
  }

  return sizes
    .map((size) => {
      const optimizedUrl = optimizeImageUrl(url, { width: size, quality: 80 });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Преднастроенные размеры для различных контекстов
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 150, quality: 75 },
  card: { width: 400, height: 300, quality: 80 },
  detail: { width: 800, height: 600, quality: 85 },
  hero: { width: 1600, height: 900, quality: 85 },
};
