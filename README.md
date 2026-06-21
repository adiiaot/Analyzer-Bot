# Analyzer Bot

Production-grade **XAU/USD trading signal bot** for Telegram, powered by FastAPI. Generates scalp trading signals using Mr PFX logic across 4 timeframes, logs trades to Firebase, and exposes a REST API for a Next.js dashboard.

## Features

- **Signal Engine** — 4-timeframe analysis (1H/4H trend, 15M S/R, 5M pullback, 1M entry confirmation)
- **Telegram Bot** — 5 commands: `/signal`, `/log_trade`, `/stats`, `/dashboard`, `/help`
- **REST API** — Endpoints for signals, trades, and trading statistics
- **Firebase Firestore** — Persistent storage for signals and trade logs
- **TradingView Integration** — Real-time OHLCV candle data via RapidAPI

## Tech Stack

FastAPI · python-telegram-bot · Firebase Admin · Pandas · aiohttp · Uvicorn

## Getting Started

```bash
cd bot
pip install -r requirements.txt
```

Fill in `bot/.env` with your API keys, then:

```bash
uvicorn main:app --reload
```

## Project Structure

```
bot/
├── main.py                  # FastAPI entry point
├── config.py                # Environment configuration
├── app/
│   ├── models.py            # Pydantic schemas
│   ├── tradingview_client.py
│   ├── signal_generator.py  # Mr PFX logic
│   ├── firebase_manager.py
│   └── telegram_handler.py
├── routers/
│   ├── signals.py
│   ├── trades.py
│   └── telegram.py
└── utils/
    ├── logger.py
    ├── validators.py
    └── helpers.py
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Root info |
| GET | `/health` | Health check |
| POST | `/api/signal` | Generate trading signal |
| GET | `/api/signal/{id}` | Get signal by ID |
| POST | `/api/trades` | Log a trade |
| GET | `/api/trades` | Get all trades |
| GET | `/api/stats` | Trading statistics |

---

*Built for AOT — portfolio project.*
