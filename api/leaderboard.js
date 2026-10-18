import { Redis } from '@upstash/redis';

const kv = Redis.fromEnv();

export default async function handler(req, res) {
  // Запрещаем кэшировать результаты дольше 5 секунд
  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate');
  
  const ids = await kv.zrange('leaderboard', 0, 19, { rev: true });
  
  if (!ids || ids.length === 0) {
    return res.status(200).json({ players: [] });
  }

  const players = await Promise.all(ids.map(async (id) => {
    const data = await kv.hgetall(`user:${id}`);
    if (!data) return null;
    return {
      id,
      name: data.name || 'Игрок',
      money: Number(data.money) || 0,
      photo: data.photo || ''
    };
  }));

  return res.status(200).json({ players: players.filter(Boolean) });
}