# Professional Trading Dashboard Specification v2.0
## Multi-Page Trading Command Center with Live Data & Learning Hub

**Project:** XAU/USD Trading Analysis Platform  
**Target User:** Traders learning XAU/USD scalp trading with Mr PFX framework  
**Tech Stack:** Next.js + React, Tailwind CSS, Recharts, Firebase, Telegram Bot API  
**Deployment:** Vercel  

---

## 1. DESIGN DIRECTION

### Visual Identity
- **Palette:** Professional trading dark (inspired by Forex Edge, TradingView)
  - Primary Dark: `#0f1419` (page background)
  - Secondary Dark: `#1a1f2e` (cards, panels)
  - Accent Gold: `#d4af37` (XAU/USD highlight, CTAs)
  - Text Primary: `#e8eef5` (body text)
  - Text Secondary: `#a0aac4` (labels, captions)
  - Green (bullish): `#26a69a` (up candles, buy signals)
  - Red (bearish): `#ef5350` (down candles, sell signals)
  - Gray (neutral): `#6b7487` (disabled, secondary)

- **Typography:**
  - Display: `Inter Bold` (headings, price displays, signal alerts)
  - Body: `Inter Regular` (descriptions, content)
  - Mono: `JetBrains Mono` (ticker symbols, technical values, timestamps)

- **Signature Element:** 
  - Live XAU/USD chart as hero on Market Overview page with real-time price ticker and technical level overlays
  - Gold accent on active nav items and signal status badges
  - Minimal animations—only price ticks, candle updates, and signal pulses

- **Layout Philosophy:**
  - Multi-page with persistent left sidebar navigation
  - Cards for modular content (live data, analytics sections)
  - Right-aligned data panels for quick reference
  - Full-width chart areas for analysis pages
  - Mobile-responsive but optimized for desktop trader workflow

---

## 2. PAGE STRUCTURE & FEATURES

### Navigation
**Left Sidebar (persistent across all pages):**
```
Logo/Branding
├─ Market Overview (dashboard home)
├─ Deep Analysis (technical analysis, volume, macro)
├─ Learning Hub (education, backtester, paper trading)
├─ Bot Signals (live signal feed)
└─ Settings (account, preferences, risk calculator)

Active page highlighted with gold accent (#d4af37)
Collapsed state: icons only
```

---

## PAGE 1: MARKET OVERVIEW (Dashboard Home)

**Purpose:** Live XAU/USD market snapshot + signals + macro context  
**Layout:** 3-column grid on desktop, single column on mobile

### Top Section (Full Width)
**Live XAU/USD Chart**
- Embedded TradingView Lightweight Charts (or Recharts if needed flexibility)
- 1H timeframe default (user can switch: 5m, 15m, 1H, 4H, Daily)
- **Chart Elements:**
  - Candlesticks (green up, red down)
  - Support/Resistance lines (drawn from your Mr PFX levels)
  - Levels of Rejection (visual markers)
  - Break of Structure zones (shaded areas)
  - Volume bars colored by direction
- **Live Price Ticker (above chart):**
  - Current Price: `$2,041.35` (gold text, large)
  - 24H Change: `+0.45%` (green if up, red if down)
  - 24H Range: `Low: $2,031.20 | High: $2,052.80`
  - Spread: `0.5 pips` (for execution context)

### Left Sidebar
**Major Pairs Live Data**
```
XAU/USD
├─ Price: $2,041.35 ↑
├─ Change: +0.45% (24H)
└─ Vol: 120K contracts

USD Index
├─ Price: 103.45 ↓
├─ Change: -0.12% (24H)
└─ Strength: Medium (color-coded)
```

Each pair updates live (WebSocket or polling every 1-2 sec)
Click to jump to detailed analysis page

### Right Sidebar
**Gold Analytics Panel**

**1. Volume Analytics**
```
Current Volume: 120K
├─ vs 24H Avg: +15% (highlighted)
├─ vs 7D Avg: +8%
└─ Volume Profile: Bar chart (micro)
   - High volume zones marked
   - Current price vs volume density
```

**2. Volatility Gauge**
```
ATR (14): 12.45 pips
├─ Status: Moderate (color scale)
├─ vs 7D Avg: +2.3%
└─ Volatility Meter: Visual bar (0-100)
```

