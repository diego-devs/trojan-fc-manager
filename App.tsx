
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Player, DraggedPlayerInfo, Formation, PlayerPosition, TacticalSetup, AppData, Match, Language, LeagueTableRow, TeamStatistic, PlayerStatistic } from './types';
import { 
  PITCH_SLOT_COUNT, 
  FORMATIONS, 
  DEFAULT_FORMATION, 
  PLAYER_POSITIONS_LIST,
} from './constants';
import Pitch from './components/tactician/Pitch';
import PlayerRoster from './components/tactician/PlayerRoster';
import LeftPanel from './components/tactician/LeftPanel'; 
import ConfigModal from './components/tactician/ConfigModal'; 
import FormationSelectorPanel from './components/tactician/FormationSelectorPanel';
import HelpModal from './components/common/HelpModal';
import PlayerDetailModal from './components/common/PlayerDetailModal';
import TopNavBar from './components/common/TopNavBar';
import PlayersManagementPage from './components/PlayersManagementPage';
import SeasonPage from './components/SeasonPage';
import NextMatchPage from './components/NextMatchPage';
import { useTranslation } from './hooks/useTranslation';
import { translations } from './i18n/translations'; 

const getSlotRole = (formationName: string, slotIndex: number): PlayerPosition | null => {
  if (slotIndex < 0 || slotIndex >= PITCH_SLOT_COUNT) return null;
  if (slotIndex === 0) return PlayerPosition.GK;
  switch (formationName) {
    case "2-3-1": 
      if (slotIndex >= 1 && slotIndex <= 2) return PlayerPosition.DEF;
      if (slotIndex >= 3 && slotIndex <= 5) return PlayerPosition.MID;
      if (slotIndex === 6) return PlayerPosition.FWD;
      break;
    case "3-1-2":
      if (slotIndex >= 1 && slotIndex <= 3) return PlayerPosition.DEF;
      if (slotIndex === 4) return PlayerPosition.MID;
      if (slotIndex >= 5 && slotIndex <= 6) return PlayerPosition.FWD;
      break;
    case "1-3-2":
      if (slotIndex === 1) return PlayerPosition.DEF;
      if (slotIndex >= 2 && slotIndex <= 4) return PlayerPosition.MID;
      if (slotIndex >= 5 && slotIndex <= 6) return PlayerPosition.FWD;
      break;
    case "2-1-3":
      if (slotIndex >= 1 && slotIndex <= 2) return PlayerPosition.DEF;
      if (slotIndex === 3) return PlayerPosition.MID;
      if (slotIndex >= 4 && slotIndex <= 6) return PlayerPosition.FWD;
      break;
    case "3-2-1":
      if (slotIndex >= 1 && slotIndex <= 3) return PlayerPosition.DEF;
      if (slotIndex >= 4 && slotIndex <= 5) return PlayerPosition.MID;
      if (slotIndex === 6) return PlayerPosition.FWD;
      break;
    default: return null;
  }
  return null; 
};

type AppView = 'tactician' | 'players' | 'season' | 'nextMatch';

export type NewPlayerData = Omit<Player, 'id' | 'photoUrl' | 'goals' | 'assists' | 'minutesPlayed' | 'gamesPlayed' | 'playablePositions'> & Partial<Pick<Player, 'goals' | 'assists' | 'minutesPlayed' | 'gamesPlayed' | 'playablePositions'>>;

const LOCAL_STORAGE_APP_DATA_KEY = 'trojan_fc_backup';
const APP_VERSION = "1.0.0";

