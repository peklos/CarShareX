/**
 * Оптимизация URL изображений
 * Упрощенная версия для работы с локальными изображениями
 */

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'webp' | 'jpg' | 'auto';
}

/**
 * Возвращает URL изображения без изменений
 * @param url - Исходный URL изображения
 * @param options - Опции оптимизации (не используются)
 * @returns URL изображения
 */
export function optimizeImageUrl(
  url: string,
  options: ImageOptimizationOptions = {}
): string {
  // Если URL пустой или не является строкой, возвращаем его как есть
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Возвращаем URL без изменений
  return url;
}

/**
 * Генерирует srcSet для responsive изображений
 * @param url - Исходный URL изображения
 * @param sizes - Массив размеров для генерации
 * @returns srcSet строка (пустая для локальных изображений)
 */
export function generateSrcSet(
  url: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string {
  // Для локальных изображений не генерируем srcSet
  return '';
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
