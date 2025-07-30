import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BINANCE_BASE_URL;

export const fetchOHLCV = async (symbol = 'BTCUSDT', interval = '1d', startTime, endTime) => {
  try {
    const res = await axios.get(`${BASE_URL}/klines`, {
      params: {
        symbol,
        interval,
        startTime: startTime?.valueOf(),
        endTime: endTime?.valueOf(),
      },
    });

    return res.data.map(d => ({
      time: new Date(d[0]),
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
      volume: parseFloat(d[5]),
    }));
  } catch (e) {
    console.error('Error fetching Binance data:', e);
    return [];
  }
};
