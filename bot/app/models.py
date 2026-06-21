from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class TrendEnum(str, Enum):
    UP = "UP"
    DOWN = "DOWN"
    NEUTRAL = "NEUTRAL"


class ResultEnum(str, Enum):
    WIN = "win"
    LOSS = "loss"
    PENDING = "pending"


class CandleData(BaseModel):
    time: int
    open: float
    high: float
    low: float
    close: float
    volume: float


class SignalEntry(BaseModel):
    price: float = Field(..., description="Entry price")
    tp: float = Field(..., description="Take profit price")
    tp_pips: int = Field(..., description="TP in pips")
    auto_close: bool = False


class Signal(BaseModel):
    id: str
    timestamp: datetime
    trend: TrendEnum
    entries: List[SignalEntry]
    support_level: float
    resistance_level: float
    pullback_detected: bool
    entry_confirmation: bool
    valid_until: datetime
    confidence: float


class SignalResponse(BaseModel):
    success: bool
    signal: Optional[Signal] = None
    message: str


class TradeLog(BaseModel):
    entry_price: float
    exit_price: float
    quantity: float = 0.01
    result: ResultEnum
    signal_id: Optional[str] = None
    notes: Optional[str] = None
    hold_time_seconds: Optional[int] = None


class TradeLogResponse(BaseModel):
    id: str
    entry_price: float
    exit_price: float
    pnl: float
    pnl_percent: float
    result: ResultEnum
    timestamp: datetime
    message: str


class TradingStats(BaseModel):
    total_trades: int
    wins: int
    losses: int
    win_rate: float
    total_pnl: float
    profit_factor: float
    avg_win: float
    avg_loss: float
    consecutive_wins: int
    consecutive_losses: int


class TelegramMessage(BaseModel):
    message: str
    user_id: str
    timestamp: datetime