**3. Support & Resistance**
```
Resistance Levels:
├─ R2: $2,055.60
├─ R1: $2,048.20
└─ Pivot: $2,042.10

Support Levels:
├─ S1: $2,036.05
├─ S2: $2,028.45
└─ Last Daily Close: $2,038.90
```

**4. Mr PFX Strategy Indicators**
```
Current Status:
├─ Levels of Rejection: ACTIVE (location marked on chart)
├─ Build-up of Structure: FORMING
├─ Break of Structure: NOT YET
├─ Internal Region (consolidation): YES
└─ Next Signal Window: 3:00 PM (countdown timer)
```

### Bottom Section (Full Width)
**Recent Bot Signals**
```
Signal Feed (Last 5 signals):

[SIGNAL #42] Timestamp: Today 2:45 PM
├─ Status: PENDING ⏳
├─ Buy Limit Orders:
│  ├─ Order 1: $2,040.50 | TP1: $2,043.20 (32 pips)
│  ├─ Order 2: $2,038.10 | TP2: $2,041.80 (36 pips)
│  ├─ Order 3: $2,035.70 | TP3: $2,039.50 (37 pips)
│  └─ Order 4: $2,033.30 | TP4: $2,037.10 (37 pips)
├─ Valid Until: 5:00 PM (remaining time)
└─ Confidence: 78%

[Signal #41] Timestamp: Yesterday 4:30 PM
├─ Status: CLOSED ✓
├─ Result: +$45 profit (3 of 4 orders filled)
└─ Win Rate: 75% (on this signal)
```

Signal cards are color-coded:
- **Green** = pending, high confidence
- **Yellow** = pending, medium confidence
- **Gold** = active, filling orders
- **Gray** = expired/closed

---

## PAGE 2: DEEP ANALYSIS (Multi-Tab)

**Purpose:** Technical analysis, volume analysis, macro trends, economic calendar  
**Layout:** Full-width tabs with scrollable content

### Tab 1: Technical Analysis

**Top: Multi-Timeframe Chart Display**
```
Tabs: [5m] [15m] [1H] [4H] [Daily]
- Switch between timeframes
- Chart shows candlesticks + your chosen indicators
```

**Chart Indicators (User Can Toggle On/Off):**
- Moving Averages (20/50/200 SMA/EMA)
- RSI (14)
- MACD (12/26/9)
- Bollinger Bands (20, 2 std dev)
- ATR Bands
- Volume Overlay

**Below Chart: Technical Summary**
```
1H Timeframe Analysis:
├─ Trend: UPTREND (higher highs, higher lows)
├─ Momentum: STRONG (RSI: 68, approaching overbought)
├─ Volatility: MODERATE (ATR: 12.45 pips)
├─ Price Position: Near R1 ($2,048.20)
└─ Next Key Level: R2 at $2,055.60 (13.25 pips away)

Potential Setup (Mr PFX):
├─ Current Structure: Building
├─ Rejection Levels: $2,050 zone (watch for reversal)
├─ Breakout Confirmation: Need close above $2,052
└─ Recommendation: Wait for pullback to S1 or consolidation break
```

---

### Tab 2: Volume Analysis

**Top: Volume Chart**
```
- Volume bars colored by direction (green up, red down)
- Cumulative volume line overlay
- Volume profile (right-side histogram showing density at price levels)
- Current volume vs 20-period moving average
```

**Volume Metrics Section:**
```
Current Volume: 120K contracts
├─ 24H Average: 104K (115% of average = HIGH)
├─ 7D Average: 98K (122% of average = VERY HIGH)
├─ Volume Profile Peak: $2,042-2,044 zone (most traded)
├─ Volume Spike Threshold: +50% triggers alert
└─ Last Spike: 45 min ago (119K contracts in 5m candle)

Volume-Price Relationship:
├─ Price Rising + Volume Rising: STRONG TREND ✓
├─ Price Rising + Volume Falling: WEAK TREND ⚠
└─ Current Status: Strong uptrend with elevated volume
```

**Volume-Based Signals:**
```
- High Volume at Resistance: Potential rejection point
- High Volume at Support: Bounce expected
- Volume Spike at Key Level: Confirmation of breakout
```

---

### Tab 3: Economic Calendar & Macro

