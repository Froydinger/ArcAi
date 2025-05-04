import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Updated FAQ items for ArcAi
const faqItems = [
  {
    question: "What is ArcAi?",
    answer: "ArcAi is your personal AI assistant designed to help you with various tasks, answer questions, generate creative content, search the web, and even create images. It learns from your interactions and custom instructions to provide a personalized experience.",
  },
  {
    question: "How does ArcAi remember things about me?",
    answer: "ArcAi stores your conversation history, name, and custom instructions ('What should I know about you?') directly in your browser's local storage. This means your data stays on your device.",
  },
  {
    question: "Can I use ArcAi on multiple devices?",
    answer: "Since your data (conversations, settings) is stored locally in your browser, it won't automatically sync between different devices or browsers. Each browser/device will have its own separate instance of ArcAi.",
  },
  {
    question: "What commands can I use?",
    answer: "Currently, you can use the `/search` command followed by your query (e.g., `/search latest AI news`) to perform live web searches. ArcAi will summarize the findings for you. More commands might be added in the future!",
  },
  {
    question: "How is my data stored and secured?",
    answer: "Your chat history and personal settings (name, instructions, theme) are stored locally in your browser. Your login is handled securely via Netlify Identity. When using features like search or image generation, relevant prompts are sent to external services (Google, OpenAI) for processing, but your core settings remain local.",
  },
  {
    question: "Is ArcAi free to use?",
    answer: "ArcAi basic chat feature is free, forever. Period. other features may come and go, but your mental wellness companion is here to stay.", // Updated answer
  }
];

const accordionContentVariant = {
  hidden: { height: 0, opacity: 0, marginTop: 0 },
  visible: { height: "auto", opacity: 1, marginTop: '0.75rem', transition: { duration: 0.2, ease: "easeInOut" } },
  exit: { height: 0, opacity: 0, marginTop: 0, transition: { duration: 0.15, ease: "easeInOut" } },
};

const subtleSpringTransition = { type: 'spring', stiffness: 500, damping: 12 };

// Renamed component
export const GeneralFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-200 mb-4">Frequently Asked Questions</h3>
      {faqItems.map((item, index) => (
        <div key={index} className="border-b border-white/10 last:border-b-0">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex justify-between items-center py-3 text-left text-sm text-gray-300 hover:text-white transition-colors"
          >
            <span className="font-medium">{item.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={subtleSpringTransition}
            >
              <ChevronDown className="w-4 h-4 text-[rgb(var(--theme-accent))]" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                key="content"
                variants={accordionContentVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <p className="text-sm text-gray-400 pb-3 leading-relaxed">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
