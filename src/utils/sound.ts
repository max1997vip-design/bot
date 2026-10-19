// src/utils/sound.ts
let audioCtx: AudioContext | null = null;

export const playSound = (type: 'click' | 'coin' | 'win') => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Если браузер заблокировал звук (до первого клика), пропускаем
    if (audioCtx.state === 'suspended') return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.05, now); // Тихий клик
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'coin') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.setValueAtTime(1600, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'win') {
      // Аккорд победы
      [400, 500, 600].forEach((freq, i) => {
        const o = audioCtx!.createOscillator();
        const g = audioCtx!.createGain();
        o.connect(g); g.connect(audioCtx!.destination);
        o.type = 'triangle';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.05, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.1);
        o.start(now + i * 0.1);
        o.stop(now + 0.5 + i * 0.1);
      });
    }
  } catch (e) {
    console.log('Audio error:', e);
  }
};