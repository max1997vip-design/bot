// src/config/cars.ts

export interface CarConfig {
  id: string;
  name: string;
  image: string;
  // Координаты фар в процентах (X и Y)
  leftHeadlight: { x: string; y: string };
  rightHeadlight: { x: string; y: string };
}

export const CARS: Record<string, CarConfig> = {
  'audi-tt': {
    id: 'audi-tt',
    name: 'Audi TT MK2',
    image: '/cars/audi-tt-front.png',
    leftHeadlight: { x: '20%', y: '53%' },
    rightHeadlight: { x: '80%', y: '53%' },
  },
  // Пример для будущей машины:
  // 'bmw-m3': {
  //   id: 'bmw-m3',
  //   name: 'BMW M3',
  //   image: '/cars/bmw-m3-front.png',
  //   leftHeadlight: { x: '25%', y: '55%' }, // тут будут другие цифры
  //   rightHeadlight: { x: '75%', y: '55%' },
  // },
};