**Upcoming Economic Events:**
```
[HIGH IMPACT] Today 2:00 PM ET
├─ Event: Core PCE Price Index (USA)
├─ Expected: 0.2% vs Prev: 0.3%
├─ Impact on XAU: BULLISH if lower inflation (dollar weakens)
└─ Time until: 45 minutes ⏰

[MEDIUM IMPACT] Today 8:30 AM ET (PASSED)
├─ Event: Initial Jobless Claims
├─ Forecast: 410K vs Actual: 415K vs Previous: 408K
├─ Result: WORSE THAN EXPECTED ⚠
└─ Impact: Supported gold as risk-off sentiment

[HIGH IMPACT] Tomorrow 10:00 AM ET
├─ Event: Fed Chair Powell Speech
├─ Impact: HIGH volatility expected
└─ Bias: May influence USD (affects XAU inversely)

Next 7 Days: [View Calendar] (link to full calendar)
```

**Macro Trends Panel:**
```
USD Strength Index: 103.45 (🔴 Strong Dollar = Headwind for Gold)
├─ 7D Change: -0.12%
├─ 30D Change: +1.2%
└─ Impact: When USD rises, gold becomes less attractive globally

Real Interest Rates: 1.85% (up 0.05% today)
├─ Impact: Higher rates = less appeal to hold non-yielding gold
└─ Trend: Rising rates = bearish for gold

Risk Sentiment: MODERATE RISK ON
├─ Stock Market: SPY +0.3% (stocks rising = less gold demand)
├─ VIX Index: 16.2 (low volatility = less safe-haven buying)
└─ Crypto: BTC +1.2% (risk appetite returning)

Gold Seasonality (June):
├─ Typical: Weakness (summer doldrums)
├─ This Year: +2.3% (stronger than normal)
└─ Next Seasonal High: August (historically)
```

---

### Tab 4: Macro Trends Visualization

**Multi-Panel Dashboard:**
```
1. USD Index Chart (30-day)
   - Trend line, key resistance/support
   - Current level marked
   - Inverse correlation to XAU shown with annotation

2. Real Interest Rates (30-day)
   - 10Y yields highlighted
   - Spread between nominal and inflation expectations
   - Impact on gold demand

3. Risk Sentiment Gauge
   - Stock/crypto correlations
   - VIX level (fear index)
   - Safe-haven flow indicator

4. Gold Seasonality
   - Monthly average returns (12-month heat map)
   - Current vs historical performance this month
   - Next high/low season marked
```

---

## PAGE 3: LEARNING HUB (Multi-Tab)

**Purpose:** Educational content + interactive tools + backtester + paper trading

### Tab 1: Education

**Educational Articles (Organized)**
```
├─ Forex 101
│  ├─ What is Forex? (5 min read)
│  ├─ Understanding Currency Pairs (5 min)
│  └─ How to Read Price Quotes (3 min)
│
├─ Gold Trading Fundamentals
│  ├─ What Moves the Price of Gold (8 min)
│  ├─ XAU/USD Pair Specifics (6 min)
│  ├─ Factors Affecting Gold (10 min)
│  └─ Historical Gold Trends (7 min)
│
├─ Technical Analysis
│  ├─ Candlestick Basics (6 min)
│  ├─ Support & Resistance (8 min)
│  ├─ Trend Identification (7 min)
│  ├─ Candlestick Patterns (12 min)
│  └─ Indicator Guide (RSI, MACD, MA) (10 min)
│
├─ Trading Psychology & Risk Management
│  ├─ Position Sizing 101 (6 min)
│  ├─ Risk-Reward Ratios (5 min)
│  ├─ Trading Psychology (8 min)
│  └─ Common Mistakes (7 min)
│
└─ Mr PFX Strategy Deep Dive
   ├─ Strategy Overview (10 min)
   ├─ Levels of Rejection Explained (8 min)
   ├─ Build-up of Structure (7 min)
   ├─ Break of Structure (7 min)
   ├─ Internal Regions/Consolidation (6 min)
   ├─ Support & Resistance Tying to Bias (6 min)
   └─ Standard Breakouts (5 min)
```

**Each Article Includes:**
- Title + read time estimate
- Short summary
- Body content (formatted with headings, bullet points)
- Example chart screenshots with annotations
- "Learn More" links to related articles
- Interactive diagram or embedded chart example

