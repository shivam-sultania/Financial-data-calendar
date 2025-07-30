// src/utils/liquidity.js

export const getLiquidityLevel = (volume, maxVolume) => {
  const ratio = volume / maxVolume;
  if (ratio < 0.3) return 'low';
  if (ratio < 0.7) return 'medium';
  return 'high';
};
