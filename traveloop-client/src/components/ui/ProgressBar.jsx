import React from 'react';

export const ProgressBar = ({ label, value, max = 100 }) => {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs font-medium mb-1.5">
          <span className="text-neutral-text">{label}</span>
          <span className="text-secondary-bg">{percent}%</span>
        </div>
      )}
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
        <div
          className="bg-accent-blue h-full rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
