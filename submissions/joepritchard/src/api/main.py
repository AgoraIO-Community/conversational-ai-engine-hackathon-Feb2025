from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
import json
import logging
import traceback
from api.gpt_wrapper import chat_with_gpt, get_latest_spotify_track
from api.agora import join_agora_session
from api.spotify import search_spotify_track

#  Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "FastAPI is running on Vercel!"}

@app.get("/api/health")
async def health_check():
    """Quick endpoint to check if API is running."""
    return {"status": "ok"}

#  In-memory storage for user sessions (persists while app is running)
active_channels = {}  # { user_id: channel_id }

@app.post("/api/start-agora")
async def start_agora(request: Request):
    """Stores user_id → channel_id in memory and starts Agora session."""
    try:
        data = await request.json()
        channel_id = data.get("channel_id")
        user_id = data.get("user_id")  # Unique identifier for the user

        if not channel_id or not user_id:
            raise HTTPException(status_code=400, detail="Missing channel_id or user_id in request.")

        logger.info(f"🔹 Storing Agora session: user {user_id} → channel {channel_id}")

        #  Store `user_id → channel_id` in memory
        active_channels[user_id] = channel_id  

        #  Call Agora API to start session
        agora_response = await join_agora_session(channel_id)

        return JSONResponse(content={"channel_id": channel_id, "agora_response": agora_response})  

    except Exception as e:
        logger.error(f" Error in /api/start-agora: {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/api/get-latest-track/{channel_id}")
async def get_latest_track(channel_id: str):
    """Fetch the latest Spotify track URI stored in memory for the given channel."""
    return get_latest_spotify_track(channel_id)

@app.post("/api/chat/{channel_id}")
async def handle_user_message(channel_id: str, request: Request):
    """Handles user messages, extracting `channel_id` from the URL."""
    try:
        raw_body = await request.body()
        raw_body_str = raw_body.decode('utf-8')

        #  Dump full request headers
        headers = dict(request.headers)
        logger.info(f"📥 FULL REQUEST HEADERS:\n{json.dumps(headers, indent=2)}")

        #  Dump full request body
        logger.info(f"📥 FULL REQUEST BODY:\n{raw_body_str}")

        try:
            data = json.loads(raw_body)
        except json.JSONDecodeError:
            logger.error(" Failed to parse JSON body")
            return JSONResponse(status_code=400, content={"error": "Invalid JSON format"})

        #  Log parsed JSON (confirming it matches raw request)
        logger.info(f"🔍 Parsed JSON Data:\n{json.dumps(data, indent=2)}")

        #  Log the extracted `channel_id`
        logger.info(f"ℹ️ Received request for channel_id: {channel_id}")

        #  Ensure messages exist and are properly formatted
        if "messages" not in data or not isinstance(data["messages"], list):
            logger.error(" 'messages' is missing or not a list.")
            return JSONResponse(status_code=400, content={"error": "Invalid 'messages' format."})

        #  Log cleaned-up messages
        logger.info(f"💬 Messages:\n{json.dumps(data['messages'], indent=2)}")

        ai_response = await chat_with_gpt(data, channel_id)

        if isinstance(ai_response, StreamingResponse):
            return ai_response  #  Prevent serialization error

        logger.info(f"📤 AI Response:\n{json.dumps(ai_response, indent=2)}")
        return JSONResponse(content=ai_response)

    except Exception as e:
        error_traceback = traceback.format_exc()
        logger.error(f" Exception in /api/chat:\n{error_traceback}")
        return JSONResponse(status_code=500, content={"error": str(e), "traceback": error_traceback})