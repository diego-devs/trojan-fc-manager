
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

type AppView = 'tactician' | 'players' | 'season' | 'nextMatch'; // Updated AppView

interface TopNavBarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onSaveAllData: () => void; // For downloading backup file
  onRequestLoadAllData: () => void; 
  onQuickSaveData: () => void; // New prop for quick save to localStorage
}

const TopNavBar: React.FC<TopNavBarProps> = ({ currentView, setCurrentView, onSaveAllData, onRequestLoadAllData, onQuickSaveData }) => {
  const { t } = useTranslation();

  const navItems: { view: AppView; labelKey: string }[] = [
    { view: 'tactician', labelKey: 'navTactician' },
    { view: 'players', labelKey: 'navPlayers' },
    { view: 'season', labelKey: 'navSeason' },
    { view: 'nextMatch', labelKey: 'navNextMatch' }, // Added Next Match
  ];

  return (
    <nav className="bg-slate-800/50 backdrop-blur-md p-3 shadow-lg mb-4 rounded-lg flex justify-between items-center sticky top-0 z-50">
      <ul className="flex justify-center space-x-4 sm:space-x-6 md:space-x-8">
        {navItems.map((item) => (
          <li key={item.view}>
            <button
              onClick={() => setCurrentView(item.view)}
              className={`pb-2 text-sm sm:text-base font-medium transition-colors duration-150 ease-in-out border-b-2
                ${currentView === item.view
                  ? 'text-sky-400 border-sky-400'
                  : 'text-gray-300 hover:text-sky-300 border-transparent hover:border-sky-300'
                }
              `}
              aria-current={currentView === item.view ? 'page' : undefined}
            >
              {t(item.labelKey)}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-2">
        <button
          onClick={onQuickSaveData}
          className="p-2 text-gray-300 hover:text-sky-400 transition-colors"
          aria-label={t('quickSaveButtonLabel')}
          title={t('quickSaveButtonLabel')}
        >
          {/* Simple Save Icon (Floppy Disk) */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
            <path d="M3 3.75A1.75 1.75 0 014.75 2h7.928a2.25 2.25 0 011.804 1.03l.513 1.026A1.75 1.75 0 0016.75 5h.5A1.75 1.75 0 0119 6.75v8.5A1.75 1.75 0 0117.25 17h-11A1.75 1.75 0 014.5 15.25V15h10.75a.75.75 0 000-1.5H4.5V6.75A.75.75 0 003.75 6H3V3.75z" />
            <path d="M6.25 6A.75.75 0 005.5 6.75V15h1.938V7.641A2.251 2.251 0 019.25 5.5h.5A2.25 2.25 0 0112 7.75v7.25h1.5V7.75A2.25 2.25 0 0010.75 5.5h-.5A2.251 2.251 0 008.188 7.64L6.25 7.75V6z" />
             <rect x="7" y="11" width="6" height="5" rx="0.5" fill="rgba(128,128,128,0.5)" />
          </svg>
        </button>
        <button
          onClick={onRequestLoadAllData}
          className="p-2 text-gray-300 hover:text-sky-400 transition-colors"
          aria-label={t('loadAllDataButtonLabel')}
          title={t('loadAllDataButtonLabel')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
            <path d="M9.25 13.25a.75.75 0 001.5 0V4.66l1.97 1.97a.75.75 0 001.06-1.06l-3.25-3.25a.75.75 0 00-1.06 0L6.22 5.57a.75.75 0 001.06 1.06L9.25 4.66v8.59z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
        </button>
        <button
          onClick={onSaveAllData}
          className="p-2 text-gray-300 hover:text-sky-400 transition-colors"
          aria-label={t('saveAllDataButtonLabel')}
          title={t('saveAllDataButtonLabel')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default TopNavBar;