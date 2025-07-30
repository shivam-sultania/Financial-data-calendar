import React, { useState } from 'react';
import CalendarView from './components/Calendar/CalendarView';
import Filters from './components/Filters';
import Legend from './components/Legend';

function App() {
  const [filters, setFilters] = useState({
    symbol: 'BTCUSDT',
    metrics: {
      volatility: true,
      liquidity: true,
      performance: true,
    },
  });

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Financial Data Calendar</h1>
      <Filters filters={filters} setFilters={setFilters} />
      <CalendarView filters={filters} />
      <Legend />
    </div>
  );
}

export default App;
