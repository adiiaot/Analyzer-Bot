from datetime import datetime
from typing import Optional


def generate_id(prefix: str = 'signal') -> str:
    return f"{prefix}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"


def generate_trade_id() -> str:
    return generate_id('trade')


def round_price(value: float, decimals: int = 2) -> float:
    return round(value, decimals)


def calculate_pnl(entry: float, exit_: float, result: str) -> float:
    pnl = exit_ - entry
    return abs(pnl) if result == 'loss' else pnl


def calculate_pnl_percent(entry: float, pnl: float) -> float:
    if entry == 0:
        return 0.0
    return (pnl / entry) * 100
