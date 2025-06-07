import React from 'react';
import { Player, DraggedPlayerInfo, Formation } from '../../types';
import PitchSlotView from './PitchSlotView';
import { PITCH_SLOT_COUNT } from '../../constants';

interface PitchProps {
  playersOnPitch: (Player | null)[];
  captainId: string | null;
  penaltyTakerId: string | null;
  cornerTakerId: string | null;
  freeKickTakerId: string | null;
  onDropOnSlot: (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => void;
  onDragOverPitch: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStartCard: (e: React.DragEvent<HTMLDivElement>, draggedInfo: DraggedPlayerInfo) => void;
  onOpenDetailModal: (player: Player) => void;
  currentFormationLayout: Formation['layout'];
  cardScale: number;
}

const Pitch: React.FC<PitchProps> = ({ 
  playersOnPitch, 
  captainId, 
  penaltyTakerId,
  cornerTakerId,
  freeKickTakerId,
  onDropOnSlot, 
  onDragOverPitch, 
  onDragStartCard, 
  onOpenDetailModal,
  currentFormationLayout,
  cardScale
}) => {
  const pitchStyle: React.CSSProperties = {
    backgroundColor: '#3A7D44', // A base, rich green color (e.g., between Tailwind's green-600 and green-700)
    backgroundImage: [
      // Subtle vertical stripes for a "mowed" look
      'linear-gradient(90deg, rgba(0, 0, 0, 0.07) 50%, transparent 50%)',
      // Very fine noise texture for a bit of depth
      'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02) 1px, transparent 1px, transparent 2.5px)',
      'repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02) 1px, transparent 1px, transparent 2.5px)'
    ].join(','),
    backgroundSize: '80px 100%, 3px 3px, 3px 3px', // Stripe width, noise pattern size
    backgroundRepeat: 'repeat-x, repeat, repeat', // Stripes repeat horizontally, noise repeats fully
  };

  return (
    <div 
      className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden p-4 flex items-center justify-center"
      style={pitchStyle}
    >
      {/* Pitch Markings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-1/4 aspect-square border-4 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-1 border-l-4 border-white/50 transform -translate-x-1/2"></div>
        <div className="absolute top-1/3 bottom-1/3 left-[2%] w-[15%] border-4 border-white/50 rounded-md"></div>
        <div className="absolute top-[40%] bottom-[40%] left-[0.5%] w-[3%] border-4 border-white bg-white/20 rounded-sm"></div>
        <div className="absolute top-1/3 bottom-1/3 right-[2%] w-[15%] border-4 border-white/50 rounded-md"></div>
        <div className="absolute top-[40%] bottom-[40%] right-[0.5%] w-[3%] border-4 border-white bg-white/20 rounded-sm"></div>
      </div>

      <div 
        className="grid grid-cols-7 grid-rows-6 gap-1 z-10 w-full h-full"
        style={{ transform: 'translateY(-3.5rem)' }} // Added offset here
      >
        {Array(PITCH_SLOT_COUNT).fill(null).map((_, index) => {
          const slotPos = currentFormationLayout[index] || { row: 1, col: index + 1 }; 
          const playerInSlot = playersOnPitch[index];
          return (
            <PitchSlotView
              key={`slot-${index}`}
              slotIndex={index}
              position={slotPos}
              player={playerInSlot}
              onDrop={onDropOnSlot}
              onDragOver={onDragOverPitch}
              onDragStartCard={onDragStartCard}
              onOpenDetailModal={onOpenDetailModal}
              isCaptain={playerInSlot?.id === captainId}
              isPenaltyTaker={playerInSlot?.id === penaltyTakerId}
              isCornerTaker={playerInSlot?.id === cornerTakerId}
              isFreeKickTaker={playerInSlot?.id === freeKickTakerId}
              cardScale={cardScale}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Pitch;