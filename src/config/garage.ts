// src/config/garage.ts

export type UpgradeType = 'engine' | 'tires' | 'suspension' | 'ecu' | 'paint';

export const PAINT_COLORS = [
  { id: 'original', label: 'Заводской',  hex: 'transparent' },
  { id: 'red',      label: 'Красный',    hex: '#ff0000' },
  { id: 'blue',     label: 'Синий',      hex: '#0055ff' },
  { id: 'green',    label: 'Зеленый',    hex: '#00ff41' },
  { id: 'yellow',   label: 'Желтый',     hex: '#ffcc00' },
  { id: 'purple',   label: 'Фиолетовый', hex: '#b000ff' },
  { id: 'matte',    label: 'Матовый',    hex: '#333333' },
  { id: 'white',    label: 'Белый',      hex: '#ffffff' },
];