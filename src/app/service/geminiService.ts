import axios from "axios";
import axiosClient from "./axios";

export const callGeminiAPI = async (
  prompt: string,
  jsonSchema: object | null = null
) => {
  const apiKey = "";
  const model = "gemini-2.0-flash";
  const url = `${model}:generateContent?key=${apiKey}`;

  const payload: any = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  if (jsonSchema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: jsonSchema,
    };
  }

  try {
    const response = await axiosClient.post(url, payload);
    const data = response.data;

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content.parts[0].text
    ) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response structure from API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Re-throw a more specific error from the API if available
      throw new Error(
        `API request failed with status ${
          error.response.status
        }: ${JSON.stringify(error.response.data)}`
      );
    }
    // Re-throw the original error if it's not an Axios error
    throw error;
  }
};
