import React from 'react';

export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-10 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-neutral-text" />
        </div>
      )}
      <h3 className="text-xl font-heading font-semibold text-secondary-bg mb-2">{title}</h3>
      {description && <p className="text-neutral-text text-sm max-w-sm mx-auto mb-6">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-accent-blue text-[#0A1622] rounded-[16px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
