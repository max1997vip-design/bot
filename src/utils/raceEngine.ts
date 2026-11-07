// src/utils/raceEngine.ts
export interface CarPhysics {
  power: number;
  topSpeed: number; // км/ч
  accel: number;    // сек до 100 км/ч
  grip: number;     // 0-100
  handling: number; // 0-100
}

export interface RaceTick {
  time: number;
  playerDist: number;
  opponentDist: number;
  playerSpeed: number;
  opponentSpeed: number;
}

export interface RaceResult {
  winner: 'player' | 'opponent';
  playerTime: number;
  opponentTime: number;
  ticks: RaceTick[];
  log: string[];
}

// 🎯 400 метров = 1/4 мили (как в UI)
const TRACK_DISTANCE = 400;

export function simulateRacePhysics(
  player: CarPhysics,
  opponent: CarPhysics,
  opponentName: string
): RaceResult {
  const ticks: RaceTick[] = [];

  // 🎯 Симулируем 2 гонки независимо, чтобы не было «слипания»
  const runRace = (car: CarPhysics, isBot: boolean) => {
    let dist = 0;
    let speed = 0; // м/с
    let time = 0;
    const maxSpeedMs = car.topSpeed / 3.6;

    // 🎯 Учёт сцепления: плохое сцепление = пробуксовка на старте
    //    grip=0 → −40% к эффективности разгона, grip=100 → +0%
    const gripPenalty = (100 - Math.max(0, Math.min(100, car.grip))) / 100 * 0.4;
    
    // 🎯 Эффективное время до 100 км/ч (с учётом сцепления)
    let effectiveAccel = car.accel * (1 + gripPenalty);

    // 🎯 Бот «ошибается» на старте — рандом ±15%
    if (isBot) {
      effectiveAccel *= 0.85 + Math.random() * 0.3;
    }

    // 🎯 Пока не финишировал и не прошло 60 сек
    while (dist < TRACK_DISTANCE && time < 60) {
      const dt = 0.05; // шаг 50 мс — точнее
      time += dt;

      // 🎯 Разгон: линейно к максималке, затухает
      //    Чем ближе к макс. скорости — тем медленнее разгон
      const accelRate = (maxSpeedMs / effectiveAccel) * dt;
      speed += accelRate * (1 - speed / maxSpeedMs);

      // 🎯 Потолок — макс. скорость
      if (speed > maxSpeedMs) speed = maxSpeedMs;

      // 🎯 Пройденное расстояние
      dist += speed * dt;
    }

    return {
      time: Math.min(time, 60),
      dist,
    };
  };

  // 🎯 Запускаем обе гонки
  const playerRace = runRace(player, false);
  const opponentRace = runRace(opponent, true);

  // 🎯 Победитель — кто прошёл 400м первым (меньше время)
  const pFinished = playerRace.dist >= TRACK_DISTANCE;
  const oFinished = opponentRace.dist >= TRACK_DISTANCE;

  let winner: 'player' | 'opponent';
  if (pFinished && !oFinished) winner = 'player';
  else if (!pFinished && oFinished) winner = 'opponent';
  else if (pFinished && oFinished) {
    winner = playerRace.time < opponentRace.time ? 'player' : 'opponent';
  } else {
    // Оба не финишировали (не должно случиться)
    winner = playerRace.dist > opponentRace.dist ? 'player' : 'opponent';
  }

  // 🎯 Дополнительные тики (для анимации) — берём равномерно
  //    Просто строим кривую по времени
  const totalTime = Math.max(playerRace.time, opponentRace.time);
  const numTicks = 60;
  for (let i = 0; i <= numTicks; i++) {
    const t = (i / numTicks) * totalTime;
    
    // Приблизительная дистанция по времени (линейная аппроксимация)
    const pDist = Math.min(
      TRACK_DISTANCE,
      (playerRace.time > 0 ? t / playerRace.time : 1) * TRACK_DISTANCE
    );
    const oDist = Math.min(
      TRACK_DISTANCE,
      (opponentRace.time > 0 ? t / opponentRace.time : 1) * TRACK_DISTANCE
    );
    
    ticks.push({
      time: t,
      playerDist: pDist,
      opponentDist: oDist,
      playerSpeed: player.topSpeed / 3.6,
      opponentSpeed: opponent.topSpeed / 3.6,
    });
  }

  const pTime = pFinished ? playerRace.time : 99;
  const oTime = oFinished ? opponentRace.time : 99;

  return {
    winner,
    playerTime: pTime,
    opponentTime: oTime,
    ticks,
    log: [
      `🏁 Старт! Соперник: ${opponentName}`,
      `Вы проехали 400м за ${pTime.toFixed(2)} сек.`,
      `${opponentName} проехал за ${oTime.toFixed(2)} сек.`,
      winner === 'player'
        ? `🏆 Победа! Вы были быстрее на ${(oTime - pTime).toFixed(2)} сек.`
        : `💨 Поражение... Соперник был быстрее на ${(pTime - oTime).toFixed(2)} сек.`,
    ],
  };
}