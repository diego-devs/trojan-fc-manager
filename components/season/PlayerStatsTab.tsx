
import React from 'react';
import { PlayerStatistic } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface PlayerStatsTabProps {
  playerStats: PlayerStatistic[];
}

const PlayerStatsTab: React.FC<PlayerStatsTabProps> = ({ playerStats }) => {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 bg-slate-800/50 rounded-b-lg shadow-inner">
      {playerStats.length === 0 ? (
        <p className="text-slate-400 italic text-center py-4">{t('noDataAvailable') || 'No player statistics available. Load from backup.'}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {playerStats.map(stat => (
            <div key={stat.id} className="bg-slate-700 p-3 rounded-lg shadow flex items-center space-x-3">
              {stat.playerPhotoUrl && (
                <img src={stat.playerPhotoUrl} alt={stat.playerName} className="w-10 h-10 rounded-full object-cover border-2 border-slate-500"/>
              )}
              <div>
                <h4 className="text-sm font-semibold text-sky-400 mb-0.5">{t(stat.statNameKey)}</h4>
                <p className="text-lg font-bold text-white">{stat.value} - <span className="text-xs text-slate-300">{stat.playerName}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500 mt-4 italic text-center">
        Detailed player statistics and leaderboards will be shown here.
      </p>
    </div>
  );
};

export default PlayerStatsTab;
