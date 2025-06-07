import React from 'react'; 
import { Player, DraggedPlayerInfo } from '../../types';
import PlayerCard from '../common/PlayerCard';
import { useTranslation } from '../../hooks/useTranslation';

interface PlayerRosterProps {
  benchPlayers: Player[];
  onDragStartCard: (e: React.DragEvent<HTMLDivElement>, draggedInfo: DraggedPlayerInfo) => void;
  onDropOnBench: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOverBench: (e: React.DragEvent<HTMLDivElement>) => void;
  onAddToFormation: (player: Player) => void;
  onOpenDetailModal: (player: Player) => void;
  cardScale: number; // Added to control card size in roster
}

const PlayerRoster: React.FC<PlayerRosterProps> = ({ 
  benchPlayers, 
  onDragStartCard, 
  onDropOnBench, 
  onDragOverBench, 
  onAddToFormation,
  onOpenDetailModal,
  cardScale, // Use this prop
}) => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col bg-slate-800/50 backdrop-blur-md p-4 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-sky-400 border-b-2 border-sky-500 pb-2">{t('playerRosterTitle')}</h2>
      
      <p className="text-sm text-gray-400 mb-2">{t('availablePlayersLabel')} ({benchPlayers.length}):</p>
      <div
        className="flex-grow space-y-3 overflow-y-auto p-2 bg-gray-700/50 rounded-md border border-gray-600 min-h-[200px]"
        onDrop={onDropOnBench}
        onDragOver={onDragOverBench}
        aria-label={t('benchAreaLabel')}
      >
        {benchPlayers.length === 0 && <p className="text-gray-500 italic text-center py-4">{t('noPlayersOnBench')}</p>}
        {benchPlayers.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            isDraggable={true}
            onDragStart={onDragStartCard}
            dataSource="bench"
            showRemoveButton={false} 
            onAddToFormation={onAddToFormation}
            showAddToFormationButton={true} 
            onOpenDetailModal={onOpenDetailModal}
            isOnPitch={false} 
            cardScale={cardScale} // Pass the cardScale to PlayerCard
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerRoster;