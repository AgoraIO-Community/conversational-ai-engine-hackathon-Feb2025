"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ClientVideoCall from "@/components/ClientVideoCall";

export default function DoctorPage() {
  const [sessionId, setSessionId] = useState("");
  const [patientUrl, setPatientUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(false);
  const [hasPatient, setHasPatient] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [showCall, setShowCall] = useState(false);

  const languages = [
    { value: "en-US", label: "English", voice: "en-US-EmmaMultilingualNeural" },
    { value: "es-ES", label: "Español", voice: "es-AR-ElenaNeural" },
    {
      value: "zh-CN",
      label: "中文",
      voice: "zh-CN-XiaoxiaoNeural",
    },
  ];

  const createNewSession = async () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    const patientJoinUrl = `${window.location.origin}/patient/${newSessionId}`;
    setPatientUrl(patientJoinUrl);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(patientUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
  };

  const handleStartSession = () => {
    const selectedLang = languages.find((l) => l.value === selectedLanguage);
    if (typeof window !== "undefined") {
      window.NEXT_PUBLIC_ASR_LANGUAGE = selectedLanguage;
      window.NEXT_PUBLIC_AZURE_TTS_VOICE = selectedLang.voice;
    }
    setShowCall(true);
  };

  const handleAiToggle = () => {
    if (!hasPatient) return;
    setAiAssistantEnabled(!aiAssistantEnabled);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Agora ConvoAI Demo - Telehealth Platform
          </h1>
          <p className="text-gray-400">
            Secure video consultations powered by Agora
          </p>
        </div>

        {!sessionId ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Create Session Card */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Start New Consultation
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Create a new session and invite your patient to join
                  </p>
                  <button
                    onClick={createNewSession}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
                  >
                    Create New Session
                  </button>
                </div>
              </div>
            </div>

            {/* Information Card */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Session Features
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-400 mt-0.5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">
                    High-quality video consultations
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-400 mt-0.5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Real-time diagnosis assistance
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-400 mt-0.5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Secure and private communications
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-400 mt-0.5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-300">Easy patient onboarding</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Session Setup */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div
                className={`p-6 ${showCall ? "border-b border-gray-700" : ""}`}
              >
                {!showCall ? (
                  <>
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Session Setup
                    </h2>

                    {/* Language Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Session Language
                      </label>
                      <div className="max-w-xs">
                        <select
                          value={selectedLanguage}
                          onChange={handleLanguageChange}
                          className="w-full px-4 py-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 hover:border-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                        >
                          {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Session Controls */}
                <div className="flex flex-col gap-4">
                  {!showCall ? (
                    // Start Session button before session starts
                    <div className="flex">
                      <button
                        onClick={handleStartSession}
                        className="min-w-[200px] w-[30%] bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Start Session
                      </button>
                    </div>
                  ) : (
                    // Patient Link and AI Toggle after session starts
                    <div className="flex items-center gap-4">
                      <div className="flex-grow">
                        <div className="flex flex-col">
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Share with Patient
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={patientUrl}
                              readOnly
                              className="w-full p-2.5 border rounded-lg bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={copyToClipboard}
                              title={copied ? "Copied!" : "Copy to clipboard"}
                              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                            >
                              {copied ? (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col shrink-0">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          AI Assistant
                        </label>
                        <button
                          onClick={handleAiToggle}
                          disabled={!hasPatient}
                          className={`h-[42px] px-4 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                            !hasPatient
                              ? "bg-gray-700 cursor-not-allowed opacity-50"
                              : aiAssistantEnabled
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-600 hover:bg-gray-700"
                          } text-white`}
                          title={!hasPatient ? "Wait for patient to join" : ""}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {!hasPatient
                            ? "Waiting for Patient"
                            : aiAssistantEnabled
                            ? "Turn Off AI Assistant"
                            : "Turn On AI Assistant"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Call Component */}
            {showCall && (
              <ClientVideoCall
                channelName={sessionId}
                isDoctor={true}
                aiAssistantEnabled={aiAssistantEnabled}
                onAiToggle={(hasPatient) => setHasPatient(hasPatient)}
                selectedLanguage={selectedLanguage}
                selectedVoice={
                  languages.find((l) => l.value === selectedLanguage).voice
                }
              />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <p className="text-gray-400 text-sm mb-2">Powered by</p>
          <img
            src="https://cdn.prod.website-files.com/660affa848e8af81bdd03909/66ab7f671fb90c022fb7f1dc_Agora%20Logo%20Crisp-p-500.png"
            alt="Agora Logo"
            className="h-8 opacity-75"
          />
        </div>
      </div>
    </div>
  );
}
