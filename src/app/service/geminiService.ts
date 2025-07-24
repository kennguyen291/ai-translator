import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "API key not found. Please set REACT_APP_GEMINI_API_KEY in your .env file."
  );
}
const ai = new GoogleGenAI({ apiKey });

export const callGeminiAPI = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    if (!response || !response.text) {
      throw new Error("No response text received from Gemini API.");
    }
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // The client library often provides more detailed error messages.
    throw new Error("Failed to get a response from the Gemini API.");
  }
};
