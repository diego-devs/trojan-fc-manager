import React from 'react';
import { Player, DraggedPlayerInfo, SlotPosition } from '../../types';
import PlayerCard from '../common/PlayerCard';
import { useTranslation } from '../../hooks/useTranslation';

interface PitchSlotViewProps {
  player: Player | null;
  slotIndex: number;
  position: SlotPosition; 
  onDrop: (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStartCard: (e: React.DragEvent<HTMLDivElement>, draggedInfo: DraggedPlayerInfo) => void;
  onOpenDetailModal: (player: Player) => void;
  isCaptain: boolean;
  isPenaltyTaker: boolean;
  isCornerTaker: boolean;
  isFreeKickTaker: boolean;
  cardScale: number;
}

const PitchSlotView: React.FC<PitchSlotViewProps> = ({ 
  player, 
  slotIndex, 
  position, 
  onDrop, 
  onDragOver, 
  onDragStartCard, 
  onOpenDetailModal,
  isCaptain,
  isPenaltyTaker,
  isCornerTaker,
  isFreeKickTaker,
  cardScale
}) => {
  const { t } = useTranslation();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDrop(e, slotIndex);
  };
  
  const getSlotLabel = (index: number): string => {
    const labels = [
      t('slotGK'), t('slotDef1'), t('slotDef2'), 
      t('slotMid1'), t('slotMid2'), t('slotMid3'), 
      t('slotFwd1')
    ];
    return labels[index] || `${t('slotDefaultLabel')} ${index + 1}`;
  }

  const slotLabel = getSlotLabel(slotIndex);
  
  const baseSlotWidth = 150; 
  const baseSlotHeight = 112; 
  const mdBaseSlotWidth = 190;
  const mdBaseSlotHeight = 128;

  const slotWidth = window.innerWidth >= 768 ? mdBaseSlotWidth * cardScale : baseSlotWidth * cardScale;
  const slotHeight = window.innerWidth >= 768 ? mdBaseSlotHeight * cardScale : baseSlotHeight * cardScale;

  const baseLabelFontSize = 12; 
  const mdBaseLabelFontSize = 14; 
  const labelFontSize = window.innerWidth >= 768 ? mdBaseLabelFontSize * cardScale : baseLabelFontSize * cardScale;


  const dynamicStyle = {
    gridRowStart: position.row,
    gridColumnStart: position.col,
    width: `${slotWidth}px`,
    height: `${slotHeight}px`,
  };

  const emptySlotBaseClasses = "border-2 border-dashed border-green-600/60 bg-green-800/20";
  const occupiedSlotBaseClasses = "p-0"; // Remove padding from slot itself if player is present, card will handle padding

  return (
    <div
      style={dynamicStyle}
      onDrop={handleDrop}
      onDragOver={onDragOver}
      className={`relative flex items-center justify-center m-0.5 md:m-1 rounded-lg transition-all hover:bg-green-700/50
                  ${player ? occupiedSlotBaseClasses : emptySlotBaseClasses}`}
      aria-label={player ? `${t('pitchSlotWithPlayer', { name: player.name, position: t(player.position) })}` : `${t('pitchSlotEmpty', { label: slotLabel })}`}
    >
      {player ? (
        <div className={`w-full h-full relative ${isCaptain ? 'ring-4 ring-yellow-400 rounded-lg shadow-md' : ''}`}>
           <PlayerCard 
            player={player} 
            isDraggable={true} 
            onDragStart={onDragStartCard} 
            dataSource="pitch"
            pitchSlotIndex={slotIndex}
            onOpenDetailModal={onOpenDetailModal}
            isCaptain={isCaptain}
            isPenaltyTaker={isPenaltyTaker}
            isCornerTaker={isCornerTaker}
            isFreeKickTaker={isFreeKickTaker}
            cardScale={cardScale}
            isOnPitch={true}
          />
        </div>
      ) : (
        <span className="text-green-400/80" style={{ fontSize: `${labelFontSize}px`}}>{slotLabel}</span>
      )}
    </div>
  );
};

export default PitchSlotView;