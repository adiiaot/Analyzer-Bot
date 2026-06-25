# Firebase Firestore Schema & Real-Time Sync Architecture

## Overview
Firebase Firestore is the **single source of truth** for all trading data, signals, and journal entries. Both the Telegram bot (Python/FastAPI backend) and the Next.js dashboard read/write to the same collections in real-time via Cloud Firestore listeners.

---

## Collections & Documents

### 1. `users/{userId}`
**Purpose:** User account metadata and settings.

```javascript
{
  userId: string (Firebase Auth UID),
  email: string,
  createdAt: Timestamp,
  accountMode: "demo" | "live",  // Toggle between demo and live
  accountBalance: number,          // Editable via Settings page
  initialBalance: number,          // For ROI calculation
  maxRiskPerTrade: number,         // Risk % per trade
  maxDailyLoss: number,            // Max loss before auto-stop
  maxWeeklyLoss: number,           // Max weekly loss
  defaultRiskPercentage: number,   // Default risk for risk calculator
  preferences: {
    theme: "dark" | "light" | "auto",
    notifications: {
      signals: boolean,
      tradeClose: boolean,
      econCalendar: boolean,
    },
    tradingHours: {
      sessionStart: "14:30",  // Tue-Thu afternoon session
      sessionEnd: "22:00",
      enableAutoTrade: boolean // Future: automatic trade execution
    }
  },
  telegramUserId: string,         // Link Telegram account
  lastActive: Timestamp,
}
```

---

### 2. `signals/{signalId}`
**Purpose:** All generated signals, synced from bot to dashboard.

```javascript
{
  signalId: string (auto-generated: "signal_YYYYMMDD_HHMMSS"),
  userId: string,
  timestamp: Timestamp (when signal was generated),
  trend: "UP" | "DOWN",
  entries: [
    {
      entryNumber: 1,
      price: number (entry limit),
      tp: number (take-profit price),
      tpPips: number (20, 40, 60, 80),
      autoClose: boolean (only true for entry 1)
    },
    // ... 3 more entries
  ],
  supportLevel: number,
  resistanceLevel: number,
  pullbackDetected: boolean,
  entryConfirmation: boolean,
  validUntil: Timestamp,
  confidence: number (0.0 - 1.0, currently 0.75),
  status: "pending" | "active" | "expired" | "closed",
  
  // Execution tracking (filled by dashboard/bot)
  executedEntries: [
    {
      entryNumber: 1,
      executedPrice: number,
      executedAt: Timestamp,
      executionStatus: "filled" | "partial" | "rejected"
    }
  ],
  
  // For bot -> dashboard delivery
  deliveredVia: "telegram" | "dashboard" | "both",
  deliveredAt: Timestamp,
  acknowledged: boolean,
  
  // Analysis (filled after trade closes)
  analysis: {
    reasonGenerated: string, // AI explanation of why this signal was generated
    confidence_breakdown: {
      trend_strength: number,
      level_proximity: number,
      volatility_score: number,
      reversal_pattern_quality: number
    }
  }
}
```

---

### 3. `trades/{tradeId}`
**Purpose:** All executed trades with entry, exit, and P&L.

```javascript
{
  tradeId: string (auto-generated or from MT5),
  userId: string,
  signalId: string (reference to the signal that triggered this trade),
  timestamp: Timestamp (entry time),
  entryPrice: number,
  entrySize: number,      // Lot size
  entryTime: Timestamp,
  
  // Exit details (populated when trade closes)
  exitPrice: number,
  exitTime: Timestamp,
  
  // P&L
  pnl: number (profit/loss in currency),
  pnlPercent: number (profit/loss as %),
  result: "win" | "loss" | "break_even",
  
  // Trade metadata
  trend: "UP" | "DOWN",
  supportLevel: number,
  resistanceLevel: number,
  
  // Risk management
  stopLoss: number,
  takeProfit: number,
  riskRewardRatio: number,
  
  // Status
  status: "open" | "closed" | "cancelled",
  holdTimeSeconds: number (duration of trade),
  
  // Journal notes (from Telegram bot /journal command)
  journalNotes: string,
  tradingConditions: string,
  
  // AI Analysis (filled after close)
  analysis: {
    performanceReason: string, // Why did this trade win/loss?
    howSignalBenefited: string,
    improvements: string[],
    confidence: number
  }
}
```

---

### 4. `journal/{entryId}`
**Purpose:** Trading journal entries from Telegram bot `/journal` command.

When user sends `/journal <text>` in Telegram, bot saves to this collection.

