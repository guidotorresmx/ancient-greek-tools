/**
 * Plays a synthesized success "ding" sound using the Web Audio API.
 */
export function playSuccessSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    // Frequency sequence for a "pleasant" success sound (D5 -> A5)
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(587.33, context.currentTime); // D5
    oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.1); // A5

    // Volume envelope (quick attack, short decay)
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);

    // Clean up context after sound finishes to avoid memory leaks
    setTimeout(() => {
      if (context.state !== "closed") {
        context.close();
      }
    }, 500);
  } catch (e) {
    console.error("Failed to play success sound:", e);
  }
}

/**
 * Plays a synthesized subtle error "thud" sound.
 */
export function playErrorSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(150, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, context.currentTime + 0.2);

    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);

    setTimeout(() => {
      if (context.state !== "closed") {
        context.close();
      }
    }, 500);
  } catch (e) {
    console.error("Failed to play error sound:", e);
  }
}
