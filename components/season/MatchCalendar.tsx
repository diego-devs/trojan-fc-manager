
import React from 'react';
import { Match } from '../../types';
import DayCell from './DayCell';
import { useTranslation } from '../../hooks/useTranslation';

interface MatchCalendarProps {
  currentDisplayDate: Date;
  setCurrentDisplayDate: (date: Date) => void;
  matches: Match[];
  onAddMatchRequest: (date: string) => void; // YYYY-MM-DD
  onEditMatchRequest: (match: Match) => void;
  onDeleteMatchRequest: (matchId: string) => void;
  onSelectNextMatchCard?: (match: Match) => void;
}

const MatchCalendar: React.FC<MatchCalendarProps> = ({
  currentDisplayDate,
  setCurrentDisplayDate,
  matches,
  onAddMatchRequest,
  onEditMatchRequest,
  onDeleteMatchRequest,
  onSelectNextMatchCard
}) => {
  const { t, language } = useTranslation();

  const getMonthName = (monthIndex: number) => {
    return t(`month_${monthIndex}` as any); // Use 'any' if TranslationKey doesn't cover dynamic keys like this
  };
  
  const daysOfWeek = [
    t('daySun'), t('dayMon'), t('dayTue'), t('dayWed'), t('dayThu'), t('dayFri'), t('daySat')
  ];
  
  // Adjust starting day based on locale if needed, for now Sun-Sat
  // const firstDayOfWeek = 0; // Sunday

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDisplayDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDisplayDate(newDate);
  };

  const changeYear = (delta: number) => {
    const newDate = new Date(currentDisplayDate);
    newDate.setFullYear(newDate.getFullYear() + delta);
    setCurrentDisplayDate(newDate);
  };

  const goToToday = () => {
    setCurrentDisplayDate(new Date());
  };

  const getCalendarGrid = () => {
    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid: (Date | null)[] = [];
    // Fill leading empty cells
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(null);
    }
    // Fill days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(new Date(year, month, day));
    }
    // Fill trailing empty cells to complete the grid (usually 35 or 42 cells for 5 or 6 weeks)
    const totalCells = grid.length <= 35 ? 35 : 42;
    while (grid.length < totalCells) {
      grid.push(null);
    }
    return grid;
  };

  const calendarGridDates = getCalendarGrid();
  const today = new Date();
  today.setHours(0,0,0,0); // Normalize today for date comparisons

  const findNextMatch = (): Match | null => {
    const now = new Date();
    const upcomingMatches = matches
      .filter(match => new Date(match.date + 'T' + match.time) >= now)
      .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
    return upcomingMatches.length > 0 ? upcomingMatches[0] : null;
  };
  const nextMatch = findNextMatch();

  return (
    <div className="bg-slate-800/70 p-3 sm:p-4 rounded-lg shadow-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button onClick={() => changeYear(-1)} title={t('prevYear')} className="p-1.5 hover:bg-slate-700 rounded-md">«</button>
          <button onClick={() => changeMonth(-1)} title={t('prevMonth')} className="p-1.5 hover:bg-slate-700 rounded-md">‹</button>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-sky-400 text-center">
          {getMonthName(currentDisplayDate.getMonth())} {currentDisplayDate.getFullYear()}
        </h2>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button onClick={() => changeMonth(1)} title={t('nextMonth')} className="p-1.5 hover:bg-slate-700 rounded-md">›</button>
          <button onClick={() => changeYear(1)} title={t('nextYear')} className="p-1.5 hover:bg-slate-700 rounded-md">»</button>
        </div>
      </div>
      <div className="text-center mb-3">
        <button 
            onClick={goToToday} 
            className="py-1 px-3 bg-sky-600 hover:bg-sky-700 text-xs sm:text-sm rounded-md shadow transition-colors"
        >
            {t('todayButton')}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-700 border border-slate-700">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center py-2 text-xs sm:text-sm font-medium text-slate-400 bg-slate-800">
            {day}
          </div>
        ))}
        {calendarGridDates.map((dateOrNull, index) => {
          if (!dateOrNull) {
            return <DayCell key={`empty-${index}`} fullDate={new Date()} dayNumber={null} isCurrentMonth={false} isToday={false} matches={[]} onDayClick={() => {}} onEditMatch={onEditMatchRequest} onDeleteMatch={onDeleteMatchRequest} />;
          }
          const dateObj = dateOrNull;
          dateObj.setHours(0,0,0,0); // Normalize for comparison
          const dateString = dateObj.toISOString().split('T')[0];
          const matchesOnDay = matches.filter(m => m.date === dateString).sort((a,b) => a.time.localeCompare(b.time));
          
          return (
            <DayCell
              key={dateString}
              fullDate={dateObj}
              dayNumber={dateObj.getDate()}
              isCurrentMonth={dateObj.getMonth() === currentDisplayDate.getMonth()}
              isToday={dateObj.getTime() === today.getTime()}
              matches={matchesOnDay}
              nextMatchId={nextMatch?.id}
              onDayClick={onAddMatchRequest}
              onEditMatch={onEditMatchRequest}
              onDeleteMatch={onDeleteMatchRequest}
              onSelectNextMatchCard={onSelectNextMatchCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MatchCalendar;
