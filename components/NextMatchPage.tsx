
import React, { useState, useEffect, useMemo } from 'react';
import { Player, Formation, Match, PlayerPosition } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import FormationDisplay from './tactician/FormationDisplay';
import PlayerCard from './common/PlayerCard';
// import PositionTag from './common/PositionTag'; // Not directly used but PlayerCard uses it

interface NextMatchPageProps {
  nextMatch: Match | null; // Receive the specific next match object
  onUpdateMatchNotes: (matchId: string, notes: string) => void; // Handler to update notes in App.tsx
  playersOnPitch: (Player | null)[];
  selectedFormation: Formation;
  customFormationName: string;
  captainPlayer: Player | null;
  penaltyTakerPlayer: Player | null;
  cornerTakerPlayer: Player | null;
  freeKickTakerPlayer: Player | null;
  onOpenDetailModal: (player: Player) => void;
  cardScale: number;
  getSlotRole: (formationName: string, slotIndex: number) => PlayerPosition | null;
  onNavigateBack: () => void;
}

const NextMatchPage: React.FC<NextMatchPageProps> = ({
  nextMatch, // Use this prop
  onUpdateMatchNotes, // Use this prop
  playersOnPitch,
  selectedFormation,
  customFormationName,
  captainPlayer,
  penaltyTakerPlayer,
  cornerTakerPlayer,
  freeKickTakerPlayer,
  onOpenDetailModal,
  cardScale,
  getSlotRole,
  onNavigateBack,
}) => {
  const { t, language } = useTranslation();
  const [localMatchNotes, setLocalMatchNotes] = useState('');

  useEffect(() => {
    // Initialize local notes state from the passed nextMatch prop
    if (nextMatch?.matchNotes) {
      setLocalMatchNotes(nextMatch.matchNotes);
    } else {
      setLocalMatchNotes(''); // Reset if no next match or no notes
    }
  }, [nextMatch]);

  const handleSaveNotes = () => {
    if (nextMatch) {
      onUpdateMatchNotes(nextMatch.id, localMatchNotes); // Call handler from App.tsx
      alert(t('notesSavedSuccess'));
    }
  };

  const averageTeamSkill = useMemo(() => {
    const onPitch = playersOnPitch.filter(p => p !== null) as Player[];
    if (onPitch.length === 0) return t('noPlayersForAvgSkillLabel');
    const totalSkill = onPitch.reduce((sum, player) => sum + player.skill, 0);
    return (totalSkill / onPitch.length).toFixed(1);
  }, [playersOnPitch, t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); 
    return date.toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const getPlayerSlotRoleText = (slotIndex: number): string => {
        const role = getSlotRole(selectedFormation.name, slotIndex);
        return role ? t(role) : t('slotDefaultLabel');
  };

  if (!nextMatch) {
    return (
      <div className="flex-grow flex flex-col p-4 items-center justify-center text-center">
        <svg className="w-16 h-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
        <h1 className="text-2xl font-semibold text-sky-400 mb-2">{t('noUpcomingMatches')}</h1>
        <p className="text-slate-400 mb-6">{t('addMatchOnDate', { date: t('seasonPageTitle')})}</p>
        <button
          onClick={onNavigateBack}
          className="bg-slate-700 hover:bg-slate-600 text-sky-300 font-semibold py-2 px-4 rounded-lg transition-colors shadow-md"
        >
          {t('backToTacticianButton')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col p-3 sm:p-4 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-400">{t('nextMatchPageTitle')}</h1>
         <button
          onClick={onNavigateBack}
          className="bg-slate-700 hover:bg-slate-600 text-sky-300 font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg transition-colors shadow-md text-xs sm:text-sm"
        >
          {t('backToTacticianButton')}
        </button>
      </div>

      <section className="mb-6 p-4 bg-slate-800/60 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-yellow-400 mb-1">{nextMatch.opponent}</h2>
        <p className="text-lg text-slate-300 mb-1">{formatDate(nextMatch.date)} - {nextMatch.time}</p>
        <p className={`text-md font-semibold ${nextMatch.isHome ? 'text-green-400' : 'text-orange-400'}`}>
          {nextMatch.isHome ? `(${t('homeMatch')})` : `(${t('awayMatch')})`}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="p-4 bg-slate-800/50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-sky-400 mb-3 border-b border-slate-700 pb-2">{t('ourTacticalSetup')}</h3>
          <div className="mb-3">
            <p className="text-sm text-slate-400">{t('customFormationNameLabel')}: <span className="font-semibold text-white">{customFormationName} ({selectedFormation.name})</span></p>
          </div>
          <div className="mb-4 flex justify-center">
            <div className="w-48">
                <FormationDisplay formationVisual={selectedFormation.visual} isSelected={true} />
            </div>
          </div>
           <div className="mb-3">
             <p className="text-sm text-slate-400">{t('averageTeamSkillLabel')}: <span className="font-semibold text-white">{averageTeamSkill}</span></p>
          </div>
          <div className="space-y-1 text-sm">
            <p><span className="text-slate-400">{t('teamCaptainLabel')}:</span> <span className="font-medium text-white">{captainPlayer?.name || t('selectPlayerPlaceholder')}</span></p>
            <p><span className="text-slate-400">{t('penaltyTakerLabel')}:</span> <span className="font-medium text-white">{penaltyTakerPlayer?.name || t('selectPlayerPlaceholder')}</span></p>
            <p><span className="text-slate-400">{t('cornerTakerLabel')}:</span> <span className="font-medium text-white">{cornerTakerPlayer?.name || t('selectPlayerPlaceholder')}</span></p>
            <p><span className="text-slate-400">{t('freeKickTakerLabel')}:</span> <span className="font-medium text-white">{freeKickTakerPlayer?.name || t('selectPlayerPlaceholder')}</span></p>
          </div>
        </section>

        <section className="p-4 bg-slate-800/50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-sky-400 mb-3 border-b border-slate-700 pb-2">{t('ourStartingLineup')}</h3>
          <div className="space-y-2 overflow-y-auto max-h-96 custom-scrollbar-thin pr-1">
            {playersOnPitch.map((player, index) => (
              <div key={player ? player.id : `empty-${index}`} className="bg-slate-700/50 p-2 rounded-md">
                {player ? (
                  <>
                    <PlayerCard
                      player={player}
                      isDraggable={false}
                      onDragStart={() => {}}
                      dataSource="bench" // Changed from "pitch" to "bench"
                      onOpenDetailModal={() => onOpenDetailModal(player)}
                      isCaptain={player.id === captainPlayer?.id}
                      isPenaltyTaker={player.id === penaltyTakerPlayer?.id}
                      isCornerTaker={player.id === cornerTakerPlayer?.id}
                      isFreeKickTaker={player.id === freeKickTakerPlayer?.id}
                      cardScale={cardScale * 0.9} 
                      isOnPitch={false} 
                    />
                     <p className="text-xs text-slate-400 mt-1 ml-1">{t('positionInFormation', { position: getPlayerSlotRoleText(index) })}</p>
                  </>
                ) : (
                  <div className="h-20 flex items-center justify-center text-slate-500 italic">
                    {t('emptySlotInLineup')} - {getPlayerSlotRoleText(index)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-4 p-4 bg-slate-800/50 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-sky-400 mb-3">{t('matchNotesStrategy')}</h3>
        <textarea
          value={localMatchNotes}
          onChange={(e) => setLocalMatchNotes(e.target.value)}
          rows={4}
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400"
          placeholder={t('matchNotesStrategy') + "..."}
          aria-label={t('matchNotesStrategy')}
        />
        <button
          onClick={handleSaveNotes}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
        >
          {t('saveNotesButton')}
        </button>
      </section>
      
       <section className="mt-4 p-4 bg-slate-800/50 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-sky-400 mb-3">{t('opponentSnapshot')}</h3>
        <p className="text-slate-400 italic">{t('opponentInfoPlaceholder')}</p>
      </section>

    </div>
  );
};

export default NextMatchPage;
