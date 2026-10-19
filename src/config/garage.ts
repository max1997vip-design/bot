// src/config/garage.ts

// ДОБАВЛЕН 'suspension'
export type UpgradeType = 'engine' | 'tires' | 'suspension' | 'ecu' | 'paint';

export const GARAGE_HOTSPOTS = [
  // Левая точка — на стойке с покрышками
  { id: 'tires' as UpgradeType,  label: 'Шины',      x: '2%', y: '50%' },
  
  // Правая точка — на стеллаже с инструментами
  { id: 'ecu' as UpgradeType,    label: 'Прошивка',  x: '78%', y: '25%' },
  
  // Центральная точка — на капоте машины
  { id: 'engine' as UpgradeType, label: 'Двигатель', x: '50%', y: '45%' },
  
  // НОВАЯ ТОЧКА ПОДВЕСКИ (поставь туда, где она логично смотрится)
  { id: 'suspension' as UpgradeType, label: 'Подвеска', x: '85%', y: '65%' },
  
  // Точка покраски — внизу
  { id: 'paint' as UpgradeType,  label: 'Покраска',  x: '5%', y: '25%' },
];

export const CAR_POSITION = {
  x: '50%',      // Центр по горизонтали
  y: '60%',      // Чуть ниже середины
  width: '68%',  // ← Этот размер делает машину как на старом фото
};

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