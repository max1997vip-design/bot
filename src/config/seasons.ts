// src/config/seasons.ts
export function getCurrentSeasonId(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getSeasonName(seasonId?: string): string {
  const id = seasonId || getCurrentSeasonId();
  const [year, month] = id.split('-').map(Number);
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ];
  return `${months[month - 1]} ${year}`;
}

export function getSeasonTimeLeft(): number {
  const now = new Date();
  const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  return endOfMonth.getTime() - now.getTime();
}

/**
 * Возвращает ID предыдущего сезона (месяц-1).
 */
export function getPrevSeasonId(): string {
  const now = new Date();
  const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const year = prev.getUTCFullYear();
  const month = String(prev.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}