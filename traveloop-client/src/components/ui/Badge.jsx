import React from 'react';

const TONE_CLASSES = {
  blue: 'bg-accent-blue/20 text-accent-blue border-accent-blue/20',
  mint: 'bg-accent-mint/20 text-accent-mint border-accent-mint/20',
  orange: 'bg-accent-orange/20 text-accent-orange border-accent-orange/20',
  gray: 'bg-white/10 text-neutral-text border-white/10'
};

export const Badge = ({ children, tone = 'gray' }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${TONE_CLASSES[tone] || TONE_CLASSES.gray}`}>
      {children}
    </span>
  );
};
