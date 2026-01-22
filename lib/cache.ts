import { unstable_cache } from 'next/cache';

/**
 * Утилита для кеширования данных
 * 
 * ВАЖНО: 
 * - Кеш используется ТОЛЬКО для защиты от множественных одновременных запросов
 * - Кеш должен быть очень коротким (30-60 секунд максимум)
 * - Данные должны быть всегда актуальными
 * - При любых изменениях данных - ОБЯЗАТЕЛЬНО инвалидировать кеш
 */

// In-memory кеш для инвалидации (можно заменить на Redis)
const cacheInvalidationKeys = new Set<string>();

/**
 * Получить данные из кеша или выполнить функцию
 * 
 * @param key - уникальный ключ кеша
 * @param fn - функция для получения данных
 * @param revalidate - время жизни кеша в секундах (максимум 60 секунд!)
 * @param tags - теги для групповой инвалидации
 */
export async function getCachedData<T>(
  key: string,
  fn: () => Promise<T>,
  revalidate: number = 30,
  tags?: string[]
): Promise<T> {
  // Проверяем, не был ли кеш инвалидирован
  if (cacheInvalidationKeys.has(key)) {
    cacheInvalidationKeys.delete(key);
    // Выполняем функцию без кеша
    return fn();
  }

  // Используем unstable_cache от Next.js
  const cachedFn = unstable_cache(
    async () => {
      console.log(`[Cache] Cache miss for key: ${key}`);
      return fn();
    },
    [key],
    {
      revalidate: Math.min(revalidate, 60), // Максимум 60 секунд!
      tags: tags || [],
    }
  );

  return cachedFn();
}

/**
 * Инвалидировать кеш по ключу
 * 
 * @param keys - ключи кеша для инвалидации
 */
export function invalidateCache(keys: string[]): void {
  console.log(`[Cache] Invalidating cache for keys: ${keys.join(', ')}`);
  keys.forEach((key) => {
    cacheInvalidationKeys.add(key);
  });
  
  // В будущем здесь можно добавить инвалидацию через revalidateTag
  // import { revalidateTag } from 'next/cache';
  // tags.forEach(tag => revalidateTag(tag));
}

/**
 * Инвалидировать кеш по тегам (для Next.js cache tags)
 * 
 * @param tags - теги для инвалидации
 */
export async function invalidateCacheByTags(tags: string[]): Promise<void> {
  // Для Next.js cache tags нужно использовать revalidateTag
  // Но это работает только в Server Actions или Route Handlers
  console.log(`[Cache] Invalidating cache by tags: ${tags.join(', ')}`);
  
  // Добавляем теги в список для инвалидации
  tags.forEach((tag) => {
    cacheInvalidationKeys.add(`tag:${tag}`);
  });
}

/**
 * Генераторы ключей кеша для разных endpoints
 */
export const cacheKeys = {
  dashboard: {
    summary: 'dashboard:summary',
    financial: 'dashboard:financial',
    timeline: 'dashboard:timeline',
  },
  districts: 'districts',
  buildings: (districtId?: number) => 
    districtId ? `buildings:district:${districtId}` : 'buildings:all',
  apartments: (buildingId?: number, status?: string) => {
    if (buildingId && status) {
      return `apartments:building:${buildingId}:status:${status}`;
    }
    if (buildingId) {
      return `apartments:building:${buildingId}`;
    }
    if (status) {
      return `apartments:status:${status}`;
    }
    return 'apartments:all';
  },
};
