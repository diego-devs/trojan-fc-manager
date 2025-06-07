
import React from 'react';
import { Player, DraggedPlayerInfo, PlayerPosition } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import PositionTag from './PositionTag'; // Import PositionTag

interface PlayerCardProps {
  player: Player;
  isDraggable: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, draggedInfo: DraggedPlayerInfo) => void;
  dataSource: 'bench' | 'pitch';
  pitchSlotIndex?: number;
  onRemove?: (playerId: string) => void;
  showRemoveButton?: boolean;
  onAddToFormation?: (player: Player) => void;
  showAddToFormationButton?: boolean;
  onOpenDetailModal?: (player: Player) => void;
  isCaptain?: boolean;
  isPenaltyTaker?: boolean;
  isCornerTaker?: boolean;
  isFreeKickTaker?: boolean;
  cardScale?: number; 
  isOnPitch?: boolean; 
  showStartingPlayerOutline?: boolean; 
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  isDraggable, 
  onDragStart, 
  dataSource, 
  pitchSlotIndex, 
  onRemove, 
  showRemoveButton = false,
  onAddToFormation,
  showAddToFormationButton = false,
  onOpenDetailModal,
  isCaptain = false,
  isPenaltyTaker = false,
  isCornerTaker = false,
  isFreeKickTaker = false,
  cardScale = 1.0, 
  isOnPitch = false,
  showStartingPlayerOutline = false, 
}) => {
  const { t } = useTranslation();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    onDragStart(e, { player, source: dataSource, sourceIndex: pitchSlotIndex });
  };

  const handleAddToFormationClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (onAddToFormation) onAddToFormation(player);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (onRemove) {
        onRemove(player.id);
    }
  };

  const handleCardClick = () => {
    if (onOpenDetailModal) onOpenDetailModal(player);
  };
  
  const baseImageWidth = 48; 
  const baseImageHeight = 64; 
  const basePadding = 8; 
  const baseNameSize = 16; 
  const baseDetailSize = 12; 
  const baseRoleIconSize = 9;
  const baseRoleIconPaddingX = 4; 
  const baseRoleIconPaddingY = 2; 
  const baseRoleIconTopOffset = -6; 
  const baseRoleIconRightOffset = -6; 

  const mdMultiplier = isOnPitch ? 1.25 : 1.1; 

  const currentImageWidth = (window.innerWidth >= 768 ? baseImageWidth * mdMultiplier : baseImageWidth) * cardScale;
  const currentImageHeight = (window.innerWidth >= 768 ? baseImageHeight * mdMultiplier : baseImageHeight) * cardScale;
  const currentPadding = (window.innerWidth >= 768 ? basePadding * mdMultiplier : basePadding) * cardScale;
  const currentNameSize = (window.innerWidth >= 768 ? baseNameSize * mdMultiplier : baseNameSize) * cardScale;
  const currentDetailSize = (window.innerWidth >= 768 ? baseDetailSize * mdMultiplier : baseDetailSize) * cardScale;
  
  const currentRoleIconSize = baseRoleIconSize * cardScale;
  const currentRoleIconPaddingX = baseRoleIconPaddingX * cardScale;
  const currentRoleIconPaddingY = baseRoleIconPaddingY * cardScale;
  const currentRoleIconTop = baseRoleIconTopOffset * cardScale;
  const currentRoleIconRight = baseRoleIconRightOffset * cardScale;

  const cardBaseClasses = `relative rounded-lg shadow-lg transition-all duration-200 flex flex-col justify-between group`;
  const cardCursorClass = onOpenDetailModal ? 'cursor-pointer' : (isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default');
  
  const cardBgClass = isOnPitch 
    ? 'bg-gradient-to-br from-slate-500 via-slate-400 to-amber-300' 
    : (dataSource === 'bench' 
        ? 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-600 hover:from-slate-600 hover:via-slate-700 hover:to-slate-500' 
        : 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-600'); 
  
  const nameTextColor = isOnPitch ? 'text-slate-900' : 'text-sky-400';
  const jerseyNumberTextColor = isOnPitch ? 'text-slate-700 opacity-90' : 'text-sky-200 opacity-80';
  const skillTextColor = isOnPitch ? 'text-amber-700' : (dataSource === 'bench' ? 'text-yellow-400' : 'text-yellow-500');
  const imageBorderColor = isOnPitch ? 'border-amber-500' : 'border-slate-500';

  const startingPlayerOutlineClass = showStartingPlayerOutline ? 'ring-2 ring-slate-300 ring-offset-2 ring-offset-slate-800' : '';


  const roleIconBaseStyle: React.CSSProperties = {
    position: 'absolute',
    fontSize: `${currentRoleIconSize}px`,
    fontWeight: 'bold',
    padding: `${currentRoleIconPaddingY}px ${currentRoleIconPaddingX}px`,
    borderRadius: '9999px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    lineHeight: 1,
    color: 'black',
  };
  
  const cardStyle: React.CSSProperties = {
    touchAction: 'manipulation',
    padding: `${currentPadding}px`,
    width: '100%'
  };

  if (isOnPitch) {
    cardStyle.height = '100%';
  }

  return (
    <div
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onClick={onOpenDetailModal ? handleCardClick : undefined}
      className={`${cardBaseClasses} ${cardCursorClass} ${cardBgClass} ${startingPlayerOutlineClass}`}
      style={cardStyle}
      aria-label={`${player.name}, #${player.jerseyNumber}, ${t(player.position)}, ${t('skillLabel')} ${player.skill}${ isOnPitch ? '' : `, ${t('ageLabel')} ${player.age}`}`}
    >
      {/* Main Content Area */}
      <div className="flex items-start" style={{ columnGap: `${currentPadding / 2}px` }}>
        <img 
          src={player.photoUrl} 
          alt={player.name} 
          className={`object-cover rounded-md border-2 ${imageBorderColor} flex-shrink-0`}
          style={{ 
            width: `${currentImageWidth}px`, 
            height: `${currentImageHeight}px`
          }} 
        />
        <div className="flex-grow overflow-hidden">
          <h3 className={`font-semibold truncate ${nameTextColor}`} style={{ fontSize: `${currentNameSize}px` }} title={`${player.name} #${player.jerseyNumber}`}>
            {player.name} 
            <span 
                className={`ml-1.5 font-normal ${jerseyNumberTextColor}`} 
                style={{ fontSize: `${currentNameSize * 0.75}px` }}
            >
                #{player.jerseyNumber}
            </span>
          </h3>
          
          {isOnPitch ? ( 
            <>
              <span 
                className={`font-extrabold ${skillTextColor}`}
                style={{ fontSize: `${currentNameSize * (dataSource === 'bench' ? 2.2 : 1.8)}px`, lineHeight: 1.1 }} // Adjust size for on-pitch skill
              >
                {player.skill}
              </span>
              <div style={{ marginTop: '2px' }}> 
                <PositionTag position={player.position} size="xs" />
              </div>
            </>
          ) : (
            // Bench player layout (age, then skill on the right)
            <>
              <p className={`text-gray-300`} style={{ fontSize: `${currentDetailSize}px`, marginTop: '2px' }}>
                {t('ageLabel')}: {player.age}
              </p>
              {/* Position tag for bench players is rendered below the large skill number on the right */}
            </>
          )}
        </div>
        
        {/* Skill & Position for Bench Players (right side) */}
        {dataSource === 'bench' && !isOnPitch && ( 
          <div className="ml-auto pl-1 flex-shrink-0 flex flex-col items-center justify-start">
            <span 
              className={`font-extrabold ${skillTextColor}`}
              style={{ fontSize: `${currentNameSize * 2.2}px`, lineHeight: 1.1 }} 
            >
              {player.skill}
            </span>
            <div style={{ marginTop: '2px' }}>
              <PositionTag position={player.position} size="xs" />
            </div>
          </div>
        )}
      </div>
      
      {/* Role Icons */}
      {isCaptain && (
        <div style={{...roleIconBaseStyle, top: `${currentRoleIconTop}px`, right: `${currentRoleIconRight}px`, backgroundColor: 'rgba(250, 204, 21, 1)'}} title={t('captainRole')}>C</div>
      )}
      {isPenaltyTaker && !isCaptain && (
        <div style={{...roleIconBaseStyle, top: `${currentRoleIconTop}px`, right: `${currentRoleIconRight + (currentRoleIconSize + currentRoleIconPaddingX*2 + 2)}px`, backgroundColor: 'rgba(239, 68, 68, 1)'}} title={t('penaltyTakerRole')}>P</div>
      )}
       {isCornerTaker && !isCaptain && (
        <div style={{...roleIconBaseStyle, top: `${currentRoleIconTop}px`, right: `${currentRoleIconRight + (currentRoleIconSize + currentRoleIconPaddingX*2 + 2)*2}px`, backgroundColor: 'rgba(52, 211, 153, 1)'}} title={t('cornerTakerRole')}>K</div>
      )}
      {isFreeKickTaker && !isCaptain && (
         <div style={{...roleIconBaseStyle, top: `${currentRoleIconTop}px`, right: `${currentRoleIconRight + (currentRoleIconSize + currentRoleIconPaddingX*2 + 2)*3}px`, backgroundColor: 'rgba(59, 130, 246, 1)'}} title={t('freeKickTakerRole')}>F</div>
      )}

      {/* Action Buttons Area (Only for Bench/Roster) */}
      {(dataSource === 'bench' && !isOnPitch && (showAddToFormationButton || showRemoveButton)) && (
        <div className="mt-auto pt-2 flex space-x-2 justify-end items-center">
          {showAddToFormationButton && onAddToFormation && (
            <button
              onClick={handleAddToFormationClick}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
              aria-label={`${t('addToFormationButton')} ${player.name}`}
              title={t('addToFormationButton')}
            >
              <span className="text-xl md:text-2xl font-bold leading-none select-none">+</span>
            </button>
          )}
          {showRemoveButton && onRemove && (
            <button
              onClick={handleRemoveClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out bg-red-700 hover:bg-red-800 text-red-100 p-1.5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              style={{ width: `${currentDetailSize * 2.2}px`, height: `${currentDetailSize * 2.2}px` }}
              aria-label={`${t('removeButton')} ${player.name}`}
              title={t('removeButton')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-full h-full">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.177-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.43l.84-10.518.149.022a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25V4c.827-.05 1.66-.075 2.5-.075zM8.47 9.47a.75.75 0 011.06 0L10 10.94l.47-.47a.75.75 0 111.06 1.06L11.06 12l.47.47a.75.75 0 11-1.06 1.06L10 13.06l-.47.47a.75.75 0 01-1.06-1.06L8.94 12l-.47-.47a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
