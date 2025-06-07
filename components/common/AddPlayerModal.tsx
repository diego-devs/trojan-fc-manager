import React, { useState, useEffect } from 'react';
import { PlayerPosition } from '../../types';
import { PLAYER_POSITIONS_LIST } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import type { NewPlayerData } from '../../App'; // Import the type from App.tsx

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (playerData: NewPlayerData) => void;
  initialData?: Partial<NewPlayerData>; // Optional initial data
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose, onAddPlayer, initialData }) => {
  const { t } = useTranslation();
  
  const defaultInitialData: NewPlayerData = {
    name: '',
    skill: 40,
    age: 25, // Added default age
    position: PlayerPosition.MID,
    jerseyNumber: 12,
    playablePositions: [PlayerPosition.MID],
    goals: 0,
    assists: 0,
    minutesPlayed: 0,
    gamesPlayed: 0,
  };

  const [playerName, setPlayerName] = useState(initialData?.name || defaultInitialData.name);
  const [playerSkill, setPlayerSkill] = useState(initialData?.skill || defaultInitialData.skill);
  const [playerAge, setPlayerAge] = useState(initialData?.age || defaultInitialData.age); // Added playerAge state
  const [playerPosition, setPlayerPosition] = useState(initialData?.position || defaultInitialData.position);
  const [playerJersey, setPlayerJersey] = useState(initialData?.jerseyNumber || defaultInitialData.jerseyNumber);

  useEffect(() => {
    if (isOpen) {
      // Reset form fields when modal opens, possibly with new initialData
      const activeInitialData = initialData || defaultInitialData;
      setPlayerName(activeInitialData.name || '');
      setPlayerSkill(activeInitialData.skill || 40);
      setPlayerAge(activeInitialData.age || 25); // Reset playerAge
      setPlayerPosition(activeInitialData.position || PlayerPosition.MID);
      setPlayerJersey(activeInitialData.jerseyNumber || 12);
    }
  }, [isOpen, initialData]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() === '') {
      alert(t('playerNameRequiredError'));
      return;
    }
    if (playerSkill < 30 || playerSkill > 50) {
      alert(t('skillRangeError')); // Corrected key from skillLabelWithRange to skillRangeError
      return;
    }
    if (playerAge < 16 || playerAge > 45) { // Added age validation
      alert(t('ageRangeError'));
      return;
    }
    if (playerJersey < 1 || playerJersey > 99) {
      alert(t('jerseyNumberRangeError'));
      return;
    }
    
    onAddPlayer({
      name: playerName,
      skill: playerSkill,
      age: playerAge, // Included age in submission
      position: playerPosition,
      jerseyNumber: playerJersey,
      playablePositions: [playerPosition], // Default playable to preferred
      // Default other stats for a new player
      goals: 0,
      assists: 0,
      minutesPlayed: 0,
      gamesPlayed: 0,
    });
    onClose(); // Close modal after adding
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 modal-backdrop-blur" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="addPlayerModalTitle"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent close on inner click
      >
        <h3 id="addPlayerModalTitle" className="text-xl font-semibold mb-4 text-sky-400">{t('addPlayerModalTitle')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPlayerName" className="block text-sm font-medium text-gray-300">{t('nameLabel')}</label>
            <input type="text" id="newPlayerName" value={playerName} onChange={(e) => setPlayerName(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white" />
          </div>
          <div>
            <label htmlFor="newPlayerSkill" className="block text-sm font-medium text-gray-300">{t('skillLabelWithRange')}</label>
            <input type="number" id="newPlayerSkill" value={playerSkill} onChange={(e) => setPlayerSkill(parseInt(e.target.value))} min="30" max="50" required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white" />
          </div>
          <div> {/* Added Age Input Field */}
            <label htmlFor="newPlayerAge" className="block text-sm font-medium text-gray-300">{t('ageLabelWithRange')}</label>
            <input type="number" id="newPlayerAge" value={playerAge} onChange={(e) => setPlayerAge(parseInt(e.target.value))} min="16" max="45" required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white" />
          </div>
          <div>
            <label htmlFor="newPlayerPosition" className="block text-sm font-medium text-gray-300">{t('preferredPositionLabel')}</label>
            <select id="newPlayerPosition" value={playerPosition} onChange={(e) => setPlayerPosition(e.target.value as PlayerPosition)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white">
              {PLAYER_POSITIONS_LIST.map(pos => <option key={pos} value={pos}>{t(pos)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="newPlayerJersey" className="block text-sm font-medium text-gray-300">{t('jerseyLabelWithRange')}</label>
            <input type="number" id="newPlayerJersey" value={playerJersey} onChange={(e) => setPlayerJersey(parseInt(e.target.value))} min="1" max="99" required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white" />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-800">{t('cancelButton')}</button>
            <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800">{t('addPlayerButton')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlayerModal;