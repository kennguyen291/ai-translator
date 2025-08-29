"use client"; // This is crucial for Next.js to treat this as an interactive client-side component

import React, { FC, useState } from "react";
import axiosClient from "./service/axios";
import { ApiConstants } from "./utils/ApiConstants";
import Icon from "./components/Icon";
import Spinner from "./components/Spinner";
import axios from "axios";

export default function Page() {

  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [englishTranscription, setEnglishTranscription] = useState<string>("");
  const [vietnameseTranslation, setVietnameseTranslation] =
    useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);

  const handleProcessVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) {
      setError("Please paste a YouTube URL to begin.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasProcessed(true);
    setEnglishTranscription("");
    setVietnameseTranslation("");

    try {
      // Extract: YouTube URL -> MP3 in S3 
      const extractResp = await axiosClient.get(ApiConstants.AUDIO_EXTRACT, {
        params: { url: youtubeUrl },
      });
    
      const { audio_url } = extractResp.data || {};
      if (!audio_url) {
        throw new Error("Unexpected extract response. Missing audio URL.");
      }

      // 2) Transcribe
      const transcribeResp = await axios.get(ApiConstants.AI_TRANSCRIPTION, {
        params: { audio_url},
      });
      
      const d = transcribeResp.data || {};
      const transcription =
        d.transcription ?? d.englishTranscription ?? d.english ?? "";
      const translation =
        d.translation ?? d.vietnameseTranslation ?? d.vietnamese ?? "";

      if (!transcription) {
        throw new Error("Received an empty transcription from the server.");
      }
      if (!translation) {
        // not fatal — set what we have; you can choose to throw instead
        console.warn("Lambda 2 did not return a Vietnamese translation.");
      }

      setEnglishTranscription(transcription);
      setVietnameseTranslation(translation || "");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-slate-900 text-white min-h-screen font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
            AI Video Translator
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            Paste a YouTube link, get a translation, and explore the content
            with AI.
          </p>
        </header>

        <form onSubmit={handleProcessVideo} className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Icon
                  path="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m1.5-1.5L13.19 8.688m-1.5-1.5L10.44 6.25m-1.757-1.757a4.5 4.5 0 0 1 6.364 6.364l-4.5 4.5m-1.5 1.5L8.688 13.19"
                  className="w-5 h-5"
                />
              </span>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pr-4 pl-12 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg px-6 py-3 font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Icon
                    path="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M2.25 12a8.954 8.954 0 0 0 0 11.908c.44.439 1.152.439 1.591 0L12 15.955m9.75-3.955a8.954 8.954 0 0 1 0-11.908c-.44-.439-1.152-.439-1.591 0L12 8.045"
                    className="w-5 h-5"
                  />
                  <span>Translate</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 p-4 rounded-lg my-6 text-center flex items-center justify-center gap-3 max-w-4xl mx-auto">
            <Icon
              path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              className="w-6 h-6"
            />
            <strong>Error:</strong> {error}
          </div>
        )}

        {hasProcessed && (
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Left Column: Transcription and AI Tools */}
            <div className="bg-slate-800/70 rounded-xl p-6 shadow-lg flex flex-col">
              <h2 className="text-xl font-semibold mb-4 text-slate-300">
                Original Transcription (English)
              </h2>
              <div className="h-60 overflow-y-auto pr-2 text-slate-300 leading-relaxed space-y-4 mb-6">
                {isLoading ? (
                  <div className="text-slate-400">
                    Generating transcription...
                  </div>
                ) : (
                  <p>{englishTranscription || "No transcription available."}</p>
                )}
              </div>
            </div>

            {/* Right Column: Translation */}
            <div className="bg-slate-800/70 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-slate-300">
                Translation (Vietnamese)
              </h2>
              <div className="h-full overflow-y-auto pr-2 text-slate-300 leading-relaxed space-y-4">
                {isLoading ? (
                  <div className="text-slate-400">Đang tạo bản dịch...</div>
                ) : (
                  <p>{vietnameseTranslation}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
