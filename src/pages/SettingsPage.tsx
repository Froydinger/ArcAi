import React from 'react';
import { Settings } from '../types/settings';
import { SettingsContent } from '../components/settings/SettingsContent';
import { X } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface SettingsPageProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onReset: () => void;
  onClose: () => void;
  onLogout: () => void; // Add onLogout prop
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings, // Keep settings prop if SettingsContent needs it directly (it does via useSettings hook now)
  onSave,   // Keep onSave if SettingsContent needs it directly (it uses useSettings hook now)
  onReset,
  onClose,
  onLogout, // Destructure onLogout
}) => {
  return (
    <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close Settings">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-65px)]"> {/* Adjust max-height if needed */}
        {/* Pass onClose and onLogout down to SettingsContent */}
        <SettingsContent onClose={onClose} onLogout={onLogout} />
      </div>
    </div>
  );
};