```javascript
{
  entryId: string (auto-generated: "journal_YYYYMMDD_HHMMSS"),
  userId: string,
  timestamp: Timestamp (when entry was created),
  source: "telegram" | "dashboard",
  
  // Content from /journal command
  notes: string,
  
  // Associated trade (if journal entry references a trade)
  relatedTradeId: string (optional),
  
  // Metadata
  marketCondition: string,  // e.g., "ranging", "trending", "breakout"
  tradingState: string,     // e.g., "focus", "tired", "confident"
  lessonsLearned: string[],
  
  // For dashboard analysis
  sentiment: "positive" | "neutral" | "negative",
  
  // AI analysis
  analysis: {
    theme: string,          // Auto-detected topic
    actionItems: string[],  // Extracted action items
    relatedSignals: string[], // Signal IDs mentioned or related
  }
}
```

---

### 5. `analytics/{analyticsId}`
**Purpose:** Aggregated trading statistics (auto-computed from trades).

```javascript
{
  analyticsId: string,
  userId: string,
  period: "daily" | "weekly" | "monthly" | "all_time",
  periodStart: Timestamp,
  periodEnd: Timestamp,
  
  // Performance metrics
  totalTrades: number,
  wins: number,
  losses: number,
  breakEven: number,
  winRate: number (0.0 - 1.0),
  lossRate: number (0.0 - 1.0),
  
  // P&L
  totalPnl: number,
  totalPnlPercent: number,
  avgWin: number,
  avgLoss: number,
  largestWin: number,
  largestLoss: number,
  profitFactor: number (total wins / total losses),
  
  // Streaks
  consecutiveWins: number,
  consecutiveLosses: number,
  maxDrawdown: number,
  
  // Risk metrics
  totalRiskCapital: number,
  riskPerTrade: number (average),
  sharpeRatio: number (if applicable),
  
  // Signal performance
  signalHitRate: number (% of signals that won),
  avgSignalWin: number,
  avgSignalLoss: number,
  
  // By trend
  upTrendWinRate: number,
  downTrendWinRate: number,
  
  // By entry number
  entry1Stats: { wins: number, losses: number, avg_pnl: number },
  entry2Stats: { wins: number, losses: number, avg_pnl: number },
  entry3Stats: { wins: number, losses: number, avg_pnl: number },
  entry4Stats: { wins: number, losses: number, avg_pnl: number },
  
  lastUpdated: Timestamp
}
```

---

### 6. `econCalendar/{eventId}`
**Purpose:** Gold-related economic events (manually curated or fetched from API).

```javascript
{
  eventId: string (auto-generated),
  timestamp: Timestamp (when event occurs),
  eventName: string,
  impact: "high" | "medium" | "low",
  country: string,
  forecast: number,
  previous: number,
  actual: number (filled after event),
  
  // Gold-specific analysis
  goldRelated: boolean (only store if true),
  expectedDirection: "up" | "down" | "volatile",
  rationale: string,        // Why does this affect gold?
  
  // Action for trader
  recommendedAction: string, // "Take signals", "Avoid trading", "Monitor closely"
  signalStrategy: string,    // "Look for breakouts", "Trade support/resistance", etc.
  
  // Analysis by AI
  analysis: {
    historicalImpact: string,
    currentMarketContext: string,
    goldPriceImplication: string,
    timeOfImpact: string
  }
}
```

---

### 7. `signals_sent_log/{logId}`
**Purpose:** Audit log of all signals sent via Telegram (for debugging bot issues).

```javascript
{
  logId: string (auto-generated),
  userId: string,
  signalId: string,
  timestamp: Timestamp,
  sentVia: "telegram" | "dashboard",
  telegramChatId: string,
  messageId: number,
  status: "sent" | "failed" | "acknowledged",
  errorMessage: string (if failed),
  userResponse: {
    acknowledged: boolean,
    acknowledgedAt: Timestamp,
    commandsExecuted: string[] // e.g., ["place_order", "close_position"]
  }
}
```

---

### 8. `bot_logs/{logId}`
**Purpose:** Telegram bot command execution logs (for debugging blank responses issue).

```javascript
{
  logId: string (auto-generated),
  timestamp: Timestamp,
  userId: string,
  command: string, // e.g., "/signal", "/journal", "/stats"
  arguments: string,
  status: "received" | "processing" | "success" | "error",
  response: string,
  errorLog: string (if status = error),
  processingTimeMs: number,
  
  // For debugging
  debugInfo: {
    apiCallsMade: string[],
    firestoreWrites: number,
    externalApiCalls: number[]
  }
}
```

