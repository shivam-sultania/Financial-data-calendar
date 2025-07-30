import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/klines', async (req, res) => {
  const { symbol, interval, startTime, endTime } = req.query;

  if (!symbol || !interval || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol,
        interval,
        startTime,
        endTime,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching Binance data:', err.message);
    res.status(500).json({ error: 'Failed to fetch data from Binance' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
