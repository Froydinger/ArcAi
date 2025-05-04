import React from 'react';
import { Zap, Camera } from 'lucide-react';

const ZapMenu: React.FC<{ onPromptSelect: (prompt: string) => void }> = ({ onPromptSelect }) => {
  const createPrompts = [
    { title: "Create Landscape", prompt: "generate an image of a beautiful landscape with mountains and a river" },
    { title: "Create Portrait", prompt: "generate an image of a portrait of a person in a historical setting" },
    { title: "Create Abstract", prompt: "generate an image of an abstract painting with vibrant colors" },
    { title: "Create Fantasy", prompt: "generate an image of a fantasy creature in a magical forest" },
    { title: "Create Cityscape", prompt: "generate an image of a futuristic city at night" },
    { title: "Create Underwater", prompt: "generate an image of an underwater scene with colorful fish" },
    { title: "Text Adventure", prompt: "Start a simple text game" },
    { title: "Random Challenge", prompt: "Give me a fun, quick challenge" },
    { title: "Two-Sentence Horror", prompt: "Tell a quick spooky story" },
    { title: "Weird Fact", prompt: "Tell me a strange fact" },
    { title: "Silly Song Title", prompt: "Invent a funny song title" },
    { title: "Odd Invention Idea", prompt: "Suggest a useless invention" },
  ];

  return (
    <div className="zap-menu">
      <h2 className="text-lg font-bold">Create</h2>
      <div className="flex flex-wrap gap-2">
        {createPrompts.map((prompt, index) => (
          <button
            key={index}
            className="flex items-center p-2 rounded-lg glass-panel cursor-pointer"
            onClick={() => onPromptSelect(prompt.prompt)}
          >
            <Camera className="mr-2" />
            {prompt.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ZapMenu;
