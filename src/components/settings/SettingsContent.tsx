import React, { useState, useEffect, useRef } from 'react';
import { User, Trash2, Check, Plus, X, Edit2, Save, HelpCircle, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { GeneralFAQ } from './GeneralFAQ';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/classNames';
import { useSettings } from '../../hooks/useSettings';

interface InstructionSlot {
  id: string;
  text: string;
  isEditing: boolean;
  editText?: string;
}

interface SettingsContentProps {
  onClose: () => void;
}

const themes = [
  { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-500' },
  { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500' },
  { id: 'green', name: 'Emerald Green', color: 'bg-emerald-500' },
  { id: 'gold', name: 'Sunset Gold', color: 'bg-amber-500' },
  { id: 'red', name: 'Ruby Red', color: 'bg-red-500' },
  { id: 'black-glass', name: 'Black Glass', color: 'bg-gray-950' },
];

// Animation Variants (keep as before)
const springTransition = { type: 'spring', stiffness: 400, damping: 15 };
const subtleSpringTransition = { type: 'spring', stiffness: 500, damping: 12 };

const itemAppearVariant = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springTransition },
  exit: { opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.15 } },
};

const modalVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: springTransition },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
};

const accordionContentVariant = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { ...springTransition, duration: 0.3 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
};


