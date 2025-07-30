import React from 'react';

const Filters = ({ filters, setFilters }) => {
  const handleSymbolChange = (e) => {
    setFilters((prev) => ({ ...prev, symbol: e.target.value }));
  };

  const handleToggleMetric = (metric) => {
    setFilters((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: !prev.metrics[metric],
      },
    }));
  };

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem 0',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      {/* Symbol Select */}
      <label>
        Symbol:
        <select value={filters.symbol} onChange={handleSymbolChange}>
          <option value="BTCUSDT">BTCUSDT</option>
          <option value="ETHUSDT">ETHUSDT</option>
          <option value="BNBUSDT">BNBUSDT</option>
        </select>
      </label>

      {/* Metrics Checkboxes */}
      <label>
        <input
          type="checkbox"
          checked={filters.metrics.volatility}
          onChange={() => handleToggleMetric('volatility')}
        />
        Volatility
      </label>
      <label>
        <input
          type="checkbox"
          checked={filters.metrics.liquidity}
          onChange={() => handleToggleMetric('liquidity')}
        />
        Liquidity
      </label>
      <label>
        <input
          type="checkbox"
          checked={filters.metrics.performance}
          onChange={() => handleToggleMetric('performance')}
        />
        Performance
      </label>
    </div>
  );
};

export default Filters;
