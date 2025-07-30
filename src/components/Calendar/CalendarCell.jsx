import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import Tooltip from '@mui/material/Tooltip';
import './CalendarCell.css';

const getVolatilityLevel = (data) => {
  if (!data) return 'none';
  const vol = (data.high - data.low) / data.open;
  if (vol < 0.01) return 'low';
  if (vol < 0.03) return 'medium';
  return 'high';
};

const getVolatilityColor = (level) => {
  switch (level) {
    case 'low': return '#d4edda';
    case 'medium': return '#fff3cd';
    case 'high': return '#f8d7da';
    default: return '#f0f0f0';
  }
};

const getVolumeLevel = (volume, maxVolume) => {
  const percent = volume / maxVolume;
  if (percent < 0.3) return 'low';
  if (percent < 0.7) return 'medium';
  return 'high';
};

const getVolumeBarColor = (level) => {
  switch (level) {
    case 'low': return '#9ecae1';
    case 'medium': return '#3182bd';
    case 'high': return '#08519c';
    default: return '#ccc';
  }
};

const getPerformance = (data) => {
  if (!data) return { symbol: '→', color: '#999' };
  const change = data.close - data.open;
  if (change > 0) return { symbol: '↑', color: 'green' };
  if (change < 0) return { symbol: '↓', color: 'red' };
  return { symbol: '→', color: '#999' };
};


const getTooltipText = (date, data) => {
  if (!data) return `Date: ${date.format('YYYY-MM-DD')}\nNo Data`;
  const change = data.close - data.open;
  const percent = ((change / data.open) * 100).toFixed(2);
  return `
Date: ${date.format('YYYY-MM-DD')}
Open: ${data.open.toFixed(2)}
High: ${data.high.toFixed(2)}
Low: ${data.low.toFixed(2)}
Close: ${data.close.toFixed(2)}
Volume: ${data.volume.toLocaleString()}
Change: ${percent}%`;
};

const CalendarCell = ({
  date,
  data,
  maxVolume,
  onClick,
  showVolatility,
  showLiquidity,
  showPerformance,
  index,
  totalCells,
  focusIndex,
  setFocusIndex,
  openPanel,
  columns = 4,
  getHistory,
}) => {
  const isToday = date.isSame(dayjs(), 'day');
  const volatilityLevel = getVolatilityLevel(data);
  const backgroundColor = getVolatilityColor(volatilityLevel);
  const volume = data?.volume || 0;
  const volumePercent = maxVolume ? volume / maxVolume : 0;
  const volumeLevel = getVolumeLevel(volume, maxVolume);
  const volumeColor = getVolumeBarColor(volumeLevel);

  const ref = useRef(null);

  useEffect(() => {
    if (focusIndex === index && ref.current) {
      ref.current.focus();
    }
  }, [focusIndex, index]);

  const handleKeyDown = (e) => {
    if (!setFocusIndex || !openPanel) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setFocusIndex((prev) => (prev + 1) % totalCells);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setFocusIndex((prev) => (prev - 1 + totalCells) % totalCells);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (index + columns < totalCells) {
          setFocusIndex(index + columns);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index - columns >= 0) {
          setFocusIndex(index - columns);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (data) {
          const history = getHistory ? getHistory(date) : [];
          openPanel({ date, data, history });
        }
        break;
      case 'Escape':
        e.preventDefault();
        openPanel(null);
        break;
      default:
        break;
    }
  };


  return (
    <Tooltip title={<pre>{getTooltipText(date, data)}</pre>} arrow placement="top">
      <div
        ref={ref}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={onClick}
        className={`calendar-cell ${isToday ? 'calendar-cell-today' : ''}`}
        style={{
          backgroundColor: showVolatility ? backgroundColor : '#f0f0f0',
          cursor: data ? 'pointer' : 'default',
        }}
      >
        {showLiquidity && data?.liquidity === 'low' && <div className="overlay overlay-dots" />}
        {showLiquidity && data?.liquidity === 'medium' && <div className="overlay overlay-stripes" />}
        {showLiquidity && data?.liquidity === 'high' && (
          <div
            className="overlay overlay-gradient"
            style={{ background: `linear-gradient(135deg, ${backgroundColor}88, ${backgroundColor}33)` }}
          />
        )}

        <div className="cell-content">
          <div className="cell-date">{date.date()}</div>
          {data ? (
            <>
              <div>Close: {data.close.toFixed(2)}</div>
              {showPerformance && (
                <div style={{ color: getPerformance(data).color }}>
                  {getPerformance(data).symbol}
                </div>
              )}
            </>
          ) : (
            <div className="no-data">No Data</div>
          )}
        </div>

        {showLiquidity && data && (
          <div
            className="volume-bar"
            style={{
              width: `${volumePercent * 100}%`,
              backgroundColor: volumeColor,
            }}
          />
        )}
      </div>
    </Tooltip>
  );
};

export default CalendarCell;