**Example Article: "Levels of Rejection Explained"**
```
What Are Levels of Rejection?

Levels of Rejection are price points where the market attempts to break through 
but fails, creating a "rejection" that signals weakness in that direction.

Key Characteristics:
├─ Price approaches a level (support or resistance)
├─ Volume spike occurs at the level
├─ Price reverses sharply (candle closes against the move)
└─ Creates a potential reversal trade signal

Visual Example:
[Embedded interactive chart showing]
├─ Resistance level with 3 failed breakout attempts
├─ Each attempt marked with price action annotation
└─ Subsequent reversal move highlighted

How to Use in Trading:
1. Identify a level where price has rejected before
2. Wait for price to approach that level again
3. Watch for volume spike + reversal candle
4. Enter trade opposite to the attempted breakout direction

Risk Management:
├─ Place stop loss above the rejection level (if shorting)
├─ Position size based on level strength (more rejections = stronger)
└─ Use 1:2 minimum risk-reward ratio
```

---

### Tab 2: Interactive Chart Practice Tool

**Purpose:** Learn to identify chart patterns on real data

**Interface:**
```
Top: Dropdown to select chart
├─ [Select Symbol: XAU/USD ▼]
├─ [Select Timeframe: 1H ▼]
└─ [Select Date Range: Last 30 days ▼]

Middle: Large interactive chart with tools
├─ Drawing Tools (toggle):
│  ├─ Trend Lines
│  ├─ Horizontal Lines (for S/R)
│  ├─ Fibonacci Retracements
│  ├─ Annotations (text labels)
│  └─ Clear All Drawings
│
├─ Analysis Tools:
│  ├─ Measure Distance (pip calculator)
│  └─ Highlight Candlestick Patterns
│
└─ Chart Overlays:
   ├─ Volume
   ├─ Moving Averages (20/50/200)
   ├─ RSI
   └─ MACD

Bottom: Learning Prompt
├─ "Identify 2 support levels and 1 resistance level on this 1H chart"
├─ [Submit Answer] [Show Solution]
└─ Explanation of correct answer + why those levels matter
```

**Interactive Examples for Each Strategy:**
```
Levels of Rejection:
- [Load Historical Example]
- Chart shows 4 rejections at $2,050 level
- Task: "Mark each rejection and predict next move"
- Feedback: Shows correct identification + price action after

Build-up of Structure:
- Task: "Identify where structure is building and where breakout will occur"
- Interactive highlights show consolidation zones

Break of Structure:
- Task: "Mark the break of structure and the confirmed breakout"
- Solution shows how price respects the broken level afterward
```

---

### Tab 3: Backtester

**Purpose:** Test your Mr PFX strategy rules on historical data

**Top Section: Strategy Configuration**
```
Strategy Settings:
├─ Strategy: Mr PFX (preset rules hardcoded)
├─ Symbol: XAU/USD
├─ Timeframe: 5m entry confirmation
├─ Session: Tuesday-Thursday, 3 PM - 5 PM
├─ Max Cycles: 2 per session
├─ Risk per Trade: $10 starting capital (or set custom)
└─ Commission/Spread: 0.5 pips per round turn

Backtest Period:
├─ From: [Date Picker]
├─ To: [Date Picker]
└─ [Run Backtest] button (shows loading state)
```

**Backtest Results Display:**
```
Performance Summary (Top Cards):
├─ Total Trades: 42
├─ Wins: 31 (73.8% win rate) ✓
├─ Losses: 11 (26.2% loss rate)
├─ Profit/Loss: +$87.50 (870% return)
├─ Average Win: +$4.50
├─ Average Loss: -$2.10
├─ Largest Win: +$12.30
├─ Largest Loss: -$5.60
├─ Profit Factor: 3.21 (wins/losses)
└─ Sharpe Ratio: 2.14

Risk Metrics:
├─ Max Drawdown: -8.5% (from peak to trough)
├─ Consecutive Wins: 7 (best streak)
├─ Consecutive Losses: 3 (worst streak)
└─ Days Profitable: 12 of 15 trading days (80%)
```

**Detailed Trade Log (Scrollable Table):**
```
| # | Date/Time | Entry | TP Hit | L/P | Pips | P&L |
|---|-----------|-------|--------|-----|------|-----|
| 1 | Jun 18, 3:15 PM | 2040.50 | TP2 | ✓ | +36 | +$3.60 |
| 2 | Jun 18, 4:02 PM | 2038.10 | TP1 | ✓ | +32 | +$3.20 |
| 3 | Jun 19, 3:45 PM | 2041.80 | SL | ✗ | -25 | -$2.50 |
| 4 | Jun 19, 4:30 PM | 2039.20 | TP3 | ✓ | +37 | +$3.70 |
...

Click any trade to see:
├─ Full entry setup (chart + levels)
├─ Why the signal was generated
├─ Exit reason (TP hit, SL triggered, expired)
└─ What you can learn from this trade
```

