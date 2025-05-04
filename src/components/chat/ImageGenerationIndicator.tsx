import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';

export const ImageGenerationIndicator: React.FC = () => {
  const indicatorBaseClasses = `relative flex items-center justify-center rounded-full overflow-hidden glass-panel border border-[rgb(var(--theme-accent))]/30 px-6 py-3 shadow-lg animate-fade-in`;
  const indicatorTextColor = 'text-white/90';
  const indicatorIconColor = 'text-white/90';
  const starColor = 'text-yellow-300/90';

  return (
    <div className="flex justify-center py-2 my-2">
      {/* Main container - Ensure relative positioning */}
      <div className={cn(indicatorBaseClasses, "relative")}>
        {/* --- Rainbow Glow Div --- */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60 animate-rainbow-bg animate-pulse-glow -z-10" // Apply glow classes
          style={{ backgroundSize: '400% 400%' }} // Keep backgroundSize inline
        />
        {/* --- End Glow Div --- */}

        {/* Content Wrapper - Ensure it's above the glow */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Animated Icon Container */}
          <div className="flex items-center justify-center relative mr-2">
            {/* Bouncing Main Icon */}
            <motion.div
              animate={{ y: ["0%", "-20%", "0%"] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <ImageIcon className={cn("w-5 h-5 flex-shrink-0", indicatorIconColor)} />
            </motion.div>
            {/* Animated Star */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [0.6, 1, 0.6],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className={cn("w-3 h-3", starColor)} />
            </motion.div>
          </div>

          {/* Text */}
          <span className={cn("text-sm font-medium truncate", indicatorTextColor)}>
            Generating image...
          </span>
        </div>
      </div>
    </div>
  );
};
