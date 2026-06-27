# Analyzer Bot — Full Documentation

> XAU/USD scalp trading bot with dual-model Nvidia AI verification, Telegram interface,
> and a real-time Next.js dashboard.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Structure](#2-project-structure)
3. [Bot — FastAPI Backend](#3-bot--fastapi-backend)
   - 3.1 Entry Point & Configuration
   - 3.2 Data Models
   - 3.3 Firestore Data Layer (per-collection classes)
   - 3.4 Signal Generator (4-Timeframe Engine)
   - 3.5 TradingView Client
   - 3.6 Firebase Manager (legacy)
   - 3.7 Telegram Command Handlers
   - 3.8 Nvidia Vision Analyzer
   - 3.9 Multi-Model Pipeline
   - 3.10 API Routers
   - 3.11 Utility Modules
4. [Dashboard — Next.js Frontend](#4-dashboard--nextjs-frontend)
   - 4.1 Pages
   - 4.2 API Routes
   - 4.3 Components
   - 4.4 Firebase Client Library
5. [AI Models](#5-ai-models)
6. [Trading Strategy](#6-trading-strategy)
7. [Configuration](#7-configuration)
8. [Deployment](#8-deployment)
9. [API Reference (Bot)](#9-api-reference-bot)
10. [API Reference (Dashboard)](#10-api-reference-dashboard)
11. [Environment Variables](#11-environment-variables)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Telegram User                        │
└────────────────────────┬────────────────────────────────────┘
                         │ /signal, /analyze, /log_trade, etc.
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Telegram Bot (python-telegram-bot)              │
│                   TelegramBotHandler                         │
│  ┌─────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ Signal  │  │  Screenshot  │  │ Trade / Stats / Help  │  │
│  │ Commands│  │   Handler    │  │      Commands         │  │
│  └────┬────┘  └──────┬───────┘  └──────────┬────────────┘  │
└───────┼──────────────┼──────────────────────┼───────────────┘
        │              │                      │
┌───────┴──────────────┴──────────────────────┴───────────────┐
│              FastAPI Server (bot/main.py)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Application Layer                    │   │
│  │  ┌────────────────┐  ┌──────────────────────────┐    │   │
│  │  │ SignalGenerator│  │   MultiModelPipeline     │    │   │
│  │  │  (4-TF Engine) │  │  (API + Vision Verify)   │    │   │
│  │  └───────┬────────┘  └───────────┬──────────────┘    │   │
│  │          │                       │                    │   │
│  │  ┌───────▼────────┐   ┌─────────▼──────────┐        │   │
│  │  │TradingViewClient│   │NvidiaVisionAnalyzer│        │   │
│  │  │   (RapidAPI)    │   │ (Llama 3.2 11B)    │        │   │
│  │  └────────────────┘   └────────────────────┘        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Data Layer                           │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │            FirebaseManager (Firestore)        │   │   │
│  │  │        signals/  trades/  stats               │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              REST Routers                             │   │
│  │  POST /api/signal  GET /api/trades  POST /api/trades │   │
│  │  GET /api/stats    GET /health      POST /webhook/.. │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
        │                              ▲
        │ HTTP proxy                  │ HTTP
        ▼                              │
┌─────────────────────────────────────────────────────────────┐
│              Next.js Dashboard (web/)                        │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Dashboard    │  │   Analytics      │  │   Learning   │  │
│  │  (Overview)   │  │ (4 Tabs: Perf,  │  │   (Nvidia    │  │
│  │               │  │  Screenshot,    │  │    Chatbot)  │  │
│  │               │  │  Verification,  │  │              │  │
│  │               │  │  Trade Insights)│  │              │  │
│  └──────────────┘  └──────────────────┘  └──────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            API Routes (Next.js Route Handlers)        │   │
│  │  /api/trades  /api/stats  /api/analyze-trade-nvidia  │   │
│  │  /api/analyze-screenshot  /api/learn                 │   │
│  │  /api/verification-history                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Firebase Web SDK (lib/firebase.ts)           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Data flow (signal generation):**
1. User sends `/signal` to Telegram
2. `TelegramBotHandler` calls `SignalGenerator.generate_signal()`
3. `SignalGenerator` fetches OHLCV candles from `TradingViewClient` (RapidAPI)
4. 4 timeframes are analysed (1H/4H → 15M → 5M → 1M)
5. A `Signal` object is created and persisted to Firestore via `FirebaseManager`
6. Formatted result is sent back to Telegram

**Data flow (screenshot verification):**
1. User sends `/analyze` then uploads a chart screenshot
2. `handle_screenshot` passes the image to `MultiModelPipeline`
3. Pipeline runs `SignalGenerator` (API data) and `NvidiaVisionAnalyzer` (vision) in parallel
4. `_verify_alignment` computes a score (0-100) comparing API vs vision results
5. Confidence is adjusted (+15% high alignment, -10% low alignment)
6. Final verified signal is returned to Telegram

---

## 2. Project Structure

```
root/
├── .gitignore
├── README.md
├── CHANGELOG.md
├── DOCUMENTATION.md

├── bot/                              # FastAPI Python backend
│   ├── main.py                       # Entry point, lifespan, FastAPI app factory
│   ├── config.py                     # All env-var configuration
│   ├── requirements.txt
│   ├── openapi.yaml                  # OpenAPI 3.0 specification
│   ├── railway.json                  # Railway deployment config (Nixpacks)
│   ├── setup_firestore.py            # Seed script: 8 collections, 23 documents
│   ├── firestore/                    # Firestore data-access layer (per collection)
│   │   ├── client.py                 # Singleton Firestore client
│   │   ├── signals.py                # SignalsDB — save/query/update signals
│   │   ├── trades.py                 # TradesDB — save/query trades
│   │   ├── journal.py                # JournalDB — save/query journal entries
│   │   └── logs.py                   # LogsDB — command audit logging
│   ├── handlers/                     # Telegram command handlers
│   │   ├── signal_handler.py         # /signal — generate trading signal
│   │   ├── log_trade_handler.py      # /log_trade — 4-step conversation flow
│   │   ├── journal_handler.py        # /journal — free-text journal entry
│   │   ├── stats_handler.py          # /stats — aggregated trading statistics
│   │   ├── dashboard_handler.py      # /dashboard — inline button to web dashboard
│   │   ├── clear_handler.py          # /clear — reset chat history
│   │   └── help_handler.py           # /help — list all commands
│   ├── telegram_bot/
│   │   └── commands.py               # Register all handlers with PTB Application
│   ├── app/                          # Legacy service layer (kept for REST API)
│   │   ├── models.py                 # Pydantic schemas (Signal, TradeLog, Stats, etc.)
│   │   ├── signal_generator.py       # Core 4-timeframe signal engine
│   │   ├── tradingview_client.py     # RapidAPI TradingView data wrapper
│   │   ├── firebase_manager.py       # Firestore singleton (CRUD for signals/trades)
│   │   ├── telegram_handler.py       # Legacy handler (not registered — kept for reference)
│   │   └── services/
│   │       ├── nvidia_vision_analyzer.py   # Llama 3.2 11B Vision chart analysis
│   │       └── multi_model_pipeline.py     # API + vision dual verification
│   ├── routers/
│   │   ├── signals.py                # POST/GET /api/signal, GET /api/api-stats
│   │   ├── trades.py                 # POST /api/trades, GET /api/trades, GET /api/stats
│   │   ├── telegram.py               # POST /webhook/telegram (stub)
│   │   └── admin.py                  # Admin health/status endpoints
│   └── utils/
│       ├── logger.py                 # Logging setup (stdout, structured format)
│       ├── validators.py             # Price + trade-arg validation
│       └── helpers.py                # ID generation, PnL helpers

├── web/                              # Next.js 14 frontend dashboard
│   ├── next.config.js
│   ├── vercel.json                   # Vercel deployment config
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── .env.example                  # Template for Vercel env vars
│   ├── app/
│   │   ├── layout.tsx                # Root layout (dark theme shell)
│   │   ├── page.tsx                  # Landing page with Enter button
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Overview — StatsCards + PerformanceChart + recent trades
│   │   │   ├── signals/page.tsx      # Active signals + signal history table
│   │   │   ├── trades/page.tsx       # Trade log with filters
│   │   │   ├── journal/page.tsx      # Trading journal entries with tag filters
│   │   │   ├── analytics/page.tsx    # 4-tab: Performance / Screenshot / Verification / Insights
│   │   │   ├── economic-calendar/page.tsx  # Live economic events with impact badges
│   │   │   └── learning/page.tsx     # Nvidia-powered Q&A chatbot + chart upload
│   │   └── api/
│   │       ├── trades/route.ts              # GET trades from Firestore
│   │       ├── stats/route.ts               # GET aggregated stats
│   │       ├── analyze-trade-nvidia/route.ts# POST Nvidia 70B trade analysis
│   │       ├── analyze-screenshot/route.ts  # POST proxy to Nvidia Vision API directly
│   │       ├── learn/route.ts               # POST Nvidia chatbot answer
│   │       └── verification-history/route.ts# GET mock verification metrics
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCards.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   └── OpenPositionsTable.tsx
│   │   ├── trades/
│   │   │   ├── TradeTable.tsx
│   │   │   └── TradeFilters.tsx
│   │   ├── ai/
│   │   │   ├── TradeAnalyzer.tsx
│   │   │   ├── LearningBot.tsx
│   │   │   ├── ScreenshotAnalyzer.tsx
│   │   │   └── VerificationDashboard.tsx
│   │   └── ui/
│   │       ├── Card.tsx
│   │       ├── Button.tsx
│   │       ├── Tabs.tsx
│   │       └── Spinner.tsx
│   ├── lib/
│   │   ├── firebase.ts               # Firebase Web SDK init + trade/stats queries
│   │   ├── data-context.tsx          # React context providing live Firestore data
│   │   ├── constants.ts              # Fallback mock data for empty Firestore
│   │   ├── hooks.ts                  # Custom hooks for real-time data
│   │   ├── api-client.ts             # Bot backend HTTP client helpers
│   │   └── formatters.ts             # Date, currency formatting
│   └── types/
│       └── index.ts                  # TypeScript interfaces (Trade, Signal, SignalEntry, etc.)
```

---

## 3. Bot — FastAPI Backend

### 3.1 Entry Point & Configuration

**`bot/main.py`** — Creates the FastAPI `app` instance, registers routers with prefixes, and defines startup/shutdown hooks. Exception handlers return JSON for both `HTTPException` and generic `Exception`. Root endpoint returns a self-documented API map.

**`bot/config.py`** — Single `Config` class that reads all settings from environment variables via `python-dotenv`. Key settings groups:
- Telegram credentials
- TradingView RapidAPI credentials
- Firebase service-account fields
- Nvidia NIM (model names, API URL, API key)
- Trading parameters (pair, lot size, signal validity, max hold)
- Confidence boost/penalty constants for the verification pipeline

### 3.2 Data Models (`bot/app/models.py`)

All Pydantic v2 models:

| Model | Purpose |
|-------|---------|
| `TrendEnum` | UP / DOWN / NEUTRAL |
| `ResultEnum` | win / loss / pending |
| `CandleData` | Single OHLCV candle (time, open, high, low, close, volume) |
| `SignalEntry` | One entry leg with price, TP, pip distance, auto-close flag |
| `Signal` | Full trading signal (id, timestamp, trend, 4 entries, S/R, flags, confidence) |
| `SignalResponse` | API response wrapper for signal generation |
| `TradeLog` | Incoming payload (entry/exit price, quantity, result, optional notes) |
| `TradeLogResponse` | Response after logging a trade (with calculated PnL) |
| `TradingStats` | Computed statistics (wins, losses, win rate, P&L, profit factor, streaks) |
| `TelegramMessage` | Incoming Telegram message stub |

### 3.3 Firestore Data Layer (`bot/firestore/`)

Each Firestore collection has a dedicated wrapper class:

| File | Class | Collection | Key Methods |
|------|-------|------------|-------------|
| `signals.py` | `SignalsDB` | `signals` | `save_signal()`, `get_latest_signals()`, `update_signal_status()` |
| `trades.py` | `TradesDB` | `trades` | `save_trade()`, `get_all_trades()` |
| `journal.py` | `JournalDB` | `journal` | `save_journal_entry()`, `get_user_journal()` |
| `logs.py` | `LogsDB` | `signals_sent_log` | `log_command()` — audit trail for every bot command |

All documents use **camelCase** field names matching the dashboard's TypeScript types. Fields like `entryPrice`, `supportLevel`, `entryNumber`, `tpPips`, `autoClose` are consistent across Python backends, seed scripts, and the Next.js frontend.

### 3.4 Signal Generator (`bot/app/signal_generator.py`)

The core business logic implementing a 4-timeframe scalping framework.

**Pipeline:**

```
Level 1 — Trend (1H + 4H)
  │  Fetch 10 candles from each timeframe
  │  Count higher highs/lows vs lower highs/lows
  │  Both timeframes must agree → confidence = average alignment
  │  Returns UP, DOWN, or NEUTRAL
  ▼
Level 2 — Support / Resistance (15M)
  │  Scan 20 candles for swing lows (support) and swing highs (resistance)
  │  Returns the most recent level for each
  ▼
Level 3 — Pullback Detection (5M)
  │  Check if price is within 10 pips of support (uptrend) or resistance (downtrend)
  │  Also checks volatility is low (< 5% ATR ratio)
  ▼
Level 4 — Entry Confirmation (1M)
  │  Looks for a reversal candle: pin bar (small body, long wick) or engulfing pattern
  │  Entry price = low + 1 pip (uptrend) or high - 1 pip (downtrend)
  ▼
Build Signal
  │  4 stacked entries:
  │    Entry 1: entry_price, TP +20 pips, AUTO CLOSE
  │    Entry 2: entry_price - 5 pips, TP +40 pips, Manual
  │    Entry 3: entry_price - 10 pips, TP +60 pips, Manual
  │    Entry 4: entry_price - 15 pips, TP +80 pips, Manual
  │  Valid for 3 hours, base confidence = 0.75
```

Key methods:
- `generate_signal()` — Orchestrates all 4 levels.
- `_analyze_trend()` — Level 1.
- `_detect_trend_direction(df)` — Scans a DataFrame of candles for HH/HL or LH/LL.
- `_find_levels()` — Level 2.
- `_detect_pullback(support, resistance, trend)` — Level 3.
- `_calculate_volatility(df)` — Normalized ATR = avg(high - low) / avg(close).
- `_confirm_entry(support, resistance, trend)` — Level 4.
- `_detect_reversal_candle(df)` — Pin bar or engulfing detection.
- `_build_signal(trend, entry_price, support, resistance)` — Assembles the final Signal.

### 3.5 TradingView Client (`bot/app/tradingview_client.py`)

Wrapper for the [TradingView Data API on RapidAPI](https://rapidapi.com/tradingview-tradingview-default/api/tradingview-data1).

- Fetches OHLCV candle data using `GET /api/price/{symbol}` endpoint with `timeframe` and `range` params.
- Response fields: `time`, `open`, `close`, `max` (high), `min` (low), `volume` inside `data.history[]`.
- Tracks request count against a configurable rate limit (default 150/month — free-tier cap).
- Returns `List[CandleData]` or `None` on rate-limit hit / API error.
- `get_request_count()` returns `{used, limit, remaining}` for monitoring.

### 3.7 Firebase Manager (`bot/app/firebase_manager.py`)

Singleton pattern — one `FirebaseManager` instance per process. Note: new commands use the per-collection classes in `bot/firestore/` instead. This class is kept for the REST API routers.

| Method | Description |
|--------|-------------|
| `save_signal(signal)` | Writes to `signals/{id}` collection |
| `get_signal(signal_id)` | Reads a signal document |
| `log_trade(trade, signal_id)` | Writes to `trades/{id}` with calculated PnL |
| `get_all_trades()` | Returns all trades sorted by timestamp DESC |
| `calculate_stats()` | Computes win rate, total P&L, profit factor, avg win/loss, max streaks |

### 3.6 Telegram Command Handlers (`bot/handlers/`)

Commands are implemented as individual handler classes in `bot/handlers/` and registered via `telegram_bot/commands.py` using `python-telegram-bot` v20+ `Application.add_handler()`.

**Commands:**

| Command | Handler File | Description |
|---------|--------------|-------------|
| `/signal` | `signal_handler.py` | Generate API-based signal via 4-TF engine, save to Firestore, return formatted message |
| `/log_trade` | `log_trade_handler.py` | 4-step conversation flow: entry price → exit price → result (Win/Loss) → confirm. Calculates PnL and persists to Firestore `trades` collection |
| `/journal` | `journal_handler.py` | Conversation: free-text entry, saved to Firestore `journal` collection |
| `/stats` | `stats_handler.py` | Display total signals, win rate, P&L, and latest signals from Firestore |
| `/dashboard` | `dashboard_handler.py` | Inline keyboard button linking to the web dashboard at `DASHBOARD_URL` |
| `/clear` | `clear_handler.py` | Delete bot messages and send a fresh-start message |
| `/help` | `help_handler.py` | List all 7 commands with usage examples |

**Registration** (`bot/telegram_bot/commands.py`): The `register_commands()` function is called during FastAPI's `lifespan` startup. It builds a `ConversationHandler` for `/log_trade` and `/journal`, registers simple `CommandHandler`s for the rest, and adds them to the `Application`.

**Legacy** (`bot/app/telegram_handler.py`): The old monolithic `TelegramBotHandler` class with 6 commands + screenshot analysis is preserved but not registered. The new modular architecture is preferred.

### 3.7 Nvidia Vision Analyzer (`bot/app/services/nvidia_vision_analyzer.py`)

Sends chart screenshots to Llama 3.2 11B Vision via Nvidia NIM API.

- Prompt asks for JSON output: `current_price`, `support_levels`, `resistance_levels`, `trend`, `pattern`, `rsi`, `volume_trend`, `observations`, `confidence`.
- In-memory cache keyed by MD5 hash (TTL configurable, default 5 min).
- Fallback response returns neutral data on error.
- `clear_cache()` evicts expired entries.

### 3.8 Multi-Model Pipeline (`bot/app/services/multi_model_pipeline.py`)

Coordinates dual-verification between API data and vision analysis.

**Modes:**

1. **API-only** (`process_api_only`) — Runs `SignalGenerator` alone, returns signal with `verified: false`.
2. **API + Screenshot** (`process_with_screenshot`) — Runs both, calls `_verify_alignment`, adjusts confidence.

**Alignment scoring (`_verify_alignment`):**

| Check | Penalty / Boost |
|-------|----------------|
| Support level mismatch > 0.5% | -15 |
| Resistance level mismatch > 0.5% | -15 |
| Trend direction mismatch | -20 |
| Trend direction match | +10 |
| Low vision confidence (< 50%) | -20 |
| Pattern detected (informational) | — |

Final score is clamped to [0, 100], then mapped to confidence:
- ≥ 80 → +15% boost ("high alignment")
- ≥ 60 → +5% boost ("medium alignment")
- < 40 → -10% penalty ("low alignment")

### 3.9 API Routers

**`routers/signals.py`** (`/api/signal` prefix):

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/signal` | Generate and persist a new signal |
| GET | `/api/signal/{id}` | Retrieve a signal by ID |
| GET | `/api/api-stats` | TradingView API request usage |

**`routers/trades.py`** (`/api/trades` prefix):

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/trades` | Log a trade |
| GET | `/api/trades` | List all trades |
| GET | `/api/stats` | Aggregated statistics |

**`routers/telegram.py`** (`/webhook/telegram` prefix):

| Method | Path | Description |
|--------|------|-------------|
| POST | `/webhook/telegram` | Webhook receiver (stub — polling mode used) |

### 3.10 Utility Modules

**`utils/logger.py`** — `setup_logging()` configures a structured stdout formatter: `%Y-%m-%d %H:%M:%S | %name | %level | %message`.

**`utils/validators.py`:**
- `validate_price(str)` → parses positive float or returns `None`.
- `validate_trade_args(list)` → parses Telegram `/log_trade` arguments.

**`utils/helpers.py`:**
- `generate_id(prefix)` / `generate_trade_id()` — timestamp-based unique IDs.
- `round_price(value, decimals)` — price rounding.
- `calculate_pnl(entry, exit, result)` — absolute P&L.
- `calculate_pnl_percent(entry, pnl)` — P&L as percentage of entry.

---

## 4. Dashboard — Next.js Frontend

### 4.1 Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `page.tsx` | Landing page with "Enter Dashboard" button |
| `/dashboard` | `dashboard/page.tsx` | Overview: StatsCards KPI panel, cumulative P&L chart, recent 10 trades. Auto-refreshes every 30s. |
| `/dashboard/trades` | `trades/page.tsx` | Full trade log with filters (result, date range) |
| `/dashboard/analytics` | `analytics/page.tsx` | 4-tab analytical view |
| `/dashboard/learning` | `learning/page.tsx` | Nvidia-powered trading Q&A chatbot |

### 4.2 API Routes

| Route | Method | Description | Backend |
|-------|--------|-------------|---------|
| `/api/trades` | GET | Fetch trades from Firestore | `lib/firebase.ts` → `getTrades(limit)` |
| `/api/stats` | GET | Compute aggregated stats | `lib/firebase.ts` → `calculateStats(trades)` |
| `/api/analyze-trade-nvidia` | POST | Send trade to Nvidia 70B for analysis | Direct Nvidia NIM call |
| `/api/analyze-screenshot` | POST | Proxy to bot backend for screenshot analysis | `NEXT_PUBLIC_BOT_API_URL` |
| `/api/learn` | POST | Send question to Nvidia chatbot | Direct Nvidia NIM call (Llama 3.1 70B) |
| `/api/verification-history` | GET | Return mock verification metrics (generated from trade data) | `lib/firebase.ts` |

### 4.3 Components

**Layout:**
- `Header.tsx` — Top navigation bar (dark slate theme).
- `Sidebar.tsx` — Links to Dashboard / Trades / Analytics / Learning.

**Dashboard:**
- `StatsCards.tsx` — KPI cards (Total Trades, Win Rate, P&L, Profit Factor, Avg Win/Loss, Capital).
- `PerformanceChart.tsx` — Recharts line chart (cumulative P&L over time).

**Trades:**
- `TradeTable.tsx` — Sortable table (time, entry, exit, P&L, result).
- `TradeFilters.tsx` — Filter by result (win/loss) and date range.

**AI:**
- `TradeAnalyzer.tsx` — Select a trade, call Nvidia 70B, display analysis response.
- `LearningBot.tsx` — Chat-style interface for trading Q&A (Nvidia backend).
- `ScreenshotAnalyzer.tsx` — Upload a chart screenshot, display signal + verification results.
- `VerificationDashboard.tsx` — Score trend chart + mode distribution (API-only vs dual-verify).

**UI Primitives:**
- `Card.tsx`, `Button.tsx`, `Tabs.tsx`, `Spinner.tsx` — Shared styled components.

### 4.4 Firebase Client Library (`lib/firebase.ts`)

Web SDK initialisation (reads config from `NEXT_PUBLIC_FIREBASE_*` env vars).

| Export | Description |
|--------|-------------|
| `db` | Firestore database instance |
| `getTrades(limit)` | Query `trades` collection ordered by `timestamp` DESC |
| `calculateStats(trades)` | Pure-function stats computation (not Firestore-dependent) |

---

## 5. AI Models

All models run on **Nvidia NIM** (free tier). No Claude, OpenAI, or Anthropic dependencies.

| Model | Purpose | File | Cost |
|-------|---------|------|------|
| Llama 3.2 11B Vision | Chart screenshot analysis (S/R, patterns, trend) | `nvidia_vision_analyzer.py` | $0 (NIM free tier) |
| Llama 3.3 70B Instruct | Trade analysis & strategic insights | `analyze-trade-nvidia/route.ts` | $0 |
| Llama 3.1 8B Instruct | Data processing & level identification (fallback) | `config.py` (default processor model) | $0 |
| Llama 3.1 70B Instruct | Learning Hub Q&A chatbot | `learn/route.ts` | $0 |

**Verification pipeline (dual-model):**
1. `SignalGenerator` analyses API data (no AI, algorithmic)
2. `NvidiaVisionAnalyzer` (Vision 11B) analyses the screenshot
3. `MultiModelPipeline` compares both and produces a score

---

## 6. Trading Strategy

**Instrument:** XAU/USD (Gold vs US Dollar)

**Approach:** Scalping with 4-leg pyramiding.

**Signal structure:**
```
Entry 1: current_price        TP +20 pips  → auto-close at 20 pips profit
Entry 2: current_price - 5p  TP +40 pips  → manual close
Entry 3: current_price - 10p TP +60 pips  → manual close
Entry 4: current_price - 15p TP +80 pips  → manual close
```

**Risk management:**
- Max hold time: 5 minutes
- Lot size: 0.01 (micro lot)
- Signal validity: 3 hours
- Only one signal generated per candle cycle

**Entry conditions (all must be true):**
1. 1H and 4H agree on trend direction
2. Price is at a 15M support level (uptrend) or resistance level (downtrend)
3. A pullback is in progress on 5M (price within 10 pips of the key level, low volatility)
4. 1M shows a reversal candle (pin bar or engulfing)

---

## 7. Configuration

### Env Files

**`bot/.env`** (required vars):

```ini
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=aot_analyzer_bot
TRADINGVIEW_API_KEY=...
TRADINGVIEW_API_HOST=tradingview-data1.p.rapidapi.com
FIREBASE_CREDENTIALS_PATH=../aot-analyzer-bot-firebase-adminsdk-xxx.json
# OR individual fields:
FIREBASE_PROJECT_ID=aot-analyzer-bot
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@aot-analyzer-bot.iam.gserviceaccount.com
NVIDIA_NIM_API_KEY=nvapi-...
DEBUG=True
LOG_LEVEL=INFO
DASHBOARD_URL=https://analyzer-dashboard-kohl.vercel.app
```

**`web/.env.local`** (required vars):

```ini
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aot-analyzer-bot
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aot-analyzer-bot.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://aot-analyzer-bot.firebaseio.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aot-analyzer-bot.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_BOT_API_URL=https://your-bot.up.railway.app
NEXT_PUBLIC_NVIDIA_API_KEY=nvapi-...
NEXT_PUBLIC_NVIDIA_MODEL=nvidia/llama-3.1-nemotron-nano-vl-8b-v1
```

### Config Constants (Hard Defaults)

Defined in `bot/config.py`:

| Constant | Default | Description |
|----------|---------|-------------|
| `TRADING_PAIR` | `FOREXCOM:XAUUSD` | TradingView symbol |
| `SIGNAL_VALIDITY_HOURS` | 3 | Signal lifetime |
| `LOT_SIZE` | 0.01 | Default lot size |
| `MAX_HOLD_TIME_MINUTES` | 5 | Scalping max hold |
| `TRADINGVIEW_REQUESTS_LIMIT` | 150 | Monthly cap (free tier) |
| `TRADINGVIEW_REQUESTS_PER_DAY` | 5 | Estimated daily safe limit |
| `MAX_SCREENSHOT_SIZE_MB` | 10 | Upload size limit |
| `SCREENSHOT_CACHE_MINUTES` | 5 | Vision cache TTL |
| `VERIFICATION_THRESHOLD_SCORE` | 60 | Minimum score for verified signal |
| `CONFIDENCE_BOOST_HIGH` | 15 | +15% for alignment ≥ 80 |
| `CONFIDENCE_BOOST_MEDIUM` | 5 | +5% for alignment ≥ 60 |
| `CONFIDENCE_PENALTY` | 10 | -10% for alignment < 40 |
| `DASHBOARD_URL` | `https://analyzer-dashboard-kohl.vercel.app` | Web dashboard URL for /dashboard command |

---

## 8. Deployment

### Bot (FastAPI)

**Locally:**
```bash
cd bot
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Production (Railway — Nixpacks):**
A `bot/railway.json` is provided with Nixpacks build config. Set all env vars in the Railway dashboard. The health check endpoint is `/health`.

The Telegram bot runs in polling mode (no webhook needed). The webhook router (`/webhook/telegram`) is a stub.

### Dashboard (Next.js)

**Locally:**
```bash
cd web
npm install
npm run dev
```

**Production (Vercel):**
A `web/vercel.json` is provided. Set all `NEXT_PUBLIC_*` env vars in the Vercel dashboard. Deploy via git integration or Vercel CLI.

```bash
vercel --prod
```

Live at: [https://analyzer-dashboard-kohl.vercel.app](https://analyzer-dashboard-kohl.vercel.app)

### Environment Templates

Copy the template files and fill in your values:

```bash
cp bot/.env.example bot/.env        # then edit bot/.env
cp web/.env.example web/.env.local  # then edit web/.env.local
```

---

## 9. API Reference (Bot)

Base URL: `http://localhost:8000`

### Root

```
GET /
```
Returns API name, status, docs URL, endpoint map.

### Health

```
GET /health
```
Returns `{status, timestamp, version}`.

### Signals

```
POST /api/signal
```
Generate a new signal. Returns `SignalResponse`.

```
GET /api/signal/{signal_id}
```
Retrieve a signal by ID.

```
GET /api/api-stats
```
Returns `{used, limit, remaining}` for TradingView API.

### Trades

```
POST /api/trades
Content-Type: application/json

{
  "entry_price": 2345.50,
  "exit_price": 2365.50,
  "result": "win",
  "quantity": 0.01,
  "notes": "...",
  "hold_time_seconds": 120
}
```
Logs a trade. Returns `TradeLogResponse`.

```
GET /api/trades
```
List all trades sorted by timestamp DESC.

```
GET /api/stats
```
Returns `TradingStats`.

### Telegram Webhook

```
POST /webhook/telegram
```
Stub — not used in polling mode.

Full OpenAPI 3.0 spec available at `bot/openapi.yaml`.

---

## 10. API Reference (Dashboard)

Base URL: `http://localhost:3000`

All routes are Next.js Route Handlers.

### Trades

```
GET /api/trades?limit=100
```
Fetches trades from Firestore Web SDK. Returns `{success, trades[]}`.

### Stats

```
GET /api/stats
```
Computes stats from fetched trades. Returns `{success, stats}`.

### Analyze Trade (Nvidia 70B)

```
POST /api/analyze-trade-nvidia
Content-Type: application/json

{
  "trade": { "entry_price": 2345, "exit_price": 2365, "pnl": 19.5, "pnl_percent": 0.83, "result": "win", "hold_time_seconds": 120 },
  "signal": { "trend": "UP" }
}
```
Returns `{success, analysis (string), timestamp}`.

### Analyze Screenshot

```
POST /api/analyze-screenshot
Content-Type: application/json

{ "screenshot_base64": "<base64-encoded PNG>" }
```
Proxies to `NEXT_PUBLIC_BOT_API_URL/api/analyze-screenshot`.

### Learning Q&A

```
POST /api/learn
Content-Type: application/json

{
  "question": "What is the best time to trade gold?",
  "conversationHistory": []
}
```
Returns `{success, answer (string), timestamp}`.

### Verification History

```
GET /api/verification-history
```
Returns mock verification data (score trends, mode distribution). `{success, data[], avgScore, successRate}`.

---

## 11. Environment Variables

### Bot (`bot/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Yes | Telegram bot token from @BotFather |
| `TELEGRAM_CHAT_ID` | Yes | Default chat for broadcast signals |
| `TRADINGVIEW_API_KEY` | Yes | RapidAPI subscription key |
| `TRADINGVIEW_API_HOST` | Yes | RapidAPI host (`tradingview-data1.p.rapidapi.com`) |
| `FIREBASE_PROJECT_ID` | Yes | Firebase project identifier |
| `FIREBASE_PRIVATE_KEY` | Yes | Firestore service account private key |
| `FIREBASE_CLIENT_EMAIL` | Yes | Firestore service account email |
| `NVIDIA_NIM_API_KEY` | Yes | Nvidia NIM free-tier API key (`nvapi-...`) |
| `DEBUG` | No | Enable debug mode (default `False`) |
| `LOG_LEVEL` | No | Logging level (default `INFO`) |
| `NVIDIA_MODEL_PROCESSOR` | No | Processor model (default: Llama 3.1 8B) |
| `NVIDIA_MODEL_VISION` | No | Vision model (default: Llama 3.2 11B) |
| `NVIDIA_MODEL_STRATEGIST` | No | Strategist model (default: Llama 3.3 70B) |
| `MAX_SCREENSHOT_SIZE_MB` | No | Upload limit in MB (default 10) |
| `SCREENSHOT_CACHE_MINUTES` | No | Vision cache TTL (default 5) |
| `VERIFICATION_THRESHOLD_SCORE` | No | Min score for verified signal (default 60) |
| `CONFIDENCE_BOOST_HIGH` | No | High alignment bonus % (default 15) |
| `CONFIDENCE_BOOST_MEDIUM` | No | Medium alignment bonus % (default 5) |
| `CONFIDENCE_PENALTY` | No | Low alignment penalty % (default 10) |
| `DASHBOARD_URL` | No | Web dashboard URL for /dashboard command (default: `https://analyzer-dashboard-kohl.vercel.app`) |

### Dashboard (`web/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | `aot-analyzer-bot` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase Web SDK API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | `<project>.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Yes | `https://<project>.firebaseio.com` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | `<project>.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | No | Firebase measurement ID (Analytics) |
| `NEXT_PUBLIC_BOT_API_URL` | Yes | Bot backend URL (e.g. `https://your-bot.up.railway.app`) |
| `NEXT_PUBLIC_NVIDIA_API_KEY` | Yes | Nvidia NIM API key |
| `NEXT_PUBLIC_NVIDIA_MODEL` | No | Nvidia vision model name (default: `nvidia/llama-3.1-nemotron-nano-vl-8b-v1`) |
| `NEXT_PUBLIC_MAX_SCREENSHOT_SIZE_MB` | No | Upload size limit in MB (default 10) |
| `NEXT_PUBLIC_ALLOWED_IMAGE_TYPES` | No | Comma-separated MIME types (default: `image/png,image/jpeg,image/webp`) |

---

## Appendix: Useful Commands

```bash
# Bot
cd bot
pip install -r requirements.txt
uvicorn main:app --reload

# Dashboard
cd web
npm install
npm run dev

# Python 3.14 note: Use >= version pins, not ==, because pre-built wheels
# for old numpy/pandas version pins don't exist for 3.14.
```
