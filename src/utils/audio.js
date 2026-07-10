// Programmatic notification sound using Web Audio API (zero dependencies, no static assets needed)
let audioCtx = null;

export const playChime = () => {
  try {
    // Lazy-initialize audio context to comply with browser autoplay policies
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    
    // First tone (higher frequency, shorter)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
    
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Second tone (slightly offset, resonant)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.08); // A5
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.25); // D6
    
    gain2.gain.setValueAtTime(0.05, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    
    osc2.start(now + 0.08);
    osc2.stop(now + 0.4);
    
  } catch (error) {
    console.warn("Web Audio API not supported or blocked by permissions:", error);
  }
};
