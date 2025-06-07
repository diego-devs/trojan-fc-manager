import React, { useState, useCallback, useMemo } from 'react';
import { Player, PlayerPosition } from '../types';
import PlayerCard from './common/PlayerCard';
import PlayerManagementControls from './players/PlayerManagementControls'; 
import PlayerInfoPanel from './players/PlayerInfoPanel'; 
import AddPlayerModal from './common/AddPlayerModal';
import { useTranslation } from '../hooks/useTranslation';
import type { NewPlayerData } from '../App';

interface PlayersManagementPageProps {
  allPlayers: Player[];
  onAddPlayer: (playerData: NewPlayerData) => void;
  onRemovePlayer: (playerId: string) => void;
  onSavePlayerDetail: (updatedPlayer: Player) => void;
  onOpenDetailModal: (player: Player, startInEdit?: boolean) => void; 
  onSavePlayersToFile: () => void;
  onLoadPlayersFromFile: (file: File) => void;
  onNavigateBack: () => void; 
  captainId: string | null;
  penaltyTakerId: string | null;
  cornerTakerId: string | null;
  freeKickTakerId: string | null;
  onCaptainChange: (playerId: string | null) => void;
  onPenaltyTakerChange: (playerId: string | null) => void;
  onCornerTakerChange: (playerId: string | null) => void;
  onFreeKickTakerChange: (playerId: string | null) => void;
  captainPlayer: Player | null;
  penaltyTakerPlayer: Player | null;
  cornerTakerPlayer: Player | null;
  freeKickTakerPlayer: Player | null;
  playersOnPitchIds?: (string | null)[];
  settingsCardScale?: number; // Added to match App.tsx changes
}

const INITIAL_SKILL_RANGE = { min: 30, max: 50 };
const INITIAL_AGE_RANGE = { min: 16, max: 45 };
const DEFAULT_SORT_OPTION = "name_asc";

