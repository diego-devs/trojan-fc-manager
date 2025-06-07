
import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import LeagueTableTab from './LeagueTableTab';
import TeamStatsTab from './TeamStatsTab';
import PlayerStatsTab from './PlayerStatsTab';
import { LeagueTableRow, TeamStatistic, PlayerStatistic } from '../../types';

type StatTab = 'league' | 'team' | 'player';

interface StatisticsTabsProps {
  leagueTableData: LeagueTableRow[];
  teamStatsData: TeamStatistic[];
  playerStatsData: PlayerStatistic[];
}

const StatisticsTabs: React.FC<StatisticsTabsProps> = ({
  leagueTableData,
  teamStatsData,
  playerStatsData,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<StatTab>('league');

  const tabs: { id: StatTab; labelKey: string }[] = [
    { id: 'league', labelKey: 'leagueTableTab' },
    { id: 'team', labelKey: 'teamStatsTab' },
    { id: 'player', labelKey: 'playerStatsTab' },
  ];

  return (
    <div className="mt-4 sm:mt-6">
      {/* Tab Navigation Bar */}
      <div className="bg-slate-800/70 backdrop-blur-sm rounded-t-lg border-b-2 border-slate-600">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto custom-scrollbar-thin px-1" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-3 sm:py-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors -mb-[2px]
                ${activeTab === tab.id
                  ? 'border-sky-500 text-sky-400' // Active tab
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500' // Inactive tab
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Area */}
      <div className="mt-0">
        {activeTab === 'league' && <LeagueTableTab leagueData={leagueTableData} />}
        {activeTab === 'team' && <TeamStatsTab teamStats={teamStatsData} />}
        {activeTab === 'player' && <PlayerStatsTab playerStats={playerStatsData} />}
      </div>
    </div>
  );
};

export default StatisticsTabs;
