from fastapi import APIRouter
from app.telegram_handler import TelegramBotHandler

router = APIRouter()
bot_handler = TelegramBotHandler()


@router.post("/telegram")
async def telegram_webhook(update: dict):
    pass
