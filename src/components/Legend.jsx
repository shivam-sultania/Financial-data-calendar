import React from 'react';
import './Legend.css';

const Legend = () => {
  return (
    <div className="legend-container">
      {/* Volatility */}
      <div className="legend-section">
        <strong>Volatility:</strong>
        <span className="legend-label"><span className="legend-box" style={{ backgroundColor: '#d4edda' }} /> Low</span>
        <span className="legend-label"><span className="legend-box" style={{ backgroundColor: '#fff3cd' }} /> Medium</span>
        <span className="legend-label"><span className="legend-box" style={{ backgroundColor: '#f8d7da' }} /> High</span>
      </div>

      {/* Liquidity */}
      <div className="legend-section">
        <strong>Liquidity:</strong>
        <span className="legend-label"><span className="legend-box legend-dot" /> Low: Dots</span>
        <span className="legend-label"><span className="legend-box legend-stripe" /> Medium: Stripes</span>
        <span className="legend-label"><span className="legend-box legend-gradient" /> High: Gradient</span>
      </div>

      {/* Performance */}
      <div className="legend-section">
        <strong>Performance:</strong>
        <span className="legend-label"><span style={{ color: 'green' }}>↑</span> Positive</span>
        <span className="legend-label"><span style={{ color: 'red' }}>↓</span> Negative</span>
        <span className="legend-label"><span style={{ color: '#999' }}>→</span> Neutral</span>
      </div>
    </div>
  );
};

export default Legend;
