import { useCallback, useEffect, useRef } from 'react';
import WebApp from '@twa-dev/sdk';

export function useAdsgram({ blockId, onReward, onError }: { blockId: string; onReward: () => void; onError: (err: any) => void; }) {
  const adControllerRef = useRef<any>(null);

  useEffect(() => {
    if (window.Adsgram) {
      adControllerRef.current = window.Adsgram.init({ blockId });
    }
  }, [blockId]);

  return useCallback(async () => {
    if (!adControllerRef.current) {
      onError('Adsgram не загружен');
      return;
    }
    try {
      const result = await adControllerRef.current.show();
      if (result.done) {
        onReward(); // Игрок досмотрел
      } else {
        onError('Реклама закрыта'); // Пропустил
      }
    } catch (error) {
      onError(error);
    }
  }, [onReward, onError]);
}