// src/config/cars.ts

export interface CarPerformance {
  topSpeed: number;    // макс. скорость, км/ч
  accel: number;       // время 0-100 км/ч, сек (меньше = быстрее)
  power: number;       // л.с. (для отображения)
  grip: number;        // 0-100, сцепление с дорогой
  weight: number;      // кг (влияет на разгон)
  nitro: number;       // 0-100, сила NOS
}

export interface CarConfig {
  id: string;
  name: string;
  price: number;
  image: string;
  performance: CarPerformance; // 👈 новое поле для гонок
  baseStats: {
    power: number;
    topSpeed: number;
    grip: number;
    handling: number;
  };
  leftHeadlight?: { x: string; y: string; };
  rightHeadlight?: { x: string; y: string; };
}

// Хелпер для конвертации "реальных" цифр в старые baseStats (чтобы гараж не сломался)
const mkStats = (perf: CarPerformance) => ({
  power: Math.round(perf.power / 10),
  topSpeed: Math.round(perf.topSpeed / 100),
  grip: Math.round(perf.grip),
  handling: Math.round(perf.grip * 1.1),
});

export const CARS: Record<string, CarConfig> = {
  // --- СТАРЫЕ МАШИНЫ ---
  'audi-tt': { 
    id: 'audi-tt', name: 'Audi TT', price: 0, image: '/cars/audi-tt-front.png',
    performance: { topSpeed: 250, accel: 5.6, power: 225, grip: 80, weight: 1280, nitro: 60 },
    baseStats: mkStats({ topSpeed: 250, accel: 5.6, power: 225, grip: 80, weight: 1280, nitro: 60 }),
  },
  'bmw-m3': { 
    id: 'bmw-m3', name: 'BMW M3', price: 50000, image: '/cars/placeholder.png',
    performance: { topSpeed: 280, accel: 4.8, power: 343, grip: 85, weight: 1495, nitro: 65 },
    baseStats: mkStats({ topSpeed: 280, accel: 4.8, power: 343, grip: 85, weight: 1495, nitro: 65 }),
  },
  
  // --- ТИР 1: Классика и бюджет ---
  'vaz-2107': { 
    id: 'vaz-2107', name: 'ВАЗ 2107', price: 0, image: '/cars/vaz-2107.png',
    performance: { topSpeed: 150, accel: 16.0, power: 75, grip: 45, weight: 1030, nitro: 20 },
    baseStats: mkStats({ topSpeed: 150, accel: 16.0, power: 75, grip: 45, weight: 1030, nitro: 20 }),
  },
  'moskvich': { 
    id: 'moskvich', name: 'Москвич 412', price: 5000, image: '/cars/moskvich.png',
    performance: { topSpeed: 155, accel: 15.0, power: 80, grip: 48, weight: 1045, nitro: 22 },
    baseStats: mkStats({ topSpeed: 155, accel: 15.0, power: 80, grip: 48, weight: 1045, nitro: 22 }),
  },
  'priora': { 
    id: 'priora', name: 'Lada Priora', price: 15000, image: '/cars/priora.png',
    performance: { topSpeed: 185, accel: 11.5, power: 98, grip: 55, weight: 1180, nitro: 30 },
    baseStats: mkStats({ topSpeed: 185, accel: 11.5, power: 98, grip: 55, weight: 1180, nitro: 30 }),
  },
  'vesta': { 
    id: 'vesta', name: 'Lada Vesta Sport', price: 40000, image: '/cars/vesta.png',
    performance: { topSpeed: 195, accel: 9.6, power: 145, grip: 62, weight: 1270, nitro: 40 },
    baseStats: mkStats({ topSpeed: 195, accel: 9.6, power: 145, grip: 62, weight: 1270, nitro: 40 }),
  },

  // --- ТИР 2: Японская и европейская классика ---
  'civic': { 
    id: 'civic', name: 'Honda Civic Type R', price: 100000, image: '/cars/civic.png',
    performance: { topSpeed: 272, accel: 5.8, power: 320, grip: 82, weight: 1380, nitro: 60 },
    baseStats: mkStats({ topSpeed: 272, accel: 5.8, power: 320, grip: 82, weight: 1380, nitro: 60 }),
  },
  'rx7': { 
    id: 'rx7', name: 'Mazda RX-7', price: 250000, image: '/cars/rx7.png',
    performance: { topSpeed: 260, accel: 5.3, power: 280, grip: 78, weight: 1270, nitro: 70 },
    baseStats: mkStats({ topSpeed: 260, accel: 5.3, power: 280, grip: 78, weight: 1270, nitro: 70 }),
  },
  'supra': { 
    id: 'supra', name: 'Toyota Supra MK4', price: 500000, image: '/cars/supra.png',
    performance: { topSpeed: 285, accel: 4.9, power: 330, grip: 80, weight: 1560, nitro: 75 },
    baseStats: mkStats({ topSpeed: 285, accel: 4.9, power: 330, grip: 80, weight: 1560, nitro: 75 }),
  },
  'skyline': { 
    id: 'skyline', name: 'Nissan Skyline R34', price: 850000, image: '/cars/skyline.png',
    performance: { topSpeed: 295, accel: 4.7, power: 360, grip: 84, weight: 1560, nitro: 80 },
    baseStats: mkStats({ topSpeed: 295, accel: 4.7, power: 360, grip: 84, weight: 1560, nitro: 80 }),
  },

  // --- ТИР 3: Масл-кары и спорт ---
  'mustang': { 
    id: 'mustang', name: 'Ford Mustang GT', price: 2000000, image: '/cars/mustang.png',
    performance: { topSpeed: 310, accel: 4.3, power: 460, grip: 76, weight: 1745, nitro: 85 },
    baseStats: mkStats({ topSpeed: 310, accel: 4.3, power: 460, grip: 76, weight: 1745, nitro: 85 }),
  },
  'camaro': { 
    id: 'camaro', name: 'Chevrolet Camaro SS', price: 3500000, image: '/cars/camaro.png',
    performance: { topSpeed: 318, accel: 4.1, power: 455, grip: 80, weight: 1720, nitro: 88 },
    baseStats: mkStats({ topSpeed: 318, accel: 4.1, power: 455, grip: 80, weight: 1720, nitro: 88 }),
  },
  'm3gtr': { 
    id: 'm3gtr', name: 'BMW M3 GTR', price: 6000000, image: '/cars/m3gtr.png',
    performance: { topSpeed: 320, accel: 3.9, power: 450, grip: 88, weight: 1120, nitro: 90 },
    baseStats: mkStats({ topSpeed: 320, accel: 3.9, power: 450, grip: 88, weight: 1120, nitro: 90 }),
  },
  'rs6': { 
    id: 'rs6', name: 'Audi RS6', price: 10000000, image: '/cars/rs6.png',
    performance: { topSpeed: 305, accel: 3.6, power: 600, grip: 82, weight: 2075, nitro: 92 },
    baseStats: mkStats({ topSpeed: 305, accel: 3.6, power: 600, grip: 82, weight: 2075, nitro: 92 }),
  },

  // --- ТИР 4: Суперкары ---
  'gtr': { 
    id: 'gtr', name: 'Nissan GT-R R35', price: 25000000, image: '/cars/gtr.png',
    performance: { topSpeed: 330, accel: 2.9, power: 600, grip: 92, weight: 1752, nitro: 95 },
    baseStats: mkStats({ topSpeed: 330, accel: 2.9, power: 600, grip: 92, weight: 1752, nitro: 95 }),
  },
  'porsche911': { 
    id: 'porsche911', name: 'Porsche 911 Turbo S', price: 40000000, image: '/cars/porsche911.png',
    performance: { topSpeed: 330, accel: 2.7, power: 650, grip: 94, weight: 1640, nitro: 96 },
    baseStats: mkStats({ topSpeed: 330, accel: 2.7, power: 650, grip: 94, weight: 1640, nitro: 96 }),
  },
  'r8': { 
    id: 'r8', name: 'Audi R8 V10', price: 60000000, image: '/cars/r8.png',
    performance: { topSpeed: 335, accel: 3.1, power: 620, grip: 93, weight: 1595, nitro: 96 },
    baseStats: mkStats({ topSpeed: 335, accel: 3.1, power: 620, grip: 93, weight: 1595, nitro: 96 }),
  },
  'amggt': { 
    id: 'amggt', name: 'Mercedes-AMG GT', price: 85000000, image: '/cars/amggt.png',
    performance: { topSpeed: 325, accel: 3.2, power: 585, grip: 91, weight: 1645, nitro: 95 },
    baseStats: mkStats({ topSpeed: 325, accel: 3.2, power: 585, grip: 91, weight: 1645, nitro: 95 }),
  },

  // --- ТИР 5: Топовые суперкары ---
  'ferrari458': { 
    id: 'ferrari458', name: 'Ferrari 458 Italia', price: 150000000, image: '/cars/ferrari458.png',
    performance: { topSpeed: 325, accel: 3.4, power: 570, grip: 94, weight: 1380, nitro: 96 },
    baseStats: mkStats({ topSpeed: 325, accel: 3.4, power: 570, grip: 94, weight: 1380, nitro: 96 }),
  },
  'huracan': { 
    id: 'huracan', name: 'Lamborghini Huracan', price: 250000000, image: '/cars/huracan.png',
    performance: { topSpeed: 325, accel: 3.2, power: 610, grip: 95, weight: 1422, nitro: 97 },
    baseStats: mkStats({ topSpeed: 325, accel: 3.2, power: 610, grip: 95, weight: 1422, nitro: 97 }),
  },
  'mclaren720': { 
    id: 'mclaren720', name: 'McLaren 720S', price: 350000000, image: '/cars/mclaren720.png',
    performance: { topSpeed: 341, accel: 2.9, power: 720, grip: 96, weight: 1419, nitro: 98 },
    baseStats: mkStats({ topSpeed: 341, accel: 2.9, power: 720, grip: 96, weight: 1419, nitro: 98 }),
  },
  'aventador': { 
    id: 'aventador', name: 'Lamborghini Aventador', price: 500000000, image: '/cars/aventador.png',
    performance: { topSpeed: 350, accel: 2.9, power: 740, grip: 95, weight: 1575, nitro: 98 },
    baseStats: mkStats({ topSpeed: 350, accel: 2.9, power: 740, grip: 95, weight: 1575, nitro: 98 }),
  },

  // --- ТИР 6: Гиперкары ---
  'sf90': { 
    id: 'sf90', name: 'Ferrari SF90', price: 1000000000, image: '/cars/sf90.png',
    performance: { topSpeed: 340, accel: 2.5, power: 1000, grip: 98, weight: 1570, nitro: 99 },
    baseStats: mkStats({ topSpeed: 340, accel: 2.5, power: 1000, grip: 98, weight: 1570, nitro: 99 }),
  },
  'veyron': { 
    id: 'veyron', name: 'Bugatti Veyron', price: 1500000000, image: '/cars/veyron.png',
    performance: { topSpeed: 407, accel: 2.5, power: 1001, grip: 96, weight: 1888, nitro: 99 },
    baseStats: mkStats({ topSpeed: 407, accel: 2.5, power: 1001, grip: 96, weight: 1888, nitro: 99 }),
  },
  'chiron': { 
    id: 'chiron', name: 'Bugatti Chiron', price: 2500000000, image: '/cars/chiron.png',
    performance: { topSpeed: 420, accel: 2.4, power: 1500, grip: 97, weight: 1995, nitro: 100 },
    baseStats: mkStats({ topSpeed: 420, accel: 2.4, power: 1500, grip: 97, weight: 1995, nitro: 100 }),
  },
  'speedtail': { 
    id: 'speedtail', name: 'McLaren Speedtail', price: 4000000000, image: '/cars/speedtail.png',
    performance: { topSpeed: 403, accel: 2.5, power: 1050, grip: 97, weight: 1430, nitro: 100 },
    baseStats: mkStats({ topSpeed: 403, accel: 2.5, power: 1050, grip: 97, weight: 1430, nitro: 100 }),
  },
  'jesko': { 
    id: 'jesko', name: 'Koenigsegg Jesko', price: 6000000000, image: '/cars/jesko.png',
    performance: { topSpeed: 480, accel: 2.5, power: 1600, grip: 99, weight: 1420, nitro: 100 },
    baseStats: mkStats({ topSpeed: 480, accel: 2.5, power: 1600, grip: 99, weight: 1420, nitro: 100 }),
  },
  'solus': { 
    id: 'solus', name: 'McLaren Solus GT', price: 10000000000, image: '/cars/placeholder.png',
    performance: { topSpeed: 400, accel: 2.1, power: 840, grip: 100, weight: 1000, nitro: 100 },
    baseStats: mkStats({ topSpeed: 400, accel: 2.1, power: 840, grip: 100, weight: 1000, nitro: 100 }),
  },
};