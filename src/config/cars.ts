export interface CarConfig {
  id: string;
  name: string;
  image: string;
  price: number;
  baseStats: { power: number; topSpeed: number; grip: number; handling: number }; // <-- НОВОЕ
  leftHeadlight: { x: string; y: string };
  rightHeadlight: { x: string; y: string };
}

export const CARS: Record<string, CarConfig> = {
  'audi-tt': {
    id: 'audi-tt',
    name: 'Audi TT MK2',
    image: '/cars/audi-tt-front.png',
    price: 0,
    baseStats: { power: 100, topSpeed: 150, grip: 20, handling: 20 }, // Базовые статы Audi
    leftHeadlight: { x: '20%', y: '53%' },
    rightHeadlight: { x: '80%', y: '53%' },
  },
  'bmw-m3': {
    id: 'bmw-m3',
    name: 'BMW M3 GTR',
    image: '/cars/audi-tt-front.png', // Заглушка
    price: 50000,
    baseStats: { power: 180, topSpeed: 220, grip: 40, handling: 35 }, // Базовые статы BMW
    leftHeadlight: { x: '22%', y: '55%' },
    rightHeadlight: { x: '78%', y: '55%' },
  },
};