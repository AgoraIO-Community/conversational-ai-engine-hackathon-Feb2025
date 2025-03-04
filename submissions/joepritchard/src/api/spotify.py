import httpx
import logging
import os
import json
from api.config import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_ACCESS_TOKEN

#  Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

SPOTIFY_API_BASE = "https://api.spotify.com/v1"

async def refresh_spotify_token():
    """Refreshes the Spotify OAuth token."""
    try:
        auth = httpx.BasicAuth(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
        response = httpx.post(
            "https://accounts.spotify.com/api/token",
            data={"grant_type": "client_credentials"},
            auth=auth,
        )

        if response.status_code == 200:
            token_data = response.json()
            global SPOTIFY_ACCESS_TOKEN
            SPOTIFY_ACCESS_TOKEN = token_data["access_token"]
            logger.info(" Spotify token refreshed successfully.")
        else:
            logger.error(f" Failed to refresh Spotify token: {response.text}")

    except Exception as e:
        logger.error(f" Exception in refresh_spotify_token: {str(e)}")

async def search_spotify_track(song_name):
    """Searches for a track on Spotify."""
    headers = {"Authorization": f"Bearer {SPOTIFY_ACCESS_TOKEN}"}
    params = {"q": song_name, "type": "track", "limit": 1, "market": "FR"}

    try:
        response = httpx.get(f"{SPOTIFY_API_BASE}/search", headers=headers, params=params)

        if response.status_code == 401:  # Token expired
            await refresh_spotify_token()
            headers["Authorization"] = f"Bearer {SPOTIFY_ACCESS_TOKEN}"
            response = httpx.get(f"{SPOTIFY_API_BASE}/search", headers=headers, params=params)

        if response.status_code == 200:
            track_data = response.json()
            if track_data["tracks"]["items"]:
                return track_data["tracks"]["items"][0]["uri"]
            else:
                return None
        else:
            logger.error(f" Failed to search track on Spotify: {response.text}")
            return None

    except Exception as e:
        logger.error(f" Exception in search_spotify_track: {str(e)}")
        return None