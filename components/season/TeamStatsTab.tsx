
import React from 'react';
import { TeamStatistic } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface TeamStatsTabProps {
  teamStats: TeamStatistic[];
}

const TeamStatsTab: React.FC<TeamStatsTabProps> = ({ teamStats }) => {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 bg-slate-800/50 rounded-b-lg shadow-inner">
      {teamStats.length === 0 ? (
         <p className="text-slate-400 italic text-center py-4">{t('noDataAvailable') || 'No team statistics available. Load from backup.'}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {teamStats.map(stat => (
            <div key={stat.id} className="bg-slate-700 p-3 rounded-lg shadow">
              <h4 className="text-sm font-semibold text-sky-400 mb-1">{t(stat.labelKey)}</h4>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
       <p className="text-xs text-slate-500 mt-4 italic text-center">
        More detailed team statistics will be available here.
      </p>
    </div>
  );
};

export default TeamStatsTab;
