import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/classNames';
import {
  initialChatPrompts,
  initialImagePrompts,
  initialTherapyPrompts,
  initialCreativeWritingPrompts,
  initialQuickPrompts,
  midChatPromptsBase,
  midImagePrompts,
  midTherapyPrompts,
  midCreativeWritingPrompts,
  midFunPrompts,
} from '../../lib/prompts';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import {
  Zap, MessageCircle, Image as ImageIcon, Activity, Pencil, Gamepad2, ChevronLeft, ChevronRight
} from 'lucide-react';

type PromptSetType = 'initial' | 'midChat';

interface QuickStartPromptsProps {
  onPromptSelect: (prompt: string) => void;
  promptSet?: PromptSetType;
  currentTonePrompt?: string;
}

const modeIcons: { [key: string]: React.ElementType } = {
  chat: MessageCircle,
  image: ImageIcon,
  therapy: Activity,
  write: Pencil,
  quick: Zap,
  fun: Gamepad2,
};

// UPDATED: Reordered to put Empathetic and Concise first
const roygbivToneOrder = [
  'More Empathetic Tone', // Pink/Fuchsia
  'More Concise Tone', // Gray
  'More Formal Tone', // Slate
  'More Playful Tone', // Yellow
  'More Optimistic Tone', // Amber
  'More Casual Tone', // Lime
  'More Analytical Tone', // Indigo
];

const getModeIcon = (mode: string): React.ElementType => {
  return modeIcons[mode] || MessageCircle;
};

const gridVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: "linear"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "linear"
    }
  }
};

