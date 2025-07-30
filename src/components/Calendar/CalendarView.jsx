import React, { useState } from 'react';
import dayjs from 'dayjs';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';

const CalendarView = ({ filters }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [view, setView] = useState('daily');
  
  const handlePrev = () => {
    setCurrentMonth(prev => view === 'monthly'
      ? prev.subtract(1, 'year')
      : prev.subtract(1, 'month')
    );
  };
  
  const handleNext = () => {
    setCurrentMonth(prev => view === 'monthly'
      ? prev.add(1, 'year')
      : prev.add(1, 'month')
    );
  };

  return (
    <div>
      {/* 🔁 View Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setView('daily')} disabled={view === 'daily'}>
          Daily
        </button>
        <button onClick={() => setView('weekly')} disabled={view === 'weekly'}>
          Weekly
        </button>
        <button onClick={() => setView('monthly')} disabled={view === 'monthly'}>
          Monthly
        </button>
      </div>

      {/* 📅 Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button onClick={handlePrev}>←</button>
        <h2>{currentMonth.format('MMMM YYYY')}</h2>
        <button onClick={handleNext}>→</button>
      </div>

      {/* 🔍 View Renderer */}
      {view === 'daily' && <DailyView currentMonth={currentMonth} filters={filters} />}
      {view === 'weekly' && <WeeklyView currentMonth={currentMonth} filters={filters} />}
      {view === 'monthly' && <MonthlyView currentYear={currentMonth.year()} filters={filters} />}
    </div>
  );
};

export default CalendarView;
