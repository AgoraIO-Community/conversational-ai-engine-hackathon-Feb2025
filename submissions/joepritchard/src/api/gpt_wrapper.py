import openai
import json
import logging
from openai import AsyncOpenAI
from fastapi.responses import StreamingResponse
from api.config import OPENAI_API_KEY
from api.spotify import search_spotify_track

logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=OPENAI_API_KEY)

#  In-memory storage for the latest track per channel
latest_track_data = {}  # Dictionary to store track info per channel

def update_latest_spotify_track(channel_id, track_uri, track_name, artist_name):
    """Stores the latest Spotify track details in memory per channel."""
    latest_track_data[channel_id] = {
        "track_uri": track_uri,
        "track_name": track_name,
        "artist_name": artist_name,
    }
    logger.info(f" Updated latest track for {channel_id}: {track_name} by {artist_name} ({track_uri})")

def get_latest_spotify_track(channel_id):
    """Retrieves the latest track stored in memory for a specific channel."""
    return latest_track_data.get(channel_id, {"error": "No track found for this channel"})

#  Store channel_id when /api/start-agora is called
active_channels = {}  # Add this at the top of the file

async def chat_with_gpt(request_data, channel_id):
    """Handles communication with OpenAI API, ensuring `channel_id` is passed separately."""
    try:
        #  Log that `channel_id` is being used (without modifying `request_data`)
        logger.info(f"ℹ️ Using stored channel_id: {channel_id} for OpenAI request")

        #  Call OpenAI API
        response = await client.chat.completions.create(
            model=request_data["model"],
            messages=request_data["messages"],
            stream=request_data.get("stream", False),
            stream_options=request_data.get("stream_options", {}),
            functions=[
                {
                    "name": "play_song_on_spotify",
                    "description": "Play a song on Spotify given its track name and artist.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "track_name": {
                                "type": "string",
                                "description": "The name of the song to play on Spotify.",
                            },
                            "artist_name": {
                                "type": "string",
                                "description": "The artist of the song to play on Spotify.",
                            }
                        },
                        "required": ["track_name", "artist_name"]
                    }
                }
            ],
        )

        #  Handle Streaming Response
        if request_data.get("stream", False):
            async def event_stream():
                try:
                    function_call_buffer = ""  # Buffer to store function call arguments
                    async for chunk in response:
                        chunk_data = chunk.to_dict()
                        logger.debug(f"🔹 Streaming Chunk: {chunk_data}")

                        choices = chunk_data.get("choices", [])
                        for choice in choices:
                            function_call = choice.get("delta", {}).get("function_call")
                            if function_call:
                                function_call_buffer += function_call.get("arguments", "")

                            if choice.get("finish_reason") == "function_call":
                                logger.debug(f"🎵 Function Call Detected: {function_call_buffer}")
                                try:
                                    function_args = json.loads(function_call_buffer)
                                    track_name = function_args.get("track_name")
                                    artist_name = function_args.get("artist_name")

                                    if track_name and artist_name:
                                        search_query = f"{track_name} {artist_name}"
                                        track_uri = await search_spotify_track(search_query)

                                        if track_uri:
                                            #  Prevent replaying the same song per channel
                                            if channel_id not in latest_track_data or track_uri != latest_track_data[channel_id]["track_uri"]:
                                                update_latest_spotify_track(channel_id, track_uri, track_name, artist_name)
                                                yield f"data: {json.dumps({'message': f'Playing {track_name} by {artist_name} on Spotify...'})}\n\n"
                                                yield f"data: {json.dumps({'message': 'Playing song on Spotify', 'track_uri': track_uri})}\n\n"
                                            else:
                                                yield f"data: {json.dumps({'message': f'{track_name} by {artist_name} is already playing.'})}\n\n"
                                        else:
                                            yield f"data: {json.dumps({'message': f'Sorry, I could not find {track_name} by {artist_name} on Spotify.'})}\n\n"
                                except Exception as e:
                                    logger.error(f" Failed to process function call: {e}")

                        yield f"data: {json.dumps(chunk_data)}\n\n"

                    yield "data: [DONE]\n\n"
                except Exception as e:
                    logger.error(f" Error while streaming response: {str(e)}")

            return StreamingResponse(event_stream(), media_type="text/event-stream")

        #  Process Normal Response
        response_data = response.to_dict()
        logger.debug(f" OpenAI Response: {json.dumps(response_data, indent=2)}")

        choices = response_data.get("choices", [])
        for choice in choices:
            function_call = choice.get("message", {}).get("function_call")
            if function_call and function_call["name"] == "play_song_on_spotify":
                function_args = json.loads(function_call["arguments"])
                track_name = function_args.get("track_name")
                artist_name = function_args.get("artist_name")

                if track_name and artist_name:
                    search_query = f"{track_name} {artist_name}"  # Single query
                    track_uri = await search_spotify_track(search_query)

                    if track_uri:
                        #  Prevent replaying the same song per channel
                        if channel_id not in latest_track_data or track_uri != latest_track_data[channel_id]["track_uri"]:
                            update_latest_spotify_track(channel_id, track_uri, track_name, artist_name)
                            return {"message": f"Playing {track_name} by {artist_name} on Spotify...", "track_uri": track_uri}
                        else:
                            return {"message": f"{track_name} by {artist_name} is already playing.", "track_uri": track_uri}
                    else:
                        return {"message": f"Sorry, I couldn't find '{track_name}' by '{artist_name}' on Spotify."}

        return response_data

    except Exception as e:
        logger.error(f" Exception in chat_with_gpt: {str(e)}")
        return {"error": str(e)}