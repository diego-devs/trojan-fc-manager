import React, { useState, useEffect } from 'react';
import { Player, PlayerPosition } from '../../types';
import { PLAYER_POSITIONS_LIST } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import PositionTag from '../common/PositionTag'; // Import PositionTag

interface PlayerInfoPanelProps {
  selectedPlayer: Player | null;
  onSaveDirectly: (updatedPlayer: Player) => void; 
}

const PlayerInfoPanel: React.FC<PlayerInfoPanelProps> = ({
  selectedPlayer,
  onSaveDirectly,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editablePlayerData, setEditablePlayerData] = useState<Player | null>(null);

  useEffect(() => {
    if (selectedPlayer) {
      setEditablePlayerData(selectedPlayer);
      setIsEditing(false); 
    } else {
      setEditablePlayerData(null);
      setIsEditing(false);
    }
  }, [selectedPlayer]);

  const getPositionAbbreviationKey = (position: PlayerPosition): string => {
    switch (position) {
      case PlayerPosition.GK: return 'posAbbrGK';
      case PlayerPosition.DEF: return 'posAbbrDEF';
      case PlayerPosition.MID: return 'posAbbrMID';
      case PlayerPosition.FWD: return 'posAbbrFWD';
      default: return position;
    }
  };
  
  const handleEditClick = () => {
    if (selectedPlayer) {
      setEditablePlayerData(JSON.parse(JSON.stringify(selectedPlayer))); 
      setIsEditing(true);
    }
  };

  const handleCancelClick = () => {
    if (selectedPlayer) {
      setEditablePlayerData(selectedPlayer); 
    }
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    if (editablePlayerData) {
      onSaveDirectly(editablePlayerData);
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editablePlayerData) return;
    const { name, value, type } = e.target;
    
    let processedValue: string | number | PlayerPosition = value;
    if (type === 'number') {
      processedValue = parseInt(value, 10) || 0;
    }
    
    setEditablePlayerData(prev => ({ ...prev!, [name]: processedValue }));
  };

  const handlePlayablePositionChange = (position: PlayerPosition, checked: boolean) => {
    if (!editablePlayerData) return;
    setEditablePlayerData(prev => {
      const currentPlayable = prev!.playablePositions || [];
      if (checked) {
        return { ...prev!, playablePositions: [...new Set([...currentPlayable, position])] };
      } else {
        return { ...prev!, playablePositions: currentPlayable.filter(p => p !== position) };
      }
    });
  };

  const handleImageUploadClick = () => {
    if (displayPlayer) {
        console.log(`Upload image clicked for player: ${displayPlayer.name} in PlayerInfoPanel. Implement file input logic here.`);
    }
  };


  if (!selectedPlayer && !isEditing) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-lg shadow-xl h-full flex flex-col items-center justify-center">
        <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <p className="text-slate-500 text-center">{t('noPlayerSelectedPrompt')}</p>
      </div>
    );
  }
  
  const displayPlayer = isEditing && editablePlayerData ? editablePlayerData : selectedPlayer;

  if (!displayPlayer) { 
     return <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-lg shadow-xl h-full flex flex-col items-center justify-center"><p className="text-slate-500">{t('noPlayerSelectedPrompt')}</p></div>;
  }

  const renderInputField = (labelKey: string, fieldName: keyof Player, type: string = "text", options?: PlayerPosition[]) => (
    <div className="mb-2">
      <label htmlFor={`panel-${fieldName}`} className="block text-xs font-medium text-sky-300">{t(labelKey)}</label>
      {isEditing && editablePlayerData ? (
        type === 'select' && options && fieldName === 'position' ? ( // Ensure this is only for 'position' field
          <select 
            id={`panel-${fieldName}`} 
            name={fieldName} 
            value={editablePlayerData[fieldName] as string} 
            onChange={handleChange}
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white text-xs"
          >
            {options.map(pos => <option key={pos} value={pos}>{t(pos)}</option>)}
          </select>
        ) : (
          <input
            type={type}
            id={`panel-${fieldName}`}
            name={fieldName}
            value={String(editablePlayerData[fieldName] || (type === 'number' ? 0 : ''))}
            onChange={handleChange}
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white text-xs"
            min={type === 'number' ? "0" : undefined}
          />
        )
      ) : (
         // Display for non-editing mode
        fieldName === 'position' ? (
          <div className="mt-1">
            <PositionTag position={displayPlayer[fieldName] as PlayerPosition} size="sm" />
          </div>
        ) : (
          <p className="mt-1 text-white text-sm">{String(displayPlayer[fieldName])}</p>
        )
      )}
    </div>
  );
  
  const renderPlayablePositions = () => (
    <div className="mb-2">
        <label className="block text-xs font-medium text-sky-300 mb-1">{t('playablePositionsLabel')}</label>
        {isEditing && editablePlayerData ? (
        <div className="grid grid-cols-2 gap-1">
            {PLAYER_POSITIONS_LIST.map(pos => (
            <label key={pos} className="flex items-center space-x-1.5 text-xs text-white cursor-pointer">
                <input 
                type="checkbox"
                checked={editablePlayerData.playablePositions?.includes(pos) || false}
                onChange={(e) => handlePlayablePositionChange(pos, e.target.checked)}
                className="form-checkbox h-3.5 w-3.5 text-sky-600 bg-slate-700 border-slate-500 rounded focus:ring-sky-500"
                />
                <span>{t(getPositionAbbreviationKey(pos))}</span>
            </label>
            ))}
        </div>
        ) : (
          <div className="flex flex-wrap gap-1 mt-1">
            {(displayPlayer.playablePositions || [displayPlayer.position]).map(p => (
              <PositionTag key={p} position={p} size="xs" />
            ))}
          </div>
        )}
    </div>
  );


  return (
    <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-lg shadow-xl h-full flex flex-col space-y-3 overflow-y-auto">
      <h2 className="text-xl font-bold text-sky-400 border-b-2 border-sky-500 pb-2">
        {t('playerInfoPanelTitle')}
      </h2>

      <div className="flex flex-col items-center">
        <div className="relative group w-28 h-36 md:w-32 md:h-40 mb-2">
            <img
            src={displayPlayer.photoUrl}
            alt={displayPlayer.name}
            className="w-full h-full object-cover rounded-lg border-2 border-slate-500 shadow-md"
            />
            <button
                onClick={handleImageUploadClick}
                aria-label={t('uploadNewPhotoLabel')}
                title={t('uploadNewPhotoLabel')}
                className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </button>
        </div>

        {isEditing ? (
             renderInputField("nameLabel", "name")
        ) : (
            <h3 className="text-xl font-semibold text-white text-center">{displayPlayer.name}</h3>
        )}
         {!isEditing && (
            <div className="flex items-center space-x-2 mt-1">
                <p className="text-slate-400 text-sm">#{displayPlayer.jerseyNumber}</p>
                <PositionTag position={displayPlayer.position} size="xs" />
            </div>
        )}
      </div>
      
      {isEditing && renderInputField("jerseyLabelWithRange", "jerseyNumber", "number")}
      {isEditing && renderInputField("preferredPositionLabel", "position", "select", PLAYER_POSITIONS_LIST)}

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
        {renderInputField(isEditing ? "skillLabelWithRange" : "skillLabel", "skill", "number")}
        {renderInputField(isEditing ? "ageLabelWithRange" : "ageLabel", "age", "number")}
      </div>
      
      {renderPlayablePositions()}
      
      <hr className="border-slate-700 !my-3" />
      
      <div>
        <h4 className="text-sm font-semibold text-sky-300 mb-1.5">{t('playerStatsSectionTitle')}</h4>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
          {renderInputField("gamesPlayedLabel", "gamesPlayed", "number")}
          {renderInputField("minutesPlayedLabel", "minutesPlayed", "number")}
          {renderInputField("goalsLabel", "goals", "number")}
          {renderInputField("assistsLabel", "assists", "number")}
        </div>
      </div>

      <div className="mt-auto pt-3 space-y-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md text-sm"
            >
              {t('saveButton')}
            </button>
            <button
              onClick={handleCancelClick}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md text-sm"
            >
              {t('cancelButton')}
            </button>
          </>
        ) : (
          selectedPlayer && ( 
            <button
              onClick={handleEditClick}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md text-sm"
              aria-label={`${t('editButton')} ${displayPlayer.name}`}
            >
              {t('editButton')}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default PlayerInfoPanel;