---

## Firestore Rules (Security)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data: only accessible by that user
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Signals: user can read own signals, bot can write
    match /signals/{signalId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null; // Bot writes with auth
      allow update: if request.auth.uid == resource.data.userId;
    }
    
    // Trades: user can read/write own trades
    match /trades/{tradeId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Journal: user can read/write own journal
    match /journal/{entryId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Analytics: user can read own analytics
    match /analytics/{analyticsId} {
      allow read: if request.auth.uid == resource.data.userId;
    }
    
    // Economic calendar: anyone authenticated can read
    match /econCalendar/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == 'admin_uid'; // Admin only
    }
    
    // Logs: bot can write, user can read own logs
    match /signals_sent_log/{logId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    match /bot_logs/{logId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

---

## Real-Time Sync Flow

### Bot → Dashboard (Signal delivery)
1. Telegram bot runs `/signal` command
2. Bot calls `SignalGenerator.generate_signal()` (Python)
3. Bot writes `Signal` document to `signals/{signalId}`
4. Dashboard listens to `signals` collection with `where('userId', '==', currentUser.id)`
5. New signal appears in real-time on **Signal Management** page
6. Dashboard updates **Market Overview** with latest signal

### Dashboard → Firestore (Manual entries)
1. User edits account balance in **Settings** page
2. Dashboard updates `users/{userId}` → `accountBalance`
3. Analytics recalculates immediately
4. User adds journal entry on **Trading Journal** page
5. Dashboard writes to `journal/{entryId}`

### Trade Execution & Closure
1. User executes trade manually on MT5 (demo/live)
2. User logs trade in dashboard **Trading Journal** page OR
3. Bot receives trade notification and writes to `trades/{tradeId}` (future: auto-execution)
4. Dashboard reads trade from Firestore
5. When trade closes, user updates exit price
6. Dashboard updates `trades/{tradeId}` with exit details and P&L
7. Analytics collection updates automatically (via Cloud Function or on-read calculation)

---

## Cloud Functions (Recommended)

### Function 1: `onSignalCreated`
Trigger: When new document created in `signals` collection

```python
def on_signal_created(signal):
    """
    1. Validate signal structure
    2. Send notification to user (if enabled)
    3. Log delivery to signals_sent_log
    """
    pass
```

### Function 2: `onTradeCreated`
Trigger: When new document created in `trades` collection

```python
def on_trade_created(trade):
    """
    1. Validate trade links to signal
    2. Update analytics collection
    3. Trigger AI analysis (call Nvidia NIM)
    """
    pass
```

### Function 3: `onTradeUpdated`
Trigger: When `trades/{tradeId}` document updated (exit price filled)

```python
def on_trade_updated(trade):
    """
    1. Calculate P&L if trade closed
    2. Trigger AI analysis of win/loss reason
    3. Update analytics
    4. Extract insights for journal
    """
    pass
```

### Function 4: `calculateDailyAnalytics`
Trigger: Scheduled daily (2:00 AM UTC)

```python
def calculate_daily_analytics(userId):
    """
    1. Aggregate all trades from past 24h
    2. Compute stats (win rate, profit factor, etc.)
    3. Write to analytics/{daily_record}
    4. Compare to previous days (trend detection)
    """
    pass
```

---

## Indexes

Create these composite indexes in Firestore:

| Collection | Fields | Reason |
|-----------|--------|--------|
| `signals` | userId, timestamp DESC | Dashboard signals feed |
| `trades` | userId, timestamp DESC | Dashboard trade history |
| `trades` | userId, status, timestamp DESC | Open/closed trades filtered |
| `journal` | userId, timestamp DESC | Journal entries feed |
| `analytics` | userId, period | Period-based filtering |
| `bot_logs` | timestamp DESC | Recent bot activity |
| `bot_logs` | userId, timestamp DESC | User-specific logs |

---

## Integration Checklist

- [ ] Create Firestore database in Firebase project
- [ ] Run security rules
- [ ] Create indexes
- [ ] Set up bot authentication (service account or API key)
- [ ] Update bot `main.py` to write signals to Firestore
- [ ] Update bot command handlers to log to `bot_logs` collection
- [ ] Update bot `/journal` handler to write to `journal` collection
- [ ] Set up Next.js Firebase client SDK
- [ ] Add Firestore listeners to Dashboard pages
- [ ] Deploy Cloud Functions (Node.js or Python)

