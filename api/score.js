import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const kv = Redis.fromEnv();

function validateInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calcHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (calcHash !== hash) return null;
  try { return JSON.parse(params.get('user') || '{}'); } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { initData, money } = req.body || {};
  if (!initData || typeof money !== 'number') {
    return res.status(400).json({ error: 'Bad request' });
  }

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const user = validateInitData(initData, botToken);
  if (!user || !user.id) {
    return res.status(403).json({ error: 'Invalid auth' });
  }

  const safeMoney = Math.max(0, Math.floor(money));
  const uid = String(user.id);

  await kv.hset(`user:${uid}`, {
    id: uid,
    name: user.first_name || 'Игрок',
    username: user.username || '',
    photo: user.photo_url || '',
    money: safeMoney,
    updated: Date.now()
  });
  
  await kv.zadd('leaderboard', { score: safeMoney, member: uid });

  return res.status(200).json({ ok: true });
}