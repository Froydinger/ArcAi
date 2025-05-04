import React, { useState } from 'react';
import { X, Brain, Heart, Sparkles, MessageSquare, Wand2, Headphones, Settings, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface TipsPopupProps {
  show: boolean;
  onClose: () => void;
  position?: 'center' | 'right';
}

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  details: {
    title: string;
    steps: string[];
    examples?: string[];
    tips?: string[];
  };
}

const features: Feature[] = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Mental Wellness",
    description: "Get emotional support",
    details: {
      title: "How to Use Mental Wellness Support",
      steps: [
        "Start with 'Can we have a quick therapy session?' to begin a guided conversation",
        "Share your current emotional state openly",
        "Ask for specific coping strategies or exercises",
        "Use 'I feel...' statements to express emotions"
      ],
      examples: [
        "'I'm feeling anxious about work, can we talk about it?'",
        "'Could you guide me through a calming exercise?'",
        "'Help me understand why I'm feeling this way'"
      ],
      tips: [
        "Be honest about your feelings - there's no judgment here",
        "Take your time to process emotions during conversations",
        "Remember you can always return to previous coping strategies"
      ]
    }
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Natural Chat",
    description: "Share your thoughts",
    details: {
      title: "Having Natural Conversations",
      steps: [
        "Start with any topic that interests you",
        "Ask follow-up questions for deeper discussions",
        "Share personal experiences and reflections",
        "Use the chat history to revisit important conversations"
      ],
      examples: [
        "'Let's talk about what happened today'",
        "'I've been thinking about making some changes'",
        "'Can you help me process this situation?'"
      ],
      tips: [
        "Conversations can flow naturally - just like talking to a friend",
        "Take breaks when needed to reflect",
        "You can always steer the conversation in a new direction"
      ]
    }
  },
  {
    icon: <Wand2 className="w-5 h-5" />,
    title: "Create Art",
    description: "Generate AI images",
    details: {
      title: "Creating AI Artwork",
      steps: [
        "Use phrases like 'generate an image of...' or 'create a picture of...'",
        "Be specific about style, colors, and mood",
        "Add artistic terms like 'watercolor', 'digital art', or 'photography'",
        "Include emotional elements to match your feelings"
      ],
      examples: [
        "'Generate an image of a peaceful garden at sunset'",
        "'Create a picture of hope represented through nature'",
        "'Show me a calming ocean scene in watercolor style'"
      ],
      tips: [
        "More detailed descriptions lead to better results",
        "You can request multiple variations",
        "Try different artistic styles to find what resonates"
      ]
    }
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: "Music",
    description: "Lofi beats",
    details: {
      title: "Need Some Chill Beats?",
      steps: [
        "Just tap the headphones icon in the top menu. That's literally it! 🎵",
        "Currently featuring our signature lofi beats mix",
        "(More vibes coming soon!)"
      ],
      tips: [
        "Perfect background music for chatting, thinking, or just vibing",
        "Pro tip: Music + deep breathing = instant chill mode",
        "Keep an eye out for new tracks dropping soon!"
      ]
    }
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Self Care",
    description: "Daily wellness tips",
    details: {
      title: "Practicing Self Care",
      steps: [
        "Ask for daily self-care suggestions",
        "Set reminders for regular check-ins",
        "Track your mood and energy levels",
        "Create personalized wellness routines"
      ],
      examples: [
        "'What's a good self-care activity for today?'",
        "'Help me create a morning wellness routine'",
        "'I need a quick stress-relief exercise'"
      ],
      tips: [
        "Start small with manageable activities",
        "Build habits gradually",
        "Celebrate your self-care achievements"
      ]
    }
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Activities",
    description: "Creative exercises",
    details: {
      title: "Exploring Creative Activities",
      steps: [
        "Choose from quick-start creative prompts",
        "Try guided visualization exercises",
        "Engage in expressive writing",
        "Practice artistic meditation"
      ],
      examples: [
        "'Guide me through a creative visualization'",
        "'Let's do a mindful drawing exercise'",
        "'Help me write expressively about my feelings'"
      ],
      tips: [
        "There's no right or wrong in creative expression",
        "Use activities to explore emotions indirectly",
        "Combine different exercises for deeper engagement"
      ]
    }
  }
];

export const TipsPopup: React.FC<TipsPopupProps> = ({ 
  show, 
  onClose,
  position = 'center'
}) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          if (selectedFeature) {
            setSelectedFeature(null);
          } else {
            onClose();
          }
        }}
      />
      
      <div className="relative w-full max-w-lg mx-4 bg-[#030712]/90 backdrop-blur-xl 
        rounded-2xl overflow-hidden shadow-2xl shadow-theme animate-float-up">
        <div className="p-4 border-b border-theme">
          <div className="flex items-center justify-between">
            {selectedFeature ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFeature(null)}
                  className="hover:bg-theme-hover"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h2 className="text-xl font-extralight text-white">{selectedFeature.title}</h2>
                  <p className="text-sm font-extralight text-theme-accent">{selectedFeature.description}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <img 
                  src="https://froydinger.com/wp-content/uploads/2025/03/arcainewlogo.png"
                  alt="Arcana"
                  className="w-12 h-12 object-contain animate-float"
                />
                <div>
                  <h2 className="text-xl font-extralight text-white">Welcome to Arcana</h2>
                  <p className="text-sm font-extralight text-theme-accent">Your AI Mental Wellness Companion</p>
                </div>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-6 max-h-[calc(80vh-16rem)] overflow-y-auto">
          {selectedFeature ? (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg text-theme-accent font-medium">{selectedFeature.details.title}</h3>
                
                <div className="space-y-2">
                  <h4 className="text-sm text-theme-secondary font-medium">How to Use:</h4>
                  <ul className="space-y-2">
                    {selectedFeature.details.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-theme-accent">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedFeature.details.examples && (
                  <div className="space-y-2">
                    <h4 className="text-sm text-theme-secondary font-medium">Try Saying:</h4>
                    <ul className="space-y-2">
                      {selectedFeature.details.examples.map((example, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-theme-accent">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedFeature.details.tips && (
                  <div className="space-y-2">
                    <h4 className="text-sm text-theme-secondary font-medium">Pro Tips:</h4>
                    <ul className="space-y-2">
                      {selectedFeature.details.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-theme-accent">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedFeature(feature)}
                  className="bg-black/20 rounded-lg p-3 hover:bg-black/30 
                    transition-all duration-300 hover:shadow-lg hover:shadow-theme/10
                    text-left"
                >
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-theme-gradient">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-theme-accent font-medium text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!selectedFeature && (
            <div className="mt-4 p-3 bg-theme-gradient rounded-lg">
              <p className="text-xs text-gray-300">
                <strong className="text-theme-accent">Pro Tip:</strong> Try saying "Can we have a quick therapy session?" or use the quick start prompts below for guided activities.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-theme bg-black/20">
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onClose}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
