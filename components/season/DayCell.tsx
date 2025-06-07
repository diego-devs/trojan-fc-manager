
import React from 'react';
import { Match } from '../../types';
import CalendarMatchCard from './CalendarMatchCard';
import { useTranslation } from '../../hooks/useTranslation';

interface DayCellProps {
  fullDate: Date; // Full JS Date object for this cell
  dayNumber: number | null; // Day number to display, or null for empty cells
  isCurrentMonth: boolean;
  isToday: boolean;
  matches: Match[];
  nextMatchId?: string | null;
  onDayClick: (date: string) => void; // Pass YYYY-MM-DD string, for adding new match
  onEditMatch: (match: Match) => void;
  onDeleteMatch: (matchId: string) => void;
  onSelectNextMatchCard?: (match: Match) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  fullDate,
  dayNumber,
  isCurrentMonth,
  isToday,
  matches,
  nextMatchId,
  onDayClick, // This is onAddMatchRequest from parent
  onEditMatch,
  onDeleteMatch,
  onSelectNextMatchCard
}) => {
  const { t } = useTranslation();

  if (!dayNumber) {
    // Adjusted min-h for empty cells to match new sizing
    return <div className="border border-slate-700/50 min-h-[10rem] sm:min-h-[11rem] md:min-h-[12rem]"></div>;
  }

  const dateString = fullDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const canAddMatch = matches.length === 0;

  // Increased min-height for the day cells
  const cellBaseClasses = "border border-slate-700/70 p-1.5 min-h-[10rem] sm:min-h-[11rem] md:min-h-[12rem] flex flex-col relative transition-colors duration-150";
  const currentMonthClasses = `bg-slate-800 ${canAddMatch ? 'hover:bg-slate-700/70' : ''}`;
  const otherMonthClasses = `bg-slate-800/50 text-slate-500 ${canAddMatch ? 'hover:bg-slate-700/50' : ''}`;
  const todayClasses = "ring-2 ring-sky-500";
  const cursorClass = canAddMatch ? 'cursor-pointer' : 'cursor-default';

  const handleCellClick = () => {
    if (canAddMatch) {
      onDayClick(dateString);
    }
  };
  
  let ariaLabel = '';
  if (canAddMatch) {
    ariaLabel = t('addMatchOnDate', { date: fullDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) });
  } else {
    ariaLabel = `${matches.length} ${matches.length === 1 ? 'match' : 'matches'} on ${fullDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}. Select a match to view or edit.`;
  }


  return (
    <div
      className={`${cellBaseClasses} ${isCurrentMonth ? currentMonthClasses : otherMonthClasses} ${isToday ? todayClasses : ''} ${cursorClass}`}
      onClick={handleCellClick}
      role={canAddMatch ? "button" : undefined} 
      aria-label={ariaLabel}
      tabIndex={canAddMatch ? 0 : undefined} 
    >
      <span className={`text-xs font-semibold ${isToday ? 'text-sky-400' : (isCurrentMonth ? 'text-slate-300' : 'text-slate-600')}`}>
        {dayNumber}
      </span>
      {/* Increased max-height for the match container, responsive values */}
      <div className="mt-1 flex-grow overflow-y-auto max-h-[calc(10rem-2rem)] sm:max-h-[calc(11rem-2rem)] md:max-h-[calc(12rem-2rem)] custom-scrollbar-thin">
        {matches.length === 0 && isCurrentMonth && (
          <p className="text-slate-500 text-2xs italic text-center mt-2">{t('noMatchesThisDay')}</p>
        )}
        {matches.map(match => (
          <CalendarMatchCard
            key={match.id}
            match={match}
            isNextMatch={match.id === nextMatchId}
            onEdit={onEditMatch} 
            onDelete={onDeleteMatch}
            onSelectNextMatch={onSelectNextMatchCard}
          />
        ))}
      </div>
    </div>
  );
};

export default DayCell;