export const SettingsContent: React.FC<SettingsContentProps> = ({ onClose }) => {
  const { settings, updateSettings, resetSettings, isLoaded } = useSettings();

  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState<InstructionSlot[]>([]);
  const [theme, setTheme] = useState('');

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newInstruction, setNewInstruction] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFaqAccordionOpen, setIsFaqAccordionOpen] = useState(false);

  const initialSettingsRef = useRef<typeof settings | null>(null);
  const initialInstructionsRef = useRef<InstructionSlot[]>([ ]);

  useEffect(() => {
    if (isLoaded && settings) {
      setName(settings.name || '');
      setTheme(settings.theme || 'blue');

      const initialInstructionsText = (settings.instructions || '');
      const initialInstructions = initialInstructionsText
        .split('\n')
        .filter(Boolean)
        .map(text => ({
          id: Math.random().toString(36).substr(2, 9),
          text,
          isEditing: false
        }));
      setInstructions(initialInstructions);
      initialInstructionsRef.current = initialInstructions;

      initialSettingsRef.current = { ...settings };
      setHasUnsavedChanges(false);
    }
  }, [isLoaded, settings]);

  useEffect(() => {
    if (!isLoaded || !initialSettingsRef.current) return;

    const currentInstructionsText = instructions.map(i => i.text).join('\n');

    const changed =
      name !== (initialSettingsRef.current.name || '') ||
      currentInstructionsText !== initialInstructionsRef.current.map(i => i.text).join('\n') ||
      theme !== (initialSettingsRef.current.theme || 'blue');

    setHasUnsavedChanges(changed);
  }, [name, instructions, theme, isLoaded, initialSettingsRef, initialInstructionsRef]);


  const handleSave = () => {
    const combinedInstructions = instructions
      .map(instruction => instruction.text)
      .filter(Boolean)
      .join('\n');

    const settingsToSave = {
      name,
      instructions: combinedInstructions,
      theme,
    };

    updateSettings(settingsToSave);
    window.location.reload(); // Refresh page after saving
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([
        ...instructions,
        {
          id: Math.random().toString(36).substr(2, 9),
          text: newInstruction.trim(),
          isEditing: false
        }
      ]);
      setNewInstruction('');
    }
  };

  const startEditing = (id: string) => {
    setInstructions(instructions.map(instruction =>
      instruction.id === id
        ? { ...instruction, isEditing: true, editText: instruction.text }
        : { ...instruction, isEditing: false }
    ));
  };

  const updateEditText = (id: string, editText: string) => {
    setInstructions(instructions.map(instruction =>
      instruction.id === id
        ? { ...instruction, editText }
        : instruction
    ));
  };

  const saveEdit = (id: string) => {
    setInstructions(instructions.map(instruction =>
      instruction.id === id && instruction.editText !== undefined
        ? { ...instruction, text: instruction.editText.trim(), isEditing: false, editText: undefined }
        : instruction
    ).filter(i => i.text.trim() !== ''));
  };

  const cancelEdit = (id: string) => {
    setInstructions(instructions.map(instruction =>
      instruction.id === id
        ? { ...instruction, isEditing: false, editText: undefined }
        : instruction
    ));
  };

  const deleteInstruction = (id: string) => {
    setInstructions(instructions.filter(instruction => instruction.id !== id));
  };

  if (!isLoaded) {
    return <div className="p-6 text-center text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Save Changes Button (Top Right) */}
      <div className="flex items-center justify-end h-10">
        <AnimatePresence>
          {hasUnsavedChanges && (
            <motion.div
              className="flex justify-end"
              variants={itemAppearVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handleSave}
                  className="px-4 py-2 flex items-center gap-2"
                  size="sm"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="userName" className="block text-sm font-medium text-gray-300">What should I call you?</label>
          <input
            id="userName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full glass-panel rounded-xl px-4 py-2
              text-gray-100 placeholder-[rgb(var(--theme-accent))]/70 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--theme-accent))]"
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">What's your favorite color?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themes.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(`relative flex flex-col items-center justify-center p-3 rounded-xl glass-panel-soft overflow-hidden
                          transition-colors duration-200 hover:opacity-90
                          ring-2`, theme === t.id ? 'ring-[rgb(var(--theme-accent))]' : 'ring-transparent')}
                title={t.name}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95, transition: subtleSpringTransition }}
                animate={{ scale: theme === t.id ? 1.05 : 1 }}
                transition={subtleSpringTransition}
              >
                <div className={`w-full h-8 rounded-md mb-2 ${t.color}`}></div>
                <span className="text-xs font-medium text-center text-gray-200 truncate w-full">{t.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Instruction Slots - Restored */}
      <div className="border-t border-white/5 pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-300">What should I know about you?</label>
          </div>
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {instructions.map(instruction => (
                <motion.div
                  key={instruction.id}
                  layout
                  variants={itemAppearVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center gap-2"
                >
                  {instruction.isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={instruction.editText ?? instruction.text}
                        onChange={(e) => updateEditText(instruction.id, e.target.value)}
                        className="flex-1 glass-panel rounded-xl px-4 py-2
                          text-gray-100 placeholder-[rgb(var(--theme-accent))]/70 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--theme-accent))]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(instruction.id);
                          if (e.key === 'Escape') cancelEdit(instruction.id);
                        }}
                      />
                      <motion.button
                        onClick={() => saveEdit(instruction.id)}
                        className="p-2 text-gray-400 hover:text-green-400 rounded-lg
                          hover:bg-white/5 transition-colors duration-200"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Save className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => cancelEdit(instruction.id)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg
                          hover:bg-white/5 transition-colors duration-200"
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 glass-panel rounded-xl px-4 py-2 text-gray-100 break-words min-w-0">
                        {instruction.text}
                      </div>
                      <motion.button
                        onClick={() => startEditing(instruction.id)}
                        className="p-2 text-gray-400 hover:text-[rgb(var(--theme-accent))] rounded-lg
                          hover:bg-white/5 transition-colors duration-200 flex-shrink-0"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteInstruction(instruction.id)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg
                          hover:bg-white/5 transition-colors duration-200 flex-shrink-0"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              placeholder="Add something I should know about you..."
              className="flex-1 glass-panel rounded-xl px-4 py-2
                text-gray-100 placeholder-[rgb(var(--theme-accent))]/70 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--theme-accent))]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addInstruction();
                }
              }}
            />
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={addInstruction}
                disabled={!newInstruction.trim()}
                className="p-2 flex-shrink-0"
                size="icon"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6">
        <div className="glass-panel rounded-xl overflow-hidden">
          <button
            onClick={() => setIsFaqAccordionOpen(!isFaqAccordionOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-left transition-colors
              hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[rgb(var(--theme-primary))]/20">
                <HelpCircle className="w-5 h-5 text-[rgb(var(--theme-accent))]" />
              </div>
              <span className="text-sm font-medium text-[rgb(var(--theme-secondary))]">
                About ArcAi & FAQ
              </span>
            </div>
            <motion.div
              animate={{ rotate: isFaqAccordionOpen ? 180 : 0 }}
              transition={subtleSpringTransition}
            >
              <ChevronDown className="w-4 h-4 text-[rgb(var(--theme-accent))]" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {isFaqAccordionOpen && (
              <motion.div
                key="faq-content"
                variants={accordionContentVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-4 space-y-6 border-t border-white/5">
                  <GeneralFAQ />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- ADDED: Second Save Changes Button --- */}
      <div className="border-t border-white/5 pt-6 space-y-3">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSave}
            className="w-full px-6 py-2"
          >
            Save Changes
          </Button>
        </motion.div>
      </div>
      {/* --- END ADDED --- */}

      <div className="border-t border-white/5 pt-6 space-y-3">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-950/20"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Data
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            key="reset-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
            <motion.div
              key="reset-modal-content"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-sm mx-4 glass-panel
                rounded-2xl overflow-hidden shadow-2xl p-6"
            >
              <h3 className="text-lg font-medium text-white mb-2">Reset All Data?</h3>
              <p className="text-sm text-gray-400 mb-6">
                This will delete all your conversations, settings, and preferences. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    onClick={() => setShowResetConfirm(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      resetSettings();
                      document.documentElement.setAttribute('data-theme', 'blue');
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reset Everything
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
