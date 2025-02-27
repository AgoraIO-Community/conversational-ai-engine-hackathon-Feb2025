"use client";

import { use } from "react";
import ClientVideoCall from "@/components/ClientVideoCall";

export default function PatientPage({ params }) {
  const resolvedParams = use(params);
  const { sessionId } = resolvedParams;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Agora ConvoAI Demo - Telehealth Platform
          </h1>
          <p className="text-gray-400">
            Your secure telemedicine session is ready
          </p>
        </div>

        <ClientVideoCall channelName={sessionId} isDoctor={false} />

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
