'use client';

import React from 'react';
import { Trade } from '@/types';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { formatTimeAgo } from '@/lib/formatters';

interface TradeTableProps {
  trades: Trade[];
  onAnalyze?: (trade: Trade) => void;
}

export const TradeTable = ({ trades, onAnalyze }: TradeTableProps) => {
  const exportCSV = () => {
    const csv = [
      ['Date', 'Entry', 'Exit', 'PnL', 'PnL%', 'Result', 'Hold Time (s)'],
      ...trades.map(t => [
        new Date(t.timestamp).toLocaleString(),
        t.entry_price.toString(),
        t.exit_price.toString(),
        t.pnl.toFixed(2),
        t.pnl_percent.toFixed(2),
        t.result.toUpperCase(),
        t.hold_time_seconds?.toString() || 'N/A',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-bold text-lg">Trade Logs</h2>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Date</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Entry</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Exit</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">P&L</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Result</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Hold</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr
                key={trade.id}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition"
              >
                <td className="py-3 px-4 text-slate-300">
                  {formatTimeAgo(trade.timestamp)}
                </td>
                <td className="py-3 px-4 text-slate-300">${trade.entry_price.toFixed(2)}</td>
                <td className="py-3 px-4 text-slate-300">${trade.exit_price.toFixed(2)}</td>
                <td className={`py-3 px-4 font-semibold flex items-center gap-1 ${
                  trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${trade.pnl.toFixed(2)}
                  {trade.pnl >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    trade.result === 'win'
                      ? 'bg-green-900 text-green-200'
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {trade.result.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {trade.hold_time_seconds ? `${trade.hold_time_seconds}s` : 'N/A'}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => onAnalyze?.(trade)}
                    className="text-yellow-500 hover:text-yellow-400 text-xs font-semibold"
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
