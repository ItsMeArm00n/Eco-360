'use server';

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function getGeminiInsight(weatherData: any) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }

  const prompt = `
    Based on the following weather data, provide eco-friendly advice in a strictly JSON format.
    Weather Data: ${JSON.stringify(weatherData)}

    JSON Structure:
    {
      "summary": "Plain-language explanation of today’s conditions (max 50 words)",
      "recommended": ["Action 1", "Action 2", "Action 3"],
      "avoid": ["Anti-Action 1", "Anti-Action 2", "Anti-Action 3"],
      "history": "Short insight based on past weather & AQI patterns (max 50 words)"
    }
    
    Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
  `;

  try {
    // Using the clean string syntax for the new SDK
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt, // Simple string input as per user sample
    });

    const text = response.text; // Property access as per user sample
    
    // Fallback if text is a function (just in case SDK version varies)
    const finalContent = typeof text === 'function' ? (text as any)() : text;

    if (!finalContent) throw new Error('No text in response');
    
    // Clean up potential markdown code blocks
    const cleanText = finalContent.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error getting Gemini insight:', error);
    return null;
  }
}

export async function chatWithGemini(userMessage: string, context: { weather: any, insight: any, history: any[] }) {
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');

    const systemPrompt = `
        You are an Eco AI Assistant.
        Current Weather Context: ${JSON.stringify(context.weather || {})}
        Daily Insight Context: ${JSON.stringify(context.insight || {})}
        
        Answer the user's question about sustainability, energy usage, or the environment.
        Keep answers concise and helpful.
    `;

    // Convert history to Gemini format (user/model roles)
    // The new SDK expects 'user' and 'model' roles in 'contents'
    const history = context.history.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    try {
        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                ...history,
                { role: 'user', parts: [{ text: userMessage }] }
            ]
        });

        const text = response.text;
        return typeof text === 'function' ? (text as any)() : text;
    } catch (error) {
        console.error("Chat Error:", error);
        return "I'm having trouble connecting to the eco-network right now. Please try again later.";
    }
}
