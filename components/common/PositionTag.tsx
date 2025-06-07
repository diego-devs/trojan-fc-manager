import React from 'react';
import { PlayerPosition } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface PositionTagProps {
  position: PlayerPosition;
  size?: 'xs' | 'sm'; // Optional size prop
}

const PositionTag: React.FC<PositionTagProps> = ({ position, size = 'xs' }) => {
  const { t } = useTranslation();

  const getPositionAbbreviationKey = (pos: PlayerPosition): string => {
    switch (pos) {
      case PlayerPosition.GK: return 'posAbbrGK';
      case PlayerPosition.DEF: return 'posAbbrDEF';
      case PlayerPosition.MID: return 'posAbbrMID';
      case PlayerPosition.FWD: return 'posAbbrFWD';
      default: return pos; // Fallback
    }
  };

  const getPositionStyles = (pos: PlayerPosition): string => {
    switch (pos) {
      case PlayerPosition.GK:
        return 'bg-yellow-400 text-black';
      case PlayerPosition.DEF:
        return 'bg-green-600 text-white';
      case PlayerPosition.MID:
        return 'bg-blue-600 text-white';
      case PlayerPosition.FWD:
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const textSizeClass = size === 'sm' ? 'text-sm' : 'text-xs';
  const paddingClass = size === 'sm' ? 'px-2.5 py-1' : 'px-2 py-0.5';


  return (
    <span 
      className={`inline-block ${paddingClass} ${textSizeClass} font-semibold rounded-md leading-tight ${getPositionStyles(position)}`}
      aria-label={t(position)}
    >
      {t(getPositionAbbreviationKey(position))}
    </span>
  );
};

export default PositionTag;