const App = (): JSX.Element => {
  const { t, language, setLanguage } = useTranslation();
  
  const [allPlayers, setAllPlayers] = useState<Player[]>([]); 
  const [playersOnPitch, setPlayersOnPitch] = useState<(Player | null)[]>(Array(PITCH_SLOT_COUNT).fill(null));
  const [benchPlayers, setBenchPlayers] = useState<Player[]>([]);
  
  const [customFormationName, setCustomFormationName] = useState<string>(() => t('defaultFormationName'));
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [penaltyTakerId, setPenaltyTakerId] = useState<string | null>(null);
  const [cornerTakerId, setCornerTakerId] = useState<string | null>(null);
  const [freeKickTakerId, setFreeKickTakerId] = useState<string | null>(null);

  const [selectedFormation, setSelectedFormation] = useState<Formation>(DEFAULT_FORMATION);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isFormationPanelOpen, setIsFormationPanelOpen] = useState<boolean>(false);
  
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(false); 
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false); 

  const [isPlayerDetailModalOpen, setIsPlayerDetailModalOpen] = useState<boolean>(false);
  const [selectedPlayerForDetail, setSelectedPlayerForDetail] = useState<Player | null>(null);
  const [playerDetailModalInitialEditMode, setPlayerDetailModalInitialEditMode] = useState<boolean>(false);
  const [settingsCardScale, setSettingsCardScale] = useState<number>(0.7); 

  const [draggedPlayerInfo, setDraggedPlayerInfo] = useState<DraggedPlayerInfo | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('tactician');

  // State for season data
  const [allSeasonMatches, setAllSeasonMatches] = useState<Match[]>([]);
  const [leagueTableData, setLeagueTableData] = useState<LeagueTableRow[]>([]);
  const [teamStatsData, setTeamStatsData] = useState<TeamStatistic[]>([]);
  const [playerStatsData, setPlayerStatsData] = useState<PlayerStatistic[]>([]);

  const loadAllDataFileInputRef = useRef<HTMLInputElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [dynamicPitchCardScale, setDynamicPitchCardScale] = useState(0.5); 
  const mobilePitchContainerRef = useRef<HTMLDivElement>(null);
  const desktopPitchContainerRef = useRef<HTMLDivElement>(null);
  const BASE_SLOT_WIDTH_DESKTOP = 190; 
  const BASE_SLOT_HEIGHT_DESKTOP = 128;
  const BASE_SLOT_WIDTH_MOBILE = 150;
  const BASE_SLOT_HEIGHT_MOBILE = 112;
  const PITCH_COLS = 7; 
  const PITCH_ROWS_FOR_SCALE_CALC = 6;


  const applyLoadedData = useCallback((dataToLoad: AppData) => {
    console.log("Applying loaded data:", dataToLoad);
    setCustomFormationName(dataToLoad.tactician.customSetupName || t('defaultFormationName'));
    const formationToLoad = FORMATIONS.find(f => f.name === dataToLoad.tactician.selectedFormationName);
    setSelectedFormation(formationToLoad || DEFAULT_FORMATION);

    setAllPlayers(dataToLoad.roster || []); 

    const currentRosterForPitch = dataToLoad.roster || [];
    const newPlayersOnPitch = dataToLoad.tactician.playersOnPitchIds.map(id => {
      if (!id) return null;
      return currentRosterForPitch.find(p => p.id === id) || null;
    });
    setPlayersOnPitch(newPlayersOnPitch);

    const findRolePlayerInLoadedRoster = (id: string | null) => currentRosterForPitch.find(p => p.id === id) ? id : null;
    setCaptainId(findRolePlayerInLoadedRoster(dataToLoad.tactician.captainId));
    setPenaltyTakerId(findRolePlayerInLoadedRoster(dataToLoad.tactician.penaltyTakerId));
    setCornerTakerId(findRolePlayerInLoadedRoster(dataToLoad.tactician.cornerTakerId));
    setFreeKickTakerId(findRolePlayerInLoadedRoster(dataToLoad.tactician.freeKickTakerId));

    if (dataToLoad.season) {
        setAllSeasonMatches(dataToLoad.season.matches || []);
        setLeagueTableData(dataToLoad.season.leagueTable || []);
        setTeamStatsData(dataToLoad.season.teamStats || []);
        setPlayerStatsData(dataToLoad.season.playerStats || []);
    } else {
        // Fallback for older data structures that might not have a season object
        setAllSeasonMatches([]); 
        setLeagueTableData([]);
        setTeamStatsData([]);
        setPlayerStatsData([]);
         // Attempt to load matches from old localStorage key if season object is missing in backup
        try {
            const legacyStoredMatches = localStorage.getItem('soccerSeasonMatches');
            if (legacyStoredMatches) {
                setAllSeasonMatches(JSON.parse(legacyStoredMatches));
                console.warn("Loaded matches from legacy 'soccerSeasonMatches' localStorage key as it was missing in the backup file's season object.");
            }
        } catch (e) {
            console.error("Error reading legacy matches from localStorage", e);
        }
    }
    
    setLanguage(dataToLoad.settings.language || 'es');
    setSettingsCardScale(dataToLoad.settings.cardScale || 0.7);
  }, [t, setLanguage]);


  useEffect(() => {
    if (isInitialized) return;

    const ultimateFallback = () => {
        console.warn("Ultimate fallback: No valid data found. Starting with empty/default settings.");
        setAllPlayers([]);
        setSelectedFormation(DEFAULT_FORMATION);
        setCustomFormationName(t('defaultFormationName'));
        setAllSeasonMatches([]);
        setLeagueTableData([]);
        setTeamStatsData([]);
        setPlayerStatsData([]);
        setLanguage('es'); 
        setSettingsCardScale(0.7); 
        localStorage.removeItem(LOCAL_STORAGE_APP_DATA_KEY);
        // Do not clear 'soccerSeasonMatches' here, as applyLoadedData might use it if season is missing
        setIsInitialized(true);
    };
    
    const loadDefaultDataFromFile = async () => {
        try {
            console.log("Attempting to load default data from local JSON file: /localData/trojan_fc_backup.json");
            const response = await fetch('/localData/trojan_fc_backup.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch local backup: ${response.status} ${response.statusText}`);
            }
            const defaultAppData = await response.json() as AppData;
            
            if (defaultAppData && defaultAppData.tactician && defaultAppData.roster && defaultAppData.settings && defaultAppData.version) {
                console.log("Successfully loaded default data from local JSON file, applying...");
                applyLoadedData(defaultAppData);
                localStorage.setItem(LOCAL_STORAGE_APP_DATA_KEY, JSON.stringify(defaultAppData));
                setIsInitialized(true);
            } else {
                throw new Error("Invalid data structure in local JSON file.");
            }
        } catch (fileError) {
            console.error("Error loading default data from local JSON file:", fileError);
            ultimateFallback();
        }
    };

    console.log("Attempting to load data from localStorage...");
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_APP_DATA_KEY);
        if (storedData) {
            const loadedAppData = JSON.parse(storedData) as AppData;
            if (loadedAppData && loadedAppData.tactician && loadedAppData.roster && loadedAppData.settings && loadedAppData.version) {
                 if (loadedAppData.version !== APP_VERSION) {
                    console.warn(`LocalStorage data version ${loadedAppData.version} mismatches app version ${APP_VERSION}. Attempting to load anyway.`);
                 }
                console.log("Found valid data in localStorage, applying...");
                applyLoadedData(loadedAppData);
                setIsInitialized(true); 
            } else {
                console.warn("Invalid data structure in localStorage. Clearing it and attempting to load from local JSON file.");
                localStorage.removeItem(LOCAL_STORAGE_APP_DATA_KEY);
                loadDefaultDataFromFile(); 
            }
        } else {
            console.log("No data found in localStorage. Attempting to load from local JSON file.");
            loadDefaultDataFromFile(); 
        }
    } catch (localStorageError) {
        console.error("Error processing data from localStorage:", localStorageError, "Clearing it and attempting to load from local JSON file.");
        localStorage.removeItem(LOCAL_STORAGE_APP_DATA_KEY);
        loadDefaultDataFromFile();
    }
  }, [isInitialized, applyLoadedData, t, setLanguage]);


  useEffect(() => {
    const handleResize = () => {
      const pitchContainer = window.innerWidth < 768 ? mobilePitchContainerRef.current : desktopPitchContainerRef.current;
      if (pitchContainer) {
        const containerWidth = pitchContainer.offsetWidth;
        const containerHeight = pitchContainer.offsetHeight;
        
        const baseSlotW = window.innerWidth < 768 ? BASE_SLOT_WIDTH_MOBILE : BASE_SLOT_WIDTH_DESKTOP;
        const baseSlotH = window.innerWidth < 768 ? BASE_SLOT_HEIGHT_MOBILE : BASE_SLOT_HEIGHT_DESKTOP;

        const availableWidthPerSlot = containerWidth / PITCH_COLS;
        const availableHeightPerSlot = containerHeight / PITCH_ROWS_FOR_SCALE_CALC;
        
        const scaleX = baseSlotW > 0 ? availableWidthPerSlot / baseSlotW : 1;
        const scaleY = baseSlotH > 0 ? availableHeightPerSlot / baseSlotH : 1;
        let newScale = Math.min(scaleX, scaleY);

        newScale = Math.max(0.35, Math.min(newScale, 0.7)); 
        setDynamicPitchCardScale(newScale);
      }
    };

    handleResize(); 
    const observer = new ResizeObserver(handleResize);
    const mobileContainer = mobilePitchContainerRef.current;
    const desktopContainer = desktopPitchContainerRef.current;

    if (mobileContainer) observer.observe(mobileContainer);
    if (desktopContainer) observer.observe(desktopContainer);
    
    window.addEventListener('resize', handleResize); 

    return () => {
      if (mobileContainer) observer.unobserve(mobileContainer);
      if (desktopContainer) observer.unobserve(desktopContainer);
      window.removeEventListener('resize', handleResize);
    };
  }, [allPlayers]); 

  useEffect(() => {
    if (window.innerWidth < 768) { 
      setIsLeftPanelOpen(false);
    }
  }, []);


  useEffect(() => {
    const defaultNameEN = translations.defaultFormationName.en;
    const defaultNameES = translations.defaultFormationName.es;
    if (customFormationName === defaultNameEN || customFormationName === defaultNameES) {
        setCustomFormationName(t('defaultFormationName'));
    }
  }, [language, t, customFormationName]);

  useEffect(() => {
    const onPitchIds = playersOnPitch.filter(p => p).map(p => p!.id);
    setBenchPlayers(allPlayers.filter(p => !onPitchIds.includes(p.id)));
  }, [allPlayers, playersOnPitch]);

  useEffect(() => {
    if (isPlayerDetailModalOpen) {
      setIsPlayerDetailModalOpen(false);
    }
  }, [currentView]);


  const handleAddPlayer = useCallback((playerData: NewPlayerData) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      photoUrl: `https://avatar.iran.liara.run/public/boy?username=${playerData.name.replace(/\s+/g, '')}`,
      goals: playerData.goals || 0, 
      assists: playerData.assists || 0, 
      minutesPlayed: playerData.minutesPlayed || 0, 
      gamesPlayed: playerData.gamesPlayed || 0, 
      playablePositions: playerData.playablePositions || [playerData.position],
      ...playerData,
    };
    setAllPlayers(prev => [...prev, newPlayer]);
  }, []);

  const handleRemovePlayer = useCallback((playerId: string) => {
    setAllPlayers(prev => prev.filter(p => p.id !== playerId));
    setPlayersOnPitch(prev => prev.map(p => p?.id === playerId ? null : p)); 
    if (captainId === playerId) setCaptainId(null);
    if (penaltyTakerId === playerId) setPenaltyTakerId(null);
    if (cornerTakerId === playerId) setCornerTakerId(null);
    if (freeKickTakerId === playerId) setFreeKickTakerId(null);
  }, [captainId, penaltyTakerId, cornerTakerId, freeKickTakerId]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, draggedInfo: DraggedPlayerInfo) => {
    setDraggedPlayerInfo(draggedInfo);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedInfo.player.id); 
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnPitchSlot = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    e.preventDefault(); if (!draggedPlayerInfo) return;
    const { player: draggedPlayer, source, sourceIndex } = draggedPlayerInfo;
    let newPlayersOnPitch = [...playersOnPitch];
    const existingPlayerInSlot = newPlayersOnPitch[slotIndex];

    if (source === 'bench') {
      newPlayersOnPitch[slotIndex] = draggedPlayer;
    } else if (source === 'pitch' && sourceIndex !== undefined) {
      if (existingPlayerInSlot && existingPlayerInSlot.id !== draggedPlayer.id) { 
        newPlayersOnPitch[sourceIndex] = existingPlayerInSlot;
      } else if (existingPlayerInSlot?.id !== draggedPlayer.id) {
         newPlayersOnPitch[sourceIndex] = null;
      }
      newPlayersOnPitch[slotIndex] = draggedPlayer;
    }
    setPlayersOnPitch(newPlayersOnPitch); setDraggedPlayerInfo(null);
  };

  const handleDropOnBench = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedPlayerInfo || draggedPlayerInfo.source === 'bench') {
      setDraggedPlayerInfo(null); return;
    }
    const { sourceIndex } = draggedPlayerInfo;
    let newPlayersOnPitch = [...playersOnPitch];
    if (sourceIndex !== undefined) newPlayersOnPitch[sourceIndex] = null;
    setPlayersOnPitch(newPlayersOnPitch); setDraggedPlayerInfo(null);
  };
  
  const handleResetPitch = () => {
    setPlayersOnPitch(Array(PITCH_SLOT_COUNT).fill(null));
    setCaptainId(null); setPenaltyTakerId(null); setCornerTakerId(null); setFreeKickTakerId(null);
  };

  const handleCaptainChange = (id: string | null) => setCaptainId(id);
  const handlePenaltyTakerChange = (id: string | null) => setPenaltyTakerId(id);
  const handleCornerTakerChange = (id: string | null) => setCornerTakerId(id);
  const handleFreeKickTakerChange = (id: string | null) => setFreeKickTakerId(id);
  
  const handleFormationSelect = (f: Formation) => setSelectedFormation(f);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'es' : 'en');
  const toggleHelpModal = () => setShowHelpModal(!showHelpModal);
  const toggleFormationPanel = () => setIsFormationPanelOpen(!isFormationPanelOpen);
  
  const toggleLeftPanel = () => setIsLeftPanelOpen(!isLeftPanelOpen); 
  const toggleConfigModal = () => setShowConfigModal(!showConfigModal); 

  const handleSettingsCardScaleChange = (newScale: number) => {
    const clampedScale = Math.max(0.3, Math.min(newScale, 0.7)); 
    setSettingsCardScale(clampedScale);
  };

  const handleAutoPlacePlayerOnPitch = (playerToPlace: Player) => {
    if (playersOnPitch.some(p => p?.id === playerToPlace.id)) return;
    let placed = false; const newPlayersOnPitch = [...playersOnPitch];
    for (let i = 0; i < PITCH_SLOT_COUNT; i++) {
      if (newPlayersOnPitch[i] === null) {
        const slotRole = getSlotRole(selectedFormation.name, i);
        if (slotRole === playerToPlace.position || playerToPlace.playablePositions.includes(slotRole!)) {
          newPlayersOnPitch[i] = playerToPlace; placed = true; break; 
        }
      }
    }
    if (placed) setPlayersOnPitch(newPlayersOnPitch); else alert(t('noSuitableSlotError'));
  };

  const handleOpenPlayerDetailModal = useCallback((player: Player, startInEdit: boolean = false) => {
    setSelectedPlayerForDetail(player);
    setPlayerDetailModalInitialEditMode(startInEdit);
    setIsPlayerDetailModalOpen(true);
  }, []); 

  const handleClosePlayerDetailModal = () => setIsPlayerDetailModalOpen(false);

  const handleSavePlayerDetail = useCallback((updatedPlayer: Player) => {
    setAllPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    setPlayersOnPitch(prev => prev.map(p => p?.id === updatedPlayer.id ? updatedPlayer : p));
    if (selectedPlayerForDetail && selectedPlayerForDetail.id === updatedPlayer.id) {
      setSelectedPlayerForDetail(updatedPlayer); 
    }
    setIsPlayerDetailModalOpen(false);
  }, [selectedPlayerForDetail]); 

  const handleSavePlayersToFile = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(allPlayers, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "team_roster.json";
    link.click();
  }, [allPlayers]);

  const handleLoadPlayersFromFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result;
        if (typeof json === 'string') {
          const loadedPlayers: Player[] = JSON.parse(json);
          if (Array.isArray(loadedPlayers) && (loadedPlayers.length === 0 || (loadedPlayers[0] && loadedPlayers[0].id && loadedPlayers[0].name))) {
            setAllPlayers(loadedPlayers);
            handleResetPitch(); 
          } else {
            throw new Error(t('invalidDataStructureError'));
          }
        }
      } catch (error) {
        console.error("Error loading or parsing player file:", error);
        alert(t('loadRosterError'));
      }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert(t('loadRosterError'));
    };
    reader.readAsText(file);
  }, [t]); 

  const handleLoadTacticalSetup = (loadedSetup: TacticalSetup) => {
    try {
        setCustomFormationName(loadedSetup.customSetupName || t('defaultFormationName'));
        
        const formationToLoad = FORMATIONS.find(f => f.name === loadedSetup.formationName);
        if (formationToLoad) {
            setSelectedFormation(formationToLoad);
        } else {
            console.warn(`Formation ${loadedSetup.formationName} not found. Using default.`);
            setSelectedFormation(DEFAULT_FORMATION);
        }

        const newPlayersOnPitch: (Player | null)[] = loadedSetup.playersOnPitchIds.map(playerId => {
            if (!playerId) return null;
            return allPlayers.find(p => p.id === playerId) || null;
        });
        setPlayersOnPitch(newPlayersOnPitch);

        const findRolePlayer = (id: string | null) => allPlayers.find(p => p.id === id) ? id : null;

        setCaptainId(findRolePlayer(loadedSetup.captainId));
        setPenaltyTakerId(findRolePlayer(loadedSetup.penaltyTakerId));
        setCornerTakerId(findRolePlayer(loadedSetup.cornerTakerId));
        setFreeKickTakerId(findRolePlayer(loadedSetup.freeKickTakerId));
        
        alert(t('tacticalSetupLoadedSuccess', { name: loadedSetup.customSetupName || 'Setup' }));
        setShowConfigModal(false); 
    } catch (error) {
        console.error("Error applying loaded tactical setup:", error);
        alert(t('tacticalSetupLoadError'));
    }
  };
  
  const getCurrentAppData = useCallback((): AppData => {
    return {
      tactician: {
        customSetupName: customFormationName,
        selectedFormationName: selectedFormation.name,
        playersOnPitchIds: playersOnPitch.map(p => p ? p.id : null),
        captainId: captainId,
        penaltyTakerId: penaltyTakerId,
        cornerTakerId: cornerTakerId,
        freeKickTakerId: freeKickTakerId,
      },
      roster: allPlayers,
      season: {
        matches: allSeasonMatches, // Use centralized matches state
        leagueTable: leagueTableData, 
        teamStats: teamStatsData,    
        playerStats: playerStatsData, 
      },
      settings: {
        language: language,
        cardScale: settingsCardScale, 
      },
      version: APP_VERSION,
    };
  }, [
    customFormationName, selectedFormation.name, playersOnPitch, captainId, penaltyTakerId, cornerTakerId, freeKickTakerId,
    allPlayers, allSeasonMatches, leagueTableData, teamStatsData, playerStatsData, language, settingsCardScale
  ]);


  const handleSaveAllData = useCallback(() => {
    const appData = getCurrentAppData();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(appData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "trojan_fc_backup.json";
    link.click();
  }, [getCurrentAppData]);

  const handleQuickSaveData = useCallback(() => {
    const appData = getCurrentAppData();
    try {
        localStorage.setItem(LOCAL_STORAGE_APP_DATA_KEY, JSON.stringify(appData));
        // Clear old individual keys if they exist, to avoid confusion
        localStorage.removeItem('soccerSeasonMatches'); 
        localStorage.removeItem('nextMatchNotes'); // If this was ever used
        alert(t('quickSaveSuccess'));
    } catch (error) {
        console.error("Error quick saving data to localStorage:", error);
        alert(t('quickSaveError'));
    }
  }, [getCurrentAppData, t]);


  const handleRequestLoadAllData = () => {
    loadAllDataFileInputRef.current?.click();
  };

  const handleLoadAllDataFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result;
        if (typeof jsonString !== 'string') {
          throw new Error(t('loadAllDataError'));
        }
        const loadedAppData = JSON.parse(jsonString) as AppData;

        if (!loadedAppData.tactician || !loadedAppData.roster || !loadedAppData.settings || !loadedAppData.version) { 
          throw new Error(t('invalidDataStructureError'));
        }
        if (loadedAppData.version !== APP_VERSION) {
             console.warn(`Attempting to load data file with version ${loadedAppData.version}, current app version ${APP_VERSION}. Mismatches may occur.`);
        }
        
        applyLoadedData(loadedAppData); 

        localStorage.setItem(LOCAL_STORAGE_APP_DATA_KEY, JSON.stringify(loadedAppData));
        // Clear old individual keys after successful full load
        localStorage.removeItem('soccerSeasonMatches');
        localStorage.removeItem('nextMatchNotes');
        
        alert(t('loadAllDataSuccess'));

      } catch (error) {
        console.error("Error loading or parsing data file:", error);
        alert(t('loadAllDataError'));
      } finally {
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    reader.onerror = (readError) => {
      console.error("Error reading file:", readError);
      alert(t('loadAllDataError'));
      if (event.target) {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };
  
  // Handlers for SeasonPage and NextMatchPage to update allSeasonMatches in App.tsx
  const handleSaveMatchInApp = useCallback((matchToSave: Match) => {
    setAllSeasonMatches(prevMatches => {
      const existingMatchIndex = prevMatches.findIndex(m => m.id === matchToSave.id);
      let updatedMatches;
      if (existingMatchIndex > -1) {
        updatedMatches = prevMatches.map(m => m.id === matchToSave.id ? matchToSave : m);
      } else {
        updatedMatches = [...prevMatches, matchToSave];
      }
      return updatedMatches.sort((a,b) => new Date(a.date+'T'+a.time).getTime() - new Date(b.date+'T'+b.time).getTime());
    });
  }, []);

  const handleDeleteMatchInApp = useCallback((matchIdToDelete: string) => {
    setAllSeasonMatches(prevMatches => prevMatches.filter(m => m.id !== matchIdToDelete));
  }, []);

  const handleUpdateMatchNotesInApp = useCallback((matchId: string, notes: string) => {
    setAllSeasonMatches(prevMatches => 
      prevMatches.map(m => 
        m.id === matchId ? { ...m, matchNotes: notes } : m
      )
    );
  }, []);

  const nextMatchForPage = useMemo(() => {
    if (allSeasonMatches.length === 0) return null;
    const now = new Date();
    const upcoming = allSeasonMatches
      .filter(match => new Date(match.date + 'T' + (match.time || '00:00')) >= now)
      .sort((a,b) => new Date(a.date+'T'+(a.time||'00:00')).getTime() - new Date(b.date+'T'+(b.time||'00:00')).getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [allSeasonMatches]);


  const captainPlayer = allPlayers.find(p => p.id === captainId) || null;
  const penaltyTakerPlayer = allPlayers.find(p => p.id === penaltyTakerId) || null;
  const cornerTakerPlayer = allPlayers.find(p => p.id === cornerTakerId) || null;
  const freeKickTakerPlayer = allPlayers.find(p => p.id === freeKickTakerId) || null;
  const playersOnPitchIdsForManagementPage = playersOnPitch.map(p => p ? p.id : null);


  const mainGridColClassesMd = `md:grid-cols-[${isLeftPanelOpen ? '280px' : '0px'}_1fr_280px]`;
  const mainGridColClassesLg = `lg:grid-cols-[${isLeftPanelOpen ? '320px' : '0px'}_1fr_320px]`;
  const mainGridColClassesXl = `xl:grid-cols-[${isLeftPanelOpen ? '350px' : '0px'}_1fr_350px]`;


  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white text-xl">
        Loading Trojan FC Admin...
      </div>
    );
  }

  const renderTacticianView = () => (
    <>
      <header className="mb-2 md:mb-4 text-center relative">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-sky-400">
          {t('appTitle').split(' ')[0]} {t('appTitle').split(' ')[1]}{' '}
          <span className="text-yellow-400">{t('appTitle').split(' ').slice(2).join(' ')}</span>
        </h1>
        <div className="absolute top-0 right-0 flex space-x-1 sm:space-x-2 items-center">
            <button
              onClick={toggleLeftPanel}
              className="mt-1 mr-1 p-1 sm:p-2 md:p-2.5 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-base sm:text-sm md:text-lg transition-colors hidden md:block"
              aria-label={t('toggleLeftPanelLabel')}
              title={t('toggleLeftPanelLabel')}
            >
              📊 
            </button>
            <button
              onClick={toggleConfigModal}
              className="mt-1 mr-1 p-1 sm:p-2 md:p-2.5 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-base sm:text-sm md:text-lg transition-colors md:block" 
              aria-label={t('openConfigSettingsLabel')}
              title={t('openConfigSettingsLabel')}
            >
              ⚙️ 
            </button>
            <button
                onClick={toggleHelpModal}
                className="mt-1 mr-1 p-1 sm:p-2 md:p-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-base sm:text-sm md:text-lg transition-colors"
                aria-label={t('toggleHelpModalLabel')}
            > ? </button>
            <button
                onClick={toggleLanguage}
                className="mt-1 mr-1 py-1 px-2 sm:py-1 sm:px-3 md:py-2 md:px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-xs sm:text-sm md:text-sm transition-colors"
                aria-label={language === 'es' ? t('switchToEnglishLabel') : t('switchToSpanishLabel')}
            > {language === 'es' ? t('languageToggleEN') : t('languageToggleES')} </button>
        </div>
      </header>

      <main className={`flex-grow overflow-hidden
                       grid grid-cols-1 gap-2 md:gap-4 
                       sm:flex sm:flex-row sm:gap-2 
                       md:grid ${mainGridColClassesMd}
                       lg:grid ${mainGridColClassesLg}
                       xl:grid ${mainGridColClassesXl}
      `}>
        <div className={`transition-all duration-300 ease-in-out overflow-y-auto h-full sm:flex sm:flex-col sm:flex-grow sm:order-1 md:order-1 ${isLeftPanelOpen ? 'md:w-auto' : 'md:w-0'}`}>
           <button 
            onClick={toggleLeftPanel}
            className="sm:flex md:hidden items-center justify-center w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-sky-400 font-semibold rounded-lg text-sm transition-colors mb-2"
            aria-expanded={isLeftPanelOpen} aria-controls="left-panel-content"
            >
            {isLeftPanelOpen ? t('hideLeftPanelButton') : t('showLeftPanelButton')}
            <svg className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isLeftPanelOpen ? 'rotate-180' : 'rotate-0'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <div id="left-panel-content" className={`transition-opacity duration-300 ${isLeftPanelOpen ? 'opacity-100 sm:block' : 'opacity-0 sm:hidden'} md:opacity-100 md:block h-full`}> 
             {(isLeftPanelOpen || window.innerWidth < 768) && ( 
              <LeftPanel 
                captain={captainPlayer} onCaptainChange={handleCaptainChange}
                penaltyTaker={penaltyTakerPlayer} onPenaltyTakerChange={handlePenaltyTakerChange}
                cornerTaker={cornerTakerPlayer} onCornerTakerChange={handleCornerTakerChange}
                freeKickTaker={freeKickTakerPlayer} onFreeKickTakerChange={handleFreeKickTakerChange}
                playersOnPitch={playersOnPitch}
                onOpenDetailModal={handleOpenPlayerDetailModal}
              />
             )}
          </div>
          
          <div ref={mobilePitchContainerRef} className="sm:flex sm:items-center sm:justify-center sm:overflow-hidden sm:min-h-[350px] sm:flex-grow md:hidden">
            <Pitch
              playersOnPitch={playersOnPitch} captainId={captainId}
              penaltyTakerId={penaltyTakerId} cornerTakerId={cornerTakerId} freeKickTakerId={freeKickTakerId}
              onDropOnSlot={handleDropOnPitchSlot} onDragOverPitch={handleDragOver} onDragStartCard={handleDragStart}
              currentFormationLayout={selectedFormation.layout} onOpenDetailModal={(player) => handleOpenPlayerDetailModal(player, false)}
              cardScale={dynamicPitchCardScale}
            />
          </div>

          <div className="sm:block md:hidden mt-2 md:mt-0">
            <FormationSelectorPanel formations={FORMATIONS} selectedFormationName={selectedFormation.name} onFormationSelect={handleFormationSelect} />
          </div>
        </div>
        
        <div ref={desktopPitchContainerRef} className="flex items-center justify-center overflow-hidden min-h-[300px] sm:hidden md:flex md:items-center md:justify-center md:overflow-hidden md:min-h-0 md:order-2">
          <Pitch
            playersOnPitch={playersOnPitch} captainId={captainId}
            penaltyTakerId={penaltyTakerId} cornerTakerId={cornerTakerId} freeKickTakerId={freeKickTakerId}
            onDropOnSlot={handleDropOnPitchSlot} onDragOverPitch={handleDragOver} onDragStartCard={handleDragStart}
            currentFormationLayout={selectedFormation.layout} onOpenDetailModal={(player) => handleOpenPlayerDetailModal(player, false)}
            cardScale={dynamicPitchCardScale}
          />
        </div>
        
        <div className="overflow-y-auto h-full sm:w-[180px] sm:flex-shrink-0 sm:order-2 md:order-3 md:w-auto">
          <PlayerRoster
            benchPlayers={benchPlayers}
            onDragStartCard={handleDragStart}
            onDropOnBench={handleDropOnBench}
            onDragOverBench={handleDragOver}
            onAddToFormation={handleAutoPlacePlayerOnPitch}
            onOpenDetailModal={(player) => handleOpenPlayerDetailModal(player, false)}
            cardScale={settingsCardScale}
          />
        </div>
      </main>

      <footer className="mt-2 md:mt-4 hidden sm:hidden md:block">
        <div className="mb-2 text-center hidden md:flex lg:hidden items-center justify-center">
            <button onClick={toggleFormationPanel}
                className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-sky-400 font-semibold rounded-lg text-sm transition-colors flex items-center"
                aria-expanded={isFormationPanelOpen} aria-controls="formation-panel-content-footer"
            > {isFormationPanelOpen ? t('hideFormationsButton') : t('showFormationsButton')}
            <svg className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isFormationPanelOpen ? 'rotate-180' : 'rotate-0'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
        </div>
        <div id="formation-panel-content-footer" className={`hidden ${isFormationPanelOpen ? 'md:block' : 'md:hidden'} lg:block`}>
            <FormationSelectorPanel formations={FORMATIONS} selectedFormationName={selectedFormation.name} onFormationSelect={handleFormationSelect} />
        </div>
      </footer>
      
      {showHelpModal && <HelpModal onClose={toggleHelpModal} />}
      {showConfigModal && (
        <ConfigModal
          isOpen={showConfigModal}
          onClose={toggleConfigModal}
          onResetPitch={handleResetPitch}
          customFormationName={customFormationName}
          onCustomFormationNameChange={setCustomFormationName}
          cardScale={settingsCardScale} 
          onCardScaleChange={handleSettingsCardScaleChange}
          selectedFormation={selectedFormation}
          playersOnPitch={playersOnPitch}
          captainId={captainId}
          penaltyTakerId={penaltyTakerId}
          cornerTakerId={cornerTakerId}
          freeKickTakerId={freeKickTakerId}
          onLoadTacticalSetup={handleLoadTacticalSetup}
        />
      )}
      {isPlayerDetailModalOpen && selectedPlayerForDetail && (
        <PlayerDetailModal 
          key={selectedPlayerForDetail.id} 
          player={selectedPlayerForDetail} 
          onClose={handleClosePlayerDetailModal} 
          onSave={handleSavePlayerDetail} 
          startInEditMode={playerDetailModalInitialEditMode}
        />
      )}
    </>
  );


  return (
    <div className="flex flex-col h-screen text-white p-2 md:p-4 overflow-hidden">
      <TopNavBar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onSaveAllData={handleSaveAllData} 
        onRequestLoadAllData={handleRequestLoadAllData}
        onQuickSaveData={handleQuickSaveData}
      />
      
      <input 
        type="file" 
        ref={loadAllDataFileInputRef} 
        onChange={handleLoadAllDataFromFile} 
        accept=".json" 
        className="hidden"
        aria-hidden="true"
      />

      {currentView === 'tactician' && renderTacticianView()}
      {currentView === 'players' && 
        <PlayersManagementPage 
          allPlayers={allPlayers}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onSavePlayerDetail={handleSavePlayerDetail}
          onOpenDetailModal={handleOpenPlayerDetailModal}
          onSavePlayersToFile={handleSavePlayersToFile}
          onLoadPlayersFromFile={handleLoadPlayersFromFile}
          onNavigateBack={() => setCurrentView('tactician')}
          captainId={captainId}
          penaltyTakerId={penaltyTakerId}
          cornerTakerId={cornerTakerId}
          freeKickTakerId={freeKickTakerId}
          onCaptainChange={handleCaptainChange}
          onPenaltyTakerChange={handlePenaltyTakerChange}
          onCornerTakerChange={handleCornerTakerChange}
          onFreeKickTakerChange={handleFreeKickTakerChange}
          captainPlayer={captainPlayer}
          penaltyTakerPlayer={penaltyTakerPlayer}
          cornerTakerPlayer={cornerTakerPlayer}
          freeKickTakerPlayer={freeKickTakerPlayer}
          playersOnPitchIds={playersOnPitchIdsForManagementPage}
          settingsCardScale={settingsCardScale}
        />}
      {currentView === 'season' && 
        <SeasonPage 
          matches={allSeasonMatches}
          onSaveMatch={handleSaveMatchInApp}
          onDeleteMatch={handleDeleteMatchInApp}
          leagueTableData={leagueTableData}
          teamStatsData={teamStatsData}
          playerStatsData={playerStatsData}
          onNavigateBack={() => setCurrentView('tactician')}
        />}
      {currentView === 'nextMatch' && 
        <NextMatchPage
          nextMatch={nextMatchForPage}
          onUpdateMatchNotes={handleUpdateMatchNotesInApp}
          playersOnPitch={playersOnPitch}
          selectedFormation={selectedFormation}
          customFormationName={customFormationName}
          captainPlayer={captainPlayer}
          penaltyTakerPlayer={penaltyTakerPlayer}
          cornerTakerPlayer={cornerTakerPlayer}
          freeKickTakerPlayer={freeKickTakerPlayer}
          onOpenDetailModal={handleOpenPlayerDetailModal}
          cardScale={settingsCardScale * 0.9} 
          getSlotRole={getSlotRole}
          onNavigateBack={() => setCurrentView('tactician')}
        />}
    </div>
  );
};

export default App;