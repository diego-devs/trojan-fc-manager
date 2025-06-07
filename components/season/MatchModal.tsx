
import React, { useState, useEffect } from 'react';
import { Match } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (match: Match) => void;
  matchData: Partial<Match> | null; 
  mode: 'add' | 'edit';
}

const MatchModal: React.FC<MatchModalProps> = ({ isOpen, onClose, onSave, matchData, mode }) => {
  const { t } = useTranslation();
  const [opponent, setOpponent] = useState('');
  const [time, setTime] = useState('19:00'); 
  const [isHome, setIsHome] = useState(true);
  const [matchNotes, setMatchNotes] = useState(''); // State for match notes
  const [currentMatchId, setCurrentMatchId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen && matchData) {
      setOpponent(matchData.opponent || '');
      setTime(matchData.time || '19:00');
      setIsHome(matchData.isHome === undefined ? true : matchData.isHome);
      setMatchNotes(matchData.matchNotes || ''); // Initialize matchNotes
      setCurrentMatchId(matchData.id);
    } else if (isOpen && !matchData) { 
        setOpponent('');
        setTime('19:00');
        setIsHome(true);
        setMatchNotes(''); // Reset notes for new match
        setCurrentMatchId(undefined);
    }
  }, [isOpen, matchData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent.trim()) {
      alert(t('opponentLabel') + ' ' + t('playerNameRequiredError')); 
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      alert(t('timeLabel') + ' must be in HH:MM format.');
      return;
    }

    const finalMatchData: Match = {
      id: mode === 'edit' && currentMatchId ? currentMatchId : crypto.randomUUID(),
      date: matchData!.date!, 
      opponent: opponent.trim(),
      time,
      isHome,
      matchNotes: matchNotes.trim(), // Include matchNotes
      // Ensure score is preserved if editing and exists
      ...(mode === 'edit' && matchData?.score && { score: matchData.score }),
    };
    onSave(finalMatchData);
    onClose();
  };

  const modalTitle = mode === 'add' ? t('addMatchTitle') : t('editMatchTitle');

  return (
    <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-75 modal-backdrop-blur flex items-center justify-center z-[80] p-4"
        onClick={onClose}
        role="dialog" aria-modal="true" aria-labelledby="matchModalTitle"
    >
      <div 
        className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 id="matchModalTitle" className="text-xl font-bold text-sky-400">{modalTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="matchOpponent" className="block text-sm font-medium text-gray-300">{t('opponentLabel')}</label>
            <input
              type="text"
              id="matchOpponent"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="matchTime" className="block text-sm font-medium text-gray-300">{t('timeLabel')}</label>
            <input
              type="time"
              id="matchTime"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">{t('isHomeLabel')}</label>
            <div className="mt-1 flex space-x-4">
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="venue"
                  checked={isHome}
                  onChange={() => setIsHome(true)}
                  className="form-radio h-4 w-4 text-sky-600 bg-slate-700 border-slate-500 focus:ring-sky-500"
                />
                <span className="ml-2">{t('homeMatch')}</span>
              </label>
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="venue"
                  checked={!isHome}
                  onChange={() => setIsHome(false)}
                  className="form-radio h-4 w-4 text-sky-600 bg-slate-700 border-slate-500 focus:ring-sky-500"
                />
                <span className="ml-2">{t('awayMatch')}</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="matchNotes" className="block text-sm font-medium text-gray-300">{t('matchNotesStrategy')}</label>
            <textarea
              id="matchNotes"
              value={matchNotes}
              onChange={(e) => setMatchNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white placeholder-slate-400"
              placeholder={t('matchNotesStrategy') + "..."}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-slate-500 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-800"
            >
              {t('cancelButton')}
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800"
            >
              {t('saveMatchButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatchModal;