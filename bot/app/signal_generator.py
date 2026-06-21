import logging
from typing import List, Tuple, Optional
from datetime import datetime, timedelta
import pandas as pd
from app.models import Signal, SignalEntry, TrendEnum, CandleData
from app.tradingview_client import TradingViewClient
from config import Config

logger = logging.getLogger(__name__)


class SignalGenerator:

    def __init__(self, tv_client: TradingViewClient):
        self.tv_client = tv_client
        self.symbol = Config.TRADING_PAIR
        self.pips_value = 0.01

    async def generate_signal(self) -> Tuple[Optional[Signal], str]:
        try:
            trend, trend_confidence = await self._analyze_trend()
            if trend == TrendEnum.NEUTRAL:
                return None, "Trend not clearly identified. No signal."

            logger.info(f"Trend identified: {trend} (confidence: {trend_confidence})")

            support, resistance = await self._find_levels()
            if not support or not resistance:
                return None, "Support/Resistance levels not found. No signal."

            logger.info(f"Levels found - Support: {support}, Resistance: {resistance}")

            pullback_detected = await self._detect_pullback(support, resistance, trend)
            if not pullback_detected:
                return None, "No pullback detected at key levels. No signal."

            logger.info("Pullback detected at key level")

            entry_price, entry_confirmation = await self._confirm_entry(support, resistance, trend)
            if not entry_confirmation:
                return None, "Entry confirmation not found on 1M. No signal."

            logger.info(f"Entry confirmed at: {entry_price}")

            signal = self._build_signal(
                trend=trend,
                entry_price=entry_price,
                support=support,
                resistance=resistance
            )

            logger.info(f"Signal generated: {signal.id}")
            return signal, "Signal generated successfully"

        except Exception as e:
            logger.error(f"Error generating signal: {str(e)}")
            return None, f"Error: {str(e)}"

    async def _analyze_trend(self) -> Tuple[TrendEnum, float]:
        try:
            candles_1h = await self.tv_client.get_candles('1h', 10)
            candles_4h = await self.tv_client.get_candles('4h', 10)

            if not candles_1h or not candles_4h:
                return TrendEnum.NEUTRAL, 0.0

            df_1h = pd.DataFrame([c.dict() for c in candles_1h])
            trend_1h, score_1h = self._detect_trend_direction(df_1h)

            df_4h = pd.DataFrame([c.dict() for c in candles_4h])
            trend_4h, score_4h = self._detect_trend_direction(df_4h)

            if trend_1h == trend_4h and trend_1h != TrendEnum.NEUTRAL:
                confidence = (score_1h + score_4h) / 2
                logger.debug(f"Trend confirmed: {trend_1h} (1H: {score_1h}, 4H: {score_4h})")
                return trend_1h, confidence
            else:
                logger.debug(f"Trend mismatch - 1H: {trend_1h}, 4H: {trend_4h}")
                return TrendEnum.NEUTRAL, 0.0

        except Exception as e:
            logger.error(f"Error in trend analysis: {str(e)}")
            return TrendEnum.NEUTRAL, 0.0

    def _detect_trend_direction(self, df: pd.DataFrame) -> Tuple[TrendEnum, float]:
        if len(df) < 3:
            return TrendEnum.NEUTRAL, 0.0

        higher_highs = 0
        higher_lows = 0
        lower_highs = 0
        lower_lows = 0

        for i in range(1, len(df)):
            prev_high = df.iloc[i-1]['high']
            curr_high = df.iloc[i]['high']
            prev_low = df.iloc[i-1]['low']
            curr_low = df.iloc[i]['low']

            if curr_high > prev_high:
                higher_highs += 1
            if curr_low > prev_low:
                higher_lows += 1
            if curr_high < prev_high:
                lower_highs += 1
            if curr_low < prev_low:
                lower_lows += 1

        total_candles = len(df) - 1

        if higher_highs > total_candles * 0.5 and higher_lows > total_candles * 0.5:
            confidence = (higher_highs + higher_lows) / (total_candles * 2)
            return TrendEnum.UP, confidence

        elif lower_highs > total_candles * 0.5 and lower_lows > total_candles * 0.5:
            confidence = (lower_highs + lower_lows) / (total_candles * 2)
            return TrendEnum.DOWN, confidence

        return TrendEnum.NEUTRAL, 0.0

    async def _find_levels(self) -> Tuple[Optional[float], Optional[float]]:
        try:
            candles = await self.tv_client.get_candles('15m', 20)
            if not candles or len(candles) < 5:
                return None, None

            df = pd.DataFrame([c.dict() for c in candles])

            support_levels = []
            for i in range(1, len(df) - 1):
                if df.iloc[i]['low'] < df.iloc[i-1]['low'] and df.iloc[i]['low'] < df.iloc[i+1]['low']:
                    support_levels.append(df.iloc[i]['low'])

            resistance_levels = []
            for i in range(1, len(df) - 1):
                if df.iloc[i]['high'] > df.iloc[i-1]['high'] and df.iloc[i]['high'] > df.iloc[i+1]['high']:
                    resistance_levels.append(df.iloc[i]['high'])

            support = support_levels[-1] if support_levels else None
            resistance = resistance_levels[-1] if resistance_levels else None

            logger.debug(f"Levels found - Support: {support}, Resistance: {resistance}")
            return support, resistance

        except Exception as e:
            logger.error(f"Error finding levels: {str(e)}")
            return None, None

    async def _detect_pullback(self, support: float, resistance: float, trend: TrendEnum) -> bool:
        try:
            candles = await self.tv_client.get_candles('5m', 15)
            if not candles:
                return False

            df = pd.DataFrame([c.dict() for c in candles])
            current_price = df.iloc[-1]['close']

            pullback_zone = self.pips_value * 10

            if trend == TrendEnum.UP:
                if abs(current_price - support) <= pullback_zone:
                    volatility = self._calculate_volatility(df)
                    if volatility < 0.05:
                        logger.debug("Pullback detected in UPTREND at support")
                        return True

            elif trend == TrendEnum.DOWN:
                if abs(current_price - resistance) <= pullback_zone:
                    volatility = self._calculate_volatility(df)
                    if volatility < 0.05:
                        logger.debug("Pullback detected in DOWNTREND at resistance")
                        return True

            return False

        except Exception as e:
            logger.error(f"Error detecting pullback: {str(e)}")
            return False

    def _calculate_volatility(self, df: pd.DataFrame) -> float:
        df_range = df['high'] - df['low']
        avg_range = df_range.mean()
        avg_close = df['close'].mean()
        return avg_range / avg_close if avg_close > 0 else 0

    async def _confirm_entry(self, support: float, resistance: float, trend: TrendEnum) -> Tuple[Optional[float], bool]:
        try:
            candles = await self.tv_client.get_candles('1m', 10)
            if not candles or len(candles) < 3:
                return None, False

            df = pd.DataFrame([c.dict() for c in candles])
            current_candle = df.iloc[-1]

            is_reversal = self._detect_reversal_candle(df)
            if not is_reversal:
                logger.debug("No reversal candle detected on 1M")
                return None, False

            if trend == TrendEnum.UP:
                entry_price = current_candle['low'] + (self.pips_value * 1)
                logger.debug(f"Entry confirmed for UPTREND at {entry_price}")
                return entry_price, True

            elif trend == TrendEnum.DOWN:
                entry_price = current_candle['high'] - (self.pips_value * 1)
                logger.debug(f"Entry confirmed for DOWNTREND at {entry_price}")
                return entry_price, True

            return None, False

        except Exception as e:
            logger.error(f"Error confirming entry: {str(e)}")
            return None, False

    def _detect_reversal_candle(self, df: pd.DataFrame) -> bool:
        if len(df) < 2:
            return False

        current = df.iloc[-1]
        previous = df.iloc[-2]

        body_range = abs(current['close'] - current['open'])
        total_range = current['high'] - current['low']

        if total_range == 0:
            return False

        if body_range < total_range * 0.3:
            wick_range = max(
                current['high'] - max(current['open'], current['close']),
                min(current['open'], current['close']) - current['low']
            )
            if wick_range > total_range * 0.5:
                logger.debug("Pin bar detected")
                return True

        if (current['open'] < previous['close'] and current['close'] > previous['open']) or \
           (current['open'] > previous['close'] and current['close'] < previous['open']):
            logger.debug("Engulfing pattern detected")
            return True

        return False

    def _build_signal(self, trend: TrendEnum, entry_price: float, support: float, resistance: float) -> Signal:
        entries = []

        tp_increments = [20, 40, 60, 80]
        entry_offsets = [0, -5, -10, -15]

        for idx, (tp_pips, offset_pips) in enumerate(zip(tp_increments, entry_offsets)):
            entry = entry_price + (offset_pips * self.pips_value)
            tp = entry_price + (tp_pips * self.pips_value)

            signal_entry = SignalEntry(
                price=round(entry, 2),
                tp=round(tp, 2),
                tp_pips=tp_pips,
                auto_close=(idx == 0)
            )
            entries.append(signal_entry)

        now = datetime.utcnow()
        signal_id = f"signal_{now.strftime('%Y%m%d_%H%M%S')}"

        signal = Signal(
            id=signal_id,
            timestamp=now,
            trend=trend,
            entries=entries,
            support_level=round(support, 2),
            resistance_level=round(resistance, 2),
            pullback_detected=True,
            entry_confirmation=True,
            valid_until=now + timedelta(hours=Config.SIGNAL_VALIDITY_HOURS),
            confidence=0.75
        )

        return signal
