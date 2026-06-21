# Analyzer Bot

Production-grade **XAU/USD trading signal bot** for Telegram, powered by FastAPI + Next.js dashboard. Generates scalp trading signals using signal generator logic across 4 timeframes, logs trades to Firebase, and includes multi-model AI screenshot verification (Nvidia Vision + Llama).

## Features

- **Signal Engine** — 4-timeframe analysis (1H/4H trend, 15M S/R, 5M pullback, 1M entry confirmation)
- **Telegram Bot** — 6 commands: `/signal`, `/analyze`, `/log_trade`, `/stats`, `/dashboard`, `/help`
- **Screenshot Verification** — Upload chart screenshots for dual-verified signals via Nvidia Vision AI
- **REST API** — Endpoints for signals, trades, and trading statistics
- **Web Dashboard** — Next.js 14 dashboard with charts, trade table, AI trade analysis (Nvidia Llama 3.3 70B), learning Q&A (Nvidia), and screenshot upload
- **Firebase Firestore** — Persistent storage for signals and trade logs
- **TradingView Integration** — Real-time OHLCV candle data via RapidAPI

## Tech Stack

**Bot:** FastAPI · python-telegram-bot · Firebase Admin · Pandas · aiohttp · Uvicorn  
**Dashboard:** Next.js 14 · Tailwind CSS · Recharts · Firebase Web SDK  
**AI:** Nvidia Vision (Llama 3.2 11B) · Nvidia Strategist (Llama 3.3 70B) · Nvidia Processor (Llama 3.1 8B)

## Getting Started

### Bot
```bash
cd bot
pip install -r requirements.txt
```

Fill in `bot/.env` with your API keys, then:

```bash
uvicorn main:app --reload
```

### Dashboard
```bash
cd web
npm install
npm run dev
```

Fill in `web/.env.local` with API keys and Firebase config.

## Project Structure

```
bot/
├── main.py                  # FastAPI entry point
├── config.py                # Environment configuration
├── app/
│   ├── models.py            # Pydantic schemas
│   ├── tradingview_client.py
│   ├── signal_generator.py
│   ├── firebase_manager.py
│   ├── telegram_handler.py
│   └── services/
│       ├── nvidia_vision_analyzer.py
│       └── multi_model_pipeline.py
├── routers/
│   ├── signals.py
│   ├── trades.py
│   └── telegram.py
└── utils/
    ├── logger.py
    ├── validators.py
    └── helpers.py

web/
├── app/
│   ├── layout.tsx, page.tsx
│   ├── dashboard/
│   │   ├── page.tsx              # Overview
│   │   ├── trades/page.tsx       # Trade log
│   │   ├── analytics/page.tsx    # Charts & AI
│   │   └── learning/page.tsx     # Q&A chatbot
│   └── api/                      # Next.js API routes
│       ├── trades/route.ts
│       ├── stats/route.ts
│       ├── analyze-trade-nvidia/route.ts
│       ├── learn/route.ts
│       ├── analyze-screenshot/route.ts
│       └── verification-history/route.ts
├── components/
│   ├── layout/                   # Header, Sidebar
│   ├── dashboard/                # StatsCards, PerformanceChart
│   ├── trades/                   # TradeTable, TradeFilters
│   ├── ai/                       # TradeAnalyzer, LearningBot,
│   │                             # ScreenshotAnalyzer, VerificationDashboard
│   └── ui/                       # Card, Button, Tabs, Spinner
├── lib/                          # firebase, api-client, formatters
└── types/                        # TypeScript interfaces
```

## API Endpoints (Bot)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Root info |
| GET | `/health` | Health check |
| POST | `/api/signal` | Generate trading signal |
| GET | `/api/signal/{id}` | Get signal by ID |
| POST | `/api/trades` | Log a trade |
| GET | `/api/trades` | Get all trades |
| GET | `/api/stats` | Trading statistics |

## AI Models Used

| Model | Purpose |
|-------|---------|
| Llama 3.2 11B Vision | Chart screenshot analysis (support/resistance, patterns) |
| Llama 3.3 70B Instruct | Trade analysis & strategic insights |
| Llama 3.1 8B Instruct | Data processing & level identification |

All models run via **Nvidia NIM** (free tier) — no Claude/OpenAI costs.

---

*Built for AOT — portfolio project.*
