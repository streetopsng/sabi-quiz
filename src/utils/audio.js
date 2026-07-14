const getContext = () => {
  if (typeof window === 'undefined') return null;
  window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (window.audioCtx.state === 'suspended') {
    window.audioCtx.resume();
  }
  return window.audioCtx;
};

const playTone = (freq, type, duration, vol = 0.1) => {
  const ctx = getContext();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playJoin = () => {
  playTone(440, 'sine', 0.1, 0.1);
  setTimeout(() => playTone(554.37, 'sine', 0.2, 0.15), 100);
  setTimeout(() => playTone(659.25, 'sine', 0.3, 0.2), 200);
};

export const playStart = () => {
  playTone(330, 'square', 0.1, 0.1);
  setTimeout(() => playTone(330, 'square', 0.1, 0.1), 300);
  setTimeout(() => playTone(660, 'square', 0.4, 0.2), 600);
};

export const playTick = () => {
  playTone(800, 'sine', 0.05, 0.05);
};

export const playSelect = () => {
  playTone(300, 'sine', 0.1, 0.05);
};

export const playCorrect = () => {
  playTone(523.25, 'triangle', 0.1, 0.15); // C5
  setTimeout(() => playTone(659.25, 'triangle', 0.1, 0.15), 100); // E5
  setTimeout(() => playTone(783.99, 'triangle', 0.3, 0.2), 200); // G5
};

export const playWrong = () => {
  playTone(300, 'sawtooth', 0.2, 0.1);
  setTimeout(() => playTone(250, 'sawtooth', 0.3, 0.15), 150);
};

export const playWin = () => {
  const ctx = getContext();
  if (!ctx) return;
  // Simple arpeggio
  const notes = [440, 554.37, 659.25, 880, 659.25, 880, 1108.73];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'sine', 0.3, 0.2), i * 150);
  });
};
