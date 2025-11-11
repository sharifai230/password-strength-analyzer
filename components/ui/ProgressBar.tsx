
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  colorClass: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, colorClass }) => {
  return (
    <div className="w-full bg-gray-600 rounded-full h-2.5">
      <div
        className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
