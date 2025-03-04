# 🎤 Agora Conversational AI + OpenAI Wrapper + Spotify 🎵

A voice-enabled Content Therapist using **Agora Conversational AI Engine, OpenAI GPT-4o mini, and Spotify Web API**. 

Check the video in root folder for demo

Demo location:
https://hack-five-ashy.vercel.app/

FastAPI + Agora + Spotify Integration

1. Files Overview
main.py: The main entry point for the FastAPI application.
config.py: Loads environment variables (using dotenv) for Agora, Spotify, and OpenAI keys.
gpt_wrapper.py, spotify.py, agora.py: Contain the logic for OpenAI GPT, Spotify access, and Agora session handling.
index.js & index.css: Front-end code for a simple page that interacts with Spotify and Agora.
requirements.txt: Lists the Python dependencies.

2. Environment Variables
Make sure you add these Environment Variables in your Vercel Dashboard (under Settings → Environment Variables) before deploying:

AGORA_APP_ID
AGORA_CUSTOMER_ID
AGORA_CUSTOMER_SECRET
OPENAI_API_KEY
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SPOTIFY_ACCESS_TOKEN
FASTAPI_WRAPPER_URL
API_TOKEN (you choose this randomly for now))

Note: Depending on your usage, you may not need to provide a static SPOTIFY_ACCESS_TOKEN if you handle OAuth at runtime.

3. Deploying to Vercel
Clone or upload this repository to Vercel.
Make sure your requirements.txt is present at the root.
Add (or Import) your environment variables in Vercel under Project Settings.
From your local machine (if you have the Vercel CLI installed), run:

cd src
vercel --prod --force

This forces a production deployment with the most recent changes.
Alternatively, if you connected your repo to Vercel, you can push changes to your main branch and let Vercel build automatically.

5. Usage
Visit / to see the root endpoint response.
Use /api/health to check the app’s status.
POST to /api/start-agora with the required JSON body to start a session.
POST to /api/chat/{channel_id} to chat with GPT and optionally trigger Spotify playback.
That’s all! Once deployed on Vercel, you can use the URL given by Vercel to call these endpoints.