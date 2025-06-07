import React from 'react';
import { Formation } from '../../types';
import FormationCard from './FormationCard';
import { useTranslation } from '../../hooks/useTranslation';

interface FormationSelectorPanelProps {
  formations: Formation[];
  selectedFormationName: string;
  onFormationSelect: (formation: Formation) => void;
}

const FormationSelectorPanel: React.FC<FormationSelectorPanelProps> = ({ formations, selectedFormationName, onFormationSelect }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-800/50 backdrop-blur-md p-3 md:p-4 shadow-inner rounded-t-lg">
      <h3 className="text-lg font-semibold text-sky-400 mb-3 text-center md:text-left">{t('formationSelectorTitle')}</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 px-1">
        {formations.map(formation => (
          <FormationCard
            key={formation.name}
            formation={formation}
            isSelected={formation.name === selectedFormationName}
            onSelect={() => onFormationSelect(formation)}
          />
        ))}
      </div>
    </div>
  );
};

export default FormationSelectorPanel;