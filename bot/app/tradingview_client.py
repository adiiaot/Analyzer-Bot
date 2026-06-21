import aiohttp
import logging
from typing import List, Optional
from app.models import CandleData
from config import Config

logger = logging.getLogger(__name__)


class TradingViewClient:

    def __init__(self):
        self.base_url = Config.TRADINGVIEW_BASE_URL
        self.api_key = Config.TRADINGVIEW_API_KEY
        self.api_host = Config.TRADINGVIEW_API_HOST
        self.symbol = Config.TRADING_PAIR
        self.request_count = 0
        self.rate_limit = Config.TRADINGVIEW_REQUESTS_LIMIT

    async def get_candles(self, timeframe: str, limit: int) -> Optional[List[CandleData]]:
        if self.request_count >= self.rate_limit:
            logger.warning(f"Rate limit reached ({self.request_count}/{self.rate_limit})")
            return None

        try:
            url = f"{self.base_url}/api/candlesticks/{self.symbol}"
            params = {'timeframe': timeframe, 'range': limit}
            headers = {
                'x-rapidapi-host': self.api_host,
                'x-rapidapi-key': self.api_key
            }

            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        self.request_count += 1
                        logger.info(f"Fetched {len(data.get('bars', []))} candles for {self.symbol} {timeframe}")
                        return self._parse_candles(data)
                    else:
                        logger.error(f"TradingView API error: {response.status}")
                        return None

        except Exception as e:
            logger.error(f"Error fetching candles: {str(e)}")
            return None

    def _parse_candles(self, data: dict) -> List[CandleData]:
        candles = []
        bars = data.get('bars', [])

        for bar in bars:
            candle = CandleData(
                time=bar.get('time'),
                open=float(bar.get('open', 0)),
                high=float(bar.get('high', 0)),
                low=float(bar.get('low', 0)),
                close=float(bar.get('close', 0)),
                volume=float(bar.get('volume', 0))
            )
            candles.append(candle)

        return candles

    def get_request_count(self) -> dict:
        return {
            'used': self.request_count,
            'limit': self.rate_limit,
            'remaining': self.rate_limit - self.request_count
        }
