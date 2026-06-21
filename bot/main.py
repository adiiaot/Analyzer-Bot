from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import logging
import uvicorn
from datetime import datetime
from app.telegram_handler import TelegramBotHandler
from routers import signals, trades, telegram as telegram_router
from config import Config
from utils.logger import setup_logging

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Analyzer Bot API",
    description="XAU/USD Trading Signal Generator",
    version="1.0.0"
)

bot_handler = TelegramBotHandler()


@app.on_event("startup")
async def startup():
    logger.info("Analyzer Bot API starting up...")
    logger.info(f"Environment: {Config.BOT_ENV}")
    logger.info(f"Debug mode: {Config.DEBUG}")


@app.on_event("shutdown")
async def shutdown():
    logger.info("Analyzer Bot API shutting down...")


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }


app.include_router(signals.router, prefix="/api", tags=["signals"])
app.include_router(trades.router, prefix="/api", tags=["trades"])
app.include_router(telegram_router.router, prefix="/webhook", tags=["telegram"])


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )


@app.get("/")
async def root():
    return {
        "name": "Analyzer Bot API",
        "status": "running",
        "documentation": "/docs",
        "endpoints": {
            "signals": "/api/signal",
            "trades": "/api/trades",
            "stats": "/api/stats",
            "health": "/health"
        }
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=Config.DEBUG,
        log_level=Config.LOG_LEVEL.lower()
    )
