import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { fetchOHLCV } from '../../api/useHistoricalBinanceData';
import CalendarCell from './CalendarCell';
import DashboardPanel from '../DashboardPanel';
import { getLiquidityLevel } from '../../utils/liquidity';
import { exportToCSV, exportToPDF } from '../../utils/exportData';
import './MonthlyView.css';

const groupByMonth = (data, year) => {
  const months = {};
  data.forEach(entry => {
    const time = dayjs(entry.time);
    if (time.year() !== year) return;

    const month = time.month();
    if (!months[month]) months[month] = [];
    months[month].push(entry);
  });
  return months;
};

const aggregateMonth = (entries) => {
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

const MonthlyView = ({ currentYear, filters }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [focusIndex, setFocusIndex] = useState(null);
  const [columns, setColumns] = useState(4);
  const gridRef = useRef(null);

  useEffect(() => {
    const start = dayjs().year(currentYear).startOf('year').subtract(60, 'day');
    const end = dayjs().year(currentYear).endOf('year');

    setLoading(true);
    setError(null);

    fetchOHLCV(filters.symbol, '1d', start, end)
      .then(data => {
        const grouped = groupByMonth(data, currentYear);
        const aggregated = Object.entries(grouped).map(([month, entries]) => {
          const agg = aggregateMonth(entries);
          return {
            ...agg,
            month: parseInt(month),
            label: dayjs().month(parseInt(month)).format('MMM'),
          };
        });

        const maxVol = Math.max(...aggregated.map(d => d.volume || 0));
        const enriched = aggregated.map(d => ({
          ...d,
          liquidity: getLiquidityLevel(d.volume, maxVol),
        }));

        setMonthlyData(enriched);
      })
      .catch(() => setError('Failed to fetch OHLCV data'))
      .finally(() => setLoading(false));
  }, [filters.symbol, currentYear]);

  useEffect(() => {
    const currentMonthIndex = monthlyData.findIndex(d => d.month === dayjs().month());
    if (currentMonthIndex !== -1) {
      setFocusIndex(currentMonthIndex);
    }
  }, [monthlyData]);

  useLayoutEffect(() => {
    const calculateColumns = () => {
      if (gridRef.current) {
        const wrappers = Array.from(gridRef.current.children);
        if (wrappers.length > 1) {
          const wrapperWidth = wrappers[0].getBoundingClientRect().width;
          const gridWidth = gridRef.current.getBoundingClientRect().width;
          const estimatedCols = Math.floor(gridWidth / wrapperWidth);
          if (estimatedCols > 0) {
            setColumns(estimatedCols);
          }
        }
      }
    };

    calculateColumns();
    window.addEventListener('resize', calculateColumns);
    return () => window.removeEventListener('resize', calculateColumns);
  }, []);

  const maxVolume = Math.max(...monthlyData.map(d => d.volume || 0));

  if (loading) return <div className="monthly-loading">Loading data...</div>;
  if (error) return <div className="monthly-error">{error}</div>;

  return (
    <>
      <div className="monthly-export-buttons">
        <button onClick={() => exportToCSV(monthlyData, 'monthly_data.csv')} className="export-btn">Export CSV</button>
        <button onClick={() => exportToPDF(monthlyData, 'monthly_data.pdf')} className="export-btn">Export PDF</button>
      </div>

      <div className="monthly-grid" ref={gridRef}>
        {monthlyData.map((month, i) => (
          <div key={month.label}>
            <div className="monthly-label">{month.label}</div>
            <CalendarCell
              date={dayjs().year(currentYear).month(month.month)}
              data={month}
              maxVolume={maxVolume}
              index={i}
              totalCells={monthlyData.length}
              focusIndex={focusIndex}
              setFocusIndex={setFocusIndex}
              openPanel={setSelectedData}
              columns={columns}
              onClick={() => {
                const history = monthlyData.slice(Math.max(0, i - 29), i + 1);
                setSelectedData({
                  date: dayjs().year(currentYear).month(month.month),
                  data: month,
                  history,
                });
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

export default MonthlyView;
