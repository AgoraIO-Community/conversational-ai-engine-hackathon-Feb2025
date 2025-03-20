# Mental Health Companion - Backend Server

## Overview
This is the backend server component of the Mental Health Companion project developed by Agora's SA India Team. It provides a proxy server to interface with Agora's Conversational AI Agent API, allowing the frontend application to create and manage AI-powered mental health companions.

## Features
- **AI Agent Management**: APIs to start and stop conversational AI agents
- **Multiple Termination Methods**: Support for stopping agents by channel name or agent ID
- **Preconfigured AI Personality**: Compassionate mental wellness companion profile
- **Integration with Voice Services**: Connections to OpenAI for LLM and ElevenLabs for text-to-speech

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Middleware**: CORS, Body-parser

## Prerequisites
- Node.js 
- npm or yarn
- Agora account with app ID and credentials
- OpenAI API key
- ElevenLabs API key

## Installation

1. Clone the repository and cd into the root folder

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the application:
   - Open `server.js` and update the `config` object with your Agora credentials:
     ```javascript
     const config = {
       agora: {
         appId: "YOUR_AGORA_APP_ID",
         credentials: "YOUR_BASE64_CREDENTIALS",
       },
     };
     ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Start AI Agent
- **URL**: `/api/start-ai-agent`
- **Method**: POST
- **Body**:
  ```json
  {
    "channel": "string",
    "llmApiKey": "string",
    "ttsApiKey": "string"
  }
  ```
- **Response**: Agora API response with agent details

### Stop AI Agent by Channel
- **URL**: `/api/stop-ai-agent`
- **Method**: POST
- **Body**:
  ```json
  {
    "channel": "string"
  }
  ```
- **Response**: Agora API response

### Stop AI Agent by ID
- **URL**: `/api/stop-agent-by-id`
- **Method**: POST
- **Body**:
  ```json
  {
    "agentId": "string"
  }
  ```
- **Response**: Agora API response

## AI Companion Configuration

The server comes preconfigured with a compassionate mental wellness AI personality that:

- Speaks slowly and calmly to users who may be under stress
- Practices active listening and validation
- Offers evidence-based techniques from cognitive behavioral therapy, mindfulness, and positive psychology
- Maintains boundaries regarding professional mental health support
- Guides users through anxiety, self-criticism, feeling overwhelmed, relationship conflicts, and hopelessness

The AI greeting is set to: "Hi, I'm Anaya. I'm here to listen, support, and offer you guidance. You're not alone. How are you feeling today?"

## Integration with Frontend

This server is designed to work with the Mental Health Companion frontend application. The frontend connects to this server to:

1. Start an AI agent when a user connects to a voice channel
2. Stop the AI agent when a user disconnects
3. Handle alternative termination methods if needed

## Configuration Options

### LLM Configuration
The server is configured to use OpenAI's `gpt-4o-mini` model for natural language processing. You can modify the model or parameters in the `/api/start-ai-agent` endpoint.

### TTS Configuration
The text-to-speech service uses ElevenLabs with the voice ID `21m00Tcm4TlvDq8ikWAM`. You can change the voice or model in the same endpoint.

## Security Considerations

- The server uses API keys that should be kept secure
- Agora credentials are stored in base64 format

## Error Handling

The server provides error responses with appropriate status codes and error messages when:
- API requests to Agora fail
- Required parameters are missing
- Authentication fails

## Development and Customization

### Modifying AI Personality
The AI's personality and behavior are defined in the `content` variable. You can modify this to change how the AI responds to users.

### Adding New Endpoints
To add new functionality, create additional routes in `server.js` following the existing pattern.

## Deployment

This server can be deployed to any Node.js hosting service such as:
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgements

- Agora for providing the Conversational AI Agent API
- OpenAI for natural language processing capabilities
- ElevenLabs for voice synthesis technology
- Agora's SA India Team