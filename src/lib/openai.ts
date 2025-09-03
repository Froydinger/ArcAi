import OpenAI from 'openai';
import { MENTAL_WELLNESS_PROMPT } from './prompts'; // Import MENTAL_WELLNESS_PROMPT

let isGenerating = false;

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API || '';

export const generateImage = async (prompt: string): Promise<string[]> => {
  if (isGenerating) {
    throw new Error('An image is already being generated');
  }

  try {
    isGenerating = true;

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    const enhancedPrompt = `Create an image: ${prompt}`;

    const response = await openai.images.generate({
     model: "dall-e-3",
     prompt: enhancedPrompt,
     n: 1,
     size: "1024x1024"
    });

    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      throw new Error('Invalid response format from OpenAI');
    }

    const urls = response.data
      .map(image => image.url)
      .filter((url): url is string => typeof url === 'string');

    if (urls.length === 0) {
      throw new Error('No valid image URLs in response');
    }

    return urls;
  } catch (error: any) {
    console.error('DALL-E API error:', error.message);
    if (error.response && error.response.data && error.response.data.error) {
       throw new Error(`DALL-E Error: ${error.response.data.error.message}`);
    }
    throw new Error('Failed to generate image. Please try again.');
  } finally {
    isGenerating = false;
  }
};

export const generateText = async (prompt: string, history: { text: string; isBot: boolean; }[], userName: string, instructions?: string): Promise<{ text: string; imageUrl?: string | undefined; imageUrls?: string[] | undefined; }> => {
  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    // --- UPDATED: Include instruction to avoid large titles ---
    const systemContext = `${MENTAL_WELLNESS_PROMPT}
    If the user provides a name, use it in your responses. If the user provides custom instructions, follow them carefully. Avoid using large titles in your responses unless generating a blog post or article. User's Name: ${userName || 'User'}. Custom Instructions: ${instructions || ''}`;

    const messages = [
      { role: "system", content: systemContext },
      ...history.map(msg => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.text
      })),
      { role: "user", content: prompt }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: messages as any,
      temperature: 0.7,
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    // Check if the prompt was for image generation
    if (prompt.toLowerCase().startsWith("generate an image of")) {
      try {
        const actualPrompt = prompt.substring(19).trim();
        const imageUrls = await generateImage(actualPrompt);
        return { text: 'Here are your images:', imageUrls: imageUrls };
      } catch (imageError: any) {
        console.error("Image generation failed:", imageError);
        return { text: `Image generation failed: ${imageError.message}` };
      }
    }

    return { text: completion.choices[0].message.content || '' };
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(`OpenAI Error: ${error.response.data.error.message}`);
    }
    throw new Error('Failed to generate text. Please try again.');
  }
};
