/**
 * Mock audio synthesizer tracking calls for headless Node.js tests.
 */
export const recordedAudioCalls = [];

export const audioSynth = {
  playChestReward: () => { recordedAudioCalls.push('playChestReward'); },
  playKeypressTick: () => { recordedAudioCalls.push('playKeypressTick'); },
  playErrorSoftRelease: () => { recordedAudioCalls.push('playErrorSoftRelease'); },
  playSuccessNote: (streak) => { recordedAudioCalls.push({ type: 'playSuccessNote', streak }); },
  playComboMilestone: (level) => { recordedAudioCalls.push({ type: 'playComboMilestone', level }); },
  playVictoryFanfare: () => { recordedAudioCalls.push('playVictoryFanfare'); },
  startZenMode: () => { recordedAudioCalls.push('startZenMode'); },
  stopZenMode: () => { recordedAudioCalls.push('stopZenMode'); },
  reset: () => { recordedAudioCalls.length = 0; },
};
