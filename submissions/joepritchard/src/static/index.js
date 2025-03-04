//  Create Agora client
var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

var localTracks = {
  videoTrack: null,
  audioTrack: null
};
var remoteUsers = {};
var options = {
  appid: null,
  channel: null,
  uid: null,
  token: null
};

//  Spotify OAuth Configuration
const CLIENT_ID = "c39fa4725e53412d86e76783f424abfc";
const REDIRECT_URI = new URL("/", window.location.href).href;

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent("streaming user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-private")}`;

//  Spotify Web Player Initialization


let spotifyPlayer;

function initializeSpotifyPlayer(accessToken) {
  if (!window.Spotify || typeof Spotify.Player === "undefined") {
    console.warn(" Spotify Web SDK not ready. Retrying in 1 second...");
    setTimeout(() => initializeSpotifyPlayer(accessToken), 1000);
    return;
  }

  spotifyPlayer = new Spotify.Player({
    name: "Web Playback",
    getOAuthToken: cb => { cb(accessToken); },
    volume: 0.5
  });

  //  Event listeners
  spotifyPlayer.addListener("ready", ({ device_id }) => {
    console.log(" Spotify Player Ready with Device ID:", device_id);
    localStorage.setItem("spotify_device_id", device_id);
    transferPlaybackToWebPlayer(device_id);
  });

  spotifyPlayer.addListener("not_ready", ({ device_id }) => {
    console.log("⚠️ Spotify Player Not Ready:", device_id);
  });

  spotifyPlayer.addListener("authentication_error", ({ message }) => {
    console.error(" Spotify Auth Error:", message);
  });

  spotifyPlayer.connect();
}

//  Ensure Spotify SDK is loaded before initialization

if (!document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) {
  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.async = true;
  document.head.appendChild(script);
}

window.onSpotifyWebPlaybackSDKReady = () => {
  console.log(" Spotify Web SDK Loaded");
  const accessToken = localStorage.getItem("spotify_access_token");
  if (accessToken) {
    initializeSpotifyPlayer(accessToken);
  } else {
    console.error(" No Spotify access token found.");
  }
};

//  Transfer Playback to Web Player
async function transferPlaybackToWebPlayer(deviceId) {
  const accessToken = localStorage.getItem("spotify_access_token");
  if (!accessToken || !deviceId) return;

  const response = await fetch(`https://api.spotify.com/v1/me/player`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ device_ids: [deviceId], play: false })
  });

  if (response.status === 204) {
    console.log(" Transferred playback to Web Player.");
  } else {
    const errorData = await response.json();
    console.error(" Error transferring playback:", errorData);
  }
}

//  Check for Spotify Access Token
function checkForSpotifyToken() {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const token = hashParams.get("access_token") || localStorage.getItem("spotify_access_token");

  if (token) {
    console.log("🔑 Received Spotify Access Token:", token);
    localStorage.setItem("spotify_access_token", token);
    localStorage.removeItem("spotify_login_attempt");
    window.history.replaceState({}, document.title, window.location.pathname);

    fetch("https://api.spotify.com/v1/me", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("spotify_access_token")}` }
    })
    .then(res => res.json())
    .then(data => console.log("Scopes:", data.scope))
    .catch(err => console.error(err));


    fetch("https://api.spotify.com/v1/me", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("spotify_access_token")}` }
    })
    .then(res => res.json())
    .then(data => console.log("Product:", data.product));  // Should be 'premium'
    

    initializeSpotifyPlayer(token);
  } else if (!localStorage.getItem("spotify_access_token") && !localStorage.getItem("spotify_login_attempt")) {
    console.log("⚠️ No Spotify token found.");
  }
}

//  Spotify Login Function
function loginToSpotify() {
  if (!localStorage.getItem("spotify_login_attempt")) {
    localStorage.setItem("spotify_login_attempt", "true");
    window.location.href = SPOTIFY_AUTH_URL;
  } else {
    console.log("🔄 Already attempting Spotify login, waiting...");
  }
}

//  Play a Spotify Track via Web Playback SDK
async function playSpotifyTrack(trackUri) {
  console.log(`🎶 Playing track: ${trackUri}`);
  const accessToken = localStorage.getItem("spotify_access_token");
  let deviceId = localStorage.getItem("spotify_device_id");

  if (!accessToken) {
    console.error("⚠️ No Spotify Access Token! Redirecting to login...");
    loginToSpotify();
    return;
  }

  if (!deviceId) {
    console.warn("⚠️ No Spotify Device ID! Waiting for player...");
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    deviceId = localStorage.getItem("spotify_device_id");
    if (!deviceId) return;
  }


  if (!accessToken) {
    console.error("⚠️ No Spotify Access Token! Redirecting to login...");
    loginToSpotify();
    return;
  }

  if (!deviceId) {
    console.error("⚠️ No Spotify Device ID! Waiting for player to be ready...");
    return;
  }

  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ uris: [trackUri] })
  })
  .then(response => {
    if (response.status === 204) {
      console.log(" Spotify track playing successfully!");
    } else {
      console.error(" Error playing Spotify track:", response);
    }
  })
  .catch(error => console.error(" Failed to play track:", error));
}

