import AgoraRTC from "agora-rtc-sdk-ng"

// Configuration
const config = {
  agora: {
    appId: "Please add your app ID here",
    channel: generateRandomChannelName(), // Generate a random channel name
    token: null,
    uid: generateRandomUid() // Generate random User ID
  },
  ai: {
    llmApiKey: "Please add your llm API key here",
    ttsApiKey: "Please add your tts API key here"
  },
  server: {
    // baseUrl: "http://localhost:3000" //local server to test
    baseUrl: "Please add the base address of your server here"
  }
};

// RTC client instance
let client = null;
// Local audio track
let localAudioTrack = null;
// AI agent state
let aiAgentActive = false;
// Store the agent ID when created
let currentAgentId = null;

// Generate a random channel name (less than 255 characters)
function generateRandomChannelName() {
  // Define characters that can be used in the channel name
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // Generate a random length between 8 and 20 characters
  const length = Math.floor(Math.random() * 13) + 8;
  let result = '';
  
  // Generate the random string
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add a timestamp to ensure uniqueness
  result += '_' + Date.now().toString().substring(6);
  
  // Make sure the result is less than 255 characters
  return result.substring(0, 254);
}

// Initialize the AgoraRTC client
function initializeClient() {
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  setupEventListeners();
}

// Handle client events
function setupEventListeners() {
  // Set up event listeners for remote tracks
  client.on("user-published", async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    // If the remote user publishes an audio track.
    if (mediaType === "audio") {
      // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
      const remoteAudioTrack = user.audioTrack;
      // Play the remote audio track.
      remoteAudioTrack.play();
    }
  });

  // Listen for the "user-unpublished" event
  client.on("user-unpublished", async (user) => {
    // Remote user unpublished
    console.log("User unpublished:", user.uid);
  });

  client.on("connection-state-change", (state) => {
    console.log("Connection state changed to:", state);
  });
}

// Create a local audio track
async function createLocalAudioTrack() {
  localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
}

// Join the channel and publish local audio
async function joinChannel() {
  try {
    // Log the channel name instead of displaying in UI
    console.log("Connecting to channel:", config.agora.channel);
    
    await client.join(config.agora.appId, config.agora.channel, config.agora.token, config.agora.uid);
    console.log("Joined channel successfully:", config.agora.channel);
    
    await createLocalAudioTrack();
    await publishLocalAudio();
    console.log("Published local audio successfully");
    
    // Start AI agent after successfully joining the channel
    if (!aiAgentActive) {
      startAIAgent();
    }
    
    updateUI(true);
  } catch (error) {
    console.error("Error joining channel:", error);
  }
}

// Publish local audio track
async function publishLocalAudio() {
  await client.publish([localAudioTrack]);
}

// Leave the channel and clean up
async function leaveChannel() {
  try {
    if (localAudioTrack) {
      localAudioTrack.close(); // Stop local audio
    }
    
    // Stop AI agent before leaving channel
    if (aiAgentActive) {
      stopAIAgent();
    }
    
    await client.leave(); // Leave the channel
    console.log("Left the channel successfully");
    
    // Generate a new channel name for the next connection
    config.agora.channel = generateRandomChannelName();
    console.log("New channel name generated:", config.agora.channel);
    
    updateUI(false);
  } catch (error) {
    console.error("Error leaving channel:", error);
  }
}

