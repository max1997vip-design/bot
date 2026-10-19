// src/config/cars.ts

export interface CarConfig {
  id: string;
  name: string;
  image: string;
  price: number; // <-- ДОБАВЛЕНО: Цена в монетах
  leftHeadlight: { x: string; y: string };
  rightHeadlight: { x: string; y: string };
}

export const CARS: Record<string, CarConfig> = {
  'audi-tt': {
    id: 'audi-tt',
    name: 'Audi TT MK2',
    image: '/cars/audi-tt-front.png',
    price: 0, // Базовая машина - бесплатна
    leftHeadlight: { x: '20%', y: '53%' },
    rightHeadlight: { x: '80%', y: '53%' },
  },
  // НОВАЯ МАШИНА ДЛЯ ПОКУПКИ
  'bmw-m3': {
    id: 'bmw-m3',
    name: 'BMW M3 GTR',
    image: '/cars/audi-tt-front.png', // Заглушка (потом заменишь на свою картинку)
    price: 50000, // Цена 50к монет
    leftHeadlight: { x: '22%', y: '55%' }, // Координаты фар
    rightHeadlight: { x: '78%', y: '55%' },
  },
};