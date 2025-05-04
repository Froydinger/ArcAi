import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Activity, Pencil, FastForward, Gamepad2, // Mode Icons
} from 'lucide-react';
import { Button } from './ui/Button';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../utils/classNames';
import {
  initialChatPrompts, initialTherapyPrompts, initialCreativeWritingPrompts, initialQuickPrompts,
  midChatPromptsBase, midTherapyPrompts, midCreativeWritingPrompts, midFunPrompts
} from '../lib/prompts';

interface QuickStartPromptsProps {
  onSelect: (prompt: string) => void;
  promptSet?: 'initial' | 'midChat';
}

interface Prompt {
  icon: React.ElementType;
  title: string;
  description: string;
  prompt: string;
  gradient: string;
}

const getAllowedModes = (promptSet: 'initial' | 'midChat') => {
  return promptSet === 'midChat'
    ? ['chat', 'therapy', 'write', 'fun'] as const
    : ['chat', 'therapy', 'write', 'quick'] as const;
};

type AllowedMode<T extends 'initial' | 'midChat'> = ReturnType<typeof getAllowedModes>[T][number];

const tonePromptTitles = [
  "More Optimistic Tone", "More Casual Tone", "More Formal Tone",
  "More Analytical Tone", "More Empathetic Tone", "More Playful Tone",
  "More Concise Tone"
];

const roygbivToneOrder: { [key: string]: number } = {
  "More Empathetic Tone": 1,
  "More Optimistic Tone": 2,
  "More Playful Tone": 3,
  "More Casual Tone": 4,
  "More Analytical Tone": 5,
  "More Formal Tone": 6,
  "More Concise Tone": 7
};


const gridVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: {
      scale: { type: 'spring', stiffness: 650, damping: 15 },
      y: { type: 'spring', stiffness: 650, damping: 15 },
      opacity: { duration: 0.01 }
    },
  },
  exit: {
    opacity: 0, scale: 0.9, y: -10,
    transition: {
      opacity: { duration: 0.05 },
      scale: { duration: 0.15 },
      y: { duration: 0.15 }
    }
  }
};

const toneSliderVariants = {
  initial: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.05 } }
};


