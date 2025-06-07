
import React, { useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Player, PlayerPosition } from '../../types';
import { PLAYER_POSITIONS_LIST } from '../../constants';
import PlayerCard from '../common/PlayerCard'; 

interface PlayerManagementControlsProps {
  onAddNewPlayer: () => void;
  onSaveRoster: () => void;
  onLoadRoster: (file: File) => void;
  
  allPlayers: Player[]; // For role assignment selectors
  captainId: string | null;
  penaltyTakerId: string | null;
  cornerTakerId: string | null;
  freeKickTakerId: string | null;
  onCaptainChange: (playerId: string | null) => void;
  onPenaltyTakerChange: (playerId: string | null) => void;
  onCornerTakerChange: (playerId: string | null) => void;
  onFreeKickTakerChange: (playerId: string | null) => void;
  onOpenDetailModal: (player: Player, startInEdit?: boolean) => void;
  captainPlayer: Player | null;
  penaltyTakerPlayer: Player | null;
  cornerTakerPlayer: Player | null;
  freeKickTakerPlayer: Player | null;

  // Filter and Sort props
  showOnlyStarters: boolean;
  onShowOnlyStartersChange: (checked: boolean) => void;
  nameFilter: string;
  onNameFilterChange: (name: string) => void;
  positionFilters: PlayerPosition[];
  onPositionFilterChange: (position: PlayerPosition, checked: boolean) => void;
  skillRange: { min: number; max: number };
  onSkillRangeChange: (field: 'min' | 'max', value: number) => void;
  ageRange: { min: number; max: number };
  onAgeRangeChange: (field: 'min' | 'max', value: number) => void;
  sortOption: string;
  onSortOptionChange: (option: string) => void;
  onResetFilters: () => void;
}

