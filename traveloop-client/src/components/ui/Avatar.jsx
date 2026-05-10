import React from 'react';

export const Avatar = ({ src, name, size = 36 }) => {
  const letter = name ? name.charAt(0).toUpperCase() : '?';
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden border-2 border-[#0A1622] bg-[#0A1622] flex items-center justify-center"
    >
      {src ? (
        <img src={src} alt={name || 'avatar'} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 to-accent-mint/20 text-accent-blue flex items-center justify-center text-sm font-heading font-bold">
          {letter}
        </div>
      )}
    </div>
  );
};