**Equity Curve Chart:**
```
Y-axis: Account Balance ($10 → $87.50)
X-axis: Trade number
- Line chart showing equity growth over trades
- Drawdown periods shaded in red
- Max profit point marked
- Hover to see trade details
```

**Export Options:**
```
[Export as CSV] [Export as PDF Report]
- CSV: Full trade data for external analysis
- PDF: Professional report with charts + analysis
```

---

### Tab 4: Paper Trading (Virtual Account)

**Purpose:** Practice trading without risk while learning

**Account Setup:**
```
Virtual Account Status:
├─ Account Balance: $10,000 (starting balance)
├─ Current P&L: +$245.30 (2.45%)
├─ Available Margin: $9,754.70
├─ Open Positions: 2
├─ Total Trades: 8
└─ Account Created: 15 days ago

Quick Stats:
├─ Win Rate: 62.5% (5 wins, 3 losses)
├─ Avg Win: +$58.20
├─ Largest Win: +$156.40
└─ Largest Loss: -$45.20
```

**Execute Trade Panel:**
```
[Quick Trade Entry]
├─ Symbol: XAU/USD
├─ Direction: [BUY ▼] [SELL ▼]
├─ Entry Price: [2040.50] (current price or custom)
├─ Quantity (Lots): [0.1 lots] = $100 risk
├─ Take Profit: [2043.20] (+3.20 pips, +$32 profit)
├─ Stop Loss: [2038.10] (-2.40 pips, -$24 loss)
├─ Risk/Reward: 1:1.33 ✓ (acceptable)
└─ [Place Trade] [Cancel]

Position Confirmation:
├─ "Buy 0.1 lots XAU/USD at 2040.50?"
├─ TP: 2043.20 | SL: 2038.10
└─ [Confirm] [Edit] [Cancel]
```

**Open Positions Widget:**
```
Active Positions (Real-time updates):

Position #1:
├─ BUY 0.1 XAU/USD @ 2040.50 (entered 2h ago)
├─ Current Price: 2042.80
├─ P&L: +$23 (unrealized)
├─ Take Profit: 2043.20 (45 pips away)
├─ Stop Loss: 2038.10
└─ [Close Now] [Move SL] [Move TP]

Position #2:
├─ SELL 0.05 XAU/USD @ 2045.30 (entered 30m ago)
├─ Current Price: 2042.80
├─ P&L: +$12.50 (unrealized)
├─ Take Profit: 2040.30 (pending)
├─ Stop Loss: 2048.80
└─ [Close Now] [Move SL] [Move TP]

Total P&L (all open): +$35.50
```

**Trade History (Paper Account):**
```
Closed Trades:

Trade #1: BUY 0.1 XAU/USD
├─ Entry: 2040.50 | Exit: 2043.20 (TP hit)
├─ P&L: +$27 | Win ✓
└─ Duration: 45 minutes

Trade #2: SELL 0.05 XAU/USD
├─ Entry: 2044.80 | Exit: 2043.50 (SL triggered)
├─ P&L: -$6.50 | Loss ✗
└─ Duration: 20 minutes

[Show All] [Export History]
```

---

## PAGE 4: BOT SIGNALS (Live Feed)

**Purpose:** Real-time signal monitoring and execution tracking

**Top: Signal Statistics**
```
Today's Session Stats:
├─ Signals Generated: 3
├─ Signals Filled: 2
├─ Signals Expired: 1
├─ Current P&L: +$67.30
├─ Win Rate (Today): 66.7%
└─ Next Signal Window: 2:30 PM - 5:00 PM
```

