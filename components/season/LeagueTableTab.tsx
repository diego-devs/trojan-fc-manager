
import React, { useRef } from 'react';
import { LeagueTableRow } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface LeagueTableTabProps {
  leagueData: LeagueTableRow[];
}

const LeagueTableTab: React.FC<LeagueTableTabProps> = ({ leagueData }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      alert(`File "${file.name}" selected. Parsing logic to be implemented. This feature is not fully implemented to update the table from a file yet.`);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-3 sm:p-4 bg-slate-800/50 rounded-b-lg shadow-inner">
      <div className="mb-4 flex justify-end">
        <button 
          onClick={triggerFileInput}
          className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md shadow-md transition-colors"
        >
          {t('loadLeagueTableFile')}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          aria-label={t('fileInputLabel')}
        />
      </div>
      {leagueData.length === 0 ? (
        <p className="text-slate-400 italic text-center py-4">{t('noDataAvailable') || 'No league table data available. Load from backup or a file.'}</p>
      ) : (
        <div className="overflow-x-auto custom-scrollbar-thin">
          <table className="min-w-full divide-y divide-slate-700 text-xs sm:text-sm">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-left font-semibold text-sky-400 tracking-wider">{t('rank')}</th>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-left font-semibold text-sky-400 tracking-wider">{t('team')}</th>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-center font-semibold text-sky-400 tracking-wider" title={t('played')}>{t('played')}</th>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-center font-semibold text-sky-400 tracking-wider" title={t('wins')}>{t('wins')}</th>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-center font-semibold text-sky-400 tracking-wider" title={t('draws')}>{t('draws')}</th>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-center font-semibold text-sky-400 tracking-wider" title={t('losses')}>{t('losses')}</th>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-center font-semibold text-sky-400 tracking-wider" title={t('goalsFor')}>{t('goalsForShort')}</th>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-center font-semibold text-sky-400 tracking-wider" title={t('goalsAgainst')}>{t('goalsAgainstShort')}</th>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-center font-semibold text-sky-400 tracking-wider" title={t('goalDifferenceShort')}>{t('goalDifferenceShort')}</th>
                <th className="px-2 py-2 sm:px-3 sm:py-3 text-center font-semibold text-sky-400 tracking-wider" title={t('points')}>{t('points')}</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700/50">
              {leagueData.map((row) => (
                <tr key={row.teamName + row.rank} className={`${row.teamName === "Trojan FC" ? 'bg-sky-800/30 font-semibold' : 'hover:bg-slate-700/30'}`}>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-center">{row.rank}</td>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-slate-200">{row.teamName}</td>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-center">{row.played}</td>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-center">{row.wins}</td>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-center">{row.draws}</td>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-center">{row.losses}</td>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-center">{row.goalsFor}</td>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-center">{row.goalsAgainst}</td>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-center">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5 whitespace-nowrap text-center font-bold text-sky-300">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeagueTableTab;
