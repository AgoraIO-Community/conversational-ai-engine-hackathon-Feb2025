# Mental Health Companion

## Project Overview
Mental Health Companion is an AI-powered conversational assistant developed by Agora's SA India Team. It provides real-time audio communication with an AI companion designed to support users' mental well-being through evidence-based guidance and compassionate interaction.

You can check the project LIVE right now at https://MentalHealthCompanion.netlify.app 

## Project Structure

This repository contains both the frontend and backend components of the application:

```
root folder
|
|--src
    |
    |--client_convo_ai  # Frontend application
    |--server_convo_ai  # Backend server
```

## Getting Started

Each component has its own dedicated README with detailed setup instructions and documentation:

- **Frontend**: See `src/client_convo_ai/README.md` for information about the web interface built with HTML, CSS, JavaScript, and Agora's RTC SDK.

- **Backend**: See `src/server_convo_ai/README.md` for details about the Express.js server that manages AI agents through Agora's Conversational AI API.

## Quick Start

To run the complete application:

1. Set up and start the backend server first
2. Set up and start the frontend client
3. Use the frontend interface to connect to the AI companion

Please refer to the individual README files in each directory for specific setup instructions and configuration options.

## Technologies Used

- Agora RTC SDK for real-time audio communication
- OpenAI API for natural language processing
- ElevenLabs for text-to-speech
- Express.js for the backend server
- Vite.js for frontend build and development