export const QuickStartPrompts: React.FC<QuickStartPromptsProps> = ({
  onPromptSelect,
  promptSet = 'initial',
  currentTonePrompt,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const getAllowedModes = (set: PromptSetType) => {
    if (set === 'initial') {
      // Order: Chat, Therapy, Write, Quick
      return ['chat', 'therapy', 'write', 'quick'];
    } else {
      // Order: Chat, Therapy, Write, Fun (Zap Menu)
      return ['chat', 'therapy', 'write', 'fun'];
    }
  };

  const allowedModes = useMemo(() => getAllowedModes(promptSet), [promptSet]);
  const [mode, setMode] = useState(allowedModes[0]); // Default to the first allowed mode

  // --- State for Desktop Tone Slider ---
  const [tonePageIndex, setTonePageIndex] = useState(0);
  // --- End State ---


  const prompts = useMemo(() => {
    let selectedPrompts;
    if (promptSet === 'initial') {
      switch (mode) {
        case 'chat': selectedPrompts = initialChatPrompts; break;
        case 'image': selectedPrompts = initialImagePrompts; break; // Keep for potential future use?
        case 'therapy': selectedPrompts = initialTherapyPrompts; break;
        case 'write': selectedPrompts = initialCreativeWritingPrompts; break;
        case 'quick': selectedPrompts = initialQuickPrompts; break;
        default: selectedPrompts = initialChatPrompts;
      }
      // --- Limit initial prompts to 6 per category ---
      //return selectedPrompts.slice(0, 6);
      return selectedPrompts;
      // --- End Limit ---
    } else { // midChat (Zap Menu)
      switch (mode) {
        case 'chat': selectedPrompts = midChatPromptsBase; break;
        case 'image': selectedPrompts = midImagePrompts; break; // Keep for potential future use?
        case 'therapy': selectedPrompts = midTherapyPrompts; break;
        case 'write': selectedPrompts = midCreativeWritingPrompts; break;
        case 'fun': selectedPrompts = midFunPrompts; break;
        default: selectedPrompts = midChatPromptsBase;
      }
      return selectedPrompts; // No limit for midChat prompts
    }
  }, [mode, promptSet]);

  // Sort tones according to ROYGBIV order
  const tones = useMemo(() => {
    // Only show tones for midChat 'chat' mode
    if (promptSet !== 'midChat' || mode !== 'chat') return [];

    const baseTones = midChatPromptsBase.filter(p => p.title.includes('Tone'));
    const orderedTones = roygbivToneOrder
      .map(title => baseTones.find(p => p.title === title))
      .filter(p => p !== undefined) as typeof midChatPromptsBase; // Type assertion

    // Append any tones not in the specific order (maintains all tones)
    const remainingTones = baseTones.filter(p => !roygbivToneOrder.includes(p.title));
    return [...orderedTones, ...remainingTones];
  }, [promptSet, mode]);

  const handleToneSelect = (prompt: string) => {
    onPromptSelect(prompt);
  };

  // Reset tone page index when mode changes
  useEffect(() => {
    setTonePageIndex(0);
  }, [mode]);

  // Calculate tones to display for desktop
  const tonesToShowDesktop = useMemo(() => {
    const startIndex = tonePageIndex * 2;
    return tones.slice(startIndex, startIndex + 2);
  }, [tones, tonePageIndex]);

  // No outer div needed here, styling is handled by ChatInput container and internal elements
  return (
    <>
      {/* Mode Selector */}
      <div className="flex justify-center items-center space-x-1 md:space-x-2 mb-3">
        {allowedModes.map((m) => {
          const Icon = getModeIcon(m);
          const isActive = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "glass-button", // Apply base glass style CONSISTENTLY
                "flex-1 md:flex-none", // Allow flex grow on mobile
                "px-3 py-1.5 text-xs md:text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-1.5",
                isActive
                  ? "border-[rgba(var(--theme-accent-rgb),0.3)] bg-[rgba(var(--theme-primary-rgb),0.1)] text-white" // Active state: brighter border, subtle bg tint
                  : "text-gray-400 hover:text-gray-200 border-transparent", // Inactive state: transparent border
                isMobile && !isActive ? "px-3 py-1.5" : "" // Remove text and padding on mobile when inactive
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} className="relative z-10" />
              {/* Conditionally render text on mobile */}
              <span className={cn("relative z-10 capitalize", isMobile && !isActive ? "hidden" : "")}>
                {m === 'quick' ? 'Quick' : m}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tone Slider (Only for midChat mode 'chat') */}
      {promptSet === 'midChat' && mode === 'chat' && (
        <div className="mb-2 mt-2"> {/* Removed px-2 md:px-0, padding handled by ChatInput container */}
          {/* --- DESKTOP TONE SLIDER --- */}
          {!isMobile && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setTonePageIndex(prev => Math.max(0, prev - 1))}
                disabled={tonePageIndex === 0}
                className="p-1 rounded-full text-gray-400 disabled:opacity-30 hover:bg-white/10 disabled:hover:bg-transparent transition-colors"
                aria-label="Previous tones"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex-1 flex justify-center gap-2">
                {tonesToShowDesktop.map((tone) => {
                  const Icon = tone.icon;
                  const isSelected = currentTonePrompt === tone.prompt;
                  return (
                    <motion.button
                      key={tone.title}
                      onClick={() => handleToneSelect(tone.prompt)}
                      className={cn(
                        "flex-1 text-center text-xs px-2 py-1.5 rounded-xl transition-all duration-200 border flex flex-col items-center justify-center gap-1 min-w-[100px] max-w-[150px]",
                        isSelected
                          ? 'bg-[rgba(var(--theme-accent-rgb),0.2)] border-[rgba(var(--theme-accent-rgb),0.5)] text-white scale-105 shadow-md'
                          : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-300 hover:text-gray-100'
                      )}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Icon size={16} className="mb-0.5" />
                      {tone.title.replace(' Tone', '')}
                    </motion.button>
                  );
                })}
                 {/* Add placeholders if only one tone is left */}
                 {tonesToShowDesktop.length === 1 && (
                   <div className="flex-1 min-w-[100px] max-w-[150px]"></div>
                 )}
              </div>

              <button
                onClick={() => setTonePageIndex(prev => prev + 1)}
                disabled={(tonePageIndex + 1) * 2 >= tones.length}
                className="p-1 rounded-full text-gray-400 disabled:opacity-30 hover:bg-white/10 disabled:hover:bg-transparent transition-colors"
                aria-label="Next tones"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* --- MOBILE TONE SLIDER --- */}
          {isMobile && (
             <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                {tones.map((tone) => {
                  const Icon = tone.icon;
                  const isSelected = currentTonePrompt === tone.prompt;
                  return (
                    <motion.button
                      key={tone.title}
                      onClick={() => handleToneSelect(tone.prompt)}
                      className={cn(
                        "flex-none text-center text-xs px-3 py-1.5 rounded-xl transition-all duration-200 border flex flex-col items-center justify-center gap-1 min-w-[90px]",
                        isSelected
                          ? 'bg-[rgba(var(--theme-accent-rgb),0.2)] border-[rgba(var(--theme-accent-rgb),0.5)] text-white scale-105 shadow-md'
                          : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-300 hover:text-gray-100'
                      )}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Icon size={16} className="mb-0.5" />
                      {tone.title.replace(' Tone', '')}
                    </motion.button>
                  );
                })}
              </div>
          )}
        </div>
      )}


      {/* Prompt Grid/List */}
      <AnimatePresence mode="sync">
        <motion.div
          key={mode} // Animate when mode changes
          className={cn(
            "grid gap-2 md:gap-3",
            // Use list layout for midChat (Zap Menu) on all devices
            promptSet === 'midChat'
              ? "grid-cols-1"
              // Use grid for initial prompts on desktop, list on mobile
              : isMobile ? "grid-cols-1" : "grid-cols-2"
          )}
          variants={gridVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {prompts.map((prompt, index) => {
            // Exclude tone prompts from the main list when in midChat 'chat' mode
            if (promptSet === 'midChat' && mode === 'chat' && prompt.title.includes('Tone')) {
              return null;
            }

            const Icon = prompt.icon;
            return (
              <motion.button
                key={prompt.title}
                onClick={() => onPromptSelect(prompt.prompt)}
                className={cn(
                  "glass-button", // Apply glass style universally
                  "text-left p-3 flex items-start space-x-3 hover:scale-[1.02] active:scale-[0.98]",
                  "bg-transparent" // Ensure background is transparent by default (glass-button handles actual bg)
                )}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
              >
                <div className={`mt-1 p-1.5 rounded-full bg-gradient-to-br ${prompt.gradient}`}>
                  <Icon size={16} className="text-white/90" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-100">{prompt.title}</p>
                  <p className="text-xs text-gray-400">{prompt.description}</p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