//  Store the last played track URI to prevent unnecessary replays
let lastPlayedTrack = localStorage.getItem("last_played_track") || null;

async function checkForNewTrack() {

  if(options.channel)
  try {
    console.log('/api/get-latest-track/'+options.channel);
    const response = await fetch('/api/get-latest-track/'+options.channel);
    const data = await response.json();

    if (data.track_uri && data.track_uri !== "null") {
      if (data.track_uri !== lastPlayedTrack) {  //  Only play if the track has changed
        console.log("🎵 New track detected, playing:", data.track_uri);
        playSpotifyTrack(data.track_uri);
        lastPlayedTrack = data.track_uri;  //  Update last played track
        localStorage.setItem("last_played_track", lastPlayedTrack);
      } else {
        console.log("⏸️ Track is already playing, no need to restart.");
      }
    } else {
      console.log("🔍 No track found to play.");
    }
  } catch (error) {
    console.error(" Error checking for new track:", error);
  }
}


document.addEventListener("DOMContentLoaded", function() {
  const spotifyLoginBtn = document.getElementById("spotify-login-btn");

  if (spotifyLoginBtn) {
      spotifyLoginBtn.addEventListener("click", loginToSpotify);
  } else {
      console.error(" spotify-login-btn not found in the DOM");
  }
});

//  Check for token on page load
checkForSpotifyToken();

// ======= Agora RTC Integration =======
$(() => {
  var urlParams = new URL(location.href).searchParams;
  options.appid = urlParams.get("appid");
  options.channel = urlParams.get("channel");
  options.token = urlParams.get("token");
  if (options.appid && options.channel) {
    $("#appid").val(options.appid);
    $("#token").val(options.token);
    $("#channel").val(options.channel);
    $("#join-form").submit();
  }
});

$("#join-form").submit(async function (e) {
  e.preventDefault();
  $("#join").attr("disabled", true);
  try {
    options.appid = $("#appid").val();
    options.token = $("#token").val();
    options.channel = $("#channel").val();
    await join();
  } catch (error) {
    console.error(error);
  } finally {
    $("#leave").attr("disabled", false);
  }
});

$("#leave").click(function (e) {
  leave();
});

//  Function to generate a random long channel ID
function generateChannelID() {
  return 'channel_' + Math.random().toString(36).substr(2, 15);  // Generates a unique string
}

async function join() {
  //  Generate a unique channel ID for this session
  const randomChannelID = generateChannelID();
  options.channel = randomChannelID;  // Set this as the channel for both user and AI agent

  console.log(`🔹 Generated Channel ID: ${randomChannelID}`);

  client.on("user-published", handleUserPublished);
  client.on("user-unpublished", handleUserUnpublished);

  [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
    client.join(options.appid, options.channel, options.token || null),
    AgoraRTC.createMicrophoneAudioTrack(),
    AgoraRTC.createCameraVideoTrack()
  ]);

  localTracks.videoTrack.play("local-player");
  $("#local-player-name").text(`localVideo(${options.uid})`);

  await client.publish(Object.values(localTracks));

  //  Send the channel ID to the backend to add the AI agent
  try {
    console.log("🔹 Requesting AI agent to join the Agora room...uid"+options.uid);

    const response = await fetch("/api/start-agora", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ channel_id: randomChannelID, user_id: options.uid })  //  Pass the generated channel ID
    });

    const data = await response.json();

    //  Log the full response for debugging
    console.log("📥 Received response from /api/start-agora:", data);

    if (data.error) {
      console.error(" Failed to add Agora agent:", data.error);
    } else {
      console.log("🤖 AI Agent successfully added to the room.");
     // Auto-check for new song (to be replaced with signalling, but Vercel can't do websockets and trying to do this quickly)
     setInterval(checkForNewTrack, 5000);
    }
  } catch (error) {
    console.error(" Error adding Agora agent:", error);
  }
}

//  Subscribe to remote users
async function subscribe(user, mediaType) {
  const uid = user.uid;
  await client.subscribe(user, mediaType);
  console.log(`📡 Subscribed to ${mediaType} from user ${uid}`);

  if (mediaType === 'video') {
    const player = $(`
      <div id="player-wrapper-${uid}">
        <p class="player-name">RemoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
      </div>
    `);
    $("#remote-playerlist").append(player);
    user.videoTrack.play(`player-${uid}`);
  }

  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
}

function handleUserPublished(user, mediaType) {
  const id = user.uid;
  remoteUsers[id] = user;
  subscribe(user, mediaType);
}

function handleUserUnpublished(user) {
  const id = user.uid;
  delete remoteUsers[id];
  $(`#player-wrapper-${id}`).remove();
}