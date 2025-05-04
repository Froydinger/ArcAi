import { useState, useRef, useEffect } from 'react';
import { generateImage, generateText } from '../lib/openai'; // Import generateText
import { Message } from '../types/chat';
import { useSettings } from './useSettings';
import { imageStorage } from '../lib/storage/imageStorage';

const imageGenerationTriggers = /(generate|create|draw|show|make).*(image|picture|artwork|illustration|photo)/i;
const writingTaskTriggers = /(write|create|generate|draft|make).*(blog|story|poem|article|notes|script|post|outline|summary|tweet|email)/i;

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { settings } = useSettings();
  const [imageGenerationProgress, setImageGenerationProgress] = useState<number[]>([0, 0, 0, 0]);
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([])

  const sendMessage = async (message: string, currentChat: Message[], userName?: string, instructions?: string): Promise<{ text: string; imageUrl?: string; imageUrls?: string[] }> => {
    let isImageHandled = false;

    try {
      setIsLoading(true);
      setIsGeneratingImage(false); // Reset image flag
      setImageGenerationProgress([0, 0, 0, 0]); // Reset progress
      setGeneratedImageUrls([]);

      // 3. Check for image generation request
      const isImageRequest = imageGenerationTriggers.test(message);
      if (isImageRequest) {
        isImageHandled = true;
        setIsGeneratingImage(true);

        try {
          let prompt = message.replace(imageGenerationTriggers, '').trim() || message;
          prompt = prompt.replace(/^(generate|create|draw|show|make)\s+(an?|the)?\s*(image|picture|artwork|illustration|photo)\s+(of|about|showing|depicting)\s+/i, '').trim();
          prompt = prompt.replace(/using\s+(dall-e|openai)/i, '').trim();
          prompt = prompt.replace(/\[.*?\]/g, '').trim();
          prompt = prompt.replace(/\{.*?\}/g, '').trim();
          prompt = prompt.replace(/\(.*?\)/g, '').trim();

          if (!prompt) {
             return { text: "Please provide a description for the image you want to generate." };
          }

          const urls = await generateImage(prompt);

          if (urls && urls.length > 0) {
            setGeneratedImageUrls(urls);

            return {
              text: "🖼️ Here's your generated image!",
              imageUrls: urls
            };
          } else {
             return {
              text: "Sorry, I couldn't generate an image this time.",
              imageUrl: undefined
            };
          }
        } catch (error: any) {
          console.error("[useChat] Image generation error:", error);
          let errorText = "I encountered an error while generating your image. Please try again.";
          if (error.message.includes('already being generated')) {
             errorText = "⏳ I'm already generating an image. Please wait for the current generation to complete before requesting another one.";
          } else if (error.message.includes('DALL-E Error:')) {
             errorText = `⚠️ ${error.message}`;
          } else if (error.message.includes('OpenAI API key is invalid')) {
            errorText = "⚠️ OpenAI API key issue. Please check your settings."; // More specific message
          }
          return { text: errorText };
        }
      }

      const response = await generateText(message, currentChat, userName, instructions);
      return response;

    } catch (error: any) {
      console.error('[useChat] Chat processing error:', error);
      if (error.message && error.message.includes('OpenAI API key is invalid')) {
        return { text: "⚠️ OpenAI API key issue. Please check your settings." }; // More specific message
      }
      return {
        text: "I apologize, but I encountered an error processing your request. Please try again later."
      };
    } finally {
      setIsLoading(false);
      if (isImageHandled) {
         setIsGeneratingImage(false);
      }
    }
  };

  return {
    isLoading,
    isGeneratingImage,
    sendMessage,
    imageGenerationProgress,
    generatedImageUrls
  };
};
