
import React from 'react';
import { Match } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface CalendarMatchCardProps {
  match: Match;
  isNextMatch: boolean;
  onEdit: (match: Match) => void; // For editing/viewing details via modal
  onDelete: (matchId: string) => void;
  onSelectNextMatch?: (match: Match) => void; // Specific action for "View Details" text on Next Match card
}

const CalendarMatchCard: React.FC<CalendarMatchCardProps> = ({ match, isNextMatch, onEdit, onDelete, onSelectNextMatch }) => {
  const { t } = useTranslation();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const matchIdToDelete = match.id;
    const opponentName = match.opponent; 

    console.log(`[CalendarMatchCard] handleDeleteClick: Clicked delete for match ID: ${matchIdToDelete}, Opponent: ${opponentName}.`);
    // Directly call onDelete without confirmation
    onDelete(matchIdToDelete);
    console.log(`[CalendarMatchCard] handleDeleteClick: Directly calling onDelete for match ID: ${matchIdToDelete}.`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(match);
  };

  const handleCardPrimaryClick = () => {
    onEdit(match);
  };

  const handleNextMatchViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isNextMatch && onSelectNextMatch) {
        onSelectNextMatch(match);
    } else {
      onEdit(match);
    }
  };
  
  const paddingClass = isNextMatch ? "p-1" : "p-2"; // Further reduced padding for next match card
  const baseCardClasses = `group relative ${paddingClass} rounded-md shadow-md cursor-pointer transition-all duration-150 ease-in-out w-full h-full flex flex-col justify-between`;
  const defaultCardClasses = "bg-slate-700 hover:bg-slate-600 text-slate-100";
  const nextMatchCardClasses = "bg-silver-300 text-slate-800 ring-2 ring-yellow-400 hover:ring-yellow-500 shadow-lg";

  const nextMatchBannerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #FFD700 0%, #F0E68C 50%, #B8860B 100%)',
    color: '#000',
    padding: '0.5px 3px', // Further reduced padding for banner
    fontSize: '0.6rem', // Further reduced font size for banner
    fontWeight: 'bold',
    borderRadius: '9999px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    position: 'absolute',
    top: '-4px', 
    right: '-4px', 
  };

  return (
    <div 
      className={`${baseCardClasses} ${isNextMatch ? nextMatchCardClasses : defaultCardClasses}`}
      style={isNextMatch ? {backgroundColor: '#C0C0C0'} : {}}
      onClick={handleCardPrimaryClick}
      role="button"
      aria-label={`${t('editButton')} ${match.opponent} at ${match.time}${isNextMatch ? ', ' + t('nextMatchCardTitle') : ''}`}
    >
      <div> 
        {isNextMatch && (
          <div style={nextMatchBannerStyle}>
            {t('nextMatchCardTitle')}
          </div>
        )}
        <div className={`font-semibold truncate ${isNextMatch ? 'text-2xs text-slate-900 pt-1' : 'text-xs text-slate-100'}`} title={match.opponent}>
          {match.isHome ? '(H)' : '(A)'} {match.opponent}
        </div>
        <div className={`text-2xs ${isNextMatch ? 'text-slate-700' : 'text-slate-400'}`}>{match.time}</div>
      </div>

      {isNextMatch && (
         <div className="text-center my-0.5"> {/* Reduced margin */}
            <button 
                onClick={handleNextMatchViewDetailsClick}
                className={`text-2xs font-semibold py-0.5 px-1 rounded ${ isNextMatch ? 'bg-yellow-500/50 hover:bg-yellow-500/70 text-yellow-900' : 'bg-sky-500/20 text-sky-300'}`}
                aria-label={`${t('viewMatchDetails')} for ${match.opponent}`}
            >
                 {t('viewMatchDetails')}
             </button>
         </div>
      )}
      
      <div className="absolute bottom-0.5 right-0.5 flex opacity-0 group-hover:opacity-100 transition-opacity duration-200"> {/* Adjusted position */}
        <button
          onClick={handleEditClick}
          className="p-0.5 text-sky-400 hover:text-sky-200 bg-slate-700/50 hover:bg-slate-600/50 rounded-full mr-0.5" // Adjusted size & margin
          aria-label={`${t('editButton')} ${match.opponent}`}
          title={t('editButton')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"> {/* Smaller icon */}
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-0.5 text-red-400 hover:text-red-200 bg-slate-700/50 hover:bg-slate-600/50 rounded-full" // Adjusted size
          aria-label={`${t('deleteMatchButton')} ${match.opponent}`}
          title={t('deleteMatchButton')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"> {/* Smaller icon */}
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CalendarMatchCard;
