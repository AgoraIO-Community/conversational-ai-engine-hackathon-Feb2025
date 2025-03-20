# Mental Health Companion

## Overview
Mental Health Companion is a web application developed by Agora's SA India Team that provides users with an AI-powered conversational companion for mental health support. The application leverages Agora's Real-Time Communication (RTC) SDK for audio communication and integrates with AI services to create an interactive and supportive mental health assistant.

## Features
- **Real-time Audio Communication**: Uses Agora's RTC SDK to establish voice communication channels
- **AI-Powered Mental Health Assistant**: Integrates with AI services for natural conversation
- **Secure Channel Creation**: Automatically generates secure, random channel names for each session
- **Visual Feedback**: Provides visual indicators for connection status and AI speaking activity

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: Vite.js
- **Audio SDK**: Agora RTC SDK
- **AI Integration**: Backend proxy server for LLM and TTS API integration

## Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn
- Modern web browser with microphone support

## Installation

1. Clone the repository and cd into the root folder


2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the application:
   - The main configuration is in `src/script.js`
   - Update API keys if needed:
     - Agora App ID
     - LLM API Key
     - TTS API Key
     - Server Base URL

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Usage

1. Open the application in a web browser.
2. Click the toggle switch to connect to a voice channel.
3. Once connected, the AI agent will automatically join the channel.
4. Speak naturally with the AI mental health companion.
5. The AI's speaking activity is visualized through the animated bars.
6. Toggle the switch again to disconnect from the session.

## Architecture

### Frontend Components
- **Connection Management**: Handles joining and leaving Agora channels
- **Audio Track Management**: Creates and publishes local audio tracks
- **AI Agent Integration**: Communicates with the backend to start/stop AI agents
- **UI Components**: Provides visual feedback of system status

### Backend Integration
The application communicates with a backend server that:
- Manages AI agent creation and connection to voice channels
- Handles text-to-speech conversion
- Processes natural language understanding

### Security Features
- Random channel name generation for each session
- Random user ID generation
- Token-based authentication (configurable)

## API Endpoints

The application interacts with the following backend endpoints:

- `POST /api/start-ai-agent`: Starts an AI agent in a specific channel
- `POST /api/stop-ai-agent`: Stops an AI agent by channel name
- `POST /api/stop-agent-by-id`: Stops an AI agent by its specific ID

## Configuration Options

The main configuration object in `script.js` includes:

```javascript
const config = {
  agora: {
    appId: "YOUR_AGORA_APP_ID",
    channel: generateRandomChannelName(),
    token: null,
    uid: generateRandomUid()
  },
  ai: {
    llmApiKey: "YOUR_LLM_API_KEY",
    ttsApiKey: "YOUR_TTS_API_KEY"
  },
  server: {
    baseUrl: "YOUR_SERVER_BASE_URL"
  }
};
```

## Known Issues and Limitations

- The application requires microphone permissions from the browser
- Token-based authentication is not enabled by default

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- Agora for providing the RTC SDK
- Agora's SA India Team 