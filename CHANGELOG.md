# Changelog

All notable changes to the Analyzer Bot project will be documented in this file.

## [1.0.0] - 2026-06-21

### Added
- FastAPI bot backend with Telegram integration (python-telegram-bot v20+)
- Mr PFX 4-timeframe signal generation engine:
  - Level 1: 1H/4H trend determination (higher highs/lows)
  - Level 2: 15M support/resistance level identification
  - Level 3: 5M pullback detection with volatility check
  - Level 4: 1M entry confirmation (pin bar / engulfing patterns)
- Signal building with 4 stacked entries (TP +20/+40/+60/+80 pips)
- TradingView API client via RapidAPI with rate limiting
- Firebase Firestore integration (singleton pattern):
  - Signal save/retrieve operations
  - Trade logging with PnL calculation
  - Trading statistics with win/loss streaks
- Telegram bot with 6 commands:
  - `/signal` — Generate API-based signal
  - `/analyze` — Upload chart for dual-verified signal
  - `/log_trade` — Log completed trade with entry/exit/result
  - `/stats` — View trading statistics
  - `/dashboard` — Open web dashboard link
  - `/help` — Show all commands
- Nvidia Vision analyzer (Llama 3.2 11B Vision):
  - Chart screenshot analysis
  - In-memory caching (configurable TTL)
  - JSON parsing with structured output
- Multi-model AI pipeline:
  - API-only mode (TradingView data)
  - API + Screenshot dual-verification mode
  - Verification scoring (0-100) with confidence boost/penalty
  - Automatic fallback on vision failure
- Next.js 14 web dashboard (App Router):
  - Dark theme UI (Tailwind CSS)
  - Home/landing page with enter button
  - Dashboard overview with StatsCards (KPI cards)
  - Performance chart (cumulative P&L line chart via Recharts)
  - Trade log page with filters (result, date range) and CSV export
  - Analytics page with 4-tab layout:
    - Performance tab
    - Screenshot Analysis tab (upload + verification display)
    - Verification Metrics tab (score trend, mode distribution)
    - Trade Insights tab (AI-powered analysis)
  - Learning Hub page with Nvidia AI chatbot
- Nvidia API integration:
  - Llama 3.3 70B for trade analysis
  - Llama 3.1 8B for data processing
  - Learning Q&A bot (Nvidia NIM)
- API route endpoints:
  - `GET /api/trades` — Fetch from Firebase
  - `GET /api/stats` — Calculate statistics
  - `POST /api/analyze-trade-nvidia` — Nvidia trade analysis
  - `POST /api/learn` — Nvidia learning Q&A
  - `POST /api/analyze-screenshot` — Proxy to bot backend
  - `GET /api/verification-history` — Verification metrics

### Infrastructure
- Python 3.9+ with FastAPI + Uvicorn
- TypeScript with Next.js 14 + Tailwind CSS
- Environment-based configuration (`.env` / `.env.local`)
- Firebase Firestore read/write for trades and signals
- `.gitignore` for secrets, cache, and build artifacts
- OpenAPI 3.0 specification
- Vercel-ready config for dashboard deployment
- Railway-ready config for bot deployment

## [Unreleased]

### Planned
- Live chart streaming (WebSocket)
- Mobile-responsive sidebar improvements
- Unit tests for signal generation
- CI/CD pipeline (GitHub Actions)
