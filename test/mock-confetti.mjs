/**
 * Mock canvas-confetti for headless Node.js test environments.
 */
export default function confetti(options) {
  if (global.__confettiCalls) {
    global.__confettiCalls.push(options);
  }
}