// Start the AI agent through our backend proxy
async function startAIAgent() {
  try {
    const response = await fetch(`${config.server.baseUrl}/api/start-ai-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: config.agora.channel,
        llmApiKey: config.ai.llmApiKey,
        ttsApiKey: config.ai.ttsApiKey
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to start AI agent: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log("AI agent started successfully:", data);
    aiAgentActive = true;
    
    // Store the agent ID if available in the response
    if (data && data.agent_id) {
      currentAgentId = data.agent_id;
      console.log("Agent ID stored:", currentAgentId);
    }
    
    // Update the UI to show AI agent is active
    document.getElementById("aiStatus").textContent = "Active";
    document.getElementById("aiIndicator").classList.add("connected");
  } catch (error) {
    console.error("Error starting AI agent:", error);
    alert(`Failed to start AI agent: ${error.message}`);
  }
}

// Stop the AI agent through our backend proxy
async function stopAIAgent() {
  try {
    // If we have an agent ID, try to stop by ID first
    if (currentAgentId) {
      try {
        await stopAgentById(currentAgentId);
        return; // If successful, we're done
      } catch (idError) {
        console.warn("Failed to stop agent by ID, falling back to channel method:", idError);
        // Continue with the channel-based method if ID method fails
      }
    }
    
    // Fallback to channel-based method
    const response = await fetch(`${config.server.baseUrl}/api/stop-ai-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: config.agora.channel
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to stop AI agent: ${errorData.error || response.statusText}`);
    }

    console.log("AI agent stopped successfully");
    aiAgentActive = false;
    currentAgentId = null;
    
    // Update the UI to show AI agent is inactive
    document.getElementById("aiStatus").textContent = "Inactive";
    document.getElementById("aiIndicator").classList.remove("connected");
    document.getElementById("speakingIndicator").classList.remove("active");
  } catch (error) {
    console.error("Error stopping AI agent:", error);
  }
}

// Stop AI agent by ID
async function stopAgentById(agentId) {
  const response = await fetch(`${config.server.baseUrl}/api/stop-agent-by-id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agentId: agentId
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to stop AI agent by ID: ${errorData.error || response.statusText}`);
    }

  console.log("AI agent stopped successfully by ID");
  aiAgentActive = false;
  currentAgentId = null;
  
  // Update the UI to show AI agent is inactive
  document.getElementById("aiStatus").textContent = "Inactive";
  document.getElementById("aiStatus").classList.remove("active");
}

// Update UI based on connection state
function updateUI(isConnected) {
  const toggle = document.getElementById("connectionToggle");
  const toggleLabel = document.getElementById("toggleLabel");
  const connectionStatus = document.getElementById("connectionStatus");
  const connectionIndicator = document.getElementById("connectionIndicator");
  const aiStatus = document.getElementById("aiStatus");
  const aiIndicator = document.getElementById("aiIndicator");
  const speakingIndicator = document.getElementById("speakingIndicator");
  
  if (isConnected) {
    // Update toggle
    toggle.classList.add("active");
    toggleLabel.textContent = "Connected";
    
    // Add a brief pulse animation
    toggle.classList.add("pulse");
    setTimeout(() => toggle.classList.remove("pulse"), 1000);
    
    // Update status indicators
    connectionStatus.textContent = "Connected";
    connectionIndicator.classList.add("connected");
    
    // AI status update happens separately when AI is started
  } else {
    // Update toggle
    toggle.classList.remove("active");
    toggleLabel.textContent = "Disconnected";
    
    // Update status indicators
    connectionStatus.textContent = "Disconnected";
    connectionIndicator.classList.remove("connected");
    
    // Reset AI status and speaking animation
    aiStatus.textContent = "Inactive";
    aiIndicator.classList.remove("connected");
    speakingIndicator.classList.remove("active");
  }
}

// Set up toggle handler
function setupToggleHandler() {
  const toggle = document.getElementById("connectionToggle");
  
  toggle.addEventListener("click", function() {
    if (toggle.classList.contains("active")) {
      // Currently connected, disconnect
      leaveChannel();
    } else {
      // Currently disconnected, connect
      joinChannel();
    }
  });
  
  // Set up speaking simulation (this would be replaced with actual audio detection)
  setupAISpeakingSimulation();
}


function setupAISpeakingSimulation() {

  setInterval(() => {
    if (aiAgentActive) {
      const speakingIndicator = document.getElementById("speakingIndicator");
      
      // Randomly toggle speaking animation to simulate AI speaking patterns
      if (Math.random() > 0.5) {
        speakingIndicator.classList.add("active");
        setTimeout(() => {
          speakingIndicator.classList.remove("active");
        }, Math.random() * 3000 + 1000); // Speak for 1-4 seconds
      }
    }
  }, 5000); // Check every 5 seconds
}

// Start the application
function startApp() {
  initializeClient();
  setupToggleHandler();
  updateUI(false);
  
  // Display the initial random channel name
  console.log("Initial channel name:", config.agora.channel);
}

// Generate a random 32-bit unsigned integer (0 to 4,294,967,295)
function generateRandomUid() {
  // Using Math.random() to generate a random number between 0 and 4,294,967,295
  return Math.floor(Math.random() * 4294967296);
}

startApp();

// force commit: Removed submodule