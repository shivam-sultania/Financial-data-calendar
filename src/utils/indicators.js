export const calculateMovingAverage = (data, period = 20) => {
  if (!data || data.length < period) return null;

  const recent = data.slice(-period);
  const sum = recent.reduce((acc, d) => acc + d.close, 0);
  return +(sum / period).toFixed(2);
};

export const calculateRSI = (data, period = 14) => {
  if (!data || data.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = data.length - period; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  if (losses === 0) return 100;
  const rs = gains / losses;
  return +(100 - 100 / (1 + rs)).toFixed(2);
};
