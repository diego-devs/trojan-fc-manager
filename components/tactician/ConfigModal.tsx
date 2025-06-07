import React, { useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { TacticalSetup, Formation, Player } from '../../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetPitch: () => void;
  customFormationName: string;
  onCustomFormationNameChange: (name: string) => void;
  cardScale: number;
  onCardScaleChange: (scale: number) => void;
  // Props for Save/Load Tactical Setup
  selectedFormation: Formation;
  playersOnPitch: (Player | null)[];
  captainId: string | null;
  penaltyTakerId: string | null;
  cornerTakerId: string | null;
  freeKickTakerId: string | null;
  onLoadTacticalSetup: (setup: TacticalSetup) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  onResetPitch,
  customFormationName,
  onCustomFormationNameChange,
  cardScale,
  onCardScaleChange,
  selectedFormation,
  playersOnPitch,
  captainId,
  penaltyTakerId,
  cornerTakerId,
  freeKickTakerId,
  onLoadTacticalSetup,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const handleResetPitchClick = () => {
    if (window.confirm(t('resetPitchConfirmation'))) {
      onResetPitch();
      // onClose(); // Optionally close modal
    }
  };

  const handleSaveTacticalSetup = () => {
    const playersOnPitchIds = playersOnPitch.map(p => p ? p.id : null);
    const setupToSave: TacticalSetup = {
      customSetupName: customFormationName,
      formationName: selectedFormation.name,
      playersOnPitchIds,
      captainId,
      penaltyTakerId,
      cornerTakerId,
      freeKickTakerId,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(setupToSave, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    const fileName = customFormationName.trim().replace(/\s+/g, '_') || 'tactical_setup';
    link.download = `${fileName}.json`;
    link.click();
    // onClose(); // Optionally close modal
  };

  const handleLoadFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result;
          if (typeof json === 'string') {
            const loadedSetup = JSON.parse(json) as TacticalSetup;
            // Basic validation
            if (loadedSetup && loadedSetup.formationName && Array.isArray(loadedSetup.playersOnPitchIds)) {
              onLoadTacticalSetup(loadedSetup);
            } else {
              throw new Error("Invalid tactical setup file structure.");
            }
          }
        } catch (error) {
          console.error("Error loading or parsing tactical setup file:", error);
          alert(t('tacticalSetupLoadError'));
        }
      };
      reader.onerror = (errorReading) => {
        console.error("Error reading file:", errorReading);
        alert(t('tacticalSetupLoadError'));
      };
      reader.readAsText(file);
    }
    // Reset file input value to allow loading the same file again if needed
    if (event.target) {
      event.target.value = '';
    }
  };


  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 modal-backdrop-blur flex items-center justify-center z-[70] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="configModalTitle"
    >
      <div
        className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent close on inner click
      >
        <div className="flex justify-between items-center mb-6">
          <h3 id="configModalTitle" className="text-2xl font-bold text-sky-400">{t('configModalTitle')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors text-3xl leading-none"
            aria-label={t('closeButton')}
          >
            &times;
          </button>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div>
            <label htmlFor="customFormationName" className="block text-sm font-medium text-sky-400">{t('customFormationNameLabel')}</label>
            <input
              type="text"
              id="customFormationName"
              value={customFormationName}
              onChange={(e) => onCustomFormationNameChange(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
              placeholder={t('customFormationNamePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="cardScale" className="block text-sm font-medium text-sky-400">
              {t('cardSizeLabel')} ({Math.round(cardScale * 100)}%)
            </label>
            <input
              type="range"
              id="cardScale"
              min="0.4" 
              max="0.7" 
              step="0.05"
              value={cardScale}
              onChange={(e) => onCardScaleChange(parseFloat(e.target.value))}
              className="mt-1 block w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          <hr className="border-slate-600" />

          {/* Tactical Setups Section */}
          <div>
            <h4 className="text-lg font-semibold text-sky-400 mb-3">{t('tacticalSetupsTitle')}</h4>
            <div className="space-y-3">
              <button
                onClick={handleSaveTacticalSetup}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md"
              >
                {t('saveTacticalSetupButton')}
              </button>
              <button
                onClick={handleLoadFileClick}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md"
              >
                {t('loadTacticalSetupButton')}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
              />
            </div>
          </div>
          
          <hr className="border-slate-600" />

          {/* Pitch Actions */}
          <div>
            <button
              onClick={handleResetPitchClick}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-md"
            >
              {t('resetPitchButton')}
            </button>
          </div>

        </div>

        <div className="mt-8 text-right">
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

export default ConfigModal;