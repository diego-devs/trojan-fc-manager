import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const helpPoints = [
    'help_dragPlayersRosterToPitch',
    'help_dragPlayersOnPitch',
    'help_dragPlayersPitchToRoster',
    'help_addPlayers',
    'help_removePlayers',
    'help_selectFormation',
    'help_setCaptainAndName',
    'help_languageAndHelp',
  ];

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 modal-backdrop-blur flex items-center justify-center z-50 p-4" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="helpModalTitle"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal content
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="helpModalTitle" className="text-2xl font-bold text-sky-400">{t('helpModalTitle')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors text-2xl"
            aria-label={t('closeButton')}
          >
            &times;
          </button>
        </div>
        <ul className="space-y-3 text-gray-300">
          {helpPoints.map((pointKey) => (
            <li key={pointKey} className="flex items-start">
              <svg className="w-5 h-5 text-sky-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span>{t(pointKey)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
          >
            {t('closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;