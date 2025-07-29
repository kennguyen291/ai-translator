import { GoogleGenAI } from "@google/genai";
import { execa } from "execa";
import { createReadStream, unlink } from "fs-extra";
import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables.");
}
const ai = new GoogleGenAI({ apiKey });

//  Helper to convert stream to base64 buffer
async function streamToBase64(
  filePath: string
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      }
    });
    stream.on("error", reject);
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve({ base64: buffer.toString("base64"), mimeType: "audio/mpeg" });
    });
  });
}

export async function POST(req: NextRequest) {
  const tempFile = path.join(tmpdir(), `${uuidv4()}.mp3`);

  try {
    const { youtubeUrl } = await req.json();

    if (
      !youtubeUrl ||
      !(
        youtubeUrl.includes("youtube.com") ||
        youtubeUrl.includes("https://www.youtube.com/watch?v=P7yM0TKvUm4&t=3s")
      )
    ) {
      return NextResponse.json(
        { error: "Invalid or missing YouTube URL" },
        { status: 400 }
      );
    }

    console.log("Downloading audio with yt-dlp to:", tempFile);

    // 1. Get the paths to the binaries.

    const ytDlpPath = "yt-dlp";

    // 2. Define the command-line arguments.
    const args = [
      youtubeUrl,
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--output",
      tempFile,
      "--quiet",
    ];

    // 3. Execute the command.
    await execa(ytDlpPath, args);

    const { base64, mimeType } = await streamToBase64(tempFile);
    const audioPart = { inlineData: { data: base64, mimeType } };
    const prompt = "Provide a detailed, accurate transcription of this audio.";

    console.log("Sending audio to Gemini API...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }, audioPart] }],
    });

    const transcription = response.text;
    if (!transcription) {
      return NextResponse.json(
        { error: "Failed to transcribe audio." },
        { status: 500 }
      );
    }
    return NextResponse.json({ transcription });
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json(
      {
        error:
          "Server error: " +
          (error instanceof Error ? error.message : "Unknown"),
      },
      { status: 500 }
    );
  } finally {
    unlink(tempFile).catch((err) => {
      console.error("Failed to delete temporary file:", tempFile, err);
    });
  }
}