**Active Signals (Real-time):**
```
[SIGNAL #47] - ACTIVE 🟢
├─ Generated: Today 3:15 PM
├─ Status: FILLING (1 of 4 orders filled)
├─ Confidence: 82%
│
├─ Buy Limit Orders:
│  ├─ Order 1: $2,040.50 ✓ FILLED (2:45 PM) | TP1: $2,043.20
│  ├─ Order 2: $2,038.10 ⏳ PENDING | TP2: $2,041.80
│  ├─ Order 3: $2,035.70 ⏳ PENDING | TP3: $2,039.50
│  └─ Order 4: $2,033.30 ⏳ PENDING | TP4: $2,037.10
│
├─ Partial P&L: +$28.80 (from Order 1 TP)
├─ Expires: 5:00 PM (45 minutes remaining ⏰)
└─ [View Details] [Telegram Alert Sent] 📲

[SIGNAL #46] - EXPIRED ⏹️
├─ Generated: Yesterday 3:30 PM
├─ Status: PARTIALLY FILLED + EXPIRED
├─ Final P&L: +$45.20 (2 of 4 orders filled)
├─ Orders:
│  ├─ Order 1: FILLED → TP2 HIT → +$36
│  ├─ Order 2: FILLED → TP1 HIT → +$32
│  ├─ Order 3: EXPIRED (price didn't reach)
│  └─ Order 4: EXPIRED (price didn't reach)
└─ [View Details]
```

**Signal Details Modal (Click "View Details"):**
```
Signal #47 Deep Dive:
├─ Strategy Analysis:
│  ├─ Levels of Rejection: CONFIRMED at $2,041-42 zone
│  ├─ Build-up of Structure: ACTIVE
│  ├─ Break of Structure: Confirmed above $2,040
│  ├─ Internal Region: Recent consolidation $2,038-42
│  ├─ S/R Tied to Bias: Buy bias below $2,044
│  └─ Breakout Confirmation: 5m reversal candle ✓
│
├─ Chart Screenshot:
│  - 5m chart showing entry setup
│  - Key levels marked
│  - Entry points highlighted
│
├─ Execution Status:
│  - Order 1 filled at exact price ✓
│  - Order 2 pending (price dropped 12 pips below)
│  - Wait time: 1h 15m (still within signal window)
│
└─ Performance Metrics (if closed):
   - Avg Entry: $2,039.30
   - Avg Exit: $2,041.80
   - Avg Profit/Trade: +$23.50
   - Max Adverse Excursion: -5 pips
   - Max Favorable Excursion: +45 pips
```

**Historical Signal Archive (Scrollable):**
```
Signal Statistics (Last 30 Days):

Filter By:
├─ [All Signals] [Filled] [Partially Filled] [Expired]
└─ Date Range: [Last 7 Days ▼] [Last 30 Days] [Custom]

Archive Table:
| # | Date | Status | P&L | Win% | Orders Filled |
|---|------|--------|-----|------|---------------|
| 47 | Today 3:15 PM | ACTIVE | +$28.80 | — | 1/4 |
| 46 | Yesterday 3:30 PM | CLOSED | +$45.20 | 100% | 2/4 |
| 45 | 2 days ago | CLOSED | -$12.50 | 0% | 0/4 |
| 44 | 3 days ago | CLOSED | +$67.30 | 75% | 3/4 |
...

Totals (Last 30 Days):
├─ Total Signals: 45
├─ Profitable: 31 (68.9%)
├─ Breakeven: 2 (4.4%)
├─ Losses: 12 (26.7%)
├─ Total P&L: +$456.80
├─ Avg Profit/Trade: +$10.15
└─ Best Day: +$87.50 (June 18)
```

**Settings for Signal Delivery:**
```
Telegram Alerts:
├─ [✓] New Signal Generated
├─ [✓] Order Filled
├─ [✓] Take Profit Hit
├─ [✓] Stop Loss Triggered
├─ [✓] Signal Expired
└─ Notification Sound: [Enabled]

Desktop Notifications:
├─ [✓] Browser Alerts
└─ [✓] Page Title Badge

Email Digest:
├─ Daily Summary: [Enabled]
├─ Time: [9:00 AM] 
└─ Include: [Win/Loss trades only]
```

---

## PAGE 5: SETTINGS (Account & Risk Management)

**Purpose:** Configure integrations, manage account, set risk parameters

### Tab 1: Account Connections

**Broker Integration (Exness):**
```
Exness Account Status:
├─ Account Type: Demo MT5
├─ Account Email: [connected email]
├─ Balance: $1,245.50
├─ Equity: $1,387.20
├─ Used Margin: $141.70
├─ Free Margin: $1,245.50
├─ Margin Level: 978% ✓
└─ [Disconnect] [Refresh Data]

API Key Settings:
├─ API Status: CONNECTED ✓
├─ Last Sync: 2 minutes ago
├─ Sync Frequency: Every 30 seconds
└─ [Advanced Settings] [Test Connection]
```

