import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

AGORA_APP_ID = os.getenv("AGORA_APP_ID")
AGORA_CUSTOMER_ID = os.getenv("AGORA_CUSTOMER_ID")
AGORA_CUSTOMER_SECRET = os.getenv("AGORA_CUSTOMER_SECRET")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_ACCESS_TOKEN = os.getenv("SPOTIFY_ACCESS_TOKEN")  # Needs OAuth login process
FASTAPI_WRAPPER_URL = os.getenv("FASTAPI_WRAPPER_URL")  # URL of our OpenAI wrapper
API_TOKEN = os.getenv("API_TOKEN")  # Security token for FastAPI wrapper