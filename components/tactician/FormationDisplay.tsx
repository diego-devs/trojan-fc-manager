import React from 'react';
import { Formation } from '../../types';

interface FormationDisplayProps {
  formationVisual: Formation['visual'];
  isSelected?: boolean;
}

const FormationDisplay: React.FC<FormationDisplayProps> = ({ formationVisual, isSelected }) => {
  const dotBaseClass = "w-2.5 h-2.5 rounded-full m-0.5"; // Smaller dots, tighter spacing
  const selectedDotClass = "bg-yellow-400";
  const defaultDotClass = "bg-sky-500";
  const emptyDotClass = "bg-slate-600 opacity-50";
  
  // Rotate the visual for horizontal pitch display
  // Original visual: rows are lines (DEF, MID, FWD), cols are positions in that line
  // Rotated visual: rows are columns on the pitch, cols are lines from back to front
  // For a 4-row visual like:
  // [" ", "F", " "]  (FWD line)
  // ["M", "M", "M"]  (MID line)
  // ["D", " ", "D"]  (DEF line)
  // [" ", "G", " "]  (GK line)
  // After rotation it becomes 3 rows (pitch columns) x 4 columns (pitch depth from GK to FWD)
  // [ " ", "M", "D", " " ]
  // [ "F", "M", " ", "G" ]
  // [ " ", "M", "D", " " ]

  const rotatedVisual: string[][] = [];
  if (formationVisual.length > 0) {
    const originalRows = formationVisual.length; // e.g., 4 lines (GK, DEF, MID, FWD)
    const originalCols = formationVisual[0].length; // e.g., 3 positions in a line

    for (let j = 0; j < originalCols; j++) { // Iterate through original columns (now new rows)
      const newRow: string[] = [];
      for (let i = originalRows - 1; i >= 0; i--) { // Iterate through original rows in reverse (now new columns, from GK to FWD)
        newRow.push(formationVisual[i][j]);
      }
      rotatedVisual.push(newRow);
    }
  }


  return (
    <div className={`grid p-1 rounded bg-green-700/50 border ${isSelected ? 'border-yellow-400' : 'border-green-500'}`}>
      {rotatedVisual.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          {row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`${dotBaseClass} ${cell !== " " ? (isSelected ? selectedDotClass : defaultDotClass) : emptyDotClass}`}
              title={`Position ${cell !== " " ? cell : 'Empty'}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FormationDisplay;