# Build a Compassionate AI Mental Wellness Companion with Agora

In today's fast-paced world, prioritizing mental wellness is more important than ever. This tutorial guides you through building "Anaya," a compassionate AI mental wellness companion. Anaya leverages the power of Agora's ConvoAI - a conversational platfome that allows you to build real time AI agents who can speak and respond to voice. This was build with Agora's Real-Time Communication (RTC) SDK

## Understand the Tech

This project combines real-time audio communication with advanced AI capabilities:

1.  **Agora RTC SDK:** Enables low-latency, high-quality audio communication between the user and the AI companion.
2.  **Node.js Server:** Acts as a backend proxy, securely handling API requests to Agora
3.  **ElevenLabs TTS:** Converts the AI's text responses into natural-sounding speech.
4.  **Web Client (HTML, CSS, JS):** Provides the user interface for interacting with Anaya.

## Prerequisites

To successfully implement your AI Mental Wellness Companion, you must have the following:

- A valid [Agora account](https://console.agora.io) and an Agora project.
- An [ElevenLabs account](https://elevenlabs.io/) for Text-to-Speech (TTS) capabilities.
- [Node.js](https://nodejs.org/) installed on your local machine.
- Basic knowledge of JavaScript, HTML, and CSS.

## Project Setup

1.  **Clone the Project:** Download or clone the project files.
2.  **Install Server Dependencies:** Navigate to the `server_convo_ai` directory and run `npm install` (or `yarn install`).
3.  **Install Client Dependencies:** Navigate to the `client_convo_ai` directory and run `npm install` (or `yarn install`).
4.  **Configure Environment Variables:** Create a `.env` file in the `server_convo_ai` directory and add your Agora credentials.

## Build Anaya: Your AI Wellness Companion

### Build the Node.js Server (`server_convo_ai/server.js`)

1.  **Initialize Express and Middleware:** Set up an Express app, enable CORS, and use `body-parser`.
2.  **Load Configuration:** Load environment variables and set up configurations.
3.  **Define the System Prompt:** Craft the `SystemPrompt` as per your requirements.
4.  **Implement `/api/start-ai-agent` Endpoint:** This endpoint receives a `channel` name, constructs the `agoraLLMConfig`, and sends a POST request to start the agent.
5.  **Implement `/api/stop-ai-agent` Endpoint:** This endpoint stops the agent using its name and channel.
6.  **Implement `/api/stop-agent-by-id` Endpoint:** This endpoint stops the agent using its ID.

### Build the Web Client (`client_convo_ai/src/script.js`)

1.  **HTML Structure (`index.html`):** Create the layout with a toggle switch and status displays.
2.  **CSS Styling (`src/style.css`):** Style the elements for a clean interface.
3.  **JavaScript Logic (`src/script.js`):**
    - **Initialization:** Import `AgoraRTC`, set up configuration, and initialize the client.
    - **Event Listeners:** Set up `client.on("user-published", ...)` to handle incoming audio.
    - **`joinChannel`:** Joins the Agora channel and calls `startAIAgent`.
    - **`leaveChannel`:** Stops the AI agent and leaves the channel.
    - **`startAIAgent` / `stopAIAgent`:** Make `fetch` requests to your server.

## Test Your AI Wellness Companion

1.  **Start the Server:** Navigate to `server_convo_ai` and run `npm start`.
2.  **Start the Client:** Navigate to `client_convo_ai` and run `npm run dev`.
3.  **Interact:** Open your browser and start a conversation.

## Next Steps

- Build your own ConvoAI agents using this [doc](https://docs.agora.io/en/conversational-ai/overview/product-overview)
- Explore [Advanced Video Features](https://www.agora.io/en/blog/how-to-get-started-with-agora?utm_source=medium&utm_medium=blog&utm_campaign=How_to_Build_a_Video_Calling_App_with_Agora) to make your Conversational bot become visible.
- Join the [Agora.io Developer Slack community](https://agoraiodev.slack.com/join/shared_invite/zt-pwtdea07-Oq0VrEPxW7ooiGxiuTxopg#/shared-invite/email).

## Reference

- [Agora Video SDK documentation](https://www.agora.io/en/blog/how-to-get-started-with-agora?utm_source=medium&utm_medium=blog&utm_campaign=How_to_Build_a_Video_Calling_App_with_Agora).
