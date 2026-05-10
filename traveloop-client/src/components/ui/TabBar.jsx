import React from 'react';

export const TabBar = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 bg-[#0A1622] border border-white/5 rounded-[18px] p-2">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-[14px] text-sm font-medium transition-all flex items-center gap-2 ${
              isActive
                ? 'bg-accent-blue text-[#0A1622]'
                : 'text-neutral-text hover:text-secondary-bg hover:bg-white/5'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isActive ? 'bg-[#0A1622]/15 text-[#0A1622]' : 'bg-white/10 text-neutral-text'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
