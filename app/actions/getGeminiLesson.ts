'use server';

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function getGeminiLesson(weatherContext?: any, location?: string) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not defined');
    return null;
  }

  const contextPrompt = weatherContext 
    ? `Current context: weather is ${JSON.stringify(weatherContext)} in ${location || 'user location'}.` 
    : 'Context: General sustainability topic.';

  const prompt = `
    Create a short, verified, and engaging 60-second micro-lesson about sustainability.
    ${contextPrompt}
    The lesson should be fun, interactive, and visually descriptive.

    Provide the response in strict JSON format with the following structure:
    {
      "id": "lesson_${Date.now()}",
      "title": "Catchy Title",
      "subtitle": "Short intriguing subtitle",
      "image_keywords": ["specific visual keyword 1", "specific visual keyword 2"],
      "content": {
        "intro": "Hook paragraph (2-3 sentences)",
        "fact": "A surprising 'Did you know?' fact",
        "action": "One simple actionable step the user can take today"
      },
      "quiz": {
        "question": "A fun multiple choice question related to the lesson",
        "options": ["Option A", "Option B", "Option C"],
        "correctIndex": 0,
        "explanation": "Why this is the correct answer"
      }
    }

    IMPORTANT: 
    1. "image_keywords" will be used to search for REAL photos. Use broad, common nouns (e.g. "ocean", "forest", "city", "bicycle", "solar panel"). Avoid abstract concepts.
    2. Do not include markdown formatting (like \`\`\`json). Return raw JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const text = response.text;
    const cleanText = (typeof text === 'function' ? (text as any)() : text)
        ?.replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    if (!cleanText) throw new Error('Empty response from model');

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error getting Gemini lesson:', error);
    // Fallback lesson if AI fails
    return {
        id: "fallback",
        title: "The Power of Cold Water",
        subtitle: "Saving energy one wash at a time",
        image_keywords: ["washing machine", "cold water splash"],
        content: {
            intro: "Did you know 90% of the energy used by a washing machine goes just to heating the water?",
            fact: "Switching to cold water saves huge amounts of energy and preserves your clothes' colors for longer.",
            action: "Set your next laundry cycle to 'Cold' or 30°C."
        },
        quiz: {
            question: "How much washing machine energy is used for heating water?",
            options: ["10%", "50%", "90%"],
            correctIndex: 2,
            explanation: "Heating water is the most energy-intensive part of laundry!"
        }
    };
  }
}
