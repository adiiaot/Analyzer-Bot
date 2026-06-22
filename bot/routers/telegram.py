from fastapi import APIRouter
from app.telegram_handler import TelegramBotHandler

router = APIRouter(
    tags=["Telegram"],
    prefix="/api"
)
bot_handler = TelegramBotHandler()


@router.post("/telegram")
async def telegram_webhook(update: dict):
    """Receive Telegram update via webhook and dispatch to handler.

    Currently a stub — the bot runs in polling mode via start_bot().
    """
