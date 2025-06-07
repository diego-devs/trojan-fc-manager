
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Match, LeagueTableRow, TeamStatistic, PlayerStatistic } from '../types';
import MatchCalendar from './season/MatchCalendar';
import MatchModal from './season/MatchModal';
import StatisticsTabs from './season/StatisticsTabs';

interface SeasonPageProps {
  matches: Match[];
  onSaveMatch: (match: Match) => void;
  onDeleteMatch: (matchId: string) => void;
  leagueTableData: LeagueTableRow[];
  teamStatsData: TeamStatistic[];
  playerStatsData: PlayerStatistic[];
  onNavigateBack: () => void;
}

const SeasonPage: React.FC<SeasonPageProps> = ({ 
  matches,
  onSaveMatch,
  onDeleteMatch,
  leagueTableData,
  teamStatsData,
  playerStatsData,
  onNavigateBack,
}) => {
  const { t } = useTranslation();
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchModalData, setMatchModalData] = useState<Partial<Match> | null>(null);
  const [matchModalMode, setMatchModalMode] = useState<'add' | 'edit'>('add');


  const handleAddMatchRequest = (date: string) => { 
    setMatchModalData({ date, matchNotes: '' }); // Initialize matchNotes for new match
    setMatchModalMode('add');
    setIsMatchModalOpen(true);
  };

  const handleEditMatchRequest = (match: Match) => {
    setMatchModalData(match);
    setMatchModalMode('edit');
    setIsMatchModalOpen(true);
  };

  const handleSaveMatchSubmit = (matchToSave: Match) => {
    onSaveMatch(matchToSave); // Call prop from App.tsx
    setIsMatchModalOpen(false);
  };

  const handleDeleteMatchSubmit = (matchIdToDelete: string) => {
    onDeleteMatch(matchIdToDelete); // Call prop from App.tsx
  };

  const handleSelectNextMatchCard = useCallback((match: Match) => {
    console.log("[SeasonPage] Next match card selected:", match);
    alert(`${t('nextMatchCardTitle')}: ${match.opponent} @ ${match.time}. ${t('viewMatchDetails')} (linking to be implemented).`);
  }, [t]);

  return (
    <div className="flex-grow flex flex-col p-2 sm:p-4 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-400">{t('seasonPageTitle')}</h1>
        <button
          onClick={onNavigateBack}
          className="bg-slate-700 hover:bg-slate-600 text-sky-300 font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg transition-colors shadow-md text-xs sm:text-sm"
        >
          {t('backToTacticianButton')}
        </button>
      </div>

      <MatchCalendar
        currentDisplayDate={currentDisplayDate}
        setCurrentDisplayDate={setCurrentDisplayDate}
        matches={matches}
        onAddMatchRequest={handleAddMatchRequest}
        onEditMatchRequest={handleEditMatchRequest}
        onDeleteMatchRequest={handleDeleteMatchSubmit} // Use the new handler
        onSelectNextMatchCard={handleSelectNextMatchCard}
      />

      <StatisticsTabs 
        leagueTableData={leagueTableData}
        teamStatsData={teamStatsData}
        playerStatsData={playerStatsData}
      />

      {isMatchModalOpen && (
        <MatchModal
          isOpen={isMatchModalOpen}
          onClose={() => setIsMatchModalOpen(false)}
          onSave={handleSaveMatchSubmit} // Use the new handler
          matchData={matchModalData}
          mode={matchModalMode}
        />
      )}
    </div>
  );
};

export default SeasonPage;