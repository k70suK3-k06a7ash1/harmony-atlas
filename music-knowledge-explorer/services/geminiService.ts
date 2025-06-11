
// This file MOCKS the @google/genai library for frontend demonstration purposes.
// It does not make actual API calls.

console.log('[MockGeminiService] Module execution started.'); // Diagnostic log

import { GEMINI_TEXT_MODEL } from '../constants.tsx';
import { GroundingChunk, MockGenerateContentResponse } from '../types.ts';

// Simulate the GoogleGenAI class and its structure
// In a real scenario: import { GoogleGenAI, GenerateContentResponse, Content, Part } from "@google/genai";
// For this mock, we'll define a simpler structure that mimics the part of the API we use.

interface MockGenerateContentParams {
  model: string;
  contents: any; // Simplified: can be string or { parts: any[] } for multi-turn
  config?: {
    systemInstruction?: string;
    tools?: any[]; // Simplified
    thinkingConfig?: { thinkingBudget: number };
  };
}

interface MockChat {
  sendMessage: (params: { message: string }) => Promise<MockGenerateContentResponse>;
  sendMessageStream: (params: { message: string }) => Promise<AsyncIterable<MockGenerateContentResponse>>;
}

// Safely attempt to get API_KEY, being mindful of browser environment
let apiKeyFromEnv: string | undefined = undefined;
try {
  if (typeof process !== 'undefined' && process.env) {
    apiKeyFromEnv = process.env.API_KEY;
  }
} catch (e) {
  // console.warn("Could not access process.env.API_KEY. This is expected in some browser environments for the mock service.");
}


class MockGoogleGenAI {
  public models: {
    generateContent: (params: MockGenerateContentParams) => Promise<MockGenerateContentResponse>;
    // generateImages: ... (if needed)
  };
  public chats: {
    create: (params: { model: string; config?: any }) => MockChat;
  };

  constructor(config: { apiKey?: string }) {
    // console.log("MockGoogleGenAI initialized. API key (if provided):", config?.apiKey ? "Exists" : "Not provided");

    this.models = {
      generateContent: async (params: MockGenerateContentParams): Promise<MockGenerateContentResponse> => {
        // console.log("Mocked ai.models.generateContent called with:", params);
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500)); // Simulate network delay

        let responseText = "This is a generic mock AI response.";
        const groundingChunks: GroundingChunk[] = [];

        if (typeof params.contents === 'string') {
          const prompt = params.contents.toLowerCase();
          if (prompt.startsWith("describe song:")) {
            const songInfo = prompt.replace("describe song:", "").trim();
            responseText = `This is a mock AI description for the song: ${songInfo}. It likely features intricate melodies and a captivating rhythm, perfectly embodying its genre. The instrumentation might include [mock instrument 1] and [mock instrument 2], creating a unique soundscape. Its mood is often described as [mock mood].`;
          } else if (prompt.startsWith("suggest reason:")) {
            const reasonInfo = prompt.replace("suggest reason:", "").trim();
            responseText = `This song, ${reasonInfo}, is recommended because it aligns with your interest in music that is both thought-provoking and sonically rich. Its theoretical underpinnings showcase a masterful use of [mock music theory concept].`;
          } else if (prompt.startsWith("interpret query:")) {
            const query = prompt.replace("interpret query:", "").trim();
            responseText = `Interpreted query: '${query}'. The system understands you are looking for songs with characteristics such as [mock characteristic 1] and [mock characteristic 2].`;
            if (query.includes("recent news") || query.includes("olympics 2024")) {
                 groundingChunks.push(
                    { web: { uri: "https://mock-olympics-news.com/results", title: "Mock Olympics 2024 Results" } },
                    { web: { uri: "https://mock-sports-analysis.com/paris2024", title: "Analysis of Paris 2024 Medalists" } }
                );
            }
          } else if (params.config?.tools?.some(tool => tool.googleSearch)) {
            responseText = `Based on a mock Google Search for '${params.contents}', here's some information: [mock search result snippet].`;
            groundingChunks.push(
                { web: { uri: "https://mock-search-result1.com", title: "Mock Search Result 1" } },
                { web: { uri: "https://mock-search-result2.com/page", title: "Detailed Mock Info Page 2" } }
            );
          }
        }
        
        const response: MockGenerateContentResponse = { text: responseText };
        if (groundingChunks.length > 0) {
            response.candidates = [{ groundingMetadata: { groundingChunks } }];
        }
        return response;
      },
    };

    this.chats = {
        create: (chatCreateParams): MockChat => {
            // console.log("Mocked ai.chats.create called with:", chatCreateParams);
            return {
                sendMessage: async (sendMessageParams): Promise<MockGenerateContentResponse> => {
                    // console.log("Mocked chat.sendMessage:", sendMessageParams.message);
                    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
                    return { text: `Mock chat reply to "${sendMessageParams.message}". System instruction was: "${chatCreateParams.config?.systemInstruction || 'None'}"` };
                },
                sendMessageStream: async (sendMessageParams: { message: string }): Promise<AsyncIterable<MockGenerateContentResponse>> => {
                    const systemInstruction = chatCreateParams.config?.systemInstruction || 'None';
                    // This async generator function will be returned as the resolution of the promise from sendMessageStream
                    async function* generator(): AsyncIterable<MockGenerateContentResponse> {
                        // console.log("Mocked chat.sendMessageStream (inside generator):", sendMessageParams.message);
                        const fullResponse = `Mock streamed chat reply to "${sendMessageParams.message}". System instruction: "${systemInstruction}"`;
                        const words = fullResponse.split(" ");
                        for (const word of words) {
                            await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
                            yield { text: word + " " };
                        }
                    }
                    // console.log("Mocked chat.sendMessageStream (outer async fn about to return generator):", sendMessageParams.message);
                    return generator(); // Return the AsyncIterable
                }
            };
        }
    };
  }
}