**Telegram Bot Integration:**
```
Telegram Status: CONNECTED ✓
├─ Chat ID: @yourhandle
├─ Bot Token: [masked]
├─ Last Signal Sent: Today 3:15 PM
├─ Message Count: 127 (last 30 days)
└─ [Disconnect] [Test Alert]
```

---

### Tab 2: Risk Management

**Position Sizing Calculator:**
```
Account Details:
├─ Account Balance: $1,245.50
├─ Risk Per Trade: [1.0%] = $12.46 max loss per trade
└─ Preferred Risk/Reward: [1:2 ▼]

Position Size Calculator:
├─ Entry Price: [2040.50]
├─ Stop Loss: [2038.10] (-240 pips)
├─ Take Profit: [2044.90] (+440 pips)
├─ Risk/Reward Ratio: 1:1.83 ✓
│
├─ Calculated Lot Size: 0.052 lots
├─ Risk Amount: $12.46
├─ Potential Profit: $22.77
└─ [Copy to Clipboard] [Apply to Trade]
```

**Risk Metrics Dashboard:**
```
Current Risk Exposure:
├─ Total Open Risk: $35.60 (2.86% of account)
├─ Largest Single Trade Risk: $12.46 (1%)
├─ Max Daily Loss Limit: $24.91 (2% of account)
├─ Today's P&L: +$67.30
├─ Remaining Daily Risk Budget: -$42.39 (exceeded, no new trades)
└─ Status: ⚠️ DAILY LIMIT REACHED

Risk Rules:
├─ Max Risk Per Trade: 1% ✓
├─ Max Daily Loss: 2%
├─ Max Consecutive Losses Allowed: 3
├─ Current Consecutive Losses: 0
└─ [Edit Risk Rules]
```

---

### Tab 3: Preferences

**Display Settings:**
```
Theme: [Dark Mode ▼]
Language: [English ▼]
Timezone: [UTC+1 (Lagos)] 
Date Format: [DD/MM/YYYY]

Chart Preferences:
├─ Default Timeframe: [1H ▼]
├─ Candle Color Scheme: [Traditional (Green/Red) ▼]
├─ Volume Display: [On]
└─ Grid: [On]

Notification Preferences:
├─ Sound Alerts: [On]
├─ Desktop Notifications: [On]
├─ Email Digests: [Daily]
└─ Quiet Hours: [11 PM - 7 AM]
```

---

## 3. LIVE DATA INTEGRATION

**Real-time Data Flow:**
```
Data Source: TradingView Data API (via RapidAPI)
├─ Update Frequency: 1-2 second polling
├─ Fallback: 5-second polling if rate limited
└─ Data Points:
   ├─ Current Price
   ├─ Volume (current candle)
   ├─ OHLC for all timeframes
   ├─ Technical indicator values
   └─ Intraday High/Low/Range

USD Index:
├─ Source: TradingView or Finnhub
├─ Update: Every 2 seconds
└─ Display: Price + 24H change + strength meter

Economic Calendar:
├─ Source: Finnhub Economic Calendar API
├─ Update: Daily (new events added)
└─ Display: Next 7 days of events + impact levels
```

**Telegram Bot Signal Delivery:**
```
On-Demand Command: /signal
├─ User sends: /signal
├─ Bot checks: Current Mr PFX setup status
├─ Bot responds:
   ├─ "Signal generated: [entry levels]"
   ├─ "Valid until: [timestamp]"
   ├─ "Confidence: [%]"
   └─ Chart screenshot with levels marked
```

---

## 4. DATA STORAGE (Firebase Firestore)

**Collections:**
```
/signals
├─ signalId
├─ timestamp
├─ status (pending, filled, expired, closed)
├─ entries[] (4 buy limit orders)
├─ takeProfit[] (4 TP levels)
├─ result (pips won/lost, orders filled count)
└─ profitLoss

/trades
├─ tradeId
├─ signalId (reference)
├─ entryPrice
├─ exitPrice
├─ pips
├─ profitLoss
├─ duration
└─ timestamp

/backtestResults
├─ sessionId
├─ startDate
├─ endDate
├─ trades[] (all trades in backtest)
├─ metrics (win rate, profit, max drawdown)
└─ timestamp

/paperTrades
├─ accountId
├─ startingBalance
├─ trades[]
├─ currentBalance
└─ statistics
```

