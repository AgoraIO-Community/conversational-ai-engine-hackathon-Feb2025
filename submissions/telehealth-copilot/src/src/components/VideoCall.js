"use client";

import { useEffect, useState, useRef } from "react";
import { agoraConfig } from "@/config/agoraConfig";
import DiagnosisGraph from "./DiagnosisGraph";

const useAgoraClient = (
  channelName,
  isDoctor,
  aiAssistantEnabled,
  selectedLanguage,
  selectedVoice
) => {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState(null);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasRemoteUser, setHasRemoteUser] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [aiTranscript, setAiTranscript] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isJoiningAI, setIsJoiningAI] = useState(false);
  const [agentId, setAgentId] = useState(null);
  const [patientUid, setPatientUid] = useState(null);

  const clientRef = useRef(null);
  const mountedRef = useRef(true);
  const initializingRef = useRef(false);
  const localTracksRef = useRef([]);
  let messageBuffer = [];
  const messagesMap = new Map();

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run on server side

    mountedRef.current = true;
    console.log("Starting mount with state:", {
      hasClient: !!clientRef.current,
      isInitializing: initializingRef.current,
      isMounted: mountedRef.current,
    });

    const init = async () => {
      if (initializingRef.current || clientRef.current || !mountedRef.current) {
        console.log(
          "Skipping initialization - already in progress or completed"
        );
        return;
      }

      initializingRef.current = true;
      console.log("Starting initialization...");

      try {
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;

        if (!mountedRef.current) {
          console.log("Component unmounted during AgoraRTC import");
          return;
        }

        if (clientRef.current) {
          console.log("Client already exists, skipping creation");
          return;
        }

        console.log("Creating Agora client...");
        const client = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });
        clientRef.current = client;

        // Set up event handlers
        client.on("user-published", async (user, mediaType) => {
          console.log("User published event received:", {
            user,
            mediaType,
          });
          if (!mountedRef.current) return;

          console.log(`Remote user ${user.uid} published ${mediaType} stream`);

          // Skip subscribing to AI assistant's audio/video streams
          if (user.uid === parseInt(agoraConfig.aiAssistantUid)) {
            console.log("Skipping subscription to AI assistant media stream");
            return;
          }

          // If this is the doctor, store the patient's UID
          if (isDoctor && !patientUid) {
            setPatientUid(user.uid);
          }

          try {
            // Subscribe to the remote user
            await client.subscribe(user, mediaType);
            console.log(
              `Subscribed to ${user.uid}'s ${mediaType} stream successfully`
            );

            if (mediaType === "video") {
              console.log("Setting remote video track...");
              const videoTrack = user.videoTrack;
              console.log("Remote video track details:", {
                enabled: videoTrack.enabled,
                muted: videoTrack.muted,
                state: videoTrack.state,
              });
              setRemoteVideoTrack(() => videoTrack);
              setHasRemoteUser(true);
            }
            if (mediaType === "audio") {
              console.log("Playing remote audio...");
              user.audioTrack?.play();
              setHasRemoteUser(true);
            }
          } catch (err) {
            console.error("Subscribe error:", err);
            if (!mountedRef.current) return;

            // Try to resubscribe after a short delay
            setTimeout(async () => {
              if (!mountedRef.current) return;
              try {
                await client.subscribe(user, mediaType);
                console.log(
                  `Resubscribed to ${user.uid}'s ${mediaType} stream`
                );

                if (mediaType === "video") {
                  console.log(
                    "Setting remote video track after resubscribe..."
                  );
                  const videoTrack = user.videoTrack;
                  console.log("Remote video track details after resubscribe:", {
                    enabled: videoTrack.enabled,
                    muted: videoTrack.muted,
                    state: videoTrack.state,
                  });
                  setRemoteVideoTrack(videoTrack);
                  setHasRemoteUser(true);
                }
                if (mediaType === "audio") {
                  console.log("Playing remote audio after resubscribe...");
                  user.audioTrack?.play();
                }
              } catch (retryErr) {
                console.error("Resubscribe error:", retryErr);
              }
            }, 2000);
          }
        });

        // Add stream-message handler for AI assistant messages
        // If user is doctor, attach stream-message handler to process messages
        if (isDoctor) {
          client.on("stream-message", (user, data) => {
            // Only process messages from AI assistant
            if (user === parseInt(agoraConfig.aiAssistantUid)) {
              try {
                let [messageId, messagePart, messageChunks, messageData] =
                  new TextDecoder().decode(data).split("|");
                messageData = atob(messageData);

                messagesMap.set(
                  messageId,
                  messagesMap.get(messageId)
                    ? messagesMap.get(messageId) + messageData
                    : messageData
                );

                messageData = messagesMap.get(messageId);
                if (parseInt(messagePart) === parseInt(messageChunks))
                  messagesMap.delete(messageId);
                else return;

                const messageDataJson = JSON.parse(messageData);

                if (messageDataJson.user_id) return; // Ignore messages as it's not from the assistant (user transcript)
                if (!messageDataJson?.is_final) return;
                console.log(new TextDecoder().decode(data));
                console.log(messageDataJson);
                // console.log(
                //   "Decoded AI assistant message JSON:",
                //   messageDataJson,
                // );
                const jsonData = JSON.parse(messageDataJson.text);

                console.log("Decoded AI assistant message JSON:", jsonData);

                // Update the transcript and suggestions based on the message content
                if (jsonData.summary) {
                  setAiTranscript(jsonData.summary);
                  // setAiTranscript(jsonData.summary.join("\n"));
                }

                if (jsonData.possible_conditions) {
                  const suggestions = jsonData.possible_conditions.map(
                    (condition) =>
                      `${condition.condition}: ${condition.percentage}% likelihood`
                  );
                  setAiSuggestions(suggestions);
                }

                if (jsonData.follow_up_question) {
                  setFollowUpQuestion(jsonData.follow_up_question);
                }
              } catch (error) {
                console.log("Error processing AI assistant message:", error);
                // console.error("Error processing AI assistant message:", error);
                // If not JSON
                // try {
                //   const rawMessage = new TextDecoder().decode(data);
                //   setAiTranscript(rawMessage);
                // } catch (e) {
                //   console.error("Failed to decode message as text:", e);
                // }
              }
            }
          });
        }

        client.on("user-unpublished", (user, mediaType) => {
          if (!mountedRef.current) return;
          console.log(
            `Remote user ${user.uid} unpublished ${mediaType} stream`
          );
          if (user.uid === parseInt(agoraConfig.aiAssistantUid)) {
            console.log("Skipping unsubscription to AI assistant media stream");
            return;
          }
          if (mediaType === "video") {
            console.log("Clearing remote video track...");
            if (remoteVideoTrack) {
              remoteVideoTrack.stop();
            }
            setRemoteVideoTrack(null);
            setHasRemoteUser(false);
          }
        });

        client.on("user-left", (user) => {
          if (!mountedRef.current) return;
          if (user.uid === parseInt(agoraConfig.aiAssistantUid)) {
            // AI assistant left the channel, so we don't need to stop the video track
            return;
          }
          console.log(`Remote user ${user.uid} left the channel`);

          // If patient left, clear their UID and leave AI agent
          if (isDoctor && user.uid === patientUid) {
            setPatientUid(null);
            if (agentId) {
              leaveAIAgent();
            }
          }

          if (remoteVideoTrack) {
            console.log("Stopping remote video track on user left...");
            remoteVideoTrack.stop();
          }
          setRemoteVideoTrack(null);
          setHasRemoteUser(false);
        });

        // Join channel
        console.log("Joining channel:", channelName);
        const uid = await client.join(
          agoraConfig.appId,
          channelName,
          null,
          null
        );
        console.log("Joined channel successfully as:", uid);

        if (!mountedRef.current) {
          console.log("Component unmounted after joining");
          await client.leave();
          clientRef.current = null;
          return;
        }

        // Create tracks
        console.log("Creating local tracks...");
        const [videoTrack, audioTrack] = await Promise.all([
          AgoraRTC.createCameraVideoTrack({ encoderConfig: "720p" }),
          AgoraRTC.createMicrophoneAudioTrack(),
        ]);
        console.log("Local tracks created");

        if (!mountedRef.current) {
          console.log("Component unmounted after track creation");
          videoTrack.close();
          audioTrack.close();
          await client.leave();
          clientRef.current = null;
          return;
        }

        localTracksRef.current = [videoTrack, audioTrack];
        setLocalVideoTrack(videoTrack);

        // Publish tracks
        console.log("Publishing tracks...");
        await client.publish([videoTrack, audioTrack]);
        console.log("Tracks published successfully");

        setIsInitialized(true);
      } catch (err) {
        console.error("Agora initialization error:", err);
        if (mountedRef.current) {
          setError(err.message);
        }
      } finally {
        initializingRef.current = false;
      }
    };

    init().catch(console.error);

    return () => {
      console.log("Cleanup starting...");
      mountedRef.current = false;

      const cleanup = async () => {
        try {
          // Clean up tracks
          localTracksRef.current.forEach((track) => {
            if (track) {
              console.log("Stopping and closing track");
              track.stop();
              track.close();
            }
          });
          localTracksRef.current = [];

          // Clean up client
          if (clientRef.current) {
            console.log("Cleaning up client...");
            clientRef.current.removeAllListeners();
            await clientRef.current.leave();
            clientRef.current = null;
          }
        } catch (err) {
          console.error("Cleanup error:", err);
        }
      };

      cleanup().catch(console.error);
      initializingRef.current = false;
      console.log("Cleanup completed");
    };
  }, [channelName, isDoctor, isClient, selectedLanguage, selectedVoice]); // Only run when isClient becomes true

  // Effect to handle AI Assistant
  useEffect(() => {
    if (!isDoctor || !isInitialized) return;

    const joinAIAgent = async () => {
      // Don't join if there's no patient
      if (!patientUid) {
        console.log("Cannot join AI agent - no patient present");
        return;
      }

      setIsJoiningAI(true);
      try {
        const response = await fetch("/api/ai-assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "join",
            channelName,
            patientUid,
            selectedLanguage: selectedLanguage || agoraConfig.asrLanguage,
            selectedVoice: selectedVoice || agoraConfig.azureTtsVoice,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to join AI agent to call"
          );
        }

        const data = await response.json();
        console.log("AI agent joined successfully:", data);
        setAgentId(data.agent_id);
      } catch (error) {
        console.error("Error joining AI agent:", error);
        setError("Failed to initialize AI assistant. Please try again.");
      } finally {
        setIsJoiningAI(false);
      }
    };

    const leaveAIAgent = async () => {
      if (!agentId) return;

      setIsJoiningAI(true);
      try {
        const response = await fetch("/api/ai-assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "leave",
            agentId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to remove AI agent from call"
          );
        }

        setAgentId(null);
        setAiTranscript("");
        setAiSuggestions([]);
        setFollowUpQuestion("");
      } catch (error) {
        console.error("Error removing AI agent:", error);
        setError("Failed to remove AI assistant. Please try again.");
      } finally {
        setIsJoiningAI(false);
      }
    };

    if (aiAssistantEnabled && !agentId && patientUid) {
      joinAIAgent();
    } else if ((!aiAssistantEnabled || !patientUid) && agentId) {
      leaveAIAgent();
    }
  }, [
    isDoctor,
    aiAssistantEnabled,
    channelName,
    isInitialized,
    patientUid,
    selectedLanguage,
    selectedVoice,
  ]);

  const toggleVideo = async () => {
    if (localTracksRef.current[0]) {
      if (isVideoMuted) {
        await localTracksRef.current[0].setEnabled(true);
      } else {
        await localTracksRef.current[0].setEnabled(false);
      }
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const toggleAudio = async () => {
    if (localTracksRef.current[1]) {
      if (isAudioMuted) {
        await localTracksRef.current[1].setEnabled(true);
      } else {
        await localTracksRef.current[1].setEnabled(false);
      }
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const initiateLeaveCall = () => {
    setShowConfirmation(true);
  };

  const confirmLeaveCall = async () => {
    setShowConfirmation(false);
    setIsLeaving(true);
    try {
      // Clean up tracks
      localTracksRef.current.forEach((track) => {
        if (track) {
          track.stop();
          track.close();
        }
      });
      localTracksRef.current = [];

      // Leave the channel
      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }

      // Redirect to home page
      window.location.href = "/";
    } catch (err) {
      console.error("Error leaving call:", err);
    }
  };

  const cancelLeaveCall = () => {
    setShowConfirmation(false);
  };

  return {
    localVideoTrack,
    remoteVideoTrack,
    error,
    isInitialized,
    hasRemoteUser,
    isVideoMuted,
    isAudioMuted,
    toggleVideo,
    toggleAudio,
    aiTranscript,
    aiSuggestions,
    followUpQuestion,
    initiateLeaveCall,
    confirmLeaveCall,
    cancelLeaveCall,
    isLeaving,
    showConfirmation,
    isJoiningAI,
    hasRemoteUser,
  };
};

const VideoCall = ({
  channelName,
  isDoctor,
  aiAssistantEnabled,
  onAiToggle,
  selectedLanguage,
  selectedVoice,
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const {
    localVideoTrack,
    remoteVideoTrack,
    error,
    isInitialized,
    hasRemoteUser,
    isVideoMuted,
    isAudioMuted,
    toggleVideo,
    toggleAudio,
    aiTranscript,
    aiSuggestions,
    followUpQuestion,
    initiateLeaveCall,
    confirmLeaveCall,
    cancelLeaveCall,
    isLeaving,
    showConfirmation,
    isJoiningAI,
  } = useAgoraClient(
    channelName,
    isDoctor,
    aiAssistantEnabled,
    selectedLanguage,
    selectedVoice
  );

  // Effect to notify parent component of remote user presence
  useEffect(() => {
    if (isDoctor && onAiToggle) {
      onAiToggle(hasRemoteUser);
    }
  }, [hasRemoteUser, isDoctor, onAiToggle]);

  // Effect for playing local video
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryInterval = 1000; // 1 second between retries
    let retryTimeoutId = null;

    const playVideo = async () => {
      if (!localVideoTrack) {
        console.log("No local video track available yet");
        return;
      }

      if (!localVideoRef.current) {
        console.log("Local video container not ready yet");
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Retrying in ${retryInterval}ms (attempt ${retryCount}/${maxRetries})`
          );
          retryTimeoutId = setTimeout(playVideo, retryInterval);
          return;
        }
        console.log("Max retries reached, giving up");
        return;
      }

      console.log("Local video ref exists, attempting to play...", {
        track: localVideoTrack,
        container: localVideoRef.current,
        trackState: localVideoTrack.state,
        trackEnabled: localVideoTrack.enabled,
      });

      try {
        await localVideoTrack.play(localVideoRef.current, { fit: "contain" });
        console.log("Local video playing successfully");
        retryCount = 0; // Reset retry count on success
      } catch (error) {
        console.error("Error playing local video:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Retrying after error in ${retryInterval}ms (attempt ${retryCount}/${maxRetries})`
          );
          retryTimeoutId = setTimeout(playVideo, retryInterval);
        } else {
          console.log("Max retries reached after error, giving up");
        }
      }
    };

    // Initial attempt with a small delay to ensure DOM is ready
    const initialTimeoutId = setTimeout(playVideo, 100);

    return () => {
      // Clean up all timeouts
      clearTimeout(initialTimeoutId);
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
      if (localVideoTrack) {
        console.log("Cleaning up local video...");
        try {
          localVideoTrack.stop();
        } catch (error) {
          console.error("Error stopping local video:", error);
        }
      }
    };
  }, [localVideoTrack]);

  // Effect for playing remote video
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryInterval = 1000; // 1 second between retries
    let retryTimeoutId = null;

    const playVideo = async () => {
      if (!remoteVideoTrack) {
        console.log("No remote video track available yet");
        return;
      }

      if (!remoteVideoRef.current) {
        console.log("Remote video container not ready yet");
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Retrying in ${retryInterval}ms (attempt ${retryCount}/${maxRetries})`
          );
          retryTimeoutId = setTimeout(playVideo, retryInterval);
          return;
        }
        console.log("Max retries reached, giving up");
        return;
      }

      console.log("Remote video ref exists, attempting to play...", {
        track: remoteVideoTrack,
        container: remoteVideoRef.current,
        trackState: remoteVideoTrack.state,
        trackEnabled: remoteVideoTrack.enabled,
      });

      try {
        await remoteVideoTrack.play(remoteVideoRef.current, {
          fit: "contain",
        });
        console.log("Remote video playing successfully");
        retryCount = 0; // Reset retry count on success
      } catch (error) {
        console.error("Error playing remote video:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Retrying after error in ${retryInterval}ms (attempt ${retryCount}/${maxRetries})`
          );
          retryTimeoutId = setTimeout(playVideo, retryInterval);
        } else {
          console.log("Max retries reached after error, giving up");
        }
      }
    };

    // Initial attempt with a small delay to ensure DOM is ready
    const initialTimeoutId = setTimeout(playVideo, 100);

    return () => {
      // Clean up all timeouts
      clearTimeout(initialTimeoutId);
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
      if (remoteVideoTrack) {
        console.log("Cleaning up remote video...");
        try {
          remoteVideoTrack.stop();
        } catch (error) {
          console.error("Error stopping remote video:", error);
        }
      }
    };
  }, [remoteVideoTrack]);

  if (error) {
    return (
      <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-white">Initializing video call...</span>
      </div>
    );
  }

  if (isLeaving) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-white">Leaving call...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Leave Call?
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to leave the call? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLeaveCall}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLeaveCall}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Leave Call
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Main video container */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className={`w-full ${isDoctor ? "md:w-[60%]" : ""}`}>
            <div className="relative w-full min-h-[480px] bg-gray-900 rounded-xl overflow-hidden">
              {/* Remote Video */}
              <div
                ref={remoteVideoRef}
                className="absolute inset-0 w-full h-full bg-gray-800"
              >
                {!hasRemoteUser && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400">
                      Waiting for other participant...
                    </p>
                  </div>
                )}
              </div>

              {/* Local Video */}
              <div
                ref={localVideoRef}
                className="absolute top-4 right-4 w-48 h-32 bg-gray-800 rounded-lg overflow-hidden shadow-lg z-10"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {!localVideoTrack && (
                    <p className="text-sm text-gray-400">
                      Loading local video...
                    </p>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${
                    isAudioMuted ? "bg-red-500" : "bg-gray-700"
                  } hover:bg-opacity-80 transition-colors`}
                >
                  {isAudioMuted ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${
                    isVideoMuted ? "bg-red-500" : "bg-gray-700"
                  } hover:bg-opacity-80 transition-colors`}
                >
                  {isVideoMuted ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V7.5A2.25 2.25 0 014.5 5.25H12a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={initiateLeaveCall}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* AI Assistant Panel (only visible for doctor when enabled) */}
          {isDoctor && aiAssistantEnabled && hasRemoteUser && (
            <div className="md:w-[40%]">
              {/* AI Assistant Panel */}
              <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    AI Assistant
                  </h3>
                  {isJoiningAI ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-gray-300">
                        Initializing AI Assistant...
                      </span>
                    </div>
                  ) : (
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <p className="text-gray-300 text-sm">
                        {aiTranscript || "Listening to conversation..."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Diagnosis Graph */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Diagnosis Probability
                  </h3>
                  <DiagnosisGraph
                    data={[
                      aiSuggestions.reduce((acc, suggestion) => {
                        const [condition, probabilityStr] =
                          suggestion.split(": ");
                        const probability = parseFloat(
                          probabilityStr.split("%")[0]
                        );
                        acc[condition.replace(" likelihood", "")] =
                          probability / 100;
                        return acc;
                      }, {}),
                    ]}
                  />
                  {followUpQuestion && (
                    <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Suggested Follow-up Question:
                      </h4>
                      <p className="text-sm text-gray-400">
                        {followUpQuestion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-xl">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
