import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Player } from '../../types';
import PlayerCard from '../common/PlayerCard';

interface LeftPanelProps { 
  captain: Player | null;
  onCaptainChange: (playerId: string | null) => void;
  
  penaltyTaker: Player | null;
  onPenaltyTakerChange: (playerId: string | null) => void;

  cornerTaker: Player | null;
  onCornerTakerChange: (playerId: string | null) => void;

  freeKickTaker: Player | null;
  onFreeKickTakerChange: (playerId: string | null) => void;
  
  playersOnPitch: (Player | null)[];
  onOpenDetailModal: (player: Player) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ 
  captain, 
  onCaptainChange, 
  penaltyTaker,
  onPenaltyTakerChange,
  cornerTaker,
  onCornerTakerChange,
  freeKickTaker,
  onFreeKickTakerChange,
  playersOnPitch,
  onOpenDetailModal,
}) => {
  const { t } = useTranslation();
  const selectablePlayers = playersOnPitch.filter(p => p !== null) as Player[];

  const renderRoleSelector = (
    id: string,
    labelKey: string,
    value: string | null,
    onChange: (playerId: string | null) => void,
    selectedPlayer: Player | null
  ) => (
    <div className="mb-4"> 
      <label htmlFor={id} className="block text-sm font-medium text-sky-400">{t(labelKey)}</label>
      <select
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
        aria-label={t(labelKey)}
      >
        <option value="">{t('selectPlayerPlaceholder')}</option>
        {selectablePlayers.map(p => (
          <option key={p.id} value={p.id}>{p.name} (#{p.jerseyNumber})</option>
        ))}
      </select>
      {selectedPlayer && (
        <div className="mt-2">
          <p className="text-xs font-medium text-sky-200 mb-1">{t('selectedPlayerLabel')}</p>
          <PlayerCard 
            player={selectedPlayer} 
            isDraggable={false} 
            onDragStart={()=>{}} 
            dataSource="pitch" 
            onOpenDetailModal={onOpenDetailModal}
            cardScale={0.7} 
            isOnPitch={false} 
          />
        </div>
      )}
      {!selectedPlayer && selectablePlayers.length === 0 && (
         <p className="text-xs text-gray-400 italic mt-1">{t('noPlayersOnPitchForRole')}</p>
      )}
    </div>
  );

  const calculateAverageSkill = () => {
    const playersWithSkill = playersOnPitch.filter(p => p !== null) as Player[];
    if (playersWithSkill.length === 0) {
      return t('noPlayersForAvgSkillLabel');
    }
    const totalSkill = playersWithSkill.reduce((sum, player) => sum + player.skill, 0);
    return (totalSkill / playersWithSkill.length).toFixed(1);
  };

  return (
    <div className="h-full bg-slate-800/50 backdrop-blur-md p-4 rounded-lg shadow-xl flex flex-col space-y-6 overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-sky-400 border-b-2 border-sky-500 pb-2">{t('leftPanelTitle')}</h2>
      </div>
      
      {renderRoleSelector("captainSelect", "teamCaptainLabel", captain?.id || null, onCaptainChange, captain)}
      {renderRoleSelector("penaltyTakerSelect", "penaltyTakerLabel", penaltyTaker?.id || null, onPenaltyTakerChange, penaltyTaker)}
      {renderRoleSelector("cornerTakerSelect", "cornerTakerLabel", cornerTaker?.id || null, onCornerTakerChange, cornerTaker)}
      {renderRoleSelector("freeKickTakerSelect", "freeKickTakerLabel", freeKickTaker?.id || null, onFreeKickTakerChange, freeKickTaker)}

      <hr className="border-slate-600 my-2" />

      <div>
        <h2 className="text-xl font-bold mb-3 text-sky-400 border-b border-sky-500 pb-1">{t('statisticsTitle')}</h2>
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <span className="font-semibold">{t('averageTeamSkillLabel')}: </span>
            <span className="text-sky-300 font-bold">{calculateAverageSkill()}</span>
          </div>
          <div>
            <span className="font-semibold">{t('lastMatchesLabel')}: </span>
            <span className="text-green-400">W</span> - <span className="text-red-400">L</span> - <span className="text-yellow-400">T</span> - <span className="text-green-400">W</span> - <span className="text-green-400">W</span>
          </div>
          <div 
            className="mt-2 p-3 bg-white/10 rounded-lg shadow-md cursor-pointer hover:bg-white/20 hover:scale-105 transform transition-all duration-150 ease-in-out"
            onClick={() => console.log("Next match card clicked")}
            role="button"
            tabIndex={0}
            aria-label={`${t('nextMatchLabel')} ${t('fakeOpponentName')}`}
          >
            <p className="font-semibold text-sky-300">{t('nextMatchLabel')}</p>
            <p className="text-lg text-white font-bold">{t('fakeOpponentName')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;