import React from 'react';
import { Formation } from '../../types';
import FormationDisplay from './FormationDisplay';
import { useTranslation } from '../../hooks/useTranslation';

interface FormationCardProps {
  formation: Formation;
  isSelected: boolean;
  onSelect: () => void;
}

const FormationCard: React.FC<FormationCardProps> = ({ formation, isSelected, onSelect }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onSelect}
      className={`p-3 rounded-lg shadow-md text-center transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50
                  ${isSelected 
                    ? 'bg-sky-600 ring-2 ring-yellow-400 shadow-yellow-500/30' 
                    : 'bg-slate-700 hover:bg-slate-600 focus:ring-sky-500'
                  } w-36 h-auto flex flex-col items-center justify-between`}
      aria-label={t('formationCardLabel', { name: formation.name })}
      aria-pressed={isSelected}
    >
      <FormationDisplay formationVisual={formation.visual} isSelected={isSelected} />
      <span className={`mt-2 text-sm font-semibold ${isSelected ? 'text-yellow-300' : 'text-slate-200'}`}>
        {t(formation.displayNameKey)}
      </span>
      <span className={`text-xs ${isSelected ? 'text-yellow-400' : 'text-slate-400'}`}>
        ({formation.name})
      </span>
    </button>
  );
};

export default FormationCard;