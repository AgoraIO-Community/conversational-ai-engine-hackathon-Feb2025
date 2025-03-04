import httpx
import json
import base64
import logging
from api.config import AGORA_APP_ID, AGORA_CUSTOMER_ID, AGORA_CUSTOMER_SECRET, FASTAPI_WRAPPER_URL, API_TOKEN

#  Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

AGORA_API_BASE = "https://api.agora.io/api/conversational-ai-agent/v2/projects"

async def join_agora_session(channel_id: str):
    """Joins Agora Conversational AI and configures it to use our OpenAI wrapper in the given channel."""
    
    url = f"{AGORA_API_BASE}/{AGORA_APP_ID}/join"

    auth_string = f"{AGORA_CUSTOMER_ID}:{AGORA_CUSTOMER_SECRET}"
    encoded_auth = base64.b64encode(auth_string.encode()).decode()

    headers = {
        "Authorization": f"Basic {encoded_auth}",
        "Content-Type": "application/json"
    }

   
    llm_url = f"{FASTAPI_WRAPPER_URL.rstrip('/')}/api/chat/{channel_id}"

    payload = {
        "name": f"agent_session_{channel_id}",
        "properties": {
            "channel": channel_id,
            "token": "",  
            "agent_rtc_uid": "0",
            "remote_rtc_uids": ["*"],
            "enable_string_uid": False,
            "idle_timeout": 120,
            "llm": {
                "url": llm_url,
                "api_key": API_TOKEN,
                "system_messages": [
                    {"role": "system", "content": "Based on the user's mood and how they want to feel, suggest a song and explain why it fits. Then, ask if they'd like to play it on Spotify. Use songs without lyrics. If you think it makes sense ask if they would like you to guide them to medidate and if they say yes, read meditation guidance whilst the song plays "}
                ],
                "greeting_message": "Hello! How I'm a content therapist. Tell me how you're feeling and how you would like to feel and I'll help you feel better",
                "failure_message": "Sorry, I didn't understand that.",
                "max_history": 10,
                "params": {"model": "gpt-4o-mini"}
            },
            "asr": {
                "language": "en-US"
            },
            "tts": {
                "vendor": "microsoft",
                "params": {
                    "key": "79b53f0f0e244c8698de401a0b165431",
                    "region": "eastus",
                    "voice_name": "en-US-AndrewMultilingualNeural"
                }
            }
        }
    }

    logger.debug(f"📤 Agora API Payload: {json.dumps(payload, indent=2)}")

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)

        logger.debug(f"Agora Response: {response.status_code} - {response.text}")

        if response.status_code != 200:
            logger.error(f" Agora API returned an error: {response.text}")
            return {"error": f"Agora API returned {response.status_code}: {response.text}"}

        return response.json()
