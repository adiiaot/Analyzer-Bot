from telegram import Update, BotCommand, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes
import logging
from app.signal_generator import MrPFXSignalGenerator
from app.firebase_manager import FirebaseManager
from app.tradingview_client import TradingViewClient
from app.models import TradeLog, ResultEnum
from config import Config
from utils.validators import validate_trade_args

logger = logging.getLogger(__name__)


class TelegramBotHandler:

    def __init__(self):
        self.token = Config.TELEGRAM_BOT_TOKEN
        self.tv_client = TradingViewClient()
        self.signal_gen = MrPFXSignalGenerator(self.tv_client)
        self.db = FirebaseManager()

    async def setup_commands(self, app: Application):
        commands = [
            BotCommand('signal', 'Generate XAU/USD trading signal'),
            BotCommand('log_trade', 'Log a completed trade'),
            BotCommand('stats', 'View trading statistics'),
            BotCommand('dashboard', 'Get link to web dashboard'),
            BotCommand('help', 'Show all commands'),
        ]
        await app.bot.set_my_commands(commands)

    async def signal_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            user_id = update.effective_user.id
            logger.info(f"User {user_id} requested signal")

            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text="⏳ Analyzing XAU/USD chart...",
                parse_mode='Markdown'
            )

            signal, message = await self.signal_gen.generate_signal()

            if signal:
                response = self._format_signal_message(signal)
                await context.bot.send_message(
                    chat_id=update.effective_chat.id,
                    text=response,
                    parse_mode='Markdown'
                )
                await self.db.save_signal(signal)
            else:
                await context.bot.send_message(
                    chat_id=update.effective_chat.id,
                    text=f"❌ {message}"
                )

        except Exception as e:
            logger.error(f"Error in signal command: {str(e)}")
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=f"⚠️ Error: {str(e)}"
            )

    async def log_trade_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            args = context.args

            if len(args) < 3:
                await context.bot.send_message(
                    chat_id=update.effective_chat.id,
                    text="Usage: `/log_trade entry:2345.50 exit:2365.50 result:win`\nor `/log_trade entry:2345.50 exit:2340.00 result:loss`"
                )
                return

            parsed = validate_trade_args(args)
            if not parsed:
                await context.bot.send_message(
                    chat_id=update.effective_chat.id,
                    text="❌ Invalid format. Use: entry:PRICE exit:PRICE result:win|loss"
                )
                return

            trade = TradeLog(
                entry_price=parsed['entry'],
                exit_price=parsed['exit'],
                result=ResultEnum(parsed['result'])
            )

            trade_result = await self.db.log_trade(trade)

            if trade_result:
                response = f"""
✅ **Trade Logged Successfully!**
📊 Entry: {trade.entry_price}
📊 Exit: {trade.exit_price}
💰 PnL: ${trade_result['pnl']:,.2f} ({trade_result['pnl_percent']:.2f}%)
✔️ Result: {trade.result.value.upper()}
                """
                await context.bot.send_message(
                    chat_id=update.effective_chat.id,
                    text=response,
                    parse_mode='Markdown'
                )
            else:
                await context.bot.send_message(
                    chat_id=update.effective_chat.id,
                    text="❌ Error logging trade"
                )

        except ValueError as e:
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=f"❌ Invalid format: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Error in log_trade: {str(e)}")
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=f"⚠️ Error: {str(e)}"
            )

    async def stats_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            stats = await self.db.calculate_stats()

            response = f"""
📊 **Trading Statistics (Demo)**
━━━━━━━━━━━━━━━━━━━━━━
📈 Total Trades: {stats['total_trades']}
✅ Wins: {stats['wins']}
❌ Losses: {stats['losses']}
🎯 Win Rate: {stats['win_rate']*100:.1f}%

💵 Total P&L: ${stats['total_pnl']:,.2f}
📊 Profit Factor: {stats['profit_factor']:.2f}x
📍 Avg Win: ${stats['avg_win']:,.2f}
📍 Avg Loss: ${stats['avg_loss']:,.2f}
            """

            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=response,
                parse_mode='Markdown'
            )
        except Exception as e:
            logger.error(f"Error in stats command: {str(e)}")
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=f"⚠️ Error: {str(e)}"
            )

    async def dashboard_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            dashboard_url = "https://analyzer-dashboard.vercel.app"

            keyboard = InlineKeyboardMarkup([
                [InlineKeyboardButton("📊 Open Dashboard", url=dashboard_url)]
            ])

            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text="📊 **Trading Dashboard**\n\nClick below to view your performance metrics and trade logs.",
                reply_markup=keyboard,
                parse_mode='Markdown'
            )
        except Exception as e:
            logger.error(f"Error in dashboard command: {str(e)}")

    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        help_text = """
🤖 **Analyzer Bot - Commands**
━━━━━━━━━━━━━━━━━━━━━━
/signal - Generate XAU/USD trading signal
/log_trade - Log a completed trade
/stats - View trading statistics
/dashboard - Open web dashboard
/help - Show this message

📌 **How to Use:**
1. Request a signal with `/signal`
2. Execute 4 buy limit orders in MT5
3. Log trade result: `/log_trade entry:2345.50 exit:2365.50 result:win`
4. View stats: `/stats`
5. Monitor performance: `/dashboard`

⚙️ Trading Settings:
• Pair: XAU/USD
• Max Hold: 5 minutes
• Lot Size: 0.01
        """

        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=help_text,
            parse_mode='Markdown'
        )

    def _format_signal_message(self, signal) -> str:
        entries_text = "\n".join([
            f"Entry {i+1}: ${entry.price} | TP: ${entry.tp} (+{entry.tp_pips}pips) | {'Auto Close' if entry.auto_close else 'Manual'}"
            for i, entry in enumerate(signal.entries)
        ])

        message = f"""
🎯 **XAU/USD SIGNAL**
━━━━━━━━━━━━━━━━━━━━━━
📈 Trend: **{signal.trend.value}** ✅
⏰ Time: {signal.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}

**Entry Points:**
{entries_text}

📊 Support: ${signal.support_level}
📊 Resistance: ${signal.resistance_level}
🔥 Confidence: {signal.confidence*100:.0f}%

⏱️ Valid Until: {signal.valid_until.strftime('%H:%M:%S UTC')} (3 hours)

✨ **Execute:** Place 4 buy limit orders as shown above
        """
        return message

    async def start_bot(self):
        app = Application.builder().token(self.token).build()

        app.add_handler(CommandHandler("signal", self.signal_command))
        app.add_handler(CommandHandler("log_trade", self.log_trade_command))
        app.add_handler(CommandHandler("stats", self.stats_command))
        app.add_handler(CommandHandler("dashboard", self.dashboard_command))
        app.add_handler(CommandHandler("help", self.help_command))

        await self.setup_commands(app)

        logger.info("Telegram bot starting...")
        await app.run_polling()