export const QuickStartPrompts: React.FC<QuickStartPromptsProps> = ({ onSelect, promptSet = 'initial' }) => {
  const allowedModes = useMemo(() => getAllowedModes(promptSet), [promptSet]);
  type CurrentMode = typeof allowedModes[number];

  const initialMode = allowedModes[0];
  const [mode, setMode] = useState<CurrentMode>(initialMode);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number | null>(null);
  const [selectedToneIndex, setSelectedToneIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    if (!allowedModes.includes(mode as any)) {
      setMode(allowedModes[0]);
      setSelectedPromptIndex(null);
      setSelectedToneIndex(null);
    }
  }, [allowedModes, mode]);

  const getModeIcon = (m: CurrentMode) => {
    const iconProps = { className: isMobile ? "w-3 h-3" : "w-4 h-4" };
    switch (m) {
      case 'chat': return <MessageCircle {...iconProps} />;
      case 'therapy': return <Activity {...iconProps} />;
      case 'write': return <Pencil {...iconProps} />;
      case 'quick': return <FastForward {...iconProps} />;
      case 'fun': return <Gamepad2 {...iconProps} />;
      default: return null;
    }
  }

  const handleModeSelect = (newMode: CurrentMode) => {
    setMode(newMode);
    setSelectedPromptIndex(null);
    setSelectedToneIndex(null);
  };

  const { tonePrompts, otherPrompts } = useMemo(() => {
    let tones: Prompt[] = [];
    let others: Prompt[] = [];

    if (promptSet === 'midChat') {
      switch (mode) {
        case 'chat':
          tones = midChatPromptsBase.filter(p => tonePromptTitles.includes(p.title));
          tones.sort((a, b) => (roygbivToneOrder[a.title] || 99) - (roygbivToneOrder[b.title] || 99));
          others = midChatPromptsBase.filter(p => !tonePromptTitles.includes(p.title));
          break;
        case 'therapy':
          others = midTherapyPrompts;
          break;
        case 'write':
          others = midCreativeWritingPrompts;
          break;
        case 'fun':
          others = midFunPrompts;
          break;
      }
    } else {
      switch (mode) {
        case 'chat': others = initialChatPrompts; break;
        case 'therapy':
          others = initialTherapyPrompts;
          break;
        case 'write': others = initialCreativeWritingPrompts; break;
        case 'quick': others = initialQuickPrompts; break;
      }
    }
    return { tonePrompts: tones, otherPrompts: others };
  }, [promptSet, mode]);

  const getButtonClasses = (buttonMode: CurrentMode) => {
    const baseClasses = `flex items-center justify-center gap-2 rounded-lg transition-colors duration-200 ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`;
    const activeClasses = mode === buttonMode ? 'bg-[rgb(var(--theme-accent))]/60 text-white' : 'bg-[rgb(var(--theme-accent))]/20 text-gray-200 hover:bg-[rgb(var(--theme-accent))]/30 hover:text-white';
    return `${baseClasses} ${activeClasses}`;
  };

  const handleToneSelect = (prompt: string, index: number) => {
    onSelect(prompt);
    setSelectedToneIndex(index);
    setSelectedPromptIndex(null);
  };

  const handlePromptSelect = (prompt: string, index: number) => {
    onSelect(prompt);
    setSelectedPromptIndex(index);
    setSelectedToneIndex(null);
  };


  return (
    <div className="px-0 py-4 scrollbar-hide">
      <div className="flex justify-center gap-2 mb-4 px-4">
        {allowedModes.map((allowedMode) => (
          <button
            key={allowedMode}
            onClick={() => handleModeSelect(allowedMode)}
            className={getButtonClasses(allowedMode)}
          >
            {getModeIcon(allowedMode)}
            {/* --- MODIFIED LINE BELOW --- */}
            {/* Always show label */}
            <span className="ml-1 capitalize">{allowedMode}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {promptSet === 'midChat' && mode === 'chat' && tonePrompts.length > 0 && (
            <motion.div
              key="tone-slider-wrapper"
              variants={toneSliderVariants}
              initial="initial"
              exit="exit"
              className="overflow-hidden mt-2"
            >
              <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide px-4">
                {tonePrompts.map((prompt, index) => {
                  const IconComponent = prompt.icon;
                  return (
                    <button
                      key={`tone-${prompt.title}-${index}`}
                      onClick={() => handleToneSelect(prompt.prompt, index)}
                      className={cn(
                        `flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-200 border`,
                        `bg-gradient-to-r ${prompt.gradient} bg-opacity-70 hover:bg-opacity-100`,
                        selectedToneIndex === index
                          ? 'border-[rgb(var(--theme-accent))] ring-2 ring-[rgb(var(--theme-accent))] text-white shadow-md shadow-[rgb(var(--theme-accent))]'
                          : 'border-transparent text-gray-200 hover:text-white hover:border-white/30'
                      )}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{prompt.title}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mb-2"></div>
            </motion.div>
          )}

          <div className={`grid ${(promptSet === 'midChat' || isMobile) ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'} px-4`}>
            {otherPrompts.map((prompt, index) => {
              const IconComponent = prompt.icon;
              return (
                <motion.div
                  key={`${promptSet}-${mode}-prompt-${prompt.title}-${index}`}
                  onClick={() => handlePromptSelect(prompt.prompt, index)}
                  whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 500, damping: 15 } }}
                  className={cn(`group relative overflow-hidden glass-panel rounded-2xl p-4 cursor-pointer
                    transition-all duration-300 hover:scale-[1.02] text-left border-2`,
                    selectedPromptIndex === index
                      ? 'border-[rgb(var(--theme-accent))] shadow-lg shadow-[rgb(var(--theme-accent))]'
                      : 'border-transparent hover:border-[rgba(var(--theme-accent-rgb),0.5)]'
                  )}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${prompt.gradient} opacity-60 transition-opacity duration-300`}
                  />
                  <div className="relative z-10 flex items-start gap-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg bg-white/10 text-[rgb(var(--foreground-rgb))]`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm text-[rgb(var(--foreground-rgb))] mb-1">{prompt.title}</h4>
                      <p className="text-xs text-[rgba(var(--foreground-rgb),0.7)]">{prompt.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {otherPrompts.length === 0 && tonePrompts.length === 0 && (
            <div className="text-center text-gray-500 py-8 px-4">No prompts available for this mode.</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
