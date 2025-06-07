
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Match, LeagueTableRow, TeamStatistic, PlayerStatistic } from '../types';
import MatchCalendar from './season/MatchCalendar';
import MatchModal from './season/MatchModal';
import StatisticsTabs from './season/StatisticsTabs';

// Helper to get initial matches (e.g., from localStorage or a default set)
const getInitialMatches = (): Match[] => {
  try {
    const storedMatches = localStorage.getItem('soccerSeasonMatches');
    if (storedMatches) {
      return JSON.parse(storedMatches);
    }
  } catch (error) {
    console.error("Error loading matches from localStorage:", error);
  }
  // Default/Demo Matches if nothing in localStorage
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  return [
    { id: crypto.randomUUID(), date: tomorrow.toISOString().split('T')[0], opponent: 'Rival FC', time: '15:00', isHome: true },
    { id: crypto.randomUUID(), date: nextWeek.toISOString().split('T')[0], opponent: 'Local Legends', time: '20:00', isHome: false },
    { id: crypto.randomUUID(), date: lastWeek.toISOString().split('T')[0], opponent: 'Vintage XI', time: '14:00', isHome: true, score: {us: 2, them: 1}},
    { id: crypto.randomUUID(), date: today.toISOString().split('T')[0], opponent: 'City Casuals', time: '18:30', isHome: true },
  ];
};

interface SeasonPageProps {
  onNavigateBack: () => void;
  leagueTableData: LeagueTableRow[];
  teamStatsData: TeamStatistic[];
  playerStatsData: PlayerStatistic[];
}

const SeasonPage: React.FC<SeasonPageProps> = ({ 
  onNavigateBack,
  leagueTableData,
  teamStatsData,
  playerStatsData 
}) => {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>(getInitialMatches);
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchModalData, setMatchModalData] = useState<Partial<Match> | null>(null);
  const [matchModalMode, setMatchModalMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    try {
      localStorage.setItem('soccerSeasonMatches', JSON.stringify(matches));
      console.log('[SeasonPage] Matches saved to localStorage:', matches);
    } catch (error) {
      console.error("Error saving matches to localStorage:", error);
    }
  }, [matches]);

  const handleAddMatchRequest = (date: string) => { // date is YYYY-MM-DD
    setMatchModalData({ date }); 
    setMatchModalMode('add');
    setIsMatchModalOpen(true);
  };

  const handleEditMatchRequest = (match: Match) => {
    setMatchModalData(match);
    setMatchModalMode('edit');
    setIsMatchModalOpen(true);
  };

  const handleDeleteMatchRequest = (matchIdToDelete: string) => {
    console.log(`[SeasonPage] handleDeleteMatchRequest invoked for ID: ${matchIdToDelete}`);
    setMatches(prevMatches => {
      console.log(`[SeasonPage] Matches BEFORE delete attempt (ID: ${matchIdToDelete}):`, JSON.parse(JSON.stringify(prevMatches)));
      const newMatches = prevMatches.filter(m => m.id !== matchIdToDelete);
      console.log(`[SeasonPage] Matches AFTER delete attempt (ID: ${matchIdToDelete}):`, JSON.parse(JSON.stringify(newMatches)));
      
      if (newMatches.length === prevMatches.length) {
        console.warn(`[SeasonPage] Filter did not remove any matches. ID ${matchIdToDelete} might not exist in the current list, or there's an issue with the filter logic or ID.`);
      } else {
        console.log(`[SeasonPage] Match with ID ${matchIdToDelete} successfully removed from state.`);
      }
      return newMatches;
    });
  };

  const handleSaveMatch = (matchToSave: Match) => {
    if (matchModalMode === 'add') {
      setMatches(prevMatches => [...prevMatches, matchToSave].sort((a,b) => new Date(a.date+'T'+a.time).getTime() - new Date(b.date+'T'+b.time).getTime()));
    } else {
      setMatches(prevMatches => prevMatches.map(m => m.id === matchToSave.id ? matchToSave : m).sort((a,b) => new Date(a.date+'T'+a.time).getTime() - new Date(b.date+'T'+b.time).getTime()));
    }
    setIsMatchModalOpen(false);
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
        onDeleteMatchRequest={handleDeleteMatchRequest}
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
          onSave={handleSaveMatch}
          matchData={matchModalData}
          mode={matchModalMode}
        />
      )}
    </div>
  );
};

export default SeasonPage;
