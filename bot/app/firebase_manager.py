import firebase_admin
from firebase_admin import credentials, firestore
import logging
from typing import Optional, List, Dict
from datetime import datetime
from app.models import Signal, TradeLog, ResultEnum
from config import Config

logger = logging.getLogger(__name__)


class FirebaseManager:

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirebaseManager, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        try:
            if not firebase_admin._apps:
                creds = credentials.Certificate({
                    'project_id': Config.FIREBASE_PROJECT_ID,
                    'private_key': Config.FIREBASE_PRIVATE_KEY,
                    'client_email': Config.FIREBASE_CLIENT_EMAIL,
                })
                firebase_admin.initialize_app(creds)

            self.db = firestore.client()
            logger.info("Firebase initialized successfully")
        except Exception as e:
            logger.error(f"Firebase initialization error: {str(e)}")

    async def save_signal(self, signal: Signal) -> bool:
        try:
            self.db.collection('signals').document(signal.id).set({
                'id': signal.id,
                'timestamp': signal.timestamp,
                'trend': signal.trend.value,
                'entries': [
                    {
                        'price': entry.price,
                        'tp': entry.tp,
                        'tp_pips': entry.tp_pips,
                        'auto_close': entry.auto_close
                    }
                    for entry in signal.entries
                ],
                'support_level': signal.support_level,
                'resistance_level': signal.resistance_level,
                'pullback_detected': signal.pullback_detected,
                'entry_confirmation': signal.entry_confirmation,
                'valid_until': signal.valid_until,
                'confidence': signal.confidence,
                'executed': False
            })
            logger.info(f"Signal {signal.id} saved to Firestore")
            return True
        except Exception as e:
            logger.error(f"Error saving signal: {str(e)}")
            return False

    async def get_signal(self, signal_id: str) -> Optional[Dict]:
        try:
            doc = self.db.collection('signals').document(signal_id).get()
            return doc.to_dict() if doc.exists else None
        except Exception as e:
            logger.error(f"Error retrieving signal: {str(e)}")
            return None

    async def log_trade(self, trade: TradeLog, signal_id: Optional[str] = None) -> Dict:
        try:
            trade_id = f"trade_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}"

            if trade.result == ResultEnum.WIN:
                pnl = trade.exit_price - trade.entry_price
            else:
                pnl = trade.exit_price - trade.entry_price

            pnl_percent = (pnl / trade.entry_price) * 100

            trade_data = {
                'id': trade_id,
                'timestamp': datetime.utcnow(),
                'entry_price': trade.entry_price,
                'exit_price': trade.exit_price,
                'quantity': trade.quantity,
                'pnl': round(pnl, 2),
                'pnl_percent': round(pnl_percent, 2),
                'result': trade.result.value,
                'signal_id': signal_id,
                'notes': trade.notes,
                'hold_time_seconds': trade.hold_time_seconds
            }

            self.db.collection('trades').document(trade_id).set(trade_data)
            logger.info(f"Trade {trade_id} logged successfully")

            return {
                'id': trade_id,
                'pnl': round(pnl, 2),
                'pnl_percent': round(pnl_percent, 2)
            }
        except Exception as e:
            logger.error(f"Error logging trade: {str(e)}")
            return {}

    async def get_all_trades(self) -> List[Dict]:
        try:
            docs = self.db.collection('trades').order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            logger.error(f"Error retrieving trades: {str(e)}")
            return []

    async def calculate_stats(self) -> Dict:
        try:
            trades = await self.get_all_trades()

            if not trades:
                return {
                    'total_trades': 0,
                    'wins': 0,
                    'losses': 0,
                    'win_rate': 0.0,
                    'total_pnl': 0.0,
                    'profit_factor': 0.0,
                    'avg_win': 0.0,
                    'avg_loss': 0.0,
                    'consecutive_wins': 0,
                    'consecutive_losses': 0
                }

            wins = [t for t in trades if t['result'] == 'win']
            losses = [t for t in trades if t['result'] == 'loss']

            total_pnl = sum([t['pnl'] for t in trades])
            win_pnl = sum([t['pnl'] for t in wins]) if wins else 0
            loss_pnl = sum([abs(t['pnl']) for t in losses]) if losses else 0

            profit_factor = win_pnl / loss_pnl if loss_pnl > 0 else 0

            consecutive_wins = 0
            consecutive_losses = 0
            current_streak = 0
            streak_type = None

            for t in trades:
                if t['result'] == 'win':
                    if streak_type == 'win':
                        current_streak += 1
                    else:
                        streak_type = 'win'
                        current_streak = 1
                    consecutive_wins = max(consecutive_wins, current_streak)
                elif t['result'] == 'loss':
                    if streak_type == 'loss':
                        current_streak += 1
                    else:
                        streak_type = 'loss'
                        current_streak = 1
                    consecutive_losses = max(consecutive_losses, current_streak)
                else:
                    current_streak = 0
                    streak_type = None

            return {
                'total_trades': len(trades),
                'wins': len(wins),
                'losses': len(losses),
                'win_rate': len(wins) / len(trades) if trades else 0,
                'total_pnl': round(total_pnl, 2),
                'profit_factor': round(profit_factor, 2),
                'avg_win': round(win_pnl / len(wins), 2) if wins else 0,
                'avg_loss': round(loss_pnl / len(losses), 2) if losses else 0,
                'consecutive_wins': consecutive_wins,
                'consecutive_losses': consecutive_losses
            }
        except Exception as e:
            logger.error(f"Error calculating stats: {str(e)}")
            return {}
