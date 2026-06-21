import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
    TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

    TRADINGVIEW_API_KEY = os.getenv('TRADINGVIEW_API_KEY')
    TRADINGVIEW_API_HOST = os.getenv('TRADINGVIEW_API_HOST')
    TRADINGVIEW_BASE_URL = 'https://tradingview-data1.p.rapidapi.com'

    FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')
    FIREBASE_PRIVATE_KEY = os.getenv('FIREBASE_PRIVATE_KEY')
    FIREBASE_CLIENT_EMAIL = os.getenv('FIREBASE_CLIENT_EMAIL')
    FIREBASE_DATABASE_URL = f'https://{FIREBASE_PROJECT_ID}.firebaseio.com'

    BOT_ENV = os.getenv('BOT_ENV', 'development')
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')

    TRADING_PAIR = 'FOREXCOM:XAUUSD'
    SIGNAL_VALIDITY_HOURS = 3
    LOT_SIZE = 0.01
    MAX_HOLD_TIME_MINUTES = 5

    TRADINGVIEW_REQUESTS_LIMIT = 150
    TRADINGVIEW_REQUESTS_PER_DAY = 5
