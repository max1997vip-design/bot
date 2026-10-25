// src/config/cars.ts

export interface CarConfig {
  id: string;
  name: string;
  price: number;
  image: string;
  baseStats: {
    power: number;
    topSpeed: number;
    grip: number;
    handling: number;
  };
  // 👇 ДОБАВЛЕНО: Делаем координаты фар необязательными, чтобы TS не ругался
  leftHeadlight?: { x: string; y: string; };
  rightHeadlight?: { x: string; y: string; };
}

export const CARS: Record<string, CarConfig> = {
  // --- СТАРЫЕ МАШИНЫ (Для совместимости со старыми сейвами) ---
  'audi-tt': { 
    id: 'audi-tt', 
    name: 'Audi TT', 
    price: 0, 
    image: '/cars/audi-tt-front.png', 
    baseStats: { power: 40, topSpeed: 25, grip: 20, handling: 20 },
    // Если у Audi TT были точные координаты, можешь раскомментировать и вставить их сюда:
    // leftHeadlight: { x: '25%', y: '55%' },
    // rightHeadlight: { x: '75%', y: '55%' }
  },
  'bmw-m3': { 
    id: 'bmw-m3', 
    name: 'BMW M3', 
    price: 50000, 
    image: '/cars/placeholder.png', 
    baseStats: { power: 90, topSpeed: 50, grip: 45, handling: 45 } 
  },
  
  // --- ТИР 1: Классика и бюджет ---
  'vaz-2107': { id: 'vaz-2107', name: 'ВАЗ 2107', price: 0, image: '/cars/placeholder.png', baseStats: { power: 20, topSpeed: 15, grip: 10, handling: 10 } },
  'moskvich': { id: 'moskvich', name: 'Москвич 412', price: 5000, image: '/cars/placeholder.png', baseStats: { power: 30, topSpeed: 20, grip: 15, handling: 15 } },
  'priora': { id: 'priora', name: 'Lada Priora', price: 15000, image: '/cars/placeholder.png', baseStats: { power: 50, topSpeed: 30, grip: 25, handling: 25 } },
  'vesta': { id: 'vesta', name: 'Lada Vesta Sport', price: 40000, image: '/cars/placeholder.png', baseStats: { power: 80, topSpeed: 45, grip: 40, handling: 40 } },

  // --- ТИР 2: Японская и европейская классика ---
  'civic': { id: 'civic', name: 'Honda Civic Type R', price: 100000, image: '/cars/placeholder.png', baseStats: { power: 150, topSpeed: 80, grip: 70, handling: 80 } },
  'rx7': { id: 'rx7', name: 'Mazda RX-7', price: 250000, image: '/cars/placeholder.png', baseStats: { power: 200, topSpeed: 110, grip: 90, handling: 100 } },
  'supra': { id: 'supra', name: 'Toyota Supra MK4', price: 500000, image: '/cars/placeholder.png', baseStats: { power: 300, topSpeed: 150, grip: 120, handling: 130 } },
  'skyline': { id: 'skyline', name: 'Nissan Skyline R34', price: 850000, image: '/cars/placeholder.png', baseStats: { power: 380, topSpeed: 180, grip: 150, handling: 160 } },

  // --- ТИР 3: Масл-кары и спорт ---
  'mustang': { id: 'mustang', name: 'Ford Mustang GT', price: 2000000, image: '/cars/placeholder.png', baseStats: { power: 500, topSpeed: 220, grip: 180, handling: 190 } },
  'camaro': { id: 'camaro', name: 'Chevrolet Camaro SS', price: 3500000, image: '/cars/placeholder.png', baseStats: { power: 600, topSpeed: 250, grip: 210, handling: 220 } },
  'm3gtr': { id: 'm3gtr', name: 'BMW M3 GTR', price: 6000000, image: '/cars/placeholder.png', baseStats: { power: 750, topSpeed: 300, grip: 260, handling: 280 } },
  'rs6': { id: 'rs6', name: 'Audi RS6', price: 10000000, image: '/cars/placeholder.png', baseStats: { power: 900, topSpeed: 350, grip: 300, handling: 320 } },

  // --- ТИР 4: Суперкары ---
  'gtr': { id: 'gtr', name: 'Nissan GT-R R35', price: 25000000, image: '/cars/placeholder.png', baseStats: { power: 1200, topSpeed: 420, grip: 380, handling: 400 } },
  'porsche911': { id: 'porsche911', name: 'Porsche 911 Turbo S', price: 40000000, image: '/cars/placeholder.png', baseStats: { power: 1500, topSpeed: 480, grip: 450, handling: 480 } },
  'r8': { id: 'r8', name: 'Audi R8 V10', price: 60000000, image: '/cars/placeholder.png', baseStats: { power: 1800, topSpeed: 520, grip: 500, handling: 520 } },
  'amggt': { id: 'amggt', name: 'Mercedes-AMG GT', price: 85000000, image: '/cars/placeholder.png', baseStats: { power: 2100, topSpeed: 560, grip: 550, handling: 580 } },

  // --- ТИР 5: Топовые суперкары ---
  'ferrari458': { id: 'ferrari458', name: 'Ferrari 458 Italia', price: 150000000, image: '/cars/placeholder.png', baseStats: { power: 2600, topSpeed: 620, grip: 600, handling: 650 } },
  'huracan': { id: 'huracan', name: 'Lamborghini Huracan', price: 250000000, image: '/cars/placeholder.png', baseStats: { power: 3200, topSpeed: 680, grip: 680, handling: 720 } },
  'mclaren720': { id: 'mclaren720', name: 'McLaren 720S', price: 350000000, image: '/cars/placeholder.png', baseStats: { power: 3800, topSpeed: 740, grip: 750, handling: 800 } },
  'aventador': { id: 'aventador', name: 'Lamborghini Aventador', price: 500000000, image: '/cars/placeholder.png', baseStats: { power: 4500, topSpeed: 800, grip: 820, handling: 850 } },

  // --- ТИР 6: Гиперкары ---
  'sf90': { id: 'sf90', name: 'Ferrari SF90', price: 1000000000, image: '/cars/placeholder.png', baseStats: { power: 5500, topSpeed: 880, grip: 900, handling: 950 } },
  'veyron': { id: 'veyron', name: 'Bugatti Veyron', price: 1500000000, image: '/cars/placeholder.png', baseStats: { power: 6500, topSpeed: 950, grip: 1000, handling: 1050 } },
  'chiron': { id: 'chiron', name: 'Bugatti Chiron', price: 2500000000, image: '/cars/placeholder.png', baseStats: { power: 8000, topSpeed: 1050, grip: 1100, handling: 1150 } },
  'speedtail': { id: 'speedtail', name: 'McLaren Speedtail', price: 4000000000, image: '/cars/placeholder.png', baseStats: { power: 9500, topSpeed: 1150, grip: 1200, handling: 1250 } },
  'jesko': { id: 'jesko', name: 'Koenigsegg Jesko', price: 6000000000, image: '/cars/placeholder.png', baseStats: { power: 11000, topSpeed: 1250, grip: 1300, handling: 1350 } },
  'solus': { id: 'solus', name: 'McLaren Solus GT', price: 10000000000, image: '/cars/placeholder.png', baseStats: { power: 13000, topSpeed: 1350, grip: 1400, handling: 1500 } },
};