// Assign our mock to a variable that has the same name as the real one.
// This allows the rest of the code to use 'new GoogleGenAI(...)' as if it's the real thing.
const GoogleGenAI = MockGoogleGenAI;

let aiInstance: MockGoogleGenAI | null = null;

const getAiInstance = (): MockGoogleGenAI => {
  if (!aiInstance) {
    // The API key is typically from process.env.API_KEY.
    // Our mock doesn't strictly need it, but we pass the retrieved (possibly undefined) apiKeyFromEnv.
    aiInstance = new GoogleGenAI({ apiKey: apiKeyFromEnv });
  }
  return aiInstance;
};

export const generateTextFromGemini = async (prompt: string, useGoogleSearch: boolean = false): Promise<MockGenerateContentResponse> => {
  console.log('[MockGeminiService] generateTextFromGemini called.'); 
  const ai = getAiInstance();
  try {
    const config: Partial<MockGenerateContentParams['config']> = {};
    if (useGoogleSearch) {
        config.tools = [{googleSearch: {}}];
    }

    // Thinking config example (only for gemini-2.5-flash-preview-04-17)
    // if (GEMINI_TEXT_MODEL === "gemini-2.5-flash-preview-04-17" && some_condition_for_low_latency) {
    //   config.thinkingConfig = { thinkingBudget: 0 };
    // }

    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: config
    });
    return response; // response object includes { text: "...", candidates?: ... }
  } catch (error) {
    console.error("Error generating text (mocked Gemini service):", error);
    return { text: "Error: Could not generate text content." };
  }
};

export const interpretQueryWithGemini = async (naturalLanguageQuery: string): Promise<MockGenerateContentResponse> => {
  console.log('[MockGeminiService] interpretQueryWithGemini called.');
  return generateTextFromGemini(`Interpret query: ${naturalLanguageQuery}`);
};

export const generateSongDescriptionWithGemini = async (songTitle: string, artistName: string): Promise<MockGenerateContentResponse> => {
  console.log('[MockGeminiService] generateSongDescriptionWithGemini called.');
  return generateTextFromGemini(`Describe song: ${songTitle} by ${artistName}. Focus on musical elements, mood, and instrumentation.`);
};

export const generateRecommendationReasonWithGemini = async (songTitle: string, queryContext: string): Promise<MockGenerateContentResponse> => {
  console.log('[MockGeminiService] generateRecommendationReasonWithGemini called.');
  return generateTextFromGemini(`Suggest reason: ${songTitle} based on this context: ${queryContext}?`);
};


// Example chat usage (mocked)
let mockChatInstance: MockChat | null = null;

export const startOrGetChat = () : MockChat => {
    console.log('[MockGeminiService] startOrGetChat called.');
    if (!mockChatInstance) {
        const ai = getAiInstance();
        mockChatInstance = ai.chats.create({
            model: GEMINI_TEXT_MODEL,
            config: {
                systemInstruction: "You are a helpful music expert. Provide concise and informative answers."
            }
        });
    }
    return mockChatInstance;
}

export const sendChatMessage = async (message: string): Promise<MockGenerateContentResponse> => {
    console.log('[MockGeminiService] sendChatMessage called.');
    const chat = startOrGetChat();
    return chat.sendMessage({message});
}

export const sendChatMessageStream = async (message: string): Promise<AsyncIterable<MockGenerateContentResponse>> => {
    console.log('[MockGeminiService] sendChatMessageStream called.');
    const chat = startOrGetChat();
    // When calling chat.sendMessageStream, it now correctly returns Promise<AsyncIterable<...>>
    // and we await that promise here to get the AsyncIterable for the loop.
    const stream = await chat.sendMessageStream({message}); 
    return stream; 
}

console.log('[MockGeminiService] Module execution completed.'); // Diagnostic log
