import React from 'react';
import './DashboardPanel.css';
import { calculateMovingAverage, calculateRSI } from '../utils/indicators'; // adjust path

const DashboardPanel = ({ selectedData, onClose }) => {
  if (!selectedData) return null;

  const { date, data, history } = selectedData;

  const volatility = ((data.high - data.low) / data.open * 100).toFixed(2);
  const percentChange = ((data.close - data.open) / data.open * 100).toFixed(2);
  const arrow = data.close > data.open ? '↑' : data.close < data.open ? '↓' : '→';
  const arrowColor = data.close > data.open ? 'green' : data.close < data.open ? 'red' : '#888';

  const movingAvg = history ? calculateMovingAverage(history, 20) : null;
  const rsi = history ? calculateRSI(history, 14) : null;

  return (
    <div className="dashboard-panel">
      <button className="close-btn" onClick={onClose}>✕</button>
      <h3>{date.format('YYYY-MM-DD')}</h3>
      <ul>
        <li><strong>Open:</strong> {data.open.toFixed(2)}</li>
        <li><strong>High:</strong> {data.high.toFixed(2)}</li>
        <li><strong>Low:</strong> {data.low.toFixed(2)}</li>
        <li><strong>Close:</strong> {data.close.toFixed(2)}</li>
        <li><strong>Volume:</strong> {data.volume.toLocaleString()}</li>
        <li><strong>Liquidity:</strong> {data.liquidity || 'N/A'}</li>
        <li><strong>Volatility:</strong> {volatility}%</li>
        <li>
          <strong>Change:</strong>{' '}
          <span style={{ color: arrowColor }}>
            {arrow} {percentChange}%
          </span>
        </li>
        <li><strong>MA (20d):</strong> {movingAvg ?? 'N/A'}</li>
        <li><strong>RSI (14d):</strong> {rsi ?? 'N/A'}</li>
      </ul>
    </div>
  );
};

export default DashboardPanel;