const PlayersManagementPage: React.FC<PlayersManagementPageProps> = ({
  allPlayers,
  onAddPlayer,
  onRemovePlayer,
  onSavePlayerDetail, 
  onOpenDetailModal, 
  onSavePlayersToFile,
  onLoadPlayersFromFile,
  captainId,
  penaltyTakerId,
  cornerTakerId,
  freeKickTakerId,
  onCaptainChange,
  onPenaltyTakerChange,
  onCornerTakerChange,
  onFreeKickTakerChange,
  captainPlayer,
  penaltyTakerPlayer,
  cornerTakerPlayer,
  freeKickTakerPlayer,
  playersOnPitchIds,
  settingsCardScale = 0.7, // Default if not provided
}) => {
  const { t } = useTranslation();
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [selectedPlayerForInfo, setSelectedPlayerForInfo] = useState<Player | null>(null);
  const [isPlayerInfoPanelOpen, setIsPlayerInfoPanelOpen] = useState<boolean>(false); // Default hidden

  // Filter and Sort State
  const [showOnlyStarters, setShowOnlyStarters] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [positionFilters, setPositionFilters] = useState<PlayerPosition[]>([]);
  const [skillRange, setSkillRange] = useState(INITIAL_SKILL_RANGE);
  const [ageRange, setAgeRange] = useState(INITIAL_AGE_RANGE);
  const [sortOption, setSortOption] = useState(DEFAULT_SORT_OPTION);

  const togglePlayerInfoPanel = () => {
    setIsPlayerInfoPanelOpen(prev => !prev);
  };

  const handleAddNewPlayer = () => {
    setIsAddPlayerModalOpen(true);
  };

  const handlePlayerCardClickInGrid = useCallback((player: Player) => {
    setSelectedPlayerForInfo(player);
    if (!isPlayerInfoPanelOpen && window.innerWidth >= 768) { // Open panel on desktop if closed and player selected
        // Optional: you might want to open it only if it was previously closed by user action
        // or always open it when a player is selected from the grid.
        // setIsPlayerInfoPanelOpen(true); 
    }
  }, [isPlayerInfoPanelOpen]);
  
  const cardScaleForPlayersPage = settingsCardScale; // Use passed in scale

  const handlePositionFilterChange = (position: PlayerPosition, checked: boolean) => {
    setPositionFilters(prev => 
      checked ? [...prev, position] : prev.filter(p => p !== position)
    );
  };

  const handleSkillRangeChange = (field: 'min' | 'max', value: number) => {
    setSkillRange(prev => ({ ...prev, [field]: value }));
  };

  const handleAgeRangeChange = (field: 'min' | 'max', value: number) => {
    setAgeRange(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setShowOnlyStarters(false);
    setNameFilter('');
    setPositionFilters([]);
    setSkillRange(INITIAL_SKILL_RANGE);
    setAgeRange(INITIAL_AGE_RANGE);
    setSortOption(DEFAULT_SORT_OPTION);
  };
  
  const filteredAndSortedPlayers = useMemo(() => {
    let players = [...allPlayers];

    // Filtering
    if (showOnlyStarters && playersOnPitchIds) {
      players = players.filter(p => playersOnPitchIds.includes(p.id));
    }
    if (nameFilter) {
      players = players.filter(p => p.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (positionFilters.length > 0) {
      players = players.filter(p => positionFilters.includes(p.position) || p.playablePositions.some(pp => positionFilters.includes(pp)));
    }
    players = players.filter(p => p.skill >= skillRange.min && p.skill <= skillRange.max);
    players = players.filter(p => p.age >= ageRange.min && p.age <= ageRange.max);

    // Sorting
    switch (sortOption) {
      case 'name_asc':
        players.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        players.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'skill_asc':
        players.sort((a, b) => a.skill - b.skill);
        break;
      case 'skill_desc':
        players.sort((a, b) => b.skill - a.skill);
        break;
      case 'age_asc':
        players.sort((a, b) => a.age - b.age);
        break;
      case 'age_desc':
        players.sort((a, b) => b.age - a.age);
        break;
      default:
        players.sort((a, b) => a.name.localeCompare(b.name)); 
    }
    return players;
  }, [allPlayers, showOnlyStarters, playersOnPitchIds, nameFilter, positionFilters, skillRange, ageRange, sortOption]);


  return (
    <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden h-full">
      {/* Left Panel Column - Player Info / Toggle / Placeholder */}
      <div className={`
          md:order-1 flex-shrink-0 h-full
          transition-all duration-300 ease-in-out relative
          ${isPlayerInfoPanelOpen ? 'w-full md:w-80 lg:w-96' : 'w-full md:w-20'} 
      `}>
          <button
              onClick={togglePlayerInfoPanel}
              className="absolute top-2 right-2 z-20 p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-lg"
              aria-expanded={isPlayerInfoPanelOpen}
              aria-controls="player-info-panel-content"
              title={isPlayerInfoPanelOpen ? t('hideDetails') : t('showDetails')}
          >
              {isPlayerInfoPanelOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
              )}
          </button>

          {isPlayerInfoPanelOpen && (
              <div id="player-info-panel-content" className="h-full pt-12 md:pt-0 overflow-y-auto custom-scrollbar-thin">
                  <PlayerInfoPanel
                      selectedPlayer={selectedPlayerForInfo}
                      onSaveDirectly={onSavePlayerDetail}
                  />
              </div>
          )}

          {!isPlayerInfoPanelOpen && (
              <div className="hidden md:flex flex-col items-center justify-center h-full text-center pt-12 md:pt-0"> {/* Ensure this doesn't overlap button */}
                  {selectedPlayerForInfo ? (
                      <>
                          <img src={selectedPlayerForInfo.photoUrl} alt={selectedPlayerForInfo.name} className="w-10 h-10 rounded-full object-cover mb-2 border-2 border-slate-600"/>
                          <p className="text-slate-400 text-xs" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                              {selectedPlayerForInfo.name}
                          </p>
                          <p className="text-slate-500 text-[10px] mt-1" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                            ({t('detailsHiddenLabel')})
                          </p>
                      </>
                  ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zM5 5h14M5 12h14M5 19h14" /></svg>
                  )}
              </div>
          )}
      </div>


      {/* Main Content - Player Grid */}
      <div className="flex-grow h-full overflow-y-auto bg-slate-800/50 backdrop-blur-md p-4 rounded-lg shadow-xl order-2 md:order-2 custom-scrollbar-thin">
        <h2 className="text-2xl font-bold text-sky-400 border-b-2 border-sky-500 pb-2 mb-4">
          {t('playersPage_allPlayersSectionTitle')} ({filteredAndSortedPlayers.length})
        </h2>
        {filteredAndSortedPlayers.length === 0 ? (
          <p className="text-gray-400 italic text-center py-10">
            {allPlayers.length > 0 ? t('noPlayersMatchFilters') : t('playersPage_noPlayersMessage')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredAndSortedPlayers.map(player => {
              const isStartingPlayer = playersOnPitchIds?.includes(player.id) ?? false;
              return (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isDraggable={false} 
                  onDragStart={() => {}} 
                  dataSource="bench" 
                  onRemove={(playerId) => {
                    if (window.confirm(t('removePlayerConfirmation', { name: player.name }))) {
                      onRemovePlayer(playerId);
                      if (selectedPlayerForInfo?.id === playerId) {
                        setSelectedPlayerForInfo(null);
                      }
                    }
                  }}
                  showRemoveButton={true}
                  onOpenDetailModal={handlePlayerCardClickInGrid} 
                  cardScale={cardScaleForPlayersPage}
                  isOnPitch={false} 
                  showAddToFormationButton={false}
                  showStartingPlayerOutline={isStartingPlayer}
                />
              );
            })}
          </div>
        )}
      </div>
      
      {/* Right Panel - Controls & Roles */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 h-full overflow-y-auto order-3 md:order-3 custom-scrollbar-thin">
        <PlayerManagementControls
          onAddNewPlayer={handleAddNewPlayer}
          onSaveRoster={onSavePlayersToFile}
          onLoadRoster={onLoadPlayersFromFile}
          allPlayers={allPlayers}
          captainId={captainId}
          penaltyTakerId={penaltyTakerId}
          cornerTakerId={cornerTakerId}
          freeKickTakerId={freeKickTakerId}
          onCaptainChange={onCaptainChange}
          onPenaltyTakerChange={onPenaltyTakerChange}
          onCornerTakerChange={onCornerTakerChange}
          onFreeKickTakerChange={onFreeKickTakerChange}
          onOpenDetailModal={onOpenDetailModal} 
          captainPlayer={captainPlayer}
          penaltyTakerPlayer={penaltyTakerPlayer}
          cornerTakerPlayer={cornerTakerPlayer}
          freeKickTakerPlayer={freeKickTakerPlayer}
          // Filter and Sort Props
          showOnlyStarters={showOnlyStarters}
          onShowOnlyStartersChange={setShowOnlyStarters}
          nameFilter={nameFilter}
          onNameFilterChange={setNameFilter}
          positionFilters={positionFilters}
          onPositionFilterChange={handlePositionFilterChange}
          skillRange={skillRange}
          onSkillRangeChange={handleSkillRangeChange}
          ageRange={ageRange}
          onAgeRangeChange={handleAgeRangeChange}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          onResetFilters={handleResetFilters}
        />
      </div>

      {isAddPlayerModalOpen && (
        <AddPlayerModal
          isOpen={isAddPlayerModalOpen}
          onClose={() => setIsAddPlayerModalOpen(false)}
          onAddPlayer={(playerData) => {
            onAddPlayer(playerData);
            setIsAddPlayerModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PlayersManagementPage;