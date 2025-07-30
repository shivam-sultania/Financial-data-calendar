import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { fetchOHLCV } from '../../api/useHistoricalBinanceData';
import CalendarCell from './CalendarCell';
import DashboardPanel from '../DashboardPanel';
import { getLiquidityLevel } from '../../utils/liquidity';
import { exportToCSV, exportToPDF } from '../../utils/exportData';
import './DailyView.css';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const generateCalendarDates = (month) => {
  const startOfMonth = month.startOf('month');
  const endOfMonth = month.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  let date = startDate.clone();
  const days = [];
  while (date.isBefore(endDate) || date.isSame(endDate, 'day')) {
    days.push(date.clone());
    date = date.add(1, 'day');
  }
  return days;
};

const DailyView = ({ currentMonth, filters }) => {
  const [ohlcv, setOhlcv] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [focusIndex, setFocusIndex] = useState(null);
  const [columns, setColumns] = useState(7);
  const gridRef = useRef(null);

  const days = generateCalendarDates(currentMonth);
  const maxVolume = Math.max(...ohlcv.map(d => d.volume || 0));
  const enrichedData = ohlcv.map(d => ({
    ...d,
    liquidity: getLiquidityLevel(d.volume, maxVolume),
  }));

  const firstFocusDone = useRef(false);

  // ✅ FIX: getHistory now has access to up-to-date enrichedData
  const getHistory = (date) => {
    return enrichedData
      .filter(d => dayjs(d.time).isSameOrBefore(date))
      .slice(-30);
  };

  // Fetch OHLCV data
  useEffect(() => {
    const start = currentMonth.startOf('month').subtract(30, 'day').startOf('week');
    const end = currentMonth.endOf('month').endOf('week');

    setLoading(true);
    setError(null);

    fetchOHLCV(filters.symbol, '1d', start, end)
      .then(data => setOhlcv(data))
      .catch(() => setError('Failed to fetch OHLCV data'))
      .finally(() => setLoading(false));
  }, [filters.symbol, currentMonth]);

  // Focus today's date
  useEffect(() => {
    if (firstFocusDone.current || enrichedData.length === 0) return;

    let index = days.findIndex(date => date.isSame(dayjs(), 'day'));
    if (index === -1) {
      index = days.findIndex(date =>
        enrichedData.find(d => dayjs(d.time).isSame(date, 'day'))
      );
    }

    setFocusIndex(index !== -1 ? index : 0);
    firstFocusDone.current = true;
  }, [days, enrichedData]);

  // Auto-detect columns for keyboard nav
  useEffect(() => {
    const updateColumns = () => {
      if (!gridRef.current) return;
      const cells = Array.from(gridRef.current.querySelectorAll('.calendar-cell'));
      if (cells.length < 2) return;
      const topOffset = cells[0].offsetTop;
      const columnsCount = cells.findIndex(cell => cell.offsetTop !== topOffset);
      if (columnsCount > 0) setColumns(columnsCount);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [ohlcv]);

  if (loading) return <div className="daily-loading">Loading data...</div>;
  if (error) return <div className="daily-error">{error}</div>;

  return (
    <>
      <div className="daily-export-buttons">
        <button onClick={() => exportToCSV(enrichedData, 'daily_data.csv')} className="export-btn">
          Export CSV
        </button>
        <button onClick={() => exportToPDF(enrichedData, 'daily_data.pdf')} className="export-btn">
          Export PDF
        </button>
      </div>

      <div className="daily-grid" ref={gridRef}>
        {days.map((date, i) => {
          const ohlc = enrichedData.find(d => dayjs(d.time).isSame(date, 'day'));

          return (
            <CalendarCell
              key={date.format('YYYY-MM-DD')}
              date={date}
              data={ohlc}
              maxVolume={maxVolume}
              index={i}
              totalCells={days.length}
              focusIndex={focusIndex}
              setFocusIndex={setFocusIndex}
              openPanel={setSelectedData}
              columns={columns}
              onClick={() => setSelectedData({ date, data: ohlc, history: getHistory(date) })}
              getHistory={getHistory}
              showVolatility={filters.metrics.volatility}
              showLiquidity={filters.metrics.liquidity}
              showPerformance={filters.metrics.performance}
            />
          );
        })}
      </div>

      <DashboardPanel selectedData={selectedData} onClose={() => setSelectedData(null)} />
    </>
  );
};

export default DailyView;
