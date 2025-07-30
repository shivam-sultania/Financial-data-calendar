import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { fetchOHLCV } from '../../api/useHistoricalBinanceData';
import CalendarCell from './CalendarCell';
import DashboardPanel from '../DashboardPanel';
import { getLiquidityLevel } from '../../utils/liquidity';
import { exportToCSV, exportToPDF } from '../../utils/exportData';
import './WeeklyView.css';

const groupByWeek = (data) => {
  const weeks = {};

  data.forEach(entry => {
    const time = dayjs(entry.time);
    const weekStart = time.startOf('week').format('YYYY-MM-DD');
    if (!weeks[weekStart]) weeks[weekStart] = [];
    weeks[weekStart].push(entry);
  });

  return weeks;
};

const aggregateWeek = (entries) => {
  if (!entries.length) return null;
  const open = entries[0].open;
  const close = entries[entries.length - 1].close;
  const high = Math.max(...entries.map(d => d.high));
  const low = Math.min(...entries.map(d => d.low));
  const volume = entries.reduce((sum, d) => sum + d.volume, 0);

  return {
    time: entries[0].time,
    open,
    close,
    high,
    low,
    volume,
  };
};

const WeeklyView = ({ currentMonth, filters }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [focusIndex, setFocusIndex] = useState(null);

  const gridRef = useRef(null);
  const [columns, setColumns] = useState(3); // Optional responsive behavior

  useEffect(() => {
    const start = currentMonth.startOf('month').subtract(30, 'day').startOf('week');
    const end = currentMonth.endOf('month').endOf('week');

    setLoading(true);
    setError(null);

    fetchOHLCV(filters.symbol, '1d', start, end)
      .then(data => {
        const grouped = groupByWeek(data);
        const aggregated = Object.entries(grouped).map(([week, entries]) => {
          const agg = aggregateWeek(entries);
          return {
            ...agg,
            weekStart: dayjs(week),
            label: `Week of ${dayjs(week).format('MMM D')}`,
          };
        });

        // Only show weeks that fall within the current month
        const visibleWeeks = aggregated.filter(w =>
          w.weekStart.isSame(currentMonth, 'month')
        );

        const maxVol = Math.max(...visibleWeeks.map(d => d.volume || 0));
        const enriched = visibleWeeks.map(d => ({
          ...d,
          liquidity: getLiquidityLevel(d.volume, maxVol),
        }));

        setWeeklyData(enriched);
      })
      .catch(() => setError('Failed to fetch OHLCV data'))
      .finally(() => setLoading(false));
  }, [filters.symbol, currentMonth]);

  useEffect(() => {
    if (weeklyData.length > 0) {
      setFocusIndex(0); 
    }
  }, [weeklyData]);

  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current) {
        const wrappers = gridRef.current.querySelectorAll(':scope > div');
        if (wrappers.length > 1) {
          const wrapperWidth = wrappers[0].offsetWidth;
          const gridWidth = gridRef.current.offsetWidth;
          const cols = Math.floor(gridWidth / wrapperWidth);
          if (cols > 0) setColumns(cols);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [weeklyData]);

  const maxVolume = Math.max(...weeklyData.map(d => d.volume || 0));

  if (loading) return <div className="weekly-loading">Loading data...</div>;
  if (error) return <div className="weekly-error">{error}</div>;

  return (
    <>
      <div className="weekly-export-buttons">
        <button onClick={() => exportToCSV(weeklyData, 'weekly_data.csv')} className="export-btn">Export CSV</button>
        <button onClick={() => exportToPDF(weeklyData, 'weekly_data.pdf')} className="export-btn">Export PDF</button>
      </div>

      <div className="weekly-grid" ref={gridRef}>
        {weeklyData.map((week, i) => (
          <div key={week.weekStart}>
            <div className="weekly-label">{week.label}</div>
            <CalendarCell
              date={week.weekStart}
              data={week}
              maxVolume={maxVolume}
              index={i}
              totalCells={weeklyData.length}
              focusIndex={focusIndex}
              setFocusIndex={setFocusIndex}
              openPanel={setSelectedData}
              columns={columns}
              onClick={() => {
                const index = weeklyData.findIndex(d => d.weekStart === week.weekStart);
                const history = weeklyData.slice(Math.max(0, index - 29), index + 1);
                setSelectedData({ date: week.weekStart, data: week, history });
              }}
              showVolatility={filters.metrics.volatility}
              showLiquidity={filters.metrics.liquidity}
              showPerformance={filters.metrics.performance}
            />
          </div>
        ))}
      </div>

      <DashboardPanel selectedData={selectedData} onClose={() => setSelectedData(null)} />
    </>
  );
};

export default WeeklyView;
