# 🎤 Agora Conversational AI + OpenAI Wrapper + Spotify 🎵

A voice-enabled Content Therapist using **Agora Conversational AI Engine, OpenAI GPT-4o mini, and Spotify Web API**.

Check the video in the root folder for a demo.

**Demo location:**  
[https://hack-five-ashy.vercel.app/](https://hack-five-ashy.vercel.app/)

---

## FastAPI + Agora + Spotify Integration

### 1. Files Overview

- **main.py**: The main entry point for the FastAPI application.  
- **config.py**: Loads environment variables (using dotenv) for Agora, Spotify, and OpenAI keys.  
- **gpt_wrapper.py, spotify.py, agora.py**: Contain the logic for OpenAI GPT, Spotify access, and Agora session handling.  
- **index.js & index.css**: Front-end code for a simple page that interacts with Spotify and Agora.  
- **requirements.txt**: Lists the Python dependencies.

---

### 2. Environment Variables

Make sure you add these Environment Variables in your Vercel Dashboard (under **Settings → Environment Variables**) before deploying:

- `AGORA_APP_ID`
- `AGORA_CUSTOMER_ID`
- `AGORA_CUSTOMER_SECRET`
- `OPENAI_API_KEY`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_ACCESS_TOKEN`
- `FASTAPI_WRAPPER_URL`
- `API_TOKEN` (you choose this randomly for now)

> **Note**: Depending on your usage, you may not need to provide a static `SPOTIFY_ACCESS_TOKEN` if you handle OAuth at runtime.

---

### 3. Deploying to Vercel

1. Clone or upload this repository to Vercel.  
2. Make sure your `requirements.txt` is present at the root.  
3. Add (or Import) your environment variables in Vercel under Project Settings.  
4. From your local machine (if you have the Vercel CLI installed), run:
   ```bash
   cd src
   vercel --prod --force
