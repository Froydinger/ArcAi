import React from 'react';
import { Heart, Brain, Star, Sparkles, Music, Palette, Coffee, Book, Mountain as Mountains, Compass, Flower, Camera, Moon, Sun } from 'lucide-react';

interface QuickIdeasProps {
  onSelect: (prompt: string) => void;
  show: boolean;
}

const ideas = [
  {
    icon: <Heart className="w-4 h-4" />,
    title: "Emotional Check-in",
    prompt: "Can we do a quick emotional check-in? I'd like to explore how I'm feeling.",
    gradient: "from-pink-600 to-rose-600"
  },
  {
    icon: <Brain className="w-4 h-4" />,
    title: "Anxiety Relief",
    prompt: "I'm feeling anxious. Can you guide me through some calming techniques?",
    gradient: "from-violet-600 to-purple-600"
  },
  {
    icon: <Star className="w-4 h-4" />,
    title: "Daily Affirmation",
    prompt: "Can you help me create a powerful affirmation for today?",
    gradient: "from-amber-600 to-orange-600"
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    title: "Creative Flow",
    prompt: "Help me tap into my creative flow with a unique exercise.",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: <Music className="w-4 h-4" />,
    title: "Music Therapy",
    prompt: "Let's use music for emotional healing. Can you guide me through a musical mindfulness session?",
    gradient: "from-indigo-600 to-blue-600"
  },
  {
    icon: <Palette className="w-4 h-4" />,
    title: "Art Expression",
    prompt: "Guide me through an art therapy exercise to express my current emotions.",
    gradient: "from-emerald-600 to-teal-600"
  },
  {
    icon: <Coffee className="w-4 h-4" />,
    title: "Mindful Break",
    prompt: "I need a mindful break. Can you guide me through a short meditation?",
    gradient: "from-yellow-600 to-amber-600"
  },
  {
    icon: <Book className="w-4 h-4" />,
    title: "Journal Prompt",
    prompt: "Can you give me a thought-provoking journal prompt for self-reflection?",
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    icon: <Mountains className="w-4 h-4" />,
    title: "Goal Setting",
    prompt: "Help me set a meaningful and achievable goal for personal growth.",
    gradient: "from-green-600 to-emerald-600"
  },
  {
    icon: <Moon className="w-4 h-4" />,
    title: "Sleep Prep",
    prompt: "Can you help me create a relaxing bedtime routine for better sleep?",
    gradient: "from-blue-600 to-violet-600"
  },
  {
    icon: <Sun className="w-4 h-4" />,
    title: "Morning Ritual",
    prompt: "Let's design an energizing morning ritual that sets a positive tone for the day.",
    gradient: "from-orange-600 to-red-600"
  },
  {
    icon: <Flower className="w-4 h-4" />,
    title: "Nature Connection",
    prompt: "Guide me through a visualization exercise to connect with nature's healing energy.",
    gradient: "from-teal-600 to-green-600"
  }
];

export const QuickIdeas: React.FC<QuickIdeasProps> = ({ onSelect, show }) => {
  if (!show) return null;

  return (
    <div className="absolute bottom-full mb-2 left-0 w-[320px] bg-theme-gradient rounded-xl 
      shadow-lg shadow-theme border border-theme backdrop-blur-xl 
      animate-jelly origin-bottom-left z-50">
      <div className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {ideas.map((idea, index) => (
            <button
              key={index}
              onClick={() => {
                const element = document.createElement('div');
                element.textContent = idea.prompt;
                element.className = 'animate-jelly';
                onSelect(idea.prompt);
              }}
              className={`group flex flex-col gap-2 p-2 rounded-xl 
                bg-gradient-to-br ${idea.gradient} bg-opacity-10 
                hover:bg-opacity-20 transition-all duration-300
                border border-gray-800/50 hover:border-gray-700/50
                shadow-lg shadow-black/20
                backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="p-1.5 rounded-lg bg-black/20 group-hover:bg-black/30 transition-colors w-min">
                {idea.icon}
              </div>
              <div className="text-left flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-white truncate">{idea.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