---

## 5. TECHNICAL SPECIFICATIONS

**Frontend Stack:**
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (design system)
- **Charts:** TradingView Lightweight Charts (or Recharts for flexibility)
- **State Management:** React Context + useReducer (or Zustand if needed)
- **Authentication:** Firebase Auth (optional, for future multi-user)
- **HTTP Client:** axios
- **Real-time Updates:** WebSocket or polling
- **Deployment:** Vercel

**Backend Integration:**
- **Data Source:** TradingView Data API (RapidAPI free tier)
- **Economic Calendar:** Finnhub API
- **Storage:** Firebase Firestore
- **Signal Delivery:** Telegram Bot API (on-demand /signal command)

**Performance Requirements:**
- Page load: < 2 seconds
- Chart render: < 1 second
- Price update latency: < 2 seconds
- Responsive breakpoints: 320px (mobile), 768px (tablet), 1200px+ (desktop)

---

## 6. RESPONSIVE DESIGN

**Desktop (1200px+):**
- Left sidebar (persistent, 250px)
- Main content area (flexible)
- Right panels for analytics
- Full charts

**Tablet (768px - 1199px):**
- Left sidebar collapses to icons
- Main content takes full width
- Right panels stack below
- Charts scaled appropriately

**Mobile (320px - 767px):**
- Bottom navigation (tab bar style)
- Single column layout
- Stacked cards
- Charts optimized for portrait

---

## 7. COLOR PALETTE (Final)

```css
:root {
  /* Backgrounds */
  --bg-primary: #0f1419;      /* Page bg */
  --bg-secondary: #1a1f2e;    /* Card bg */
  --bg-tertiary: #252d3d;     /* Hover/alt */
  
  /* Text */
  --text-primary: #e8eef5;    /* Body text */
  --text-secondary: #a0aac4;  /* Labels */
  --text-muted: #6b7487;      /* Disabled */
  
  /* Accent */
  --accent-gold: #d4af37;     /* XAU highlight, CTAs */
  --accent-green: #26a69a;    /* Bullish, buys */
  --accent-red: #ef5350;      /* Bearish, sells */
  --accent-blue: #5299d3;     /* Info, links */
  
  /* Functional */
  --success: #26a69a;
  --danger: #ef5350;
  --warning: #ffa726;
  --info: #5299d3;
}
```

---

## 8. COMPONENT LIBRARY

**Pre-built Components (Reusable):**
```
├─ Card (with header, body, footer)
├─ Badge (status indicators)
├─ Button (primary, secondary, danger)
├─ Input (text, number, select, date)
├─ Table (sortable, filterable)
├─ Modal (confirmation, details)
├─ Tooltip (hover info)
├─ Dropdown (menus)
├─ Tabs (tabbed content)
├─ Sidebar (navigation)
├─ Navbar (top bar)
├─ Loading Spinner
├─ Toast Notifications
├─ Chart Container (reusable chart wrapper)
└─ Price Ticker (live price display)
```

---

## 9. FUTURE ENHANCEMENTS

- [ ] Advanced screener (scan for setup patterns automatically)
- [ ] Strategy builder (visual rule editor)
- [ ] Multi-instrument support (add EUR/USD, GBP/USD, etc.)
- [ ] AI-powered analysis (LLM-based trade recommendations)
- [ ] Community features (share setups, discuss trades)
- [ ] Mobile app (React Native)
- [ ] Live trading integration (instead of demo-only)
- [ ] Premium features (advanced indicators, custom alerts, priority support)

---

## 10. DEPLOYMENT CHECKLIST

- [ ] Environment variables configured (.env.local)
- [ ] Firebase project created + Firestore rules set
- [ ] TradingView RapidAPI key obtained + tested
- [ ] Finnhub API key obtained + tested
- [ ] Telegram Bot token created + tested
- [ ] Vercel deployment configured
- [ ] Domain configured (if custom domain)
- [ ] SSL/HTTPS enforced
- [ ] Security headers set
- [ ] Monitoring + error tracking enabled (Sentry)
- [ ] Analytics configured (if desired)
- [ ] Performance optimized (images, code splitting, caching)

---

## END OF SPECIFICATION

This specification is **production-ready** and fully detailed for handoff to Deepseek V4 Flash via OpenCode. Every page, component, and interaction is specified. The prompt in the next document will guide implementation step-by-step.
