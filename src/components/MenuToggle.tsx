import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface MenuToggleProps {
  show: boolean;
  onClick: () => void;
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ show, onClick }) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <button
      onClick={onClick}
      className={`fixed top-4 left-4 z-50 p-3 rounded-full bg-gray-800/30 backdrop-blur-sm 
        hover:bg-gray-700/30 transition-all duration-300 hover:scale-105`}
    >
      {/* Consistent Chevron Icon based on platform */}
      {isMobile ? (
        <ChevronDown className={`w-5 h-5 text-[rgb(var(--theme-accent))] transition-transform duration-300 ${show ? 'rotate-180' : ''}`} />
      ) : (
        <ChevronRight className={`w-5 h-5 text-[rgb(var(--theme-accent))] transition-transform duration-300 ${show ? 'rotate-180' : ''}`} />
      )}
    </button>
  );
};
