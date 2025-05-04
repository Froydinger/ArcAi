import React from 'react';
import { Home, Sparkles, Settings, HelpCircle } from 'lucide-react';

interface TabSwitcherProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { index: 0, icon: Home, name: 'Home' },
    { index: 1, icon: Sparkles, name: 'New Chat' },
    { index: 2, icon: HelpCircle, name: 'ArcAi' },
  ];

  return (
    <div className="relative flex items-center justify-center w-full max-w-[300px] mx-auto rounded-full p-1 bg-[rgb(var(--input-bg))]">
      {/* Background Slider */}
      <div
        className="absolute h-8 w-24 rounded-full bg-[rgb(var(--theme-accent))]"
        style={{
          left: `${activeTab * (100 / tabs.length)}%`,
          transform: 'translateX(-50%)',
          transition: 'left 0.3s ease',
        }}
      />

      {/* Tabs */}
      {tabs.map((tab) => (
        <button
          key={tab.index}
          className="relative z-10 flex items-center justify-center w-24 h-8 rounded-full"
          onClick={() => setActiveTab(tab.index)}
        >
          <tab.icon className="w-4 h-4 mr-1" />
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  );
};
