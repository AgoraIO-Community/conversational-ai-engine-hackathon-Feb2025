import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Agora ConvoAI Demo - Telehealth Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with healthcare professionals through secure video
            consultations and real-time diagnosis assistance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Doctor Card */}
          <a
            href="/doctor"
            className="group block bg-gray-800 rounded-xl shadow-lg hover:shadow-blue-500/10 hover:shadow-2xl transition-all p-8 border border-gray-700 hover:border-blue-500/50"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-900/70 transition-colors">
                <svg
                  className="w-10 h-10 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                I'm a Doctor
              </h2>
              <p className="text-gray-300 mb-4">
                Create a new consultation session and receive real-time
                diagnosis assistance.
              </p>
              <span className="inline-block text-blue-400 group-hover:text-blue-300 font-medium">
                Start Consulting →
              </span>
            </div>
          </a>

          {/* Patient Card */}
          <div className="block bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                I'm a Patient
              </h2>
              <p className="text-gray-300 mb-4">
                Use the link provided by your doctor to join the consultation
                session.
              </p>
              <span className="text-gray-400">
                Please use the link provided by your doctor
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-2 text-white">Create Session</h3>
              <p className="text-gray-400 text-sm">
                Doctor creates a new consultation session
              </p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-2 text-white">Share Link</h3>
              <p className="text-gray-400 text-sm">
                Share the generated link with your patient
              </p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-2 text-white">
                Start Consultation
              </h3>
              <p className="text-gray-400 text-sm">
                Begin the video consultation with real-time diagnosis
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col items-center justify-center">
          <p className="text-gray-400 text-sm mb-2">Powered by</p>
          <img
            src="https://cdn.prod.website-files.com/660affa848e8af81bdd03909/66ab7f671fb90c022fb7f1dc_Agora%20Logo%20Crisp-p-500.png"
            alt="Agora Logo"
            className="h-8 opacity-75"
          />
        </div>
      </div>
    </main>
  );
}