const PlayerManagementControls: React.FC<PlayerManagementControlsProps> = ({
  onAddNewPlayer,
  onSaveRoster,
  onLoadRoster,
  allPlayers,
  captainId,
  penaltyTakerId,
  cornerTakerId,
  freeKickTakerId,
  onCaptainChange,
  onPenaltyTakerChange,
  onCornerTakerChange,
  onFreeKickTakerChange,
  onOpenDetailModal,
  captainPlayer,
  penaltyTakerPlayer,
  cornerTakerPlayer,
  freeKickTakerPlayer,
  showOnlyStarters,
  onShowOnlyStartersChange,
  nameFilter,
  onNameFilterChange,
  positionFilters,
  onPositionFilterChange,
  skillRange,
  onSkillRangeChange,
  ageRange,
  onAgeRangeChange,
  sortOption,
  onSortOptionChange,
  onResetFilters,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLoadRoster(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };
  
  const getPositionAbbreviationKey = (position: PlayerPosition): string => {
    switch (position) {
      case PlayerPosition.GK: return 'posAbbrGK';
      case PlayerPosition.DEF: return 'posAbbrDEF';
      case PlayerPosition.MID: return 'posAbbrMID';
      case PlayerPosition.FWD: return 'posAbbrFWD';
      default: return position;
    }
  };

  const sortOptions = [
    { value: "default", labelKey: "sortOption_default" },
    { value: "name_asc", labelKey: "sortOption_name_asc" },
    { value: "name_desc", labelKey: "sortOption_name_desc" },
    { value: "skill_asc", labelKey: "sortOption_skill_asc" },
    { value: "skill_desc", labelKey: "sortOption_skill_desc" },
    { value: "age_asc", labelKey: "sortOption_age_asc" },
    { value: "age_desc", labelKey: "sortOption_age_desc" },
  ];

  const renderRoleSelector = (
    id: string,
    labelKey: string,
    value: string | null,
    onChange: (playerId: string | null) => void,
    selectedRolePlayer: Player | null
  ) => (
    <div className="mb-3"> 
      <label htmlFor={id} className="block text-xs font-medium text-sky-400">{t(labelKey)}</label>
      <select
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="mt-0.5 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-xs text-white text-xs"
        aria-label={t(labelKey)}
      >
        <option value="">{t('selectPlayerPlaceholder')}</option>
        {allPlayers.map(p => (
          <option key={p.id} value={p.id}>{p.name} (#{p.jerseyNumber})</option>
        ))}
      </select>
      {selectedRolePlayer && (
        <div className="mt-1.5">
          <PlayerCard 
            player={selectedRolePlayer} 
            isDraggable={false} 
            onDragStart={()=>{}} 
            dataSource="bench"
            onOpenDetailModal={(player) => onOpenDetailModal(player, false)}
            cardScale={0.65} 
            isOnPitch={false} 
          />
        </div>
      )}
      {!selectedRolePlayer && allPlayers.length === 0 && (
         <p className="text-2xs text-gray-400 italic mt-0.5">{t('noPlayersInRosterForRole')}</p>
      )}
       {!selectedRolePlayer && allPlayers.length > 0 && (
         <p className="text-2xs text-gray-400 italic mt-0.5">{t('selectPlayerForRolePrompt')}</p>
      )}
    </div>
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur-md p-3 rounded-lg shadow-xl h-full flex flex-col space-y-3 overflow-y-auto custom-scrollbar-thin">
      <div>
        <h2 className="text-lg font-bold text-sky-400 border-b-2 border-sky-500 pb-1.5 mb-2">
          {t('playersPage_controlsPanelTitle')}
        </h2>
        <p className="text-xs text-gray-400 mb-3">
          {t('playersPage_controlsPanelSubtitle')}
        </p>
      </div>

      <button
        onClick={onAddNewPlayer}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-md text-sm"
      >
        {t('addNewPlayerButton')}
      </button>

      <div className="space-y-2">
        <button
          onClick={onSaveRoster}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-md text-sm"
        >
          {t('saveRosterButton')}
        </button>
        <button
          onClick={handleLoadClick}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors shadow-md text-sm"
        >
          {t('loadRosterButton')}
        </button>
        <input
          type="file"
          id="load-roster-input-playerspage-controls"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>
      
      <hr className="border-slate-600 !my-3" />

      {/* Filters & Sort Section */}
      <div>
        <h3 className="text-base font-semibold text-sky-400 mb-2">{t('playersPage_filtersTitle')}</h3>
        <div className="space-y-2.5">
          {/* Starting Players */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showOnlyStarters"
              checked={showOnlyStarters}
              onChange={(e) => onShowOnlyStartersChange(e.target.checked)}
              className="h-3.5 w-3.5 text-sky-600 bg-slate-700 border-slate-500 rounded focus:ring-sky-500"
            />
            <label htmlFor="showOnlyStarters" className="ml-2 text-xs text-gray-300">
              {t('filterByStartingPlayersLabel')}
            </label>
          </div>

          {/* Name Filter */}
          <div>
            <label htmlFor="nameFilter" className="block text-xs font-medium text-gray-300">{t('filterByNameLabel')}</label>
            <input
              type="text"
              id="nameFilter"
              value={nameFilter}
              onChange={(e) => onNameFilterChange(e.target.value)}
              placeholder={t('filterByNamePlaceholder')}
              className="mt-0.5 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-xs text-white"
            />
          </div>

          {/* Position Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-300">{t('filterByPositionLabel')}</label>
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              {PLAYER_POSITIONS_LIST.map(pos => (
                <label key={pos} className="flex items-center space-x-1.5 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={positionFilters.includes(pos)}
                    onChange={(e) => onPositionFilterChange(pos, e.target.checked)}
                    className="h-3.5 w-3.5 text-sky-600 bg-slate-700 border-slate-500 rounded focus:ring-sky-500"
                  />
                  <span>{t(getPositionAbbreviationKey(pos))}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Skill Range */}
          <div>
            <label className="block text-xs font-medium text-gray-300">{t('filterBySkillLabel')}</label>
            <div className="flex space-x-2 mt-0.5">
              <input type="number" value={skillRange.min} onChange={(e) => onSkillRangeChange('min', parseInt(e.target.value))} placeholder={t('minLabel')} className="w-1/2 bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-xs text-white focus:ring-sky-500 focus:border-sky-500" />
              <input type="number" value={skillRange.max} onChange={(e) => onSkillRangeChange('max', parseInt(e.target.value))} placeholder={t('maxLabel')} className="w-1/2 bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-xs text-white focus:ring-sky-500 focus:border-sky-500" />
            </div>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-xs font-medium text-gray-300">{t('filterByAgeLabel')}</label>
            <div className="flex space-x-2 mt-0.5">
              <input type="number" value={ageRange.min} onChange={(e) => onAgeRangeChange('min', parseInt(e.target.value))} placeholder={t('minLabel')} className="w-1/2 bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-xs text-white focus:ring-sky-500 focus:border-sky-500" />
              <input type="number" value={ageRange.max} onChange={(e) => onAgeRangeChange('max', parseInt(e.target.value))} placeholder={t('maxLabel')} className="w-1/2 bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-xs text-white focus:ring-sky-500 focus:border-sky-500" />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sortOption" className="block text-xs font-medium text-gray-300">{t('sortByLabel')}</label>
            <select
              id="sortOption"
              value={sortOption}
              onChange={(e) => onSortOptionChange(e.target.value)}
              className="mt-0.5 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-xs text-white"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{t(opt.labelKey as any)}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={onResetFilters}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2 px-3 rounded-lg transition-colors shadow-md text-sm"
          >
            {t('resetFiltersButton')}
          </button>
        </div>
      </div>


      <hr className="border-slate-600 !my-3" />

      {/* Role Assignment Section */}
      <div>
        <h3 className="text-base font-semibold text-sky-400 mb-2">{t('assignRolesTitle')}</h3>
        {renderRoleSelector("pageCaptainSelect", "teamCaptainLabel", captainId, onCaptainChange, captainPlayer)}
        {renderRoleSelector("pagePenaltyTakerSelect", "penaltyTakerLabel", penaltyTakerId, onPenaltyTakerChange, penaltyTakerPlayer)}
        {renderRoleSelector("pageCornerTakerSelect", "cornerTakerLabel", cornerTakerId, onCornerTakerChange, cornerTakerPlayer)}
        {renderRoleSelector("pageFreeKickTakerSelect", "freeKickTakerLabel", freeKickTakerId, onFreeKickTakerChange, freeKickTakerPlayer)}
      </div>
    </div>
  );
};

export default PlayerManagementControls;
