import React, { useState, useEffect } from 'react';
import { Player, PlayerPosition } from '../../types';
import { PLAYER_POSITIONS_LIST } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import PositionTag from './PositionTag'; // Import PositionTag

interface PlayerDetailModalProps {
  player: Player;
  onClose: () => void;
  onSave: (updatedPlayer: Player) => void;
  startInEditMode?: boolean;
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose, onSave, startInEditMode = false }) => {
  const { t } = useTranslation();
  const [editablePlayer, setEditablePlayer] = useState<Player>(player);
  const [isEditing, setIsEditing] = useState(startInEditMode);

  useEffect(() => {
    setEditablePlayer(player);
  }, [player]);

  useEffect(() => {
    setIsEditing(startInEditMode);
  }, [startInEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
     if (type === 'number') {
      setEditablePlayer(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setEditablePlayer(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handlePlayablePositionChange = (position: PlayerPosition, checked: boolean) => {
    setEditablePlayer(prev => {
      const currentPlayable = prev.playablePositions || [];
      if (checked) {
        return { ...prev, playablePositions: [...new Set([...currentPlayable, position])] };
      } else {
        return { ...prev, playablePositions: currentPlayable.filter(p => p !== position) };
      }
    });
  };

  const handleSave = () => {
    onSave(editablePlayer);
    setIsEditing(false); 
  };

  const handleCancelEdit = () => {
    setEditablePlayer(player); 
    setIsEditing(false);
  };

  const handleImageUploadClick = () => {
    console.log(`Upload image clicked for player: ${player.name}. Implement file input logic here.`);
  };

  const renderStatField = (labelKey: string, fieldName: keyof Player, type: string = "text", readOnlyValue?: string | number) => (
    <div className="mb-3">
      <label htmlFor={fieldName} className="block text-sm font-medium text-sky-300">{t(labelKey)}</label>
      {isEditing ? (
        <input
          type={type}
          id={fieldName}
          name={fieldName}
          value={String(editablePlayer[fieldName] || (type === 'number' ? 0 : ''))}
          onChange={handleChange}
          className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
          min={type === 'number' ? "0" : undefined}
        />
      ) : (
        <p className="mt-1 text-white">{readOnlyValue !== undefined ? readOnlyValue : String(player[fieldName])}</p>
      )}
    </div>
  );
  
  const getPositionAbbreviationKey = (position: PlayerPosition): string => {
    switch (position) {
      case PlayerPosition.GK: return 'posAbbrGK';
      case PlayerPosition.DEF: return 'posAbbrDEF';
      case PlayerPosition.MID: return 'posAbbrMID';
      case PlayerPosition.FWD: return 'posAbbrFWD';
      default: return position;
    }
  };


  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 modal-backdrop-blur flex items-center justify-center z-[60] p-4"
      onClick={onClose}
      role="dialog" aria-modal="true" aria-labelledby="playerDetailModalTitle"
    >
      <div 
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="playerDetailModalTitle" className="text-2xl font-bold text-sky-400">{t('playerDetailModalTitle')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors text-3xl leading-none">&times;</button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative group w-32 h-40 md:w-40 md:h-52 mx-auto md:mx-0 flex-shrink-0">
              <img 
                src={player.photoUrl} 
                alt={player.name} 
                className="w-full h-full object-cover rounded-lg border-2 border-slate-500 shadow-md"
              />
              <button
                onClick={handleImageUploadClick}
                aria-label={t('uploadNewPhotoLabel')}
                title={t('uploadNewPhotoLabel')}
                className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow">
                {renderStatField("nameLabel", "name", "text", isEditing ? undefined : player.name)}
                {renderStatField("jerseyLabelWithRange", "jerseyNumber", "number", isEditing ? undefined : player.jerseyNumber)}
                {renderStatField("skillLabel", "skill", "number", isEditing ? undefined : player.skill)}
                 {renderStatField("ageLabel", "age", "number", isEditing ? undefined : player.age)}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div>
                <label className="block text-sm font-medium text-sky-300">{t('preferredPositionLabel')}</label>
                {isEditing ? (
                    <select name="position" value={editablePlayer.position} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white">
                        {PLAYER_POSITIONS_LIST.map(pos => <option key={pos} value={pos}>{t(pos)}</option>)}
                    </select>
                ) : (
                  <div className="mt-1">
                    <PositionTag position={player.position} size="sm"/>
                  </div>
                )}
            </div>
            {renderStatField("goalsLabel", "goals", "number")}
            {renderStatField("assistsLabel", "assists", "number")}
            {renderStatField("gamesPlayedLabel", "gamesPlayed", "number")}
            {renderStatField("minutesPlayedLabel", "minutesPlayed", "number")}
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-sky-300 mb-1">{t('playablePositionsLabel')}</label>
          {isEditing ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLAYER_POSITIONS_LIST.map(pos => (
                <label key={pos} className="flex items-center space-x-2 text-sm text-white cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={editablePlayer.playablePositions?.includes(pos) || false}
                    onChange={(e) => handlePlayablePositionChange(pos, e.target.checked)}
                    className="form-checkbox h-4 w-4 text-sky-600 bg-slate-700 border-slate-500 rounded focus:ring-sky-500"
                  />
                  <span>{t(getPositionAbbreviationKey(pos))}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1 mt-1">
              {(player.playablePositions || []).map(p => (
                <PositionTag key={p} position={p} size="xs" />
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button onClick={handleCancelEdit} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700">{t('cancelButton')}</button>
              <button onClick={handleSave} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">{t('saveButton')}</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700">{t('editButton')}</button>
          )}
          <button onClick={onClose} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">{t('closeButton')}</button>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailModal;
