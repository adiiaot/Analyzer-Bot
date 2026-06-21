from fastapi import APIRouter, HTTPException
from app.signal_generator import MrPFXSignalGenerator
from app.tradingview_client import TradingViewClient
from app.firebase_manager import FirebaseManager
from app.models import SignalResponse, Signal

router = APIRouter()

tv_client = TradingViewClient()
signal_gen = MrPFXSignalGenerator(tv_client)
db = FirebaseManager()


@router.post("/signal", response_model=SignalResponse)
async def generate_signal():
    signal, message = await signal_gen.generate_signal()

    if signal:
        await db.save_signal(signal)
        return SignalResponse(success=True, signal=signal, message=message)
    else:
        return SignalResponse(success=False, message=message)


@router.get("/signal/{signal_id}")
async def get_signal(signal_id: str):
    signal = await db.get_signal(signal_id)
    if not signal:
        raise HTTPException(status_code=404, detail="Signal not found")
    return signal


@router.get("/api-stats")
async def api_stats():
    return tv_client.get_request_